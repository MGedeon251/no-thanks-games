<template>
  <!-- Écran des scores finaux avec classement animé -->
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">

    <!-- Titre -->
    <div class="text-center">
      <p class="text-xs uppercase tracking-widest text-felt-light mb-2">Fin de partie</p>
      <h1 class="font-display text-4xl md:text-5xl text-gold">
        Résultats
      </h1>
    </div>

    <!-- Gagnant(s) -->
    <div class="text-center">
      <div class="panel-gold px-6 py-4 inline-flex flex-col items-center gap-2 animate-winner-glow">
        <span class="text-3xl">🏆</span>
        <span class="font-display text-2xl text-gold">
          {{ winners.map(w => w.name).join(' & ') }}
        </span>
        <span class="text-felt-light text-sm font-mono">
          Score : {{ winners[0]?.score }}
        </span>
      </div>
    </div>

    <!-- Tableau des scores -->
    <div class="w-full max-w-lg flex flex-col gap-3">
      <TransitionGroup name="score-row" tag="div" class="flex flex-col gap-3" appear>
        <div
          v-for="(player, index) in ranking"
          :key="player.id"
          class="panel p-4 flex flex-col gap-3"
          :class="index === 0 ? 'border border-token-gold/50' : ''"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          <!-- En-tête joueur -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Rang -->
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold"
                :class="{
                  'bg-token-gold text-ink-dark': index === 0,
                  'bg-gray-500/40 text-gray-300': index === 1,
                  'bg-amber-700/40 text-amber-300': index === 2,
                  'bg-felt/50 text-felt-light': index > 2,
                }"
              >
                {{ index + 1 }}
              </div>

              <!-- Nom -->
              <span class="font-display font-bold" :class="index === 0 ? 'text-gold' : 'text-card-bg'">
                {{ player.name }}
              </span>
              <span v-if="player.isAI" class="text-xs px-1.5 py-0.5 rounded bg-blue-900/40 border border-blue-400/20 text-blue-300">IA</span>
            </div>

            <!-- Score total -->
            <div class="text-right">
              <div
                class="font-display text-2xl font-bold"
                :class="index === 0 ? 'text-gold' : 'text-card-bg'"
              >
                {{ player.score }}
              </div>
              <div class="text-xs text-felt-light font-mono">points</div>
            </div>
          </div>

          <!-- Détail du calcul -->
          <div class="grid grid-cols-2 gap-3 text-sm border-t border-token-gold/10 pt-3">

            <!-- Cartes -->
            <div>
              <p class="text-xs text-felt-light mb-2">Cartes (valeur des séquences)</p>
              <div class="flex flex-wrap gap-1">
                <template v-for="(seq, si) in player.sequences" :key="si">
                  <div class="flex items-center gap-0.5 px-1.5 py-1 rounded-lg"
                    :class="seq.length > 1 ? 'bg-token-gold/10 border border-token-gold/20' : ''">
                    <div
                      v-for="(c, ci) in seq"
                      :key="c"
                      class="playing-card small text-xs"
                      :class="[smallCardColor(c), ci > 0 ? '-ml-2' : '']"
                      :style="{ zIndex: ci }"
                    >
                      {{ c }}
                    </div>
                    <!-- Valeur de la séquence -->
                    <span v-if="seq.length > 1" class="text-xs text-token-gold font-mono ml-1">
                      (={{ seq[0] }})
                    </span>
                  </div>
                </template>
                <span v-if="player.cartes.length === 0" class="text-felt-light italic text-xs">aucune</span>
              </div>
            </div>

            <!-- Jetons -->
            <div>
              <p class="text-xs text-felt-light mb-2">Jetons restants</p>
              <div class="flex items-center gap-2">
                <div class="token medium" />
                <span class="font-mono text-gold text-sm">× {{ player.jetons }}</span>
                <span class="text-felt-light text-xs">(−{{ player.jetons }})</span>
              </div>
            </div>
          </div>

          <!-- Formule de score -->
          <div class="text-xs font-mono text-felt-light bg-felt-dark/40 rounded-lg px-3 py-2">
            {{ scoreFormula(player) }}
            <span class="text-gold font-semibold">= {{ player.score }}</span>
          </div>

        </div>
      </TransitionGroup>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <button
        class="btn-take flex items-center gap-2"
        @click="$emit('restart')"
      >
        <span>🎴</span>
        Rejouer
      </button>
      <button
        class="btn-refuse flex items-center gap-2"
        @click="$emit('menu')"
      >
        <span>🏠</span>
        Menu
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ranking: { type: Array, required: true },
})

defineEmits(['restart', 'menu'])

/** Gagnant(s) : joueur(s) avec le score le plus bas. */
const winners = computed(() => {
  if (!props.ranking.length) return []
  const best = props.ranking[0].score
  return props.ranking.filter(p => p.score === best)
})

function smallCardColor(n) {
  if (n <= 10) return 'card-small-low'
  if (n <= 20) return 'card-small-mid'
  if (n <= 28) return 'card-small-high'
  return 'card-small-top'
}

/** Construit la formule lisible du score d'un joueur. */
function scoreFormula(player) {
  const parts = player.sequences.map(seq => seq[0])
  const sumStr = parts.join(' + ') || '0'
  return `(${sumStr}) − ${player.jetons} `
}
</script>

<style scoped>
.score-row-enter-active {
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.score-row-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-small-low  { background: #fefae8; border-color: #d4a020; color: #1a0e00; }
.card-small-mid  { background: #fdf6e3; border-color: #c9a84c; color: #1a0e00; }
.card-small-high { background: #ede6f5; border-color: #9b7ac4; color: #2a1060; }
.card-small-top  { background: #e0e8f4; border-color: #5a7ab0; color: #0a2050; }
</style>
