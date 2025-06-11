<script>
  import { draggableMap } from '../stores/draggableMap.js';

  import {  onMount } from 'svelte';
  import { createDraggable } from 'animejs';
  import Menu from './Menu.svelte';

  import EnhancedImage from './EnhancedImage.svelte';
  import {lang} from '../stores/lang.js';
  import info from '../data/info.json';
  // export let data;
  const { data, onClose, onExpand, onMinimize, onChange, isFullscreen } = $props(); 

  import { mapImages, mapVideos } from '../stores/mapImages.js';
  import { mapTesti } from '../stores/testi.js';
  console.log(mapTesti)

  let images = mapImages[data.data.slug];
  let videos = mapVideos[data.data.slug];
  let testi = mapTesti[data.data.slug];
  const slugList =  Object.entries(mapTesti).map(([slug]) => (slug)
);

  function getAdjacent(slug) {
  const index = slugList.indexOf(slug);
  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? slugList[index - 1] : slugList[slugList.length - 1];
  const next = index < slugList.length - 1 ? slugList[index + 1] : slugList[0];

  return { prev, next };
}

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
        <div class="change-project-buttons">
          <button id="prev" on:click={() => handleChange(getAdjacent(data.data.slug).prev)}>
             {#if $lang == "it"}
                Prec.
                {:else if $lang == "en"}
                Prev.
                {/if}
          </button>
          <button id="next" on:click={() => handleChange(getAdjacent(data.data.slug).next)}>
              {#if $lang == "it"}
                Succ.
                {:else if $lang == "en"}
                Next
                {/if}
          </button>

        </div>
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
                    <h5>Believe It Or Not</h5>

                  <Menu   onChange={(slug) => handleChange(slug)}/>
                </div>
        <div class="modal-about">
          <h5>Antidisciplinary Design Lab</h5>
          <div>{info.context[$lang][0]}</div>
          <div>{info.context[$lang][1].long}</div>
          <div>Politecnico di Milano</div>
        </div>
      </div>
        
        <div class="modal-content-parent">
            <div class="modal-content">

              <div class="content-head">
             <h2>{data.data.title}</h2>
              <h3>{testi['whatif'][$lang]}</h3>
              </div>
            
              <div class="content-text">
                 <p>{testi['scenario'][$lang]}</p>
              {#if images[0]}
                {#each images[0] as image, index}
                  <EnhancedImage src={image} alt="Immagine scenario {index + 1}" class="content-img" draggable="false" />
                {/each}
              {/if}

              <p>{testi['progetto'][$lang]}</p>
              {#if images[1]}
                {#each images[1] as image, index}
                  <EnhancedImage src={image} alt="Immagine progetto {index + 1}" class="content-img"  draggable="false"  />
                {/each}
              {/if}

              <p>{testi['macchina'][$lang]}</p>
                            
              {#if testi['link'] && testi['link'][$lang]}
                <a href={testi['link'][$lang]} target="_blank" rel="noopener">
                  {testi['link'].label ? testi['link'].label[$lang] : testi['link'][$lang]}
                </a>
              {/if}

              {#if images[2]}
                {#each images[2] as image, index}
                  <EnhancedImage src={image} alt="Immagine altro {index + 1}" class="content-img" draggable="false"  />
                {/each}
              {/if}
              </div>

              <div class="content-videos">
                {#each videos as videoId,index} 
                <div class="video"                   style="aspect-ratio: 16 / 9; width:100%">
                <iframe type="text/html"
                              title={data.data.slug+"-video-"+index}
                            width="100%"
                            height="100%"
                            src={ "https://www.youtube-nocookie.com/embed/"+videoId+"?rel=0&modestbranding=1`"}
                            frameborder="0"
                            allow="accelerometer;  gyroscope; picture-in-picture"
                            allowfullscreen
                            id="video"
                        ></iframe>
                </div>
          

                {/each}
              </div>
              <div class="content-team">
               <h3>
                {#if $lang == "it"}
                Gruppo
                {:else if $lang == "en"}
                Group
                {/if}
              </h3>
                  <ul>
                    {#each data.data.team as name}
                    <li>{name}</li>
                    {/each}
                </ul>
              </div>
          
              
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
 .modal .change-project-buttons {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    column-gap: 0.2em;
    display: none;
  }
  .modal .change-project-buttons button {
    height: 100%;
     background: none;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 1em;
    font-family: 'Arial Narrow';
    text-transform: uppercase;
  }

    
  .modal .change-project-buttons button:hover,
  .modal .change-project-buttons button:focus {
    color: var(--rosso);
  }
.modal.fullsize,
.modal.top-modal,
.modal:focus{
  z-index: 2000 !important ;
}

.modal.fullsize .top-bar,
.modal.top-modal .top-bar,
.modal:focus .top-bar {
  background-color: rgb(0, 0, 0);
}

.modal.fullsize button,
.modal.top-modal button,
.modal:focus button{
  color: rgb(255, 255, 255);
}
    .modal-content .content-img  { 
      width: 100%;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  display: block;
  margin: 0 auto;
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

  
a {
    color: var(--rosso);
    cursor: pointer;
    margin-bottom: 1em;
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
  
  
  .content-text p {
    margin-top: 1em;
    margin-bottom: 1em;
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
        max-height: 100vh;
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
    }

    .left-column h5 {
      font-family: 'Arial Narrow';
      font-size: clamp(1.5rem, 1.5vw, 3rem);
      font-weight: bold;
      text-wrap: nowrap;
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

    .content-team li {
      font-weight: normal;
    }

    .content-team ul {
      list-style-type: none;
    }
    
    .content-team {
      margin-top: 1em;
      padding-bottom: 1em;
    }
    /* MOBILE */

    @media (max-width: 768px) {
       .modal, .modal.fullsize {
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

      .modal .change-project-buttons {
        display: block;
      }
      #minimize, #expand {
        display: none !important;
      }

      .modal.fullsize .left-column {
        display: none;
      }
    
    }

</style>
