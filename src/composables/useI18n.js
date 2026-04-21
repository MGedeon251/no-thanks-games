/**
 * useI18n.js — Système de traduction FR/EN (v2 : clés réseau + spectateur)
 */
import { ref } from 'vue'

const lang = ref(
  (() => { try { return localStorage.getItem('no-thanks-lang') || 'fr' } catch { return 'fr' } })()
)

const translations = {
  fr: {
    // ── Setup solo ──
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

    // ── Réseau — lobby connexion ──
    'net.title':              'Multijoueur réseau',
    'net.server_label':       'Serveur (laisser vide pour local)',
    'net.server_placeholder': 'http://192.168.1.10:3000',
    'net.name_label':         'Votre nom',
    'net.name_placeholder':   'Votre pseudo',
    'net.or':                 'ou',
    'net.create_btn':         'Créer',
    'net.join_placeholder':   'Code ABCD',
    'net.join_btn':           'Rejoindre',
    'net.spectate_label':     'Mode spectateur',
    'net.spectate_placeholder': 'Code de la partie',
    'net.spectate_btn':       '👁 Observer',
    'net.back_btn':           '← Retour au mode solo',
    'net.connected':          'Connecté au serveur',
    'net.connecting':         'Connexion…',
    'net.disconnected':       'Déconnecté',

    // ── Réseau — lobby salle ──
    'lobby.code_label':       'Code de la partie',
    'lobby.code_hint':        'Partagez ce code pour inviter des joueurs',
    'lobby.code_copied':      '✅ Copié !',
    'lobby.players_label':    'Joueurs',
    'lobby.host_badge':       'Hôte',
    'lobby.you_badge':        '(vous)',
    'lobby.waiting':          'En attente de joueurs…',
    'lobby.min_missing':      'encore {n} minimum | encore {n} minimum',
    'lobby.ready':            'prêt à démarrer',
    'lobby.timer_label':      'Timer par tour',
    'lobby.timer_off':        'Désactivé',
    'lobby.timer_unit':       's',
    'lobby.start_btn':        'Lancer la partie',
    'lobby.missing':          'joueur manquant | joueurs manquants',
    'lobby.waiting_host':     "En attente que l'hôte lance la partie…",
    'lobby.leave_btn':        'Quitter la partie',

    // ── Jeu réseau ──
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
    'game.your_turn':         'C\'est votre tour !',
    'game.waiting_turn':      'de jouer…',
    'game.wait_msg':          'Attendez votre tour…',
    'game.net_badge':         'Réseau',
    'game.disconnected_badge':'⚠ déco',

    // ── Controls ──
    'controls.your_turn':     '— votre tour',
    'controls.ai_badge':      'IA',
    'controls.tokens':        'jeton | jetons',
    'controls.must_take':     '(obligé de prendre !)',
    'controls.take_btn':      'Prendre',
    'controls.refuse_btn':    'No Thanks!',
    'controls.ai_thinking':   "L'IA réfléchit…",
    'controls.take_title':    'Prendre la carte (et récupérer les jetons)',
    'controls.refuse_title':  'Passer un jeton et refuser la carte',
    'controls.timer_label':   'Temps restant',
    'controls.time_up':       'Temps écoulé ! Carte prise automatiquement.',

    // ── Spectateur ──
    'spectate.title':         'Mode spectateur',
    'spectate.subtitle':      'Observez la partie en temps réel',
    'spectate.watching':      'Vous observez la partie',
    'spectate.code_label':    'Code de la partie',
    'spectate.current_card':  'Carte en jeu',
    'spectate.tokens_on':     'jeton | jetons sur la carte',
    'spectate.deck_left':     'carte restante | cartes restantes',
    'spectate.turn_label':    'Tour de',
    'spectate.score_label':   'Score',
    'spectate.cards_label':   'Cartes',
    'spectate.tokens_label':  'Jetons',
    'spectate.seq_label':     'séq.',
    'spectate.waiting':       'En attente du démarrage…',
    'spectate.finished':      'Partie terminée !',
    'spectate.winner':        'Gagnant',
    'spectate.leave_btn':     'Quitter',
    'spectate.timer_label':   'Temps restant',
    'spectate.no_tokens':     'Aucun jeton sur la carte',

    // ── PlayerPanel ──
    'player.no_cards':        'Aucune carte',
    'player.score':           'Score :',

    // ── ScoreScreen ──
    'score.end_label':        'Fin de partie',
    'score.title':            'Résultats',
    'score.points':           'points',
    'score.cards_title':      'Cartes (valeur des séquences)',
    'score.no_cards':         'aucune',
    'score.tokens_title':     'Jetons restants',
    'score.restart_btn':      '🎴 Rejouer',
    'score.menu_btn':         '🏠 Menu',

    // ── Quit dialog ──
    'quit.title':             'Quitter la partie ?',
    'quit.message':           'La partie sera sauvegardée et vous pourrez la reprendre.',
    'quit.confirm':           'Quitter',
    'quit.cancel':            'Continuer',

    // ── ModeSelect ──
    'mode.solo_title':        'Solo / Local',
    'mode.solo_desc':         'Jouez à plusieurs sur le même écran ou contre des IA. Pas de réseau requis.',
    'mode.solo_tag1':         '1–7 joueurs',
    'mode.solo_tag2':         'IA disponible',
    'mode.solo_tag3':         'Hors-ligne',
    'mode.net_title':         'Multijoueur réseau',
    'mode.net_desc':          'Chaque joueur sur son propre appareil. Connectez-vous via Wi-Fi local ou internet.',
    'mode.net_tag1':          '3–7 joueurs',
    'mode.net_tag2':          'Temps réel',
    'mode.net_tag3':          'Code de partie',
    'mode.choose':            'Choisissez un mode de jeu',
  },

  en: {
    // ── Setup solo ──
    'setup.title':            'No <span class="italic">Thanks!</span>',
    'setup.subtitle':         "The card game where every token can change a card's fate.",
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

    // ── Network — connection lobby ──
    'net.title':              'Network multiplayer',
    'net.server_label':       'Server (leave blank for local)',
    'net.server_placeholder': 'http://192.168.1.10:3000',
    'net.name_label':         'Your name',
    'net.name_placeholder':   'Your nickname',
    'net.or':                 'or',
    'net.create_btn':         'Create',
    'net.join_placeholder':   'Code ABCD',
    'net.join_btn':           'Join',
    'net.spectate_label':     'Spectator mode',
    'net.spectate_placeholder': 'Game code',
    'net.spectate_btn':       '👁 Watch',
    'net.back_btn':           '← Back to solo',
    'net.connected':          'Connected to server',
    'net.connecting':         'Connecting…',
    'net.disconnected':       'Disconnected',

    // ── Network — room lobby ──
    'lobby.code_label':       'Game code',
    'lobby.code_hint':        'Share this code to invite players',
    'lobby.code_copied':      '✅ Copied!',
    'lobby.players_label':    'Players',
    'lobby.host_badge':       'Host',
    'lobby.you_badge':        '(you)',
    'lobby.waiting':          'Waiting for players…',
    'lobby.min_missing':      '{n} more needed | {n} more needed',
    'lobby.ready':            'ready to start',
    'lobby.timer_label':      'Timer per turn',
    'lobby.timer_off':        'Off',
    'lobby.timer_unit':       's',
    'lobby.start_btn':        'Start game',
    'lobby.missing':          'player missing | players missing',
    'lobby.waiting_host':     'Waiting for the host to start…',
    'lobby.leave_btn':        'Leave game',

    // ── Game network ──
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
    'game.your_turn':         "It's your turn!",
    'game.waiting_turn':      'is playing…',
    'game.wait_msg':          'Wait for your turn…',
    'game.net_badge':         'Network',
    'game.disconnected_badge':'⚠ offline',

    // ── Controls ──
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
    'controls.time_up':       "Time's up! Card taken automatically.",

    // ── Spectator ──
    'spectate.title':         'Spectator mode',
    'spectate.subtitle':      'Watch the game live',
    'spectate.watching':      'You are watching the game',
    'spectate.code_label':    'Game code',
    'spectate.current_card':  'Current card',
    'spectate.tokens_on':     'token on card | tokens on card',
    'spectate.deck_left':     'card left | cards left',
    'spectate.turn_label':    "It's",
    'spectate.score_label':   'Score',
    'spectate.cards_label':   'Cards',
    'spectate.tokens_label':  'Tokens',
    'spectate.seq_label':     'seq.',
    'spectate.waiting':       'Waiting to start…',
    'spectate.finished':      'Game over!',
    'spectate.winner':        'Winner',
    'spectate.leave_btn':     'Leave',
    'spectate.timer_label':   'Time left',
    'spectate.no_tokens':     'No tokens on the card',

    // ── PlayerPanel ──
    'player.no_cards':        'No cards',
    'player.score':           'Score:',

    // ── ScoreScreen ──
    'score.end_label':        'Game over',
    'score.title':            'Results',
    'score.points':           'points',
    'score.cards_title':      'Cards (sequence value)',
    'score.no_cards':         'none',
    'score.tokens_title':     'Remaining tokens',
    'score.restart_btn':      '🎴 Play again',
    'score.menu_btn':         '🏠 Menu',

    // ── Quit dialog ──
    'quit.title':             'Quit the game?',
    'quit.message':           'The game will be saved and you can resume it later.',
    'quit.confirm':           'Quit',
    'quit.cancel':            'Continue',

    // ── ModeSelect ──
    'mode.solo_title':        'Solo / Local',
    'mode.solo_desc':         'Play together on the same screen or against AIs. No network required.',
    'mode.solo_tag1':         '1–7 players',
    'mode.solo_tag2':         'AI available',
    'mode.solo_tag3':         'Offline',
    'mode.net_title':         'Network multiplayer',
    'mode.net_desc':          'Each player on their own device. Connect via local Wi-Fi or internet.',
    'mode.net_tag1':          '3–7 players',
    'mode.net_tag2':          'Real-time',
    'mode.net_tag3':          'Game code',
    'mode.choose':            'Choose a game mode',
  },
}

export function useI18n() {
  function t(key, count = null) {
    const dict  = translations[lang.value] || translations.fr
    const value = dict[key] ?? translations.fr[key] ?? key
    if (count !== null && value.includes('|')) {
      const parts = value.split('|').map(s => s.trim())
      return count === 1 ? parts[0] : parts[1]
    }
    return value
  }
  function setLang(l) {
    if (!translations[l]) return
    lang.value = l
    try { localStorage.setItem('no-thanks-lang', l) } catch {}
  }
  return { t, lang, setLang }
}
