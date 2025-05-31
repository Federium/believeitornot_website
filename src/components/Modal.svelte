<script>
  import {  onMount } from 'svelte';
  // import immagine from '../assets/image2.jpg?enhanced'
  // import {images} from '../content/01_nwo/01_nwo.mdx'


  // export let data;
  const { data, onClose } = $props(); 

  import { mapImages } from '../stores/mapImages.js';
console.log("mapImages", mapImages);
  let images = mapImages[data.data.slug];
  console.log("immagini mappate", images);
  
  function handleClose() {
    onClose?.(); // chiama la funzione se esiste
  }


console.log("dato passato al modale",data.data);
  const Body = data.body;
  console.log(data.title);



  onMount(() => {
    // Per ricevere eventi da tastiera (Escape)
    const modal = document.getElementById(`modal-${data.slug}`);
    modal?.focus();
  });
</script>

<div class="backdrop">
  <div
    id={"modal-" + data.slug}
    class="modal draggable"
    role="dialog"
    tabindex="0"
    on:click|stopPropagation
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <button class="close" on:click={handleClose}>×</button>
    <h2>{data.data.title}</h2>
{data.body}
<!-- {#if data.data.data.images}
  <div class="modal-images">
    {#each data.images as img} -->
{#each images as image, index}
  <enhanced:img src={image} alt="Immagine del progetto {index + 1}" />
{/each}    <!-- {/each}
  </div>
{/if} -->
  </div>
</div>

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
    padding: 1.5rem;
    width: 80%;
    max-width: 700px;
    border-radius: 10px;
    position: relative;
    overflow-y: auto;
    max-height: 90vh;
    outline: none;
        pointer-events: visible;

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
