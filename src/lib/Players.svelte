<script lang="ts">
  export let players: string[]
  export let isTiebreak: boolean
  export let playerServing: string
</script>

<div>
  <div>Player</div>
  {#each players as player, index}
    {@const isServing = playerServing === players[index] && !isTiebreak}
    <div class:isServing>
      {player}
    </div>
  {/each}
</div>

<style>
  .isServing {
    font-weight: bold;
  }
</style>
