<script lang="ts">
  export let game: (string | number)[]
</script>

<div>
  <div>Pt</div>
  {#each game as point}
    <div>{point}</div>
  {/each}
</div>
