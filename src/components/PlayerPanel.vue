<template>
  <div
    class="panel p-3 transition-all duration-300 relative overflow-hidden"
    :class="{
      'player-active border-2': isActive,
      'border border-transparent': !isActive,
      'opacity-80': !isActive,
    }"
  >
    <div v-if="isActive" class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-token-gold to-transparent" />

    <!-- En-tête -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2 min-w-0">
        <div
          class="w-2 h-2 rounded-full shrink-0 transition-colors"
          :class="isActive ? 'bg-token-gold animate-pulse-gold' : 'bg-felt-light opacity-40'"
        />
        <span
          class="font-display font-bold truncate text-sm"
          :class="isActive ? 'text-gold' : 'text-card-bg'"
        >
          {{ player.name }}
        </span>
        <span
          v-if="player.isAI"
          class="text-xs px-1.5 py-0.5 rounded bg-blue-900/40 border border-blue-400/20 text-blue-300 shrink-0"
        >
          {{ t('controls.ai_badge') }}
        </span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <div class="token small" />
        <span class="font-mono text-xs" :class="player.jetons === 0 ? 'text-red-400' : 'text-gold'">
          {{ player.jetons }}
        </span>
      </div>
    </div>

    <!-- Score intermédiaire -->
    <div class="text-xs text-felt-light font-mono mb-2 flex items-center gap-1">
      <span>{{ t('player.score') }}</span>
      <span :class="score < 0 ? 'text-green-400' : 'text-card-bg'">{{ score }}</span>
    </div>

    <!-- Cartes par séquence -->
    <div v-if="player.cartes.length > 0" class="flex flex-wrap gap-1.5">
      <template v-for="(seq, si) in sequences" :key="si">
        <div
          class="flex items-center gap-0.5 px-1.5 py-1 rounded-lg"
          :class="seq.length > 1 ? 'bg-token-gold/10 border border-token-gold/20' : ''"
        >
          <div
            v-for="(c, ci) in seq"
            :key="c"
            class="playing-card small"
            :class="[smallCardColorClass(c), ci > 0 ? '-ml-2' : '']"
            :style="{ zIndex: ci }"
          >{{ c }}</div>
          <span v-if="seq.length > 1" class="sequence-badge ml-1">+{{ seq.length - 1 }}</span>
        </div>
      </template>
    </div>
    <div v-else class="text-felt-light text-xs italic">{{ t('player.no_cards') }}</div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

defineProps({
  player:    { type: Object, required: true },
  isActive:  { type: Boolean, default: false },
  score:     { type: Number,  default: 0 },
  sequences: { type: Array,   default: () => [] },
})

function smallCardColorClass(n) {
  if (n <= 10) return 'card-small-low'
  if (n <= 20) return 'card-small-mid'
  if (n <= 28) return 'card-small-high'
  return 'card-small-top'
}
</script>

<style scoped>
.card-small-low  { background: #fefae8; border-color: #d4a020; color: #1a0e00; }
.card-small-mid  { background: #fdf6e3; border-color: #c9a84c; color: #1a0e00; }
.card-small-high { background: #ede6f5; border-color: #9b7ac4; color: #2a1060; }
.card-small-top  { background: #e0e8f4; border-color: #5a7ab0; color: #0a2050; }
</style>
