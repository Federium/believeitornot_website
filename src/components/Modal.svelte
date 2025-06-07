<script>
  import { draggableMap } from '../stores/draggableMap.js';

  import {  onMount } from 'svelte';
  import { createDraggable } from 'animejs';
  import Menu from './Menu.svelte';

  import EnhancedImage from './EnhancedImage.svelte';

  
  // export let data;
  const { data, onClose, onExpand, onMinimize, onChange, isFullscreen } = $props(); 

  import { mapImages } from '../stores/mapImages.js';
  import { mapTesti } from '../stores/testi.js';
  console.log(mapTesti)

  let images = mapImages[data.data.slug];
  let testi = mapTesti[data.data.slug];
  console.log(testi);

  function handleClose() {
    onClose?.(); // chiama la funzione se esiste

  }


  function handleExpand() {
    onExpand?.(); // chiama la funzione se esiste

  }


  function handleMinimize() {
    onMinimize?.(); // chiama la funzione se esiste

  }

console.log("dato passato al modale",data.data);
  const body = data.body;


  // function redoOtherDraggable()


export function draggableModale(element) {
      const draggableElements = document.querySelectorAll(".modal");

    const draggable = createDraggable(element, {
        trigger: element.querySelector('.drag-area'),
        container: document.querySelector(".gallery-container"),
        releaseStiffness: 1000,
        onGrab: () => {
        // Rimuove "top-modal" da tutti gli altri
        draggableElements.forEach(el => el.classList.remove('top-modal'));

        // Aggiunge "top-modal" solo a quello trascinato
        element.classList.add('top-modal');
      }
          });

      return draggable;
}

  function makeDraggable() {
    // Controlla se siamo su mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      return; // Non applicare draggable su mobile
    }

    const draggableElements = document.querySelectorAll(".modal");

   draggableElements.forEach(element => {

      const draggable = draggableModale(element);
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

function handleChange(newSlug) {
  handleClose();
  onChange(newSlug);
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
class="modal {isFullscreen ? 'fullsize disable' : ''}"
    style="z-index:10"
    role="dialog"
    tabindex="0"
   
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div class="top-bar">
      <div class="drag-area">
    
      </div>
      <div class="modal-buttons">
        <button class="close" id="expand" on:click={handleExpand}>↗</button>
        <button class="close" id="minimize" on:click={handleMinimize}>↙</button>
        <button class="close" id="close" on:click={handleClose}>×</button>

        
      </div>
    </div>
    <div class="modal-content-wrapper">
      <div class="left-column">
        <div class="modal-menu">
                    <label>Believe It Or Not</label>

                  <Menu   onChange={(slug) => handleChange(slug)}/>
                </div>
        <div class="modal-about">
          <label>Antidisciplinary Design Lab</label>
          <div>Laboratorio di Sintesi Finale – C1</div>
          <div>Corso di Laurea in Design della Comunicazione</div>
          <div>Politecnico di Miilano</div>
        </div>
      </div>
        
        <div class="modal-content-parent">
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

              <p>{testi['macchina']}</p>
              {#if images[2]}
                {#each images[2] as image, index}
                  <EnhancedImage src={image} alt="Immagine altro {index + 1}" class="content-img" draggable="false"  />
                {/each}
              {/if}
        </div>
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
    max-width: 600px;
    border-radius: 2px;
    position: absolute;
    top: 20px;
    left: 20px;
    height: 90vh; /* Cambia da max-height a height fisso */
    outline: none;
        pointer-events: visible;
    z-index: 0;
      resize:both;
  overflow: hidden;
  min-width: 50px;
  min-height: 2em;
  border: 2px solid black;
  

  }

.modal.fullsize,
.modal.top-modal,
.modal:focus{
  z-index: 2000 !important ;
}

.modal.fullsize .top-bar,
.modal.top-modal .top-bar,
.modal:focus .top-bar {
  background-color: red;
}

.modal.fullsize button,
.modal.top-modal button,
.modal:focus button{
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
  
  .modal-content::selection {
  color: red;
  background-color: black;
}

  .top-bar {
    background-color: black;
    height: 2em;
    width: 100%;
    border-bottom: 2px solid black;
    display: flex;
    justify-content: flex-end;
    color: white; 

  }

  .top-bar .drag-area {
    width: 100%;
  }




  .modal-buttons button {
    width: 40px;
    height: 100%;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    
  }

  #minimize, #expand {
    font-size: 1em;
    font-weight: bold;
  }

  .modal.fullsize .modal-content-parent {
    justify-content: center;

  }
  .modal-content-parent {
    display: flex;
    justify-content: start;
    width: 100%;
     overflow: auto;
  }

  .modal-content-wrapper {
    display: flex;
    justify-content: space-between;
    
    height: 100%;
     overflow: auto;

  }

  .modal-content-wrapper>div {
            padding: 4px;

  }


  .modal-content {
    display: flex;
    flex-direction: column;
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
        line-height: 100%;

  }


  

  .modal.fullsize {
    width: calc(100vw - 40px);
  height: calc(100vh - 40px);

    max-width: 100vw;
        max-height: 100vw;
        z-index: 2000 !important;
    resize: none;
    position: absolute;
  }

    .left-column {
      max-width: 30%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: auto;
      display: none;
      border-right: 2px solid black;
    }

    .left-column label {
      font-family: 'Arial Narrow';
      font-size: clamp(1.5rem, 1.5vw, 3rem);
      font-weight: bold;
    }

      .modal.fullsize  .left-column {

      display: flex;
    }
    .modal-about div {
      margin-top: 4px;
    }

    .modal-about h2 {
      font-family: 'Arial Narrow';
      margin: 0;
    }

    .modal-buttons {
      display: flex;
    }


    .modal #minimize {
      display: none;
    }
    .modal #expand {
      display: flex;
    }

    .modal.fullsize #minimize {
      display: flex;
    }
    .modal.fullsize #expand {
      display: none;
    }



    /* MOBILE */

    @media (max-width: 768px) {
      .modal {
        left: 0;
        margin: 10px 10px;
      }
      #minimize, #expand {
        display: none !important;
      }
    
    }

</style>
