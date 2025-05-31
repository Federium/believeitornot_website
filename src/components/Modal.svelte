<script>
  export let entry;
  export let onClose;

  // Astro fornisce `entry.Body`, che è un componente Svelte pronto
  const Body = entry.Body;
</script>

<div class="backdrop" on:click={onClose}>
  <div class="modal" 
      role="dialog" 
      on:click|stopPropagation 
      on:keydown={(e) => e.key === 'Escape' && onClose()}
      tabindex="0">
      <button class="close" on:click={onClose}>×</button>
      <h2>{entry.data.title}</h2>
      <Body />
    </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10;
  }

  .modal {
    background: white;
    padding: 1.5rem;
    margin: 5% auto;
    width: 80%;
    max-width: 700px;
    border-radius: 10px;
    position: relative;
    overflow-y: auto;
    max-height: 90vh;
  }

  .close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
