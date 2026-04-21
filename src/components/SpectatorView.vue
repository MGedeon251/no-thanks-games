<template>
  <!--
    SpectatorView.vue — Mode spectateur grand écran
    Conçu pour être projeté sur un grand écran / TV.
    Affiche toutes les informations de la partie en temps réel.
    Mise en page cinématique : carte centrale grande, joueurs en bas.
  -->
  <div class="min-h-screen flex flex-col" style="background: #061f15;">

    <!-- ── En-tête ── -->
    <header class="flex items-center justify-between px-8 py-4 border-b border-token-gold/10">
      <div class="flex items-center gap-4">
        <h1 class="font-display text-2xl text-gold tracking-tight">No <span class="italic">Thanks!</span></h1>
        <span class="text-xs px-2.5 py-1 rounded-full bg-blue-900/50 border border-blue-400/20 text-blue-300 font-mono tracking-wider">
          👁 {{ t('spectate.watching') }}
        </span>
        <span class="font-mono text-sm text-felt-light">
          {{ t('spectate.code_label') }} : <span class="text-gold font-bold tracking-widest">{{ roomCode }}</span>
        </span>
      </div>
      <div class="flex items-center gap-6">
        <!-- Sélecteur langue -->
        <div class="flex gap-2">
          <button v-for="l in ['fr','en']" :key="l"
            class="px-2 py-1 rounded-lg border text-xs transition-all"
            :class="lang === l ? 'bg-token-gold text-ink-dark border-token-gold' : 'border-token-gold/20 text-felt-light hover:border-token-gold/40'"
            @click="setLang(l)">
            {{ l === 'fr' ? '🇫🇷' : '🇬🇧' }}
          </button>
        </div>
        <span class="font-mono text-xs text-felt-light">
          {{ cardsRemaining }} {{ t('spectate.deck_left', cardsRemaining) }}
        </span>
        <button class="text-xs px-3 py-1.5 rounded-lg border border-token-gold/20 text-felt-light hover:border-red-400/40 hover:text-red-400 transition-colors"
          @click="$emit('leave')">
          {{ t('spectate.leave_btn') }}
        </button>
      </div>
    </header>

    <!-- ── Corps principal ── -->
    <main class="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

      <!-- Zone centrale : carte + infos du tour -->
      <div class="flex-1 flex flex-col items-center justify-center gap-8 p-8 relative">

        <!-- Fond décoratif -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 50%, rgba(26,107,58,0.3) 0%, transparent 70%);"></div>
        </div>

        <!-- Lobby en attente -->
        <Transition name="screen-fade" mode="out-in">
          <div v-if="phase === 'lobby'" key="lobby" class="text-center flex flex-col items-center gap-6">
            <div class="font-display text-5xl text-gold animate-float">🎴</div>
            <p class="font-display text-3xl text-gold">{{ t('spectate.waiting') }}</p>
            <div class="flex flex-wrap justify-center gap-3 max-w-sm">
              <div v-for="p in players" :key="p.name"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-felt/50 border border-token-gold/20">
                <div class="token small" />
                <span class="text-sm text-card-bg">{{ p.name }}</span>
              </div>
            </div>
          </div>

          <!-- Partie en cours -->
          <div v-else-if="phase === 'playing' && currentCard" key="playing" class="flex flex-col items-center gap-8 relative z-10 w-full max-w-lg">

            <!-- Bandeau joueur actif -->
            <div class="w-full text-center">
              <p class="text-felt-light text-sm uppercase tracking-widest mb-1">{{ t('spectate.turn_label') }}</p>
              <p class="font-display text-4xl text-gold">{{ currentPlayerName }}</p>

              <!-- Timer grand format -->
              <div v-if="timerEnabled && timerRemaining !== null" class="mt-4 flex flex-col items-center gap-2">
                <div class="w-64 h-3 rounded-full bg-felt-dark/80 overflow-hidden border border-token-gold/10">
                  <div class="h-full rounded-full transition-all duration-1000 ease-linear"
                    :class="{
                      'bg-green-500':  timerUrgency === 'safe',
                      'bg-orange-400': timerUrgency === 'warn',
                      'bg-red-500':    timerUrgency === 'danger',
                    }"
                    :style="{ width: timerProgress * 100 + '%' }" />
                </div>
                <span class="font-display text-5xl font-bold transition-colors"
                  :class="{
                    'text-green-400':  timerUrgency === 'safe',
                    'text-orange-400': timerUrgency === 'warn',
                    'text-red-400 animate-pulse': timerUrgency === 'danger',
                  }">
                  {{ timerRemaining }}s
                </span>
              </div>
            </div>

            <!-- Grande carte -->
            <Transition name="card-flip" mode="out-in">
              <div :key="cardAnimKey"
                class="playing-card large animate-card-in select-none"
                :data-number="currentCard"
                :class="cardColorClass"
                style="width: 160px; height: 224px; font-size: 5rem;">
                {{ currentCard }}
              </div>
            </Transition>

            <!-- Jetons sur la carte -->
            <div class="flex flex-col items-center gap-2">
              <div v-if="tokensOnCard > 0" class="flex items-center gap-3">
                <div v-if="tokensOnCard <= 12" class="flex gap-1 flex-wrap justify-center" style="max-width: 200px;">
                  <div v-for="i in tokensOnCard" :key="i" class="token medium animate-token-drop"
                    :style="{ animationDelay: `${(i-1)*0.04}s` }" />
                </div>
                <div v-else class="token large text-xl">{{ tokensOnCard }}</div>
                <span class="font-display text-2xl text-gold">
                  {{ tokensOnCard }} {{ t('spectate.tokens_on', tokensOnCard) }}
                </span>
              </div>
              <div v-else class="text-felt-light text-lg italic">{{ t('spectate.no_tokens') }}</div>
            </div>

            <!-- Dernière action -->
            <Transition name="action-toast">
              <div v-if="lastAction" :key="lastAction.type + lastAction.card"
                class="panel-gold px-6 py-3 text-base text-center"
                :class="lastAction.type === 'take' ? 'border-green-500/40' : 'border-red-500/40'">
                <span class="font-bold" :class="lastAction.type === 'take' ? 'text-green-400' : 'text-red-400'">
                  {{ lastAction.playerName }}
                </span>
                <span class="text-felt-light mx-2">{{ lastAction.type === 'take' ? t('game.action_took') : t('game.action_refused') }}</span>
                <span class="text-gold font-mono font-bold">{{ lastAction.card }}</span>
                <span v-if="lastAction.type === 'take' && lastAction.tokens > 0" class="text-gold ml-1">
                  (+{{ lastAction.tokens }} {{ t('game.tokens_gained') }})
                </span>
              </div>
            </Transition>
          </div>

          <!-- Partie terminée -->
          <div v-else-if="phase === 'finished'" key="finished" class="text-center flex flex-col items-center gap-6 relative z-10">
            <div class="text-6xl animate-winner-glow rounded-2xl p-4">🏆</div>
            <p class="font-display text-5xl text-gold">{{ t('spectate.finished') }}</p>
            <div class="panel-gold px-8 py-4 flex flex-col items-center gap-2 animate-winner-glow">
              <p class="text-xs uppercase tracking-widest text-felt-light">{{ t('spectate.winner') }}</p>
              <p class="font-display text-3xl text-gold">{{ winners.map(w => w.name).join(' & ') }}</p>
              <p class="font-mono text-gold">{{ winners[0]?.score }} pts</p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ── Colonne droite : tableau des joueurs ── -->
      <aside class="w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-token-gold/10 flex flex-col overflow-y-auto">
        <div class="px-4 py-3 border-b border-token-gold/10">
          <h2 class="text-xs uppercase tracking-widest text-felt-light">{{ t('game.players_title') }}</h2>
        </div>

        <!-- Classement temps réel -->
        <div class="flex flex-col flex-1 p-3 gap-2">
          <TransitionGroup name="player-rank" tag="div" class="flex flex-col gap-2">
            <div v-for="(player, idx) in sortedPlayers" :key="player.id"
              class="panel p-3 transition-all duration-500 relative overflow-hidden"
              :class="{
                'player-active border-2': player.isCurrentPlayer,
                'border border-transparent': !player.isCurrentPlayer,
                'opacity-50': !player.connected,
              }">
              <div v-if="player.isCurrentPlayer" class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-token-gold to-transparent" />

              <!-- Rang + Nom -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    :class="{
                      'bg-token-gold text-ink-dark': idx === 0,
                      'bg-gray-500/40 text-gray-300': idx === 1,
                      'bg-amber-700/40 text-amber-300': idx === 2,
                      'bg-felt/50 text-felt-light': idx > 2,
                    }">{{ idx + 1 }}</div>
                  <span class="font-display font-bold text-sm truncate"
                    :class="player.isCurrentPlayer ? 'text-gold' : 'text-card-bg'">
                    {{ player.name }}
                  </span>
                  <span v-if="!player.connected" class="text-xs text-red-400">{{ t('game.disconnected_badge') }}</span>
                </div>
                <!-- Score -->
                <div class="text-right shrink-0">
                  <span class="font-display text-lg font-bold"
                    :class="player.score < 0 ? 'text-green-400' : 'text-gold'">
                    {{ player.score }}
                  </span>
                  <span class="text-xs text-felt-light ml-1">pts</span>
                </div>
              </div>

              <!-- Jetons + Cartes résumé -->
              <div class="flex items-center justify-between text-xs text-felt-light">
                <div class="flex items-center gap-1">
                  <div class="token small" style="width:16px;height:16px;font-size:8px;" />
                  <span class="font-mono" :class="player.tokens === 0 ? 'text-red-400' : 'text-gold'">{{ player.tokens }}</span>
                </div>
                <div class="flex flex-wrap gap-0.5 justify-end max-w-[160px]">
                  <template v-for="(seq, si) in player.sequences" :key="si">
                    <div class="flex items-center"
                      :class="seq.length > 1 ? 'bg-token-gold/10 rounded px-0.5' : ''">
                      <div v-for="(c, ci) in seq" :key="c"
                        class="playing-card text-center font-bold rounded"
                        :class="[smallCardColor(c), ci > 0 ? '-ml-1' : '']"
                        :style="{ width:'20px', height:'28px', fontSize:'9px', lineHeight:'28px', zIndex: ci, border:'1px solid', borderRadius:'4px' }">
                        {{ c }}
                      </div>
                    </div>
                  </template>
                  <span v-if="!player.cards.length" class="italic">{{ t('player.no_cards') }}</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Légende -->
        <div class="px-3 py-2 border-t border-token-gold/10 text-xs text-felt-light">
          {{ t('game.seq_hint') }}
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t, lang, setLang } = useI18n()

const props = defineProps({
  roomCode:          { type: String,  default: '' },
  phase:             { type: String,  default: 'lobby' },
  players:           { type: Array,   default: () => [] },
  currentCard:       { type: Number,  default: null },
  tokensOnCard:      { type: Number,  default: 0 },
  cardsRemaining:    { type: Number,  default: 0 },
  currentPlayerName: { type: String,  default: '' },
  lastAction:        { type: Object,  default: null },
  cardAnimKey:       { type: Number,  default: 0 },
  // Timer
  timerEnabled:      { type: Boolean, default: false },
  timerRemaining:    { type: Number,  default: null },
  timerProgress:     { type: Number,  default: 1 },
  timerUrgency:      { type: String,  default: 'safe' },
  // Fin de partie
  ranking:           { type: Array,   default: () => [] },
})

defineEmits(['leave'])

// Classement temps réel (le meilleur score en premier)
const sortedPlayers = computed(() =>
  [...props.players].sort((a, b) => a.score - b.score)
)

// Gagnant(s)
const winners = computed(() => {
  if (!props.ranking.length) return []
  const best = props.ranking[0]?.score
  return props.ranking.filter(p => p.score === best)
})

// Couleur de la carte
const cardColorClass = computed(() => {
  const n = props.currentCard
  if (!n) return ''
  if (n <= 10) return 'card-low'
  if (n <= 20) return 'card-mid'
  if (n <= 28) return 'card-high'
  return 'card-top'
})

function smallCardColor(n) {
  if (n <= 10) return 'card-small-low'
  if (n <= 20) return 'card-small-mid'
  if (n <= 28) return 'card-small-high'
  return 'card-small-top'
}
</script>

<style scoped>
.card-flip-enter-active,.card-flip-leave-active{transition:all .3s ease}
.card-flip-enter-from{opacity:0;transform:translateY(-30px) scale(0.85)}
.card-flip-leave-to{opacity:0;transform:translateY(30px) scale(0.85)}

.action-toast-enter-active,.action-toast-leave-active{transition:all .3s ease}
.action-toast-enter-from{opacity:0;transform:translateY(-8px) scale(0.97)}
.action-toast-leave-to{opacity:0}

.screen-fade-enter-active,.screen-fade-leave-active{transition:all .4s ease}
.screen-fade-enter-from,.screen-fade-leave-to{opacity:0;transform:scale(0.97)}

.player-rank-move{transition:transform .4s ease}
.player-rank-enter-active,.player-rank-leave-active{transition:all .3s ease}
.player-rank-enter-from,.player-rank-leave-to{opacity:0;transform:translateX(20px)}

.card-low  { background:linear-gradient(145deg,#fefae8,#fdf6d0);border-color:#d4a020;color:#1a0e00 }
.card-mid  { background:linear-gradient(145deg,#fdf6e3,#f8ede0);border-color:#c9a84c;color:#1a0e00 }
.card-high { background:linear-gradient(145deg,#f5f0f8,#ede6f5);border-color:#9b7ac4;color:#2a1060 }
.card-top  { background:linear-gradient(145deg,#f0f4f8,#e0e8f4);border-color:#5a7ab0;color:#0a2050 }
.card-small-low  { background:#fefae8;border-color:#d4a020;color:#1a0e00 }
.card-small-mid  { background:#fdf6e3;border-color:#c9a84c;color:#1a0e00 }
.card-small-high { background:#ede6f5;border-color:#9b7ac4;color:#2a1060 }
.card-small-top  { background:#e0e8f4;border-color:#5a7ab0;color:#0a2050 }
</style>
