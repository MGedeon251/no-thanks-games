<template>
  <!-- Zone de contrôle : boutons d'action du joueur actif -->
  <div class="flex flex-col items-center gap-4">

    <!-- Nom du joueur actif -->
    <div class="flex items-center gap-3 mb-1">
      <div
        class="w-3 h-3 rounded-full animate-pulse-gold"
        :class="isAI ? 'bg-blue-400' : 'bg-token-gold'"
      />
      <span class="font-display text-lg text-gold">
        {{ playerName }}
      </span>
      <span v-if="isAI" class="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 border border-blue-400/30 text-blue-300 font-body">
        IA
      </span>
      <span class="text-felt-light font-body text-sm">— votre tour</span>
    </div>

    <!-- Jetons du joueur actif -->
    <div class="flex items-center gap-2">
      <div class="token medium" />
      <span class="font-mono text-gold text-base">
        {{ playerTokens }} jeton{{ playerTokens !== 1 ? 's' : '' }}
      </span>
      <span v-if="playerTokens === 0" class="text-red-400 text-xs ml-1">(obligé de prendre !)</span>
    </div>

    <!-- Boutons d'action -->
    <div
      class="flex gap-4 mt-1"
      :class="{ 'animate-shake': shake }"
    >
      <!-- Bouton Prendre -->
      <button
        class="btn-take flex items-center gap-2"
        :disabled="disabled"
        @click="$emit('take')"
        title="Prendre la carte (et récupérer les jetons)"
      >
        <span class="text-lg">✋</span>
        <span>Prendre</span>
      </button>

      <!-- Bouton Refuser -->
      <button
        class="btn-refuse flex items-center gap-2"
        :disabled="disabled || playerTokens === 0"
        @click="$emit('refuse')"
        title="Passer un jeton et refuser la carte"
      >
        <span class="text-lg">🚫</span>
        <span>No Thanks!</span>
      </button>
    </div>

    <!-- Hint si l'IA joue -->
    <p v-if="isAI && !disabled" class="text-blue-300/70 text-xs italic animate-pulse">
      L'IA réfléchit…
    </p>

  </div>
</template>

<script setup>
defineProps({
  playerName:   { type: String, required: true },
  playerTokens: { type: Number, required: true },
  isAI:         { type: Boolean, default: false },
  disabled:     { type: Boolean, default: false },
  shake:        { type: Boolean, default: false },
})

defineEmits(['take', 'refuse'])
</script>
