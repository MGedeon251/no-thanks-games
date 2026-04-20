<template>
  <!--
    App.vue — Composant racine.
    Orchestre les 3 phases : setup → playing → finished
  -->
  <div class="relative min-h-screen">

    <!-- Particules décoratives (jetons flottants) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        v-for="i in 8"
        :key="i"
        class="absolute token small opacity-10"
        :style="floatingTokenStyle(i)"
      />
    </div>

    <!-- Phase Setup -->
    <Transition name="screen-fade" mode="out-in">
      <SetupScreen
        v-if="phase === 'setup'"
        :has-save="hasSave"
        @start="handleStart"
        @resume="handleResume"
      />

      <!-- Phase Jeu -->
      <GameBoard
        v-else-if="phase === 'playing' && currentCard !== null"
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
        @take="prendreCarte"
        @refuse="refuserCarte"
        @quit="confirmQuit"
      />

      <!-- Phase Résultats -->
      <ScoreScreen
        v-else-if="phase === 'finished'"
        :ranking="ranking"
        @restart="handleRestart"
        @menu="resetGame"
      />
    </Transition>

    <!-- Dialogue de confirmation de sortie -->
    <Transition name="dialog-fade">
      <div
        v-if="showQuitDialog"
        class="fixed inset-0 flex items-center justify-center z-50 px-4"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);"
        @click.self="showQuitDialog = false"
      >
        <div class="panel-gold p-6 max-w-sm w-full flex flex-col gap-4 text-center">
          <p class="font-display text-xl text-gold">Quitter la partie ?</p>
          <p class="text-felt-light text-sm">La partie sera sauvegardée et vous pourrez la reprendre.</p>
          <div class="flex gap-3 justify-center">
            <button class="btn-refuse px-6" @click="doQuit">Quitter</button>
            <button class="btn-take px-6" @click="showQuitDialog = false">Continuer</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SetupScreen from './components/SetupScreen.vue'
import GameBoard from './components/GameBoard.vue'
import ScoreScreen from './components/ScoreScreen.vue'
import { useGame } from './composables/useGame.js'

// ── Logique du jeu ──
const {
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
  isGameOver,
  ranking,
  liveScores,
  initGame,
  prendreCarte,
  refuserCarte,
  resetGame,
  loadFromStorage,
} = useGame()

// ── Sauvegarde ──
const hasSave = ref(false)

onMounted(() => {
  // Vérifie si une sauvegarde existe
  try {
    hasSave.value = !!localStorage.getItem('no-thanks-save')
  } catch (_) {}
})

// ── Gestion des événements ──

/** Démarre une nouvelle partie. */
function handleStart(names, isAI) {
  initGame(names, isAI)
  hasSave.value = false
}

/** Reprend la partie sauvegardée. */
function handleResume() {
  const ok = loadFromStorage()
  if (!ok) {
    hasSave.value = false
  }
}

/** Rejouer avec les mêmes joueurs. */
function handleRestart() {
  if (!players.value.length) {
    resetGame()
    return
  }
  const names = players.value.map(p => p.name)
  const isAI = players.value.map(p => p.isAI)
  initGame(names, isAI)
}

// ── Dialogue de sortie ──
const showQuitDialog = ref(false)

function confirmQuit() {
  showQuitDialog.value = true
}

function doQuit() {
  showQuitDialog.value = false
  resetGame()
  hasSave.value = true // on vient de sauvegarder
}

// ── Éléments décoratifs ──

/** Génère un style aléatoire pour les jetons flottants en arrière-plan. */
function floatingTokenStyle(i) {
  const positions = [
    { left: '5%',  top: '15%', animDelay: '0s',    animDur: '7s'  },
    { left: '88%', top: '8%',  animDelay: '1.2s',  animDur: '9s'  },
    { left: '15%', top: '75%', animDelay: '0.5s',  animDur: '8s'  },
    { left: '92%', top: '60%', animDelay: '2s',    animDur: '6s'  },
    { left: '45%', top: '5%',  animDelay: '0.8s',  animDur: '10s' },
    { left: '70%', top: '90%', animDelay: '1.5s',  animDur: '7.5s'},
    { left: '30%', top: '92%', animDelay: '3s',    animDur: '8.5s'},
    { left: '58%', top: '50%', animDelay: '2.5s',  animDur: '9.5s'},
  ]
  const p = positions[(i - 1) % positions.length]
  return {
    left: p.left,
    top: p.top,
    animationDelay: p.animDelay,
    animationDuration: p.animDur,
    animation: `float ${p.animDur} ease-in-out ${p.animDelay} infinite`,
  }
}
</script>

<style scoped>
.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.screen-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
