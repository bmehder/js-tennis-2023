<script lang="ts">
  import type { Match } from './types'

  export let match: Match
</script>

<div>
  <div>{match.score.isTiebreak ? 'Tb' : 'Pt'}</div>
  {#each match.score.game as point}
    <div class:bold={match.isInProgress}>{point}</div>
  {/each}
</div>

<style>
  .bold {
    font-weight: bold;
  }
</style>
