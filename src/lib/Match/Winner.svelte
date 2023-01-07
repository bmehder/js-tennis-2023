<script lang="ts">
  import { Confetti } from 'svelte-confetti'

  export let winner: 'Player 1' | 'Player 2'

  const displayName =
    document.querySelector(`[data-player="${winner.at(-1)}"]`)?.textContent ??
    'Name not found'
</script>

<h2>Game Set Match:<br />{displayName}</h2>

<button on:click on:keypress>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="w-6 h-6"
  >
    <path
      fill-rule="evenodd"
      d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
      clip-rule="evenodd"
    />
  </svg>
  Start New Match
</button>

<div>
  <Confetti
    x={[-5, 5]}
    y={[0, 0.1]}
    size={32}
    delay={[1000, 2000]}
    infinite
    duration="5000"
    amount="200"
    fallDistance="100vh"
  />
</div>

<style>
  h2 {
    user-select: none;
  }
  button {
    --spacing: 0.5rem;

    max-width: fit-content;
    display: grid;
    place-items: center;
    gap: var(--spacing);
    margin-block-start: var(--spacing);
    padding-block: var(--spacing);
    padding-inline: var(--spacing);
    margin-inline: auto;
    background-color: transparent;
    outline: none;
    border: none;
    color: var(--dark);
    cursor: pointer;
  }
  button:is(:hover, :focus) {
    outline: var(--dark-border);
  }
  div {
    position: fixed;
    top: -50px;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }
  svg {
    width: 3rem;
  }
</style>
