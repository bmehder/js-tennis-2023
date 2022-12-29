<script lang="ts">
  export let set: number[]
  export let tiebreak: number[]
  export let setNumber: number
</script>

<div>
  <div>Set {++setNumber}</div>
  {#each set as playerSetScore, index}
    <div>
      {playerSetScore}
      {#if tiebreak[index] > 0}
        <sup>{tiebreak[index]}</sup>
      {/if}
    </div>
  {/each}
</div>
