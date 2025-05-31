<!-- src/components/ProjectModal.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { isModalOpen, currentProject, projectContent, isLoading, closeModal } from '../stores/modalStore.js';
  
  let modal;
  let unsubscribe = [];

  onMount(() => {
    // Gestisci l'escape key
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && $isModalOpen) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  // Gestisci il click fuori dal modale
  function handleBackdropClick(event) {
    if (event.target === modal) {
      closeModal();
    }
  }

  // Gestisci i tasti sul backdrop
  function handleBackdropKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Non fare nulla, il backdrop non dovrebbe essere attivabile
    }
  }

  // Processa il markdown per la visualizzazione
  function processMarkdownContent(content) {
    if (!content) return '';
    
    // Qui potresti usare una libreria come marked o remark
    // Per ora, una semplice conversione di base
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  }
</script>

{#if $isModalOpen}
  <!-- Backdrop -->
  <div 
    class="modal-backdrop" 
    bind:this={modal}
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <!-- Modale -->
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        {#if $currentProject}
          <h2 id="modal-title">{$currentProject.title}</h2>
        {/if}
        <button 
          class="close-btn" 
          on:click={closeModal}
          aria-label="Chiudi modale"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="modal-body">
        {#if $isLoading}
          <div class="loading">
            <div class="spinner"></div>
            <p>Caricamento...</p>
          </div>
        {:else if $currentProject && $projectContent}
          <div class="project-content">
            {#if $currentProject.image}
              <img src={$currentProject.image} alt={$currentProject.title} class="project-image" />
            {/if}
            
            <div class="content-body">
              {@html processMarkdownContent($projectContent)}
            </div>
            
            {#if $currentProject.tags}
              <div class="tags">
                {#each $currentProject.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #374151;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .content-body {
    line-height: 1.6;
    color: #374151;
  }

  .content-body :global(h1),
  .content-body :global(h2),
  .content-body :global(h3) {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }

  .content-body :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .tag {
    background-color: #dbeafe;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .modal-content {
      margin: 0.5rem;
      max-height: 95vh;
    }
    
    .modal-header,
    .modal-body {
      padding: 1rem;
    }
  }
</style>