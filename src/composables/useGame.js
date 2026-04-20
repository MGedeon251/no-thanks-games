/**
 * useGame.js — Logique complète du jeu "No Thanks!"
 *
 * Règles implémentées :
 *  - 3 à 7 joueurs, cartes 3→35, 9 cartes retirées aléatoirement
 *  - Chaque joueur démarre avec 11 jetons
 *  - prendreCarte() : le joueur récupère la carte + les jetons dessus
 *  - refuserCarte() : le joueur pose 1 jeton sur la carte (si possible)
 *  - Score = somme des plus petites cartes de chaque séquence − jetons restants
 *  - Fin de partie = plus aucune carte dans la pioche
 *  - Sauvegarde automatique dans localStorage
 */

import { ref, reactive, computed } from 'vue'

// ─── Constantes ────────────────────────────────────────────────────────────────
const CARD_MIN = 3
const CARD_MAX = 35
const CARDS_REMOVED = 9
const TOKENS_PER_PLAYER = 11
const MIN_PLAYERS = 3
const MAX_PLAYERS = 7

// ─── Utilitaires ───────────────────────────────────────────────────────────────

/** Mélange un tableau en place (Fisher-Yates). */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Calcule le score d'un joueur.
 * Seule la plus petite carte de chaque séquence consécutive compte.
 * Les jetons restants sont soustraits.
 */
function calculerScore(cartes, jetons) {
  if (cartes.length === 0) return -jetons

  const sorted = [...cartes].sort((a, b) => a - b)
  let total = 0
  let prevCard = null

  for (const c of sorted) {
    // Si la carte précédente n'est pas c-1, c est le début d'une nouvelle séquence
    if (prevCard === null || c !== prevCard + 1) {
      total += c
    }
    prevCard = c
  }

  return total - jetons
}

/** Retourne les séquences consécutives d'un joueur (pour affichage). */
function getSequences(cartes) {
  if (cartes.length === 0) return []
  const sorted = [...cartes].sort((a, b) => a - b)
  const sequences = []
  let current = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      current.push(sorted[i])
    } else {
      sequences.push([...current])
      current = [sorted[i]]
    }
  }
  sequences.push(current)
  return sequences
}

// ─── Composable principal ──────────────────────────────────────────────────────

export function useGame() {
  // ── État global ──
  const phase = ref('setup')       // 'setup' | 'playing' | 'finished'
  const players = ref([])          // tableau de joueurs
  const deck = ref([])             // pioche (cartes restantes)
  const currentCard = ref(null)    // carte visible actuellement
  const tokensOnCard = ref(0)      // jetons posés sur la carte courante
  const currentPlayerIndex = ref(0)
  const removedCards = ref([])     // cartes retirées (info debug/bonus)
  const lastAction = ref(null)     // { type: 'take'|'refuse', playerName, card }
  const cardAnimKey = ref(0)       // pour forcer la re-animation de la carte
  const noTokenShake = ref(false)  // feedback si le joueur n'a plus de jetons

  // ── Joueur courant ──
  const currentPlayer = computed(() =>
    players.value[currentPlayerIndex.value] || null
  )

  // ── Fin de partie ──
  const isGameOver = computed(() => phase.value === 'finished')

  // ── Classement final ──
  const ranking = computed(() => {
    if (!isGameOver.value) return []
    return [...players.value]
      .map(p => ({
        ...p,
        score: calculerScore(p.cartes, p.jetons),
        sequences: getSequences(p.cartes),
      }))
      .sort((a, b) => a.score - b.score)
  })

  // ── Scores intermédiaires (pendant la partie) ──
  const liveScores = computed(() =>
    players.value.map(p => ({
      id: p.id,
      name: p.name,
      score: calculerScore(p.cartes, p.jetons),
      sequences: getSequences(p.cartes),
    }))
  )

  // ─── Initialisation ────────────────────────────────────────────────────────

  /**
   * Lance une nouvelle partie.
   * @param {string[]} playerNames - Noms des joueurs (3 à 7)
   * @param {boolean[]} isAI - Tableau indiquant si chaque joueur est une IA
   */
  function initGame(playerNames, isAI = []) {
    // 1. Créer et mélanger toutes les cartes
    const allCards = []
    for (let i = CARD_MIN; i <= CARD_MAX; i++) allCards.push(i)
    shuffle(allCards)

    // 2. Retirer 9 cartes (invisibles)
    removedCards.value = allCards.splice(0, CARDS_REMOVED)

    // 3. Mélanger la pioche restante
    shuffle(allCards)

    // 4. Créer les joueurs
    players.value = playerNames.map((name, i) => ({
      id: i,
      name,
      isAI: isAI[i] || false,
      cartes: [],
      jetons: TOKENS_PER_PLAYER,
    }))

    // 5. Initialiser l'état
    deck.value = allCards
    tokensOnCard.value = 0
    currentPlayerIndex.value = 0
    lastAction.value = null
    cardAnimKey.value = 0

    // 6. Révéler la première carte
    _revealNextCard()

    phase.value = 'playing'
    _saveToStorage()

    // 7. Si le premier joueur est une IA, la faire jouer après un délai
    _scheduleAITurn()
  }

  /** Révèle la prochaine carte de la pioche. */
  function _revealNextCard() {
    if (deck.value.length === 0) {
      _endGame()
      return
    }
    currentCard.value = deck.value.shift()
    tokensOnCard.value = 0
    cardAnimKey.value++
  }

  // ─── Actions de jeu ────────────────────────────────────────────────────────

  /**
   * Action : Prendre la carte.
   * Le joueur actif récupère la carte courante + tous les jetons dessus.
   */
  function prendreCarte() {
    if (phase.value !== 'playing') return
    const player = currentPlayer.value
    if (!player) return

    player.cartes.push(currentCard.value)
    player.jetons += tokensOnCard.value

    lastAction.value = {
      type: 'take',
      playerName: player.name,
      card: currentCard.value,
      tokens: tokensOnCard.value,
    }

    // Révéler la prochaine carte SANS changer de joueur
    // (le joueur qui prend rejoue s'il y a encore des cartes — règle non standard, on passe quand même)
    _revealNextCard()

    if (phase.value === 'playing') {
      _nextPlayer()
      _saveToStorage()
      _scheduleAITurn()
    }
  }

  /**
   * Action : Refuser la carte ("No Thanks!").
   * Pose un jeton du joueur sur la carte. Si le joueur n'a plus de jetons, il est forcé de prendre.
   */
  function refuserCarte() {
    if (phase.value !== 'playing') return
    const player = currentPlayer.value
    if (!player) return

    if (player.jetons <= 0) {
      // Pas de jeton disponible → doit prendre
      noTokenShake.value = true
      setTimeout(() => { noTokenShake.value = false }, 500)
      return
    }

    player.jetons--
    tokensOnCard.value++

    lastAction.value = {
      type: 'refuse',
      playerName: player.name,
      card: currentCard.value,
    }

    _nextPlayer()
    _saveToStorage()
    _scheduleAITurn()
  }

  /** Passe au joueur suivant. */
  function _nextPlayer() {
    currentPlayerIndex.value =
      (currentPlayerIndex.value + 1) % players.value.length
  }

  // ─── IA ────────────────────────────────────────────────────────────────────

  /** Planifie le tour de l'IA si le joueur courant est une IA. */
  function _scheduleAITurn() {
    if (phase.value !== 'playing') return
    const player = currentPlayer.value
    if (!player || !player.isAI) return

    setTimeout(() => {
      if (phase.value !== 'playing') return
      _aiPlay()
    }, 900)
  }

  /**
   * Stratégie IA heuristique :
   * - Prend la carte si elle coûte peu ou compléte une séquence
   * - Refuse si elle a des jetons ET que la carte est chère
   */
  function _aiPlay() {
    const player = currentPlayer.value
    if (!player) return

    const card = currentCard.value
    const tokens = tokensOnCard.value
    const netCost = card - tokens // coût réel si on prend maintenant

    // Vérifie si la carte complète une séquence du joueur
    const extendsSequence =
      player.cartes.includes(card - 1) || player.cartes.includes(card + 1)

    // Décision : prendre si
    // - pas de jetons disponibles
    // - coût net ≤ 5
    // - carte complète une séquence et coût net ≤ 15
    // - carte ≤ 10 (petites cartes valent peu)
    const shouldTake =
      player.jetons === 0 ||
      netCost <= 5 ||
      (extendsSequence && netCost <= 15) ||
      card <= 10

    if (shouldTake) {
      prendreCarte()
    } else {
      refuserCarte()
    }
  }

  // ─── Fin de partie ─────────────────────────────────────────────────────────

  function _endGame() {
    currentCard.value = null
    phase.value = 'finished'
    _clearStorage()
  }

  // ─── Persistence localStorage ──────────────────────────────────────────────

  const STORAGE_KEY = 'no-thanks-save'

  function _saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        phase: phase.value,
        players: players.value,
        deck: deck.value,
        currentCard: currentCard.value,
        tokensOnCard: tokensOnCard.value,
        currentPlayerIndex: currentPlayerIndex.value,
        removedCards: removedCards.value,
      }))
    } catch (_) {
      // Silently ignore storage errors
    }
  }

  function _clearStorage() {
    try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
  }

  /** Charge une sauvegarde existante. Retourne true si succès. */
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false
      const data = JSON.parse(raw)
      if (data.phase !== 'playing') return false

      phase.value = data.phase
      players.value = data.players
      deck.value = data.deck
      currentCard.value = data.currentCard
      tokensOnCard.value = data.tokensOnCard
      currentPlayerIndex.value = data.currentPlayerIndex
      removedCards.value = data.removedCards
      cardAnimKey.value = 1
      lastAction.value = null
      return true
    } catch (_) {
      return false
    }
  }

  /** Annule la partie et revient au menu. */
  function resetGame() {
    _clearStorage()
    phase.value = 'setup'
    players.value = []
    deck.value = []
    currentCard.value = null
    tokensOnCard.value = 0
    currentPlayerIndex.value = 0
    lastAction.value = null
  }

  // ─── Helpers exposés ───────────────────────────────────────────────────────

  /** Retourne les séquences d'un joueur (pour affichage). */
  function getPlayerSequences(player) {
    return getSequences(player.cartes)
  }

  /** Score actuel d'un joueur. */
  function getPlayerScore(player) {
    return calculerScore(player.cartes, player.jetons)
  }

  return {
    // État
    phase,
    players,
    deck,
    currentCard,
    tokensOnCard,
    currentPlayerIndex,
    currentPlayer,
    lastAction,
    cardAnimKey,
    noTokenShake,
    removedCards,

    // Computed
    isGameOver,
    ranking,
    liveScores,

    // Constantes
    MIN_PLAYERS,
    MAX_PLAYERS,
    TOKENS_PER_PLAYER,
    CARDS_REMOVED,

    // Actions
    initGame,
    prendreCarte,
    refuserCarte,
    resetGame,
    loadFromStorage,

    // Helpers
    getPlayerSequences,
    getPlayerScore,
  }
}
