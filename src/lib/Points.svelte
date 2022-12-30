<script lang="ts">
  export let points: (string | number)[]
  export let isTiebreak: boolean
  export let isInProgress: boolean
</script>

<div>
  <div>{isTiebreak ? 'Tb' : 'Pt'}</div>
  {#each points as point}
    <div class:bold={isInProgress}>{point}</div>
  {/each}
</div>

<style>
  .bold {
    font-weight: bold;
  }
</style>
