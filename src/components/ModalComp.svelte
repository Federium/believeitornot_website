<script>
  import { draggableMap } from '../stores/draggableMap.js';

  import {  onMount } from 'svelte';
  import { createDraggable } from 'animejs';

  import EnhancedImage from './EnhancedImage.svelte';

  
  // export let data;
  const { onClose, isFullscreen, slug, id, Content } = $props(); 

  function handleClose() {
    onClose?.(); // chiama la funzione se esiste

  }


  function handleExpand() {
    const element = document.getElementById(id);
    element.style.width = "";
    element.style.height = "";
    element.style.height = "";
    element.classList.add('fullsize');
    element.focus();
    const d = draggableMap.get(element);
 
    d.disable(); // safe call
     d.setX(0);
    d.setY(0);

   window.history.pushState({}, '', `/${slug}`); // <-- cambia URL
  }

  

  function handleMinimize() {
    const element = document.getElementById(id);
    const d = draggableMap.get(element);
    if (d) {
      d.enable();
     }
     element.focus();
    document.getElementById(id).classList.remove('fullsize');
    
    window.history.pushState({}, '', '/'); 
  }

  // function redoOtherDraggable()


export function draggableModale(element) {
      const draggableElements = document.querySelectorAll(".modal");

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

      return draggable;
}

  function makeDraggable() {
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





  onMount(() => {
    const modal = document.getElementById(`${id}`);
        makeDraggable();
        modal?.focus();
        document.querySelectorAll('.modal').forEach(el => el.classList.remove('top-modal'));
        modal.classList.add('top-modal');

  });
</script>

<!-- <div class="backdrop"> -->
  <div
    id={id}
    class="modal {isFullscreen ? 'fullsize disable' : ''}"
    style="z-index:10"
    role="dialog"
    tabindex="0"
   
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div class="top-bar">
      <div class="drag-area">
        <label>
        </label>
      </div>
      <div class="modal-buttons">
        <button class="close" id="expand" on:click={handleExpand}>↗</button>
        <button class="close" id="minimize" on:click={handleMinimize}>↙</button>
        <button class="close" id="close" on:click={handleClose}>×</button>

        
      </div>
    </div>
    <div class="modal-content-wrapper">
    <Content/>  
   
  
  </div>
</div>

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
    max-height: 90vh;
    outline: none;
    pointer-events: visible;
    z-index: 0;
    resize:both;
    overflow: hidden;
    min-width: 50px;
    min-height: 2em;
    border: 2px solid black;
  }

#modal-about .modal-content-wrapper {
  padding: 4px;
} 

.modal.fullsize,
.modal.top-modal,
.modal:focus-within{
  z-index: 2000 !important ;
}

.modal.fullsize .top-bar,
.modal.top-modal .top-bar,
.modal:focus .top-bar {
  background-color: black;
}

.modal.fullsize button,
.modal.top-modal button,
.modal:focus button{
  color: white;
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
  color: var(--rosso);
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
    overflow-y: auto;
    width: 100%;
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



  

  .modal.fullsize {
    width: calc(100vw - 40px);
  height: calc(100vh - 40px);

    max-width: 100vw;
        max-height: 100vw;
        z-index: 2000 !important;
    resize: none;
    position: absolute;
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

    @media (max-width: 768px) {
  .modal {
    left: 0;
    margin: 1rem;
    height: 90dvh !important;
    max-height: 90dvh !important;
    min-height: 0 !important;
  }
  .modal-content-wrapper,
  .modal-content-parent {
    height: 100%;
    max-height: 100%;
  }
  #minimize, #expand {
    display: none !important;
  }
}
</style>
