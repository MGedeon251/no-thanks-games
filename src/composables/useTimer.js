/**
 * useTimer.js — Timer de tour par joueur
 *
 * - Compte à rebours depuis `duration` secondes
 * - Émet un callback `onExpire` quand le temps est écoulé
 * - Peut être mis en pause (tour de l'IA) et réinitialisé entre les tours
 * - timerEnabled = false → le timer est totalement ignoré
 */

import { ref, computed } from 'vue'

export function useTimer() {
  const timerEnabled  = ref(false)   // activé dans la config ?
  const duration      = ref(30)      // secondes par tour
  const remaining     = ref(0)       // secondes restantes
  const isRunning     = ref(false)

  let intervalId = null
  let expireCallback = null

  /** Progression 0→1 pour la barre de progression. */
  const progress = computed(() =>
    duration.value > 0 ? remaining.value / duration.value : 1
  )

  /** Couleur selon urgence. */
  const urgency = computed(() => {
    const r = progress.value
    if (r > 0.5) return 'safe'     // vert
    if (r > 0.25) return 'warn'    // orange
    return 'danger'                // rouge
  })

  /** Démarre (ou redémarre) le timer pour un nouveau tour. */
  function startTimer(onExpire) {
    if (!timerEnabled.value) return
    stopTimer()
    remaining.value  = duration.value
    isRunning.value  = true
    expireCallback   = onExpire

    intervalId = setInterval(() => {
      if (remaining.value <= 1) {
        remaining.value = 0
        stopTimer()
        expireCallback?.()
      } else {
        remaining.value--
      }
    }, 1000)
  }

  /** Arrête le timer sans déclencher le callback. */
  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  /** Réinitialise complètement (entre les parties). */
  function resetTimer() {
    stopTimer()
    remaining.value = duration.value
  }

  /** Configure le timer depuis les options de setup. */
  function configure(enabled, seconds) {
    timerEnabled.value = enabled
    duration.value     = seconds
    remaining.value    = seconds
  }

  return {
    timerEnabled,
    duration,
    remaining,
    isRunning,
    progress,
    urgency,
    startTimer,
    stopTimer,
    resetTimer,
    configure,
  }
}
