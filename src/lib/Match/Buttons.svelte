<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let isInProgress = true
</script>

<div class="button-group">
  {#each { length: 2 } as _, index}
    <button
      class:matchOver={!isInProgress}
      disabled={!isInProgress}
      on:click={() => dispatch('winpoint', index)}>Player {index + 1}</button
    >
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
  button.matchOver {
    cursor: not-allowed;
    opacity: 50%;
  }
  button:focus {
    outline: 1px solid var(--dark);
  }
</style>
