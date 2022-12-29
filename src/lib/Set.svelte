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
