<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8">

    <!-- Titre principal -->
    <div class="text-center">
      <h1
        class="font-display text-5xl md:text-7xl text-gold tracking-tight leading-none mb-3 animate-float"
        v-html="t('setup.title')"
      />
      <p class="text-felt-light font-body text-sm md:text-base max-w-xs mx-auto">
        {{ t('setup.subtitle') }}
      </p>
    </div>

    <!-- Carte de configuration -->
    <div class="panel-gold w-full max-w-lg p-6 flex flex-col gap-6">

      <!-- ── Langue + Timer (ligne horizontale) ── -->
      <div class="flex items-start gap-4 flex-wrap">

        <!-- Sélecteur de langue -->
        <div class="flex-1 min-w-[120px]">
          <label class="text-xs uppercase tracking-widest text-felt-light block mb-2">
            {{ t('setup.lang_label') }}
          </label>
          <div class="flex gap-2">
            <button
              v-for="l in ['fr', 'en']"
              :key="l"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all"
              :class="lang === l
                ? 'bg-token-gold text-ink-dark border-token-gold'
                : 'bg-felt/50 border-token-gold/20 text-felt-light hover:border-token-gold/50 hover:text-gold'"
              @click="setLang(l)"
            >
              <span>{{ l === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
              <span class="uppercase">{{ l }}</span>
            </button>
          </div>
        </div>

        <!-- Timer -->
        <div class="flex-1 min-w-[160px]">
          <label class="text-xs uppercase tracking-widest text-felt-light block mb-2">
            {{ t('setup.timer_label') }}
          </label>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Toggle On/Off -->
            <button
              class="px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all"
              :class="timerEnabled
                ? 'bg-token-gold text-ink-dark border-token-gold'
                : 'bg-felt/50 border-token-gold/20 text-felt-light hover:border-token-gold/50 hover:text-gold'"
              @click="timerEnabled = !timerEnabled"
            >
              {{ timerEnabled ? '⏱' : t('setup.timer_off') }}
            </button>

            <!-- Durée (visible si activé) -->
            <Transition name="slide-right">
              <div v-if="timerEnabled" class="flex items-center gap-1">
                <button
                  class="w-7 h-7 rounded-lg bg-felt/50 border border-token-gold/20 text-gold hover:border-token-gold/50 text-base font-bold transition-all"
                  @click="decreaseTimer"
                >−</button>
                <span class="font-mono text-gold text-sm w-12 text-center">
                  {{ timerDuration }}{{ t('setup.timer_unit') }}
                </span>
                <button
                  class="w-7 h-7 rounded-lg bg-felt/50 border border-token-gold/20 text-gold hover:border-token-gold/50 text-base font-bold transition-all"
                  @click="increaseTimer"
                >+</button>
              </div>
            </Transition>
          </div>
          <!-- Présets rapides -->
          <Transition name="slide-right">
            <div v-if="timerEnabled" class="flex gap-1.5 mt-2 flex-wrap">
              <button
                v-for="s in [15, 30, 45, 60]"
                :key="s"
                class="text-xs px-2 py-0.5 rounded border transition-all font-mono"
                :class="timerDuration === s
                  ? 'bg-token-gold/20 border-token-gold/60 text-gold'
                  : 'border-token-gold/15 text-felt-light hover:border-token-gold/40'"
                @click="timerDuration = s"
              >{{ s }}s</button>
            </div>
          </Transition>
        </div>

      </div>

      <!-- ── Nombre de joueurs ── -->
      <div>
        <label class="text-xs uppercase tracking-widest text-felt-light block mb-3">
          {{ t('setup.players_label') }}
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

      <!-- ── Saisie des noms ── -->
      <div class="flex flex-col gap-3">
        <label class="text-xs uppercase tracking-widest text-felt-light">
          {{ t('setup.names_label') }}
        </label>
        <TransitionGroup name="player-row" tag="div" class="flex flex-col gap-2">
          <div
            v-for="i in playerCount"
            :key="i"
            class="flex items-center gap-3"
          >
            <div class="token small shrink-0" style="font-size: 10px;">{{ i }}</div>
            <input
              v-model="playerNames[i - 1]"
              type="text"
              :placeholder="`${t('setup.placeholder')} ${i}`"
              maxlength="20"
              class="flex-1 bg-felt-dark/60 border border-token-gold/20 rounded-lg px-3 py-2 text-sm text-card-bg placeholder-felt-light/50 focus:outline-none focus:border-token-gold/60 transition-colors font-body"
              @keydown.enter="focusNext(i)"
              :ref="el => { if (el) inputRefs[i - 1] = el }"
            />
            <button
              class="text-xs px-2 py-1.5 rounded-lg border transition-all shrink-0"
              :class="isAI[i - 1]
                ? 'bg-blue-900/60 border-blue-400/50 text-blue-300'
                : 'bg-felt/50 border-token-gold/20 text-felt-light hover:border-token-gold/40'"
              @click="toggleAI(i - 1)"
              :title="isAI[i - 1] ? t('setup.ai_title') : t('setup.human_title')"
            >
              {{ isAI[i - 1] ? t('setup.ai_btn') : t('setup.human_btn') }}
            </button>
          </div>
        </TransitionGroup>
      </div>

      <!-- ── Règles rapides ── -->
      <details class="text-xs text-felt-light cursor-pointer">
        <summary class="text-gold/70 hover:text-gold transition-colors select-none">
          {{ t('setup.rules_title') }}
        </summary>
        <div class="mt-3 grid grid-cols-1 gap-1.5 pl-2 border-l-2 border-token-gold/20">
          <p v-html="t('setup.rule1')" />
          <p v-html="t('setup.rule2')" />
          <p v-html="t('setup.rule3')" />
          <p v-html="t('setup.rule4')" />
          <p v-html="t('setup.rule5')" />
          <p v-html="t('setup.rule6')" />
        </div>
      </details>

      <!-- ── Bouton démarrer ── -->
      <button
        class="btn-take w-full justify-center py-4 text-base flex items-center gap-2"
        :disabled="!canStart"
        @click="handleStart"
      >
        <span class="text-xl">🎴</span>
        {{ t('setup.start_btn') }}
      </button>

      <!-- Reprendre partie sauvegardée -->
      <button
        v-if="hasSave"
        class="text-sm text-gold/60 hover:text-gold transition-colors underline underline-offset-2 text-center"
        @click="$emit('resume')"
      >
        {{ t('setup.resume_btn') }}
      </button>

    </div>

    <!-- Crédits -->
    <p class="text-felt-light/30 text-xs font-mono">
      {{ t('setup.credits') }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  hasSave: { type: Boolean, default: false },
})

const emit = defineEmits(['start', 'resume'])

const { t, lang, setLang } = useI18n()

// ── État du formulaire ──
const playerCount   = ref(4)
const playerNames   = ref(['', '', '', '', '', '', ''])
const isAI          = ref([false, false, false, false, false, false, false])
const inputRefs     = ref([])

// ── Options timer ──
const timerEnabled  = ref(false)
const timerDuration = ref(30)

const TIMER_MIN = 10
const TIMER_MAX = 120
const TIMER_STEP = 5

function increaseTimer() {
  if (timerDuration.value < TIMER_MAX) timerDuration.value += TIMER_STEP
}
function decreaseTimer() {
  if (timerDuration.value > TIMER_MIN) timerDuration.value -= TIMER_STEP
}

const canStart = computed(() => playerCount.value >= 3)

function setPlayerCount(n) { playerCount.value = n }

function toggleAI(index) { isAI.value[index] = !isAI.value[index] }

function getNames() {
  return Array.from({ length: playerCount.value }, (_, i) =>
    playerNames.value[i]?.trim() || `${t('setup.placeholder')} ${i + 1}`
  )
}

function focusNext(i) {
  if (i < playerCount.value && inputRefs.value[i]) inputRefs.value[i].focus()
}

function handleStart() {
  emit('start', getNames(), isAI.value.slice(0, playerCount.value), {
    timerEnabled: timerEnabled.value,
    timerDuration: timerDuration.value,
  })
}
</script>

<style scoped>
.player-row-enter-active,
.player-row-leave-active { transition: all 0.25s ease; }
.player-row-enter-from,
.player-row-leave-to     { opacity: 0; transform: translateX(-12px); }

.slide-right-enter-active,
.slide-right-leave-active { transition: all 0.2s ease; }
.slide-right-enter-from   { opacity: 0; transform: translateX(-8px); }
.slide-right-leave-to     { opacity: 0; transform: translateX(-8px); }
</style>
