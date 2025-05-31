<script>

  import { onMount } from 'svelte';
  import { animate, createDraggable, stagger } from "animejs";

  export let images = [];
  // Stato per il modale
  let modalOpen = false;
  let modalContent = null;
  export let data;
  let openModals = [];
 

  function openModal(image) {
    console.log(`Opening modal for image: ${image.src}`);
    modalContent = image;
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    modalContent = null;
  }

  function handleInfoClick(event, image) {
    event.stopPropagation();
    openModal(image);
  }

  function handleImageClick(image) {
    openModal(image);
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
        onRelease: () => element.style.zIndex = "",
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

  onMount(() => {
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

      on:click={() => handleImageClick(img)}
    >
      <enhanced:img
        src={img.src}
        alt={img.alt}
        width="300"
        class="gallery-image"
        draggable="false"
      />
      <button class="info-button" on:click|stopPropagation={(e) => handleInfoClick(e, img)}>
        ?
      </button>
    </div>
  {/each}
</div>

{#if modalOpen}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <h3>{modalContent.alt}</h3>
      <img src={modalContent.src} alt={modalContent.alt} width="400" />
      <p>{modalContent.info}</p>
      <button on:click={closeModal}>Chiudi</button>
    </div>
  </div>
{/if}

<style>
  .gallery-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
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
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 1rem;
    border-radius: 6px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }
  button {
    margin-top: 1rem;
  }
</style>
