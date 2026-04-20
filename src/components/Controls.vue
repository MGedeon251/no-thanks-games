<template>
  <div class="flex flex-col items-center gap-4">

    <!-- Nom du joueur actif -->
    <div class="flex items-center gap-3 mb-1">
      <div
        class="w-3 h-3 rounded-full animate-pulse-gold"
        :class="isAI ? 'bg-blue-400' : 'bg-token-gold'"
      />
      <span class="font-display text-lg text-gold">{{ playerName }}</span>
      <span
        v-if="isAI"
        class="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 border border-blue-400/30 text-blue-300 font-body"
      >
        {{ t('controls.ai_badge') }}
      </span>
      <span class="text-felt-light font-body text-sm">{{ t('controls.your_turn') }}</span>
    </div>

    <!-- Jetons du joueur actif -->
    <div class="flex items-center gap-2">
      <div class="token medium" />
      <span class="font-mono text-gold text-base">
        {{ playerTokens }} {{ t('controls.tokens', playerTokens) }}
      </span>
      <span v-if="playerTokens === 0" class="text-red-400 text-xs ml-1">
        {{ t('controls.must_take') }}
      </span>
    </div>

    <!-- ── Timer ── -->
    <Transition name="timer-slide">
      <div v-if="timerEnabled && !isAI" class="w-full max-w-xs flex flex-col items-center gap-1.5">
        <!-- Barre de progression -->
        <div class="w-full h-2 rounded-full bg-felt-dark/60 overflow-hidden border border-token-gold/10">
          <div
            class="h-full rounded-full transition-all duration-1000 ease-linear"
            :class="{
              'bg-green-500':  urgency === 'safe',
              'bg-orange-400': urgency === 'warn',
              'bg-red-500 animate-pulse': urgency === 'danger',
            }"
            :style="{ width: (progress * 100) + '%' }"
          />
        </div>
        <!-- Secondes restantes -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-felt-light">{{ t('controls.timer_label') }}</span>
          <span
            class="font-mono text-sm font-bold transition-colors"
            :class="{
              'text-green-400':  urgency === 'safe',
              'text-orange-400': urgency === 'warn',
              'text-red-400':    urgency === 'danger',
            }"
          >{{ remaining }}s</span>
        </div>

        <!-- Flash "temps écoulé" -->
        <Transition name="time-up-fade">
          <p v-if="timeUpFlash" class="text-red-400 text-xs font-semibold animate-pulse text-center">
            {{ t('controls.time_up') }}
          </p>
        </Transition>
      </div>
    </Transition>

    <!-- Boutons d'action -->
    <div class="flex gap-4 mt-1" :class="{ 'animate-shake': shake }">
      <button
        class="btn-take flex items-center gap-2"
        :disabled="disabled"
        @click="$emit('take')"
        :title="t('controls.take_title')"
      >
        <span class="text-lg">✋</span>
        <span>{{ t('controls.take_btn') }}</span>
      </button>

      <button
        class="btn-refuse flex items-center gap-2"
        :disabled="disabled || playerTokens === 0"
        @click="$emit('refuse')"
        :title="t('controls.refuse_title')"
      >
        <span class="text-lg">🚫</span>
        <span>{{ t('controls.refuse_btn') }}</span>
      </button>
    </div>

    <!-- Hint IA -->
    <p v-if="isAI && !disabled" class="text-blue-300/70 text-xs italic animate-pulse">
      {{ t('controls.ai_thinking') }}
    </p>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const props = defineProps({
  playerName:   { type: String,  required: true },
  playerTokens: { type: Number,  required: true },
  isAI:         { type: Boolean, default: false },
  disabled:     { type: Boolean, default: false },
  shake:        { type: Boolean, default: false },
  // Timer
  timerEnabled: { type: Boolean, default: false },
  remaining:    { type: Number,  default: 0 },
  progress:     { type: Number,  default: 1 },
  urgency:      { type: String,  default: 'safe' },
})

defineEmits(['take', 'refuse'])

// Flash "temps écoulé" quand remaining atteint 0
const timeUpFlash = ref(false)
watch(() => props.remaining, (val) => {
  if (val === 0 && props.timerEnabled) {
    timeUpFlash.value = true
    setTimeout(() => { timeUpFlash.value = false }, 2500)
  }
})
</script>

<style scoped>
.timer-slide-enter-active,
.timer-slide-leave-active { transition: all 0.3s ease; }
.timer-slide-enter-from,
.timer-slide-leave-to     { opacity: 0; transform: translateY(-6px); }

.time-up-fade-enter-active,
.time-up-fade-leave-active { transition: opacity 0.3s; }
.time-up-fade-enter-from,
.time-up-fade-leave-to     { opacity: 0; }
</style>
