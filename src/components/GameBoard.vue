<template>
  <!--
    GameBoard : plateau de jeu principal.
    Compose CardPile, Controls et PlayerPanel en une mise en page centrée.
  -->
  <div class="min-h-screen flex flex-col items-center px-4 py-6 gap-6">

    <!-- En-tête : titre + infos de partie -->
    <header class="w-full max-w-5xl flex items-center justify-between">
      <h1 class="font-display text-2xl md:text-3xl text-gold tracking-tight">
        No <span class="italic">Thanks!</span>
      </h1>
      <div class="flex items-center gap-4 text-sm text-felt-light font-body">
        <span class="font-mono">
          {{ deck.length + 1 }} carte{{ deck.length + 1 !== 1 ? 's' : '' }} restante{{ deck.length + 1 !== 1 ? 's' : '' }}
        </span>
        <button
          class="text-xs px-3 py-1 rounded-lg border border-token-gold/30 text-gold/70 hover:text-gold hover:border-token-gold/60 transition-colors"
          @click="$emit('quit')"
        >
          Quitter
        </button>
      </div>
    </header>

    <!-- Corps principal : plateau + joueurs -->
    <main class="w-full max-w-5xl flex flex-col lg:flex-row gap-6 flex-1">

      <!-- Colonne centrale : carte + action -->
      <div class="flex flex-col items-center gap-8 flex-1">

        <!-- Notification dernière action -->
        <Transition name="action-toast">
          <div
            v-if="lastAction"
            :key="lastAction.type + lastAction.card"
            class="panel-gold px-4 py-2 text-sm text-center"
            :class="lastAction.type === 'take' ? 'border-green-500/40' : 'border-red-500/40'"
          >
            <span class="font-semibold" :class="lastAction.type === 'take' ? 'text-green-400' : 'text-red-400'">
              {{ lastAction.playerName }}
            </span>
            <span class="text-felt-light mx-1">
              {{ lastAction.type === 'take' ? 'a pris la carte' : 'a dit No Thanks!' }}
            </span>
            <span class="text-gold font-mono">{{ lastAction.card }}</span>
            <span v-if="lastAction.type === 'take' && lastAction.tokens > 0" class="text-gold ml-1">
              (+{{ lastAction.tokens }} jetons)
            </span>
          </div>
        </Transition>

        <!-- Carte centrale -->
        <div class="panel-gold p-8 flex flex-col items-center gap-6">
          <CardPile
            :card="currentCard"
            :tokens-on-card="tokensOnCard"
            :deck-size="deck.length"
            :anim-key="cardAnimKey"
          />
        </div>

        <!-- Séparateur décoratif -->
        <div class="w-full flex items-center gap-3">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-token-gold/30 to-transparent" />
          <div class="token small opacity-60" />
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-token-gold/30 to-transparent" />
        </div>

        <!-- Contrôles du joueur actif -->
        <Controls
          :player-name="currentPlayer.name"
          :player-tokens="currentPlayer.jetons"
          :is-a-i="currentPlayer.isAI"
          :disabled="currentPlayer.isAI"
          :shake="noTokenShake"
          @take="$emit('take')"
          @refuse="$emit('refuse')"
        />

      </div>

      <!-- Colonne droite : panneau des joueurs -->
      <aside class="w-full lg:w-72 xl:w-80 flex flex-col gap-3">
        <h2 class="text-xs uppercase tracking-widest text-felt-light font-body mb-1 px-1">
          Joueurs
        </h2>

        <PlayerPanel
          v-for="(player, i) in players"
          :key="player.id"
          :player="player"
          :is-active="i === currentPlayerIndex"
          :score="liveScores.find(s => s.id === player.id)?.score ?? 0"
          :sequences="liveScores.find(s => s.id === player.id)?.sequences ?? []"
        />

        <!-- Légende séquences -->
        <div class="panel px-3 py-2 text-xs text-felt-light flex items-start gap-2 mt-1">
          <span class="text-token-gold">ℹ</span>
          <span>Les cartes consécutives forment une séquence : seule la plus petite compte dans le score.</span>
        </div>
      </aside>

    </main>
  </div>
</template>

<script setup>
import CardPile from './CardPile.vue'
import Controls from './Controls.vue'
import PlayerPanel from './PlayerPanel.vue'

defineProps({
  players:            { type: Array, required: true },
  deck:               { type: Array, required: true },
  currentCard:        { type: Number, required: true },
  tokensOnCard:       { type: Number, required: true },
  currentPlayerIndex: { type: Number, required: true },
  currentPlayer:      { type: Object, required: true },
  lastAction:         { type: Object, default: null },
  cardAnimKey:        { type: Number, default: 0 },
  noTokenShake:       { type: Boolean, default: false },
  liveScores:         { type: Array, default: () => [] },
})

defineEmits(['take', 'refuse', 'quit'])
</script>

<style scoped>
.action-toast-enter-active,
.action-toast-leave-active {
  transition: all 0.3s ease;
}
.action-toast-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.action-toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
