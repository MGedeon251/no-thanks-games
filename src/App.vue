<template>
  <div class="relative min-h-screen">

    <!-- Particules décoratives -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div v-for="i in 8" :key="i" class="absolute token small opacity-10" :style="floatingTokenStyle(i)" />
    </div>

    <Transition name="screen-fade" mode="out-in">
      <SetupScreen
        v-if="phase === 'setup'"
        key="setup"
        :has-save="hasSave"
        @start="handleStart"
        @resume="handleResume"
      />
      <GameBoard
        v-else-if="phase === 'playing' && currentCard !== null"
        key="playing"
        :players="players"
        :deck="deck"
        :current-card="currentCard"
        :tokens-on-card="tokensOnCard"
        :current-player-index="currentPlayerIndex"
        :current-player="currentPlayer"
        :last-action="lastAction"
        :card-anim-key="cardAnimKey"
        :no-token-shake="noTokenShake"
        :live-scores="liveScores"
        :timer-enabled="timerEnabled"
        :remaining="remaining"
        :progress="progress"
        :urgency="urgency"
        @take="handleTake"
        @refuse="handleRefuse"
        @quit="confirmQuit"
      />
      <ScoreScreen
        v-else-if="phase === 'finished'"
        key="finished"
        :ranking="ranking"
        @restart="handleRestart"
        @menu="resetGame"
      />
      <div v-else key="loading" class="min-h-screen flex items-center justify-center">
        <div class="token large animate-pulse" />
      </div>
    </Transition>

    <!-- Dialogue de sortie -->
    <Transition name="dialog-fade">
      <div
        v-if="showQuitDialog"
        class="fixed inset-0 flex items-center justify-center z-50 px-4"
        style="background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);"
        @click.self="showQuitDialog = false"
      >
        <div class="panel-gold p-6 max-w-sm w-full flex flex-col gap-4 text-center">
          <p class="font-display text-xl text-gold">{{ t('quit.title') }}</p>
          <p class="text-felt-light text-sm">{{ t('quit.message') }}</p>
          <div class="flex gap-3 justify-center">
            <button class="btn-refuse px-6" @click="doQuit">{{ t('quit.confirm') }}</button>
            <button class="btn-take px-6"   @click="showQuitDialog = false">{{ t('quit.cancel') }}</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, onMounted } from 'vue'
import SetupScreen from './components/SetupScreen.vue'
import GameBoard   from './components/GameBoard.vue'
import ScoreScreen from './components/ScoreScreen.vue'
import { useGame }  from './composables/useGame.js'
import { useTimer } from './composables/useTimer.js'
import { useI18n }  from './composables/useI18n.js'

const { t } = useI18n()

// ── Jeu ──
const {
  phase, players, deck, currentCard, tokensOnCard,
  currentPlayerIndex, currentPlayer, lastAction,
  cardAnimKey, noTokenShake, ranking, liveScores,
  initGame, prendreCarte, refuserCarte, resetGame, loadFromStorage,
} = useGame()

// ── Timer ──
const { timerEnabled, remaining, progress, urgency, startTimer, stopTimer, configure } = useTimer()

// ── Sauvegarde ──
const hasSave = ref(false)
onMounted(() => {
  try { hasSave.value = !!localStorage.getItem('no-thanks-save') } catch {}
})

// ── Lancer le timer au changement de joueur ──
watch(currentPlayerIndex, () => {
  if (phase.value !== 'playing') return
  if (currentPlayer.value?.isAI) {
    stopTimer()
    return
  }
  startTimer(() => {
    // Temps écoulé → le joueur prend la carte automatiquement
    prendreCarte()
  })
})

// Arrêter le timer quand la partie se termine
watch(phase, (val) => {
  if (val !== 'playing') stopTimer()
})

onUnmounted(() => stopTimer())

// ── Actions avec timer ──
function handleTake() {
  stopTimer()
  prendreCarte()
}

function handleRefuse() {
  stopTimer()
  refuserCarte()
}

// ── Setup ──
function handleStart(names, isAIList, options = {}) {
  configure(options.timerEnabled ?? false, options.timerDuration ?? 30)
  initGame(names, Array.isArray(isAIList) ? isAIList : [])
  hasSave.value = false
}

function handleResume() {
  const ok = loadFromStorage()
  if (!ok) hasSave.value = false
  // Relancer le timer si la partie reprise a le timer activé
  // (on ne le sauvegarde pas, donc désactivé par défaut à la reprise)
}

function handleRestart() {
  stopTimer()
  if (!players.value.length) { resetGame(); return }
  const names  = players.value.map(p => p.name)
  const isAI   = players.value.map(p => p.isAI)
  // Réutilise la config timer courante
  initGame(names, isAI)
}

// ── Démarrer le timer pour le premier joueur après init ──
watch(currentCard, (val) => {
  if (val !== null && phase.value === 'playing' && !currentPlayer.value?.isAI) {
    startTimer(() => { prendreCarte() })
  }
}, { once: false })

// ── Quit dialog ──
const showQuitDialog = ref(false)
function confirmQuit()  { showQuitDialog.value = true }
function doQuit() {
  showQuitDialog.value = false
  stopTimer()
  resetGame()
  hasSave.value = true
}

// ── Déco ──
function floatingTokenStyle(i) {
  const p = [
    { left:'5%',  top:'15%', d:'0s',    dur:'7s'   },
    { left:'88%', top:'8%',  d:'1.2s',  dur:'9s'   },
    { left:'15%', top:'75%', d:'0.5s',  dur:'8s'   },
    { left:'92%', top:'60%', d:'2s',    dur:'6s'   },
    { left:'45%', top:'5%',  d:'0.8s',  dur:'10s'  },
    { left:'70%', top:'90%', d:'1.5s',  dur:'7.5s' },
    { left:'30%', top:'92%', d:'3s',    dur:'8.5s' },
    { left:'58%', top:'50%', d:'2.5s',  dur:'9.5s' },
  ][(i-1) % 8]
  return { left:p.left, top:p.top, animation:`float ${p.dur} ease-in-out ${p.d} infinite` }
}
</script>

<style scoped>
.screen-fade-enter-active, .screen-fade-leave-active { transition: opacity .3s ease, transform .3s ease; }
.screen-fade-enter-from { opacity:0; transform:translateY(10px); }
.screen-fade-leave-to   { opacity:0; transform:translateY(-10px); }
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity .2s ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity:0; }
</style>
