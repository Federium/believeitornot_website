<script>

  import { onMount } from 'svelte';
  import { animate, createDraggable, stagger } from "animejs";
  import Modal from './Modal.svelte'; // o il path corretto

  export let images = [];
  // Stato per il modale
  // let modalOpen = false;
  // let modalContent = null;
  export let data;
  let openModals = [];
 let initialSlug = null;


  // function openModal(entry) {
  //   openModals = [...openModals, entry];
  // }

function openModal(entry, isFullscreen = false) {
  if (typeof entry === 'string') {
    const item = data.find(d => d.data.slug === entry);
    if (item && !openModals.find(m => m.data.slug === entry)) {
      openModals = [...openModals, { ...item, isFullscreen }];
    }
  } else {
    if (!openModals.find(m => m.data.slug === entry.data.slug)) {
      openModals = [...openModals, { ...entry, isFullscreen }];
    }
  }
}

  function closeModal(slug) {
    console.log("Closing modal with slug:", slug);
    openModals = openModals.filter(m => m.data.slug !== slug);
    window.history.pushState({}, '', '/'); // <-- torna alla root
  
  }
  
  function handleInfoClick(event, image) {
    console.log("Info button clicked for image:", image);
    event.stopPropagation();
    openModal(image);
  }

  function handleImageClick(slug) {
    console.log("Image clicked with slug:", slug);
   window.history.pushState({}, '', `/${slug}`); // <-- cambia URL

    openModal(slug);
  }

  // Posizionamento casuale immagini
  function randomizePositions() {
    console.log("Randomizing positions");
    const container = document.getElementById("gallery-container");
    if (!container) return;
    const imageWrappers = Array.from(container.querySelectorAll(".image-wrapper"));
    if (imageWrappers.length === 0) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const wrapperWidth = imageWrappers[0].offsetWidth;
    const wrapperHeight = imageWrappers[0].offsetHeight;
    const verticalSpacing = wrapperHeight * 1.2;

    const gridStructure = [4, 3, 4];
    const totalRows = gridStructure.length;
    const totalGridHeight = totalRows * verticalSpacing;
    const baseOffsetY = (containerHeight - totalGridHeight) / 2;

    let index = 0;
    for (let row = 0; row < gridStructure.length; row++) {
      const itemsInRow = gridStructure[row];
      const rowY = baseOffsetY + row * verticalSpacing;
      const totalRowWidth = itemsInRow * wrapperWidth;
      const baseOffsetX = (containerWidth - totalRowWidth) / 2;

      for (let col = 0; col < itemsInRow; col++) {
        if (index >= imageWrappers.length) break;

        const wrapper = imageWrappers[index];
        console.log(`Positioning wrapper ${index} at row ${row}, col ${col}`);
        const baseX = baseOffsetX + col * wrapperWidth;
        const baseY = rowY;
        const jitterX = (Math.random() - 0.3) * wrapperWidth;
        const jitterY = (Math.random() - 0.3) * wrapperHeight;
        const finalX = baseX + jitterX;
        const finalY = baseY + jitterY;

        animate(wrapper, {
          translateX: finalX,
          translateY: finalY,
          duration: 0,
          easing: "linear",
        });

        index++;
      }
    }
  }

  // Drag & Click
  function makeDraggableAndClickable() {
    const container = document.getElementById("gallery-container");
    if (!container) return;
    const draggableElements = container.querySelectorAll(".draggable");

    draggableElements.forEach(element => {
      createDraggable(element, {
        container: ".gallery-container",
        onDrag: () => element.style.zIndex = "999",
      });
    });
  }

  // Animazione entrata
  function animateImagesIn() {
    const imageWrappers = document.querySelectorAll(".image-wrapper");
    animate(imageWrappers, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 200,
      delay: stagger(100),
    });
  }

function openFromSlug() {
  const slug = window.location.pathname.slice(1); // rimuove lo slash iniziale
  if (slug !== "") {
    initialSlug = slug;
    openModal(slug, true); // true = fullscreen
    console.log("Opening from slug:", slug);
  }
}


  onMount(() => {
    const slug =  openFromSlug();
    
    randomizePositions();
    animateImagesIn();


    setTimeout(() => {
      makeDraggableAndClickable();
    }, 800);

    window.addEventListener("resize", () => {
      randomizePositions();
    });
  });

</script>

<div class="gallery-container" id="gallery-container">
  {#each images as img}
    <div
      class="image-wrapper draggable"

      on:click={() => handleImageClick(img.slug)}
    >
    <div>
    <enhanced:img
            src={img.src}
            alt={img.slug}
            width="300"
            class="gallery-image"
            draggable="false"
          
            />
            
             <button class="info-button" on:click|stopPropagation={(e) => handleInfoClick(e, img)}>
        ?
      </button>
    </div>
      
<!--      
         {#if openModals.find(m => m.data.slug === img.slug)}
        <Modal
          data={openModals.find(m => m.data.slug === img.slug)}
          onClose={() => closeModal(img.slug)}
        />
      {/if} -->
    </div>

       

  {/each}
</div>
<!-- <div class="modals-container"> -->
{#each openModals as modal (modal.data.slug)}
 <Modal
  data={modal}
  isFullscreen={modal.isFullscreen}
  onClose={() => closeModal(modal.data.slug)}
/>
{/each}


<!-- </div> -->



<style>
  .gallery-container {
    position: absolute;
    width: 100%;
    top:0;
    left:0;
    height: 100%;
    overflow: hidden;
    z-index: 2;
  }
  .image-wrapper {
    position: absolute;
    cursor: grab;
  }
  .image-wrapper:active {
    cursor: grabbing;
  }


  .gallery-image {
    /* width: 100%;
    height: 100%; */
    object-fit: cover;
  }
  .info-button {
    position: absolute;
    bottom: 10px;
    right: 5px;
    width: 15px;
    height: 15px;
    border-radius: 10%;
    background-color: rgb(242, 255, 0);
    color: rgb(255, 0, 0);
    border: none;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
.modals-container {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
  button {
    margin-top: 1rem;
  }
</style>
