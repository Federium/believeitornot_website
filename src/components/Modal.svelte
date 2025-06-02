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


  // function redoOtherDraggable()

const draggableMap = new Map();

  function makeDraggable() {
    const draggableElements = document.querySelectorAll(".modal");

   draggableElements.forEach(element => {
      const draggable = createDraggable(element, {
        trigger: element.querySelector('.drag-area'),
        container: document.querySelector(".gallery-container"),
        onGrab: () => {
        // Rimuove "top-modal" da tutti gli altri
        draggableElements.forEach(el => el.classList.remove('top-modal'));

        // Aggiunge "top-modal" solo a quello trascinato
        element.classList.add('top-modal');
      }
          });
      draggableMap.set(element, draggable);
  element.addEventListener('resize', () => {
    const d = draggableMap.get(element);
    d.refresh(); // safe call
  });


    });

  }


function refreshAllDraggables() {
  for (const draggable of draggableMap.values()) {
    draggable.refresh();
  }
}


  onMount(() => {
    const modal = document.getElementById(`modal-${data.data.slug}`);
  makeDraggable();
  modal?.focus();
   document.querySelectorAll('.modal').forEach(el => el.classList.remove('top-modal'));
    modal.classList.add('top-modal');

  });
</script>

<!-- <div class="backdrop"> -->
  <div
    id={"modal-" + data.data.slug}
    class="modal"
    style="z-index:10"
    role="dialog"
    tabindex="0"
   
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div class="top-bar">
      <div class="drag-area"></div>
<button class="close" on:click={handleClose}>×</button>
    </div>
    <div class="modal-content-wrapper">
        <div class="modal-content">

              <h2>{data.data.title}</h2>

              <h3>{data.data.whatif}</h3>

              <p>{testi['scenario']}</p>
              {#if images[0]}
                {#each images[0] as image, index}
                  <EnhancedImage src={image} alt="Immagine scenario {index + 1}" class="content-img" draggable="false" />
                {/each}
              {/if}

              <p>{testi['progetto']}</p>
              {#if images[1]}
                {#each images[1] as image, index}
                  <EnhancedImage src={image} alt="Immagine progetto {index + 1}" class="content-img"  draggable="false"  />
                {/each}
              {/if}

              <p>{testi['altro']}</p>
              {#if images[2]}
                {#each images[2] as image, index}
                  <EnhancedImage src={image} alt="Immagine altro {index + 1}" class="content-img" draggable="false"  />
                {/each}
              {/if}
            </div>
    </div>
   
  
  </div>
<!-- </div> -->

<style>
  .backdrop {
 
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .modal {
    background: white;
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    border-radius: 2px;
    position: absolute;
    top: 20px;
    left: 20px;
    max-height: 90vh;
    outline: none;
        pointer-events: visible;
    z-index: 0;
      resize:both;
  overflow:auto; /* something other than visible */
  min-width: 50px;
  min-height: 2em;
  

  }

.modal.top-modal,
.modal:focus{
  z-index: 2000 !important ;
}

.modal.top-modal .top-bar,
.modal:focus .top-bar {
  background-color: red;
}

.modal.top-modal .close,
.modal:focus .close{
  color: black;
}
    .modal-content .content-img  { 
      width: 100%;
          user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    }
  
  
  .top-bar {
    background-color: black;
    height: 2em;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    color: white; 

  }

  .top-bar .drag-area {
    width: 100%;
  }




  .close {
    width: 40px;
    height: 100%;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    
  }

  .modal-content-wrapper {
    overflow-y: visible;
    width: 100%;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    padding: 4px;
        max-width: 800px;

  }

  .modal-content h2 {
    font-family: 'Arial Narrow',sans-serif;
    margin-top: 0;
    margin-bottom: 4px;
    font-size: 3em;
    line-height: 100%;
  }


  .modal-content h3 {
    font-family: 'Arial Narrow',sans-serif;
    margin-top: 0;
    margin-bottom: 4px;
    font-size: 1.6em;
  }

    .modal-content h3 {
    font-family: 'Arial',sans-serif;
    margin-top: 0;
    margin-bottom: 4px;

  }
</style>
