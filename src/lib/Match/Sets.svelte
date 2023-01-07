<script lang="ts">
  import Set from '$lib/Match/Set.svelte'

  type Score = {
    sets: {
      set1: [number, number]
      set2: [number, number]
      set3: [number, number]
    }
    tiebreaks: {
      set1: [number, number]
      set2: [number, number]
      set3: [number, number]
    }
    setWinners: ('Player 1' | 'Player 2')[]
  }

  export let score: Score
</script>

{#each Object.values(score.sets) as set, index}
  {@const tiebreak = Object.values(score.tiebreaks)}
  {@const setWinner = score.setWinners[index]}
  <Set {set} {setWinner} tiebreak={tiebreak[index]} setNumber={index + 1} />
{/each}
