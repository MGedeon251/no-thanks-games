<template>
  <!--
    Écran de configuration : saisie des noms de joueurs, choix IA/humain,
    option de reprise de partie sauvegardée.
  -->
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">

    <!-- Titre principal -->
    <div class="text-center">
      <h1 class="font-display text-5xl md:text-7xl text-gold tracking-tight leading-none mb-3 animate-float">
        No <span class="italic">Thanks!</span>
      </h1>
      <p class="text-felt-light font-body text-sm md:text-base max-w-xs mx-auto">
        Le jeu de cartes où chaque jeton peut changer le destin d'une carte.
      </p>
    </div>

    <!-- Carte de configuration -->
    <div class="panel-gold w-full max-w-lg p-6 flex flex-col gap-6">

      <!-- Nombre de joueurs -->
      <div>
        <label class="text-xs uppercase tracking-widest text-felt-light block mb-3">
          Nombre de joueurs
        </label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="n in [3,4,5,6,7]"
            :key="n"
            class="w-10 h-10 rounded-lg font-mono text-sm font-semibold border transition-all"
            :class="playerCount === n
              ? 'bg-token-gold text-ink-dark border-token-gold shadow-[0_2px_0_#8b6014]'
              : 'bg-felt/50 border-token-gold/20 text-felt-light hover:border-token-gold/50 hover:text-gold'"
            @click="setPlayerCount(n)"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Saisie des noms -->
      <div class="flex flex-col gap-3">
        <label class="text-xs uppercase tracking-widest text-felt-light">
          Joueurs
        </label>

        <TransitionGroup name="player-row" tag="div" class="flex flex-col gap-2">
          <div
            v-for="i in playerCount"
            :key="i"
            class="flex items-center gap-3"
          >
            <!-- Index -->
            <div
              class="token small shrink-0"
              style="font-size: 10px;"
            >{{ i }}</div>

            <!-- Nom -->
            <input
              v-model="playerNames[i - 1]"
              type="text"
              :placeholder="`Joueur ${i}`"
              maxlength="20"
              class="flex-1 bg-felt-dark/60 border border-token-gold/20 rounded-lg px-3 py-2 text-sm text-card-bg placeholder-felt-light/50 focus:outline-none focus:border-token-gold/60 transition-colors font-body"
              @keydown.enter="focusNext(i)"
              :ref="el => { if (el) inputRefs[i - 1] = el }"
            />

            <!-- Toggle IA -->
            <button
              class="text-xs px-2 py-1.5 rounded-lg border transition-all shrink-0"
              :class="isAI[i - 1]
                ? 'bg-blue-900/60 border-blue-400/50 text-blue-300'
                : 'bg-felt/50 border-token-gold/20 text-felt-light hover:border-token-gold/40'"
              @click="toggleAI(i - 1)"
              :title="isAI[i - 1] ? 'Joueur IA (cliquer pour humain)' : 'Joueur humain (cliquer pour IA)'"
            >
              {{ isAI[i - 1] ? '🤖 IA' : '👤' }}
            </button>
          </div>
        </TransitionGroup>
      </div>

      <!-- Règles rapides -->
      <details class="text-xs text-felt-light cursor-pointer">
        <summary class="text-gold/70 hover:text-gold transition-colors select-none">
          Rappel des règles
        </summary>
        <div class="mt-3 grid grid-cols-1 gap-1.5 pl-2 border-l-2 border-token-gold/20">
          <p>• Cartes numérotées de 3 à 35 — 9 retirées aléatoirement</p>
          <p>• Chaque joueur commence avec <strong class="text-gold">11 jetons</strong></p>
          <p>• Ton tour : <strong class="text-card-bg">Prendre</strong> la carte (et ses jetons) <em>ou</em> <strong class="text-card-bg">No Thanks!</strong> (poser 1 jeton)</p>
          <p>• Sans jeton : obligation de prendre !</p>
          <p>• Score = cartes (séquences = plus petite uniquement) − jetons restants</p>
          <p>• Le plus petit score gagne</p>
        </div>
      </details>

      <!-- Bouton démarrer -->
      <button
        class="btn-take w-full justify-center py-4 text-base flex items-center gap-2"
        :disabled="!canStart"
        @click="$emit('start', getNames(), isAI.value.slice(0, playerCount))"
      >
        <span class="text-xl">🎴</span>
        Commencer la partie
      </button>

      <!-- Reprendre partie sauvegardée -->
      <button
        v-if="hasSave"
        class="text-sm text-gold/60 hover:text-gold transition-colors underline underline-offset-2 text-center"
        @click="$emit('resume')"
      >
        ↩ Reprendre la partie précédente
      </button>

    </div>

    <!-- Crédits discrets -->
    <p class="text-felt-light/30 text-xs font-mono">
      No Thanks! — Thorsten Gimmler (2004)
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  hasSave: { type: Boolean, default: false },
})

const emit = defineEmits(['start', 'resume'])

const playerCount = ref(4)
// Noms par défaut
const playerNames = ref(['', '', '', '', '', '', ''])
// Indicateurs IA (false = humain par défaut)
const isAI = ref([false, false, false, false, false, false, false])
const inputRefs = ref([])

const canStart = computed(() => {
  // Au moins les champs requis remplis ou laissés au placeholder
  return playerCount.value >= 3
})

function setPlayerCount(n) {
  playerCount.value = n
}

function toggleAI(index) {
  isAI.value[index] = !isAI.value[index]
}

/** Retourne les noms finaux (en utilisant le placeholder si vide). */
function getNames() {
  return Array.from({ length: playerCount.value }, (_, i) =>
    playerNames.value[i]?.trim() || `Joueur ${i + 1}`
  )
}

/** Focus sur le champ suivant au Enter. */
function focusNext(i) {
  if (i < playerCount.value && inputRefs.value[i]) {
    inputRefs.value[i].focus()
  }
}
</script>

<style scoped>
.player-row-enter-active,
.player-row-leave-active {
  transition: all 0.25s ease;
}
.player-row-enter-from,
.player-row-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
