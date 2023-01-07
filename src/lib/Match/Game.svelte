<script lang="ts">
  export let score: { isTiebreak: boolean; game: (number | 'Ad')[] }
  export let isInProgress: boolean
</script>

<div>
  <div>{score.isTiebreak ? 'Tb' : 'Pt'}</div>
  {#each score.game as point}
    <div class:bold={isInProgress}>{point}</div>
  {/each}
</div>
