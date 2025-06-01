<script>
  import {  onMount } from 'svelte';
  import { createDraggable } from 'animejs';


  import EnhancedImage from './EnhancedImage.svelte';
  
  // export let data;
  const { data, onClose } = $props(); 

  import { mapImages } from '../stores/mapImages.js';
  import { mapTesti } from '../stores/testi.js';
  console.log(mapTesti)

  let images = mapImages[data.data.slug];
  let testi = mapTesti[data.data.slug];
  console.log(testi);

  function handleClose() {
    onClose?.(); // chiama la funzione se esiste
  }


console.log("dato passato al modale",data.data);
  const body = data.body;


  function makeDraggable() {
    const draggableElements = document.querySelectorAll(".modal");

    draggableElements.forEach(element => {
      createDraggable(element, {
        trigger: element.querySelector('.top-bar'),
        onDrag: () => element.style.zIndex = "999",
        onRelease: () => element.style.zIndex = "100",
      });
    });
  }

  onMount(() => {
    const modal = document.getElementById(`modal-${data.slug}`);
  makeDraggable();
    modal?.focus();
  });
</script>

<!-- <div class="backdrop"> -->
  <div
    id={"modal-" + data.slug}
    class="modal"
    role="dialog"
    tabindex="0"
    on:click|stopPropagation
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div class="top-bar">
          <button class="close" on:click={handleClose}>×</button>

    </div>
    <h2>{data.data.title}</h2>

<h3>Complotto</h3>

<p>{testi['scenario']}</p>
{#if images[0]}
  {#each images[0] as image, index}
    <EnhancedImage src={image} alt="Immagine scenario {index + 1}" draggable="false" />
  {/each}
{/if}

<p>{testi['progetto']}</p>
{#if images[1]}
  {#each images[1] as image, index}
    <EnhancedImage src={image} alt="Immagine progetto {index + 1}" draggable="false"  />
  {/each}
{/if}

<p>{testi['altro']}</p>
{#if images[2]}
  {#each images[2] as image, index}
    <EnhancedImage src={image} alt="Immagine altro {index + 1}" draggable="false"  />
  {/each}
{/if}
  </div>
<!-- </div> -->

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .modal {
    background: white;
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 700px;
    border-radius: 10px;
    position: relative;
    overflow-y: auto;
    max-height: 90vh;
    outline: none;
        pointer-events: visible;
    z-index: 100;
      resize:both;
  overflow:auto; /* something other than visible */

    img {    width: 100%;
    }
  
  }
  .top-bar {
    margin-bottom: 1rem;
    background-color: red;
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .close {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>
