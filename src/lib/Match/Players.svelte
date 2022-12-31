<script lang="ts">
  import { sum } from '$lib/helpers'
  import type { Match } from '$lib/Match/types'

  export let match: Match

  // prettier-ignore
  $: playerServing =
    Object.values(match.score.sets)
      .map(item => item.reduce(sum))
      .reduce(sum) % 2 === 0 ? match.players[0] : match.players[1]
</script>

<div>
  <div>Player</div>
  {#each match.players as player, index}
    {@const isServing =
      playerServing === match.players[index] &&
      !match.score.isTiebreak &&
      match.isInProgress}
    <div class:isServing data-player={index + 1} contenteditable>
      {player}
    </div>
  {/each}
</div>

<style>
  .isServing {
    font-weight: bold;
  }
</style>
