<script lang="ts">
  export let set: number[]
  export let tiebreak: number[]
</script>

<div>
  <div>Set 1</div>
  {#each set as playerSetScore, index}
    <div>
      {playerSetScore}
      {#if tiebreak[index] > 0}
        <sup>{tiebreak[index]}</sup>
      {/if}
    </div>
  {/each}
</div>

<style>
  div > div {
    padding: 1rem;
    text-align: center;
    border-right: 1px solid var(--dark);
  }
  div > div:first-child {
    padding: 1rem;
    background-color: var(--dark);
    color: white;
  }
  div > div:nth-child(3) {
    border-top: 1px solid var(--dark);
  }
  sup {
    line-height: 0;
  }
</style>
