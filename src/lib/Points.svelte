<script lang="ts">
  export let points: (string | number)[]
  export let isTiebreak: boolean
</script>

<div>
  <div>{isTiebreak ? 'Tb' : 'Pt'}</div>
  {#each points as point}
    <div>{point}</div>
  {/each}
</div>
