<template>
  <div class="flex flex-col items-center gap-6">
    <div class="relative flex flex-col items-center">
      <p class="text-xs uppercase tracking-widest text-felt-light mb-3 font-body">
        {{ t('game.current_card') }}
      </p>

      <Transition name="card-flip" mode="out-in">
        <div
          :key="animKey"
          class="playing-card large animate-card-in select-none"
          :data-number="card"
          :class="cardColorClass"
        >
          {{ card }}
        </div>
      </Transition>

      <Transition name="tokens-fade">
        <div
          v-if="tokensOnCard > 0"
          class="absolute -bottom-4 flex items-center gap-1 flex-wrap justify-center"
          style="max-width: 160px;"
        >
          <template v-if="tokensOnCard <= 8">
            <div
              v-for="i in tokensOnCard"
              :key="i"
              class="token small animate-token-drop"
              :style="{ animationDelay: `${(i - 1) * 0.04}s` }"
            />
          </template>
          <template v-else>
            <div class="token large">{{ tokensOnCard }}</div>
          </template>
        </div>
      </Transition>
    </div>

    <div class="flex flex-col items-center gap-1 mt-4">
      <div v-if="tokensOnCard > 0" class="flex items-center gap-2">
        <div class="token small" />
        <span class="text-gold font-mono text-sm">
          × {{ tokensOnCard }} {{ t('game.tokens_on_card', tokensOnCard) }}
        </span>
      </div>
      <div v-else class="text-felt-light text-sm italic">{{ t('game.no_tokens') }}</div>
      <div class="flex items-center gap-2 mt-1">
        <div class="w-3 h-3 rounded bg-ink-mid opacity-70" />
        <span class="text-felt-light text-xs font-mono">
          {{ deckSize }} {{ t('game.deck_left', deckSize) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const props = defineProps({
  card:         { type: Number,  required: true },
  tokensOnCard: { type: Number,  default: 0 },
  deckSize:     { type: Number,  default: 0 },
  animKey:      { type: Number,  default: 0 },
})

const cardColorClass = computed(() => {
  const n = props.card
  if (n <= 10) return 'card-low'
  if (n <= 20) return 'card-mid'
  if (n <= 28) return 'card-high'
  return 'card-top'
})
</script>

<style scoped>
.card-flip-enter-active, .card-flip-leave-active { transition: all 0.25s ease; }
.card-flip-enter-from  { opacity: 0; transform: translateY(-24px) scale(0.9); }
.card-flip-leave-to    { opacity: 0; transform: translateY(24px)  scale(0.9); }
.tokens-fade-enter-active, .tokens-fade-leave-active { transition: opacity 0.2s ease; }
.tokens-fade-enter-from, .tokens-fade-leave-to { opacity: 0; }
.card-low  { background: linear-gradient(145deg,#fefae8,#fdf6d0); border-color:#d4a020; }
.card-mid  { background: linear-gradient(145deg,#fdf6e3,#f8ede0); border-color:#c9a84c; }
.card-high { background: linear-gradient(145deg,#f5f0f8,#ede6f5); border-color:#9b7ac4; color:#2a1060!important; }
.card-top  { background: linear-gradient(145deg,#f0f4f8,#e0e8f4); border-color:#5a7ab0; color:#0a2050!important; }
</style>
