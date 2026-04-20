/**
 * useI18n.js — Système de traduction FR/EN
 * Usage : const { t, lang, setLang } = useI18n()
 * t('setup.title') → "No Thanks!" (identique dans les deux langues)
 * t('setup.subtitle') → "Le jeu de cartes..." ou "The card game..."
 */

import { ref, computed } from 'vue'

// ── Singleton partagé entre tous les composants ──
const lang = ref(
  (() => {
    try { return localStorage.getItem('no-thanks-lang') || 'fr' } catch { return 'fr' }
  })()
)

// ── Dictionnaire complet ──
const translations = {
  fr: {
    // Setup
    'setup.title':            'No <span class="italic">Thanks!</span>',
    'setup.subtitle':         "Le jeu de cartes où chaque jeton peut changer le destin d'une carte.",
    'setup.players_label':    'Nombre de joueurs',
    'setup.names_label':      'Joueurs',
    'setup.placeholder':      'Joueur',
    'setup.ai_btn':           '🤖 IA',
    'setup.human_btn':        '👤',
    'setup.ai_title':         'Joueur IA (cliquer pour humain)',
    'setup.human_title':      'Joueur humain (cliquer pour IA)',
    'setup.rules_title':      'Rappel des règles',
    'setup.rule1':            '• Cartes numérotées de 3 à 35 — 9 retirées aléatoirement',
    'setup.rule2':            '• Chaque joueur commence avec <strong class="text-gold">11 jetons</strong>',
    'setup.rule3':            "• Ton tour : <strong class=\"text-card-bg\">Prendre</strong> la carte (et ses jetons) <em>ou</em> <strong class=\"text-card-bg\">No Thanks!</strong> (poser 1 jeton)",
    'setup.rule4':            '• Sans jeton : obligation de prendre !',
    'setup.rule5':            '• Score = cartes (séquences = plus petite uniquement) − jetons restants',
    'setup.rule6':            '• Le plus petit score gagne',
    'setup.timer_label':      'Timer par joueur',
    'setup.timer_off':        'Désactivé',
    'setup.timer_unit':       's',
    'setup.start_btn':        'Commencer la partie',
    'setup.resume_btn':       '↩ Reprendre la partie précédente',
    'setup.credits':          'No Thanks! — Thorsten Gimmler (2004)',
    'setup.lang_label':       'Langue',

    // GameBoard
    'game.cards_left':        'carte restante | cartes restantes',
    'game.quit_btn':          'Quitter',
    'game.current_card':      'Carte en jeu',
    'game.tokens_on_card':    'jeton sur la carte | jetons sur la carte',
    'game.no_tokens':         'Aucun jeton sur la carte',
    'game.deck_left':         'carte restante | cartes restantes',
    'game.players_title':     'Joueurs',
    'game.seq_hint':          'Les cartes consécutives forment une séquence : seule la plus petite compte dans le score.',
    'game.action_took':       'a pris la carte',
    'game.action_refused':    'a dit No Thanks!',
    'game.tokens_gained':     'jetons',

    // Controls
    'controls.your_turn':     '— votre tour',
    'controls.ai_badge':      'IA',
    'controls.tokens':        'jeton | jetons',
    'controls.must_take':     '(obligé de prendre !)',
    'controls.take_btn':      'Prendre',
    'controls.refuse_btn':    'No Thanks!',
    'controls.ai_thinking':   'L\'IA réfléchit…',
    'controls.take_title':    'Prendre la carte (et récupérer les jetons)',
    'controls.refuse_title':  'Passer un jeton et refuser la carte',
    'controls.timer_label':   'Temps restant',
    'controls.time_up':       'Temps écoulé ! Carte prise automatiquement.',

    // PlayerPanel
    'player.no_cards':        'Aucune carte',
    'player.score':           'Score :',

    // ScoreScreen
    'score.end_label':        'Fin de partie',
    'score.title':            'Résultats',
    'score.points':           'points',
    'score.cards_title':      'Cartes (valeur des séquences)',
    'score.no_cards':         'aucune',
    'score.tokens_title':     'Jetons restants',
    'score.restart_btn':      '🎴 Rejouer',
    'score.menu_btn':         '🏠 Menu',

    // Quit dialog
    'quit.title':             'Quitter la partie ?',
    'quit.message':           'La partie sera sauvegardée et vous pourrez la reprendre.',
    'quit.confirm':           'Quitter',
    'quit.cancel':            'Continuer',
  },

  en: {
    // Setup
    'setup.title':            'No <span class="italic">Thanks!</span>',
    'setup.subtitle':         'The card game where every token can change a card\'s fate.',
    'setup.players_label':    'Number of players',
    'setup.names_label':      'Players',
    'setup.placeholder':      'Player',
    'setup.ai_btn':           '🤖 AI',
    'setup.human_btn':        '👤',
    'setup.ai_title':         'AI player (click for human)',
    'setup.human_title':      'Human player (click for AI)',
    'setup.rules_title':      'Quick rules',
    'setup.rule1':            '• Cards numbered 3 to 35 — 9 removed randomly',
    'setup.rule2':            '• Each player starts with <strong class="text-gold">11 tokens</strong>',
    'setup.rule3':            '• Your turn: <strong class="text-card-bg">Take</strong> the card (and its tokens) <em>or</em> <strong class="text-card-bg">No Thanks!</strong> (place 1 token)',
    'setup.rule4':            '• No tokens left: you must take!',
    'setup.rule5':            '• Score = cards (sequences = lowest only) − remaining tokens',
    'setup.rule6':            '• Lowest score wins',
    'setup.timer_label':      'Timer per player',
    'setup.timer_off':        'Off',
    'setup.timer_unit':       's',
    'setup.start_btn':        'Start game',
    'setup.resume_btn':       '↩ Resume previous game',
    'setup.credits':          'No Thanks! — Thorsten Gimmler (2004)',
    'setup.lang_label':       'Language',

    // GameBoard
    'game.cards_left':        'card left | cards left',
    'game.quit_btn':          'Quit',
    'game.current_card':      'Current card',
    'game.tokens_on_card':    'token on card | tokens on card',
    'game.no_tokens':         'No tokens on the card',
    'game.deck_left':         'card left | cards left',
    'game.players_title':     'Players',
    'game.seq_hint':          'Consecutive cards form a sequence: only the lowest counts toward the score.',
    'game.action_took':       'took the card',
    'game.action_refused':    'said No Thanks!',
    'game.tokens_gained':     'tokens',

    // Controls
    'controls.your_turn':     '— your turn',
    'controls.ai_badge':      'AI',
    'controls.tokens':        'token | tokens',
    'controls.must_take':     '(must take!)',
    'controls.take_btn':      'Take',
    'controls.refuse_btn':    'No Thanks!',
    'controls.ai_thinking':   'AI is thinking…',
    'controls.take_title':    'Take the card (and collect the tokens)',
    'controls.refuse_title':  'Pass a token and refuse the card',
    'controls.timer_label':   'Time left',
    'controls.time_up':       'Time\'s up! Card taken automatically.',

    // PlayerPanel
    'player.no_cards':        'No cards',
    'player.score':           'Score:',

    // ScoreScreen
    'score.end_label':        'Game over',
    'score.title':            'Results',
    'score.points':           'points',
    'score.cards_title':      'Cards (sequence value)',
    'score.no_cards':         'none',
    'score.tokens_title':     'Remaining tokens',
    'score.restart_btn':      '🎴 Play again',
    'score.menu_btn':         '🏠 Menu',

    // Quit dialog
    'quit.title':             'Quit the game?',
    'quit.message':           'The game will be saved and you can resume it later.',
    'quit.confirm':           'Quit',
    'quit.cancel':            'Continue',
  },
}

export function useI18n() {
  /**
   * Traduit une clé.
   * Supporte la pluralisation simple avec | :
   *   t('game.cards_left', 1) → "card left"
   *   t('game.cards_left', 3) → "cards left"
   */
  function t(key, count = null) {
    const dict = translations[lang.value] || translations.fr
    const value = dict[key] ?? translations.fr[key] ?? key

    if (count !== null && value.includes('|')) {
      const parts = value.split('|').map(s => s.trim())
      return count === 1 ? parts[0] : parts[1]
    }
    return value
  }

  /** Change la langue et persiste le choix. */
  function setLang(newLang) {
    if (!translations[newLang]) return
    lang.value = newLang
    try { localStorage.setItem('no-thanks-lang', newLang) } catch {}
  }

  return { t, lang, setLang }
}
