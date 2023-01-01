<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
</script>

<div class="button-group">
  {#each Array(2) as _, index}
    <button on:click={() => dispatch('point', index)} on:keypress>
      Player {index + 1}
    </button>
  {/each}
</div>

<style>
  .button-group {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  button {
    padding: 1rem 2rem;
    background-color: var(--dark);
    color: white;
    font-size: inherit;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: scale 100ms ease-in-out;
  }
  button:hover:not([disabled]) {
    scale: 0.98;
  }
  button:focus {
    outline: 1px solid var(--dark);
  }
</style>
