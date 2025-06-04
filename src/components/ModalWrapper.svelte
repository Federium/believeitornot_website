<script>

  import { onMount, setContext } from 'svelte';
  import { animate, createDraggable, stagger } from "animejs";
  import Modal from './Modal.svelte'; // o il path corretto

  import { draggableMap } from '../stores/draggableMap.js';

  export let images = [];
  // Stato per il modale
  // let modalOpen = false;
  // let modalContent = null;
  export let data;
  setContext('progetti', data);

  let openModals = [];
 let initialSlug = null;
  let isMobile = false;
  	let currentImageIndex = 0;
    	let isDragging = false;

	let currentDragElement;
	let initialTransform = { x: 0, y: 0, rotation: 0 };

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
  
   function expandModal(slug) {
    console.log("Expanding modal with slug:", slug);
    const id = "modal-"+slug;
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

    function minimizeModal(slug) {
    console.log("Minimizing modal with slug:", slug);
    const id = "modal-"+slug;
    const element = document.getElementById(id);
console.log(draggableMap);
    const d = draggableMap.get(element);
    if (d) {
      d.enable();
     }
     element.focus();
    document.getElementById(id).classList.remove('fullsize');
    
    window.history.pushState({}, '', '/'); 
  
  }
  function handleInfoClick(event, image) {
    console.log("Info button clicked for image:", image);
    event.stopPropagation();
    openModal(image);

  }

function handleImageClick(slug) {
  console.log("Image clicked with slug:", slug, openModals);
  
  const isAlreadyOpen = openModals.some(modal => modal.id === slug);

  if (isAlreadyOpen) {
    // Rimuovi la classe top-modal da tutti i modali
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('top-modal');
    });

    // Aggiungi la classe top-modal al modal attuale
    const modalEl = document.getElementById(`modal-${slug}`);
    console.log(modalEl);
    if (modalEl) {
      modalEl.classList.add('top-modal');
      modalEl.focus?.(); // metti il focus se supportato
    }
  } else {
    openModal(slug); // presumibilmente aggiunge un oggetto con id === slug
  }
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

  	// Funzione per rilevare se è mobile
	function detectMobile() {
		return window.innerWidth <= 768;
	}

	function positionMobileStack() {
		const container = document.getElementById("gallery-container");
		if (!container) return;
		const imageWrappers = Array.from(
			container.querySelectorAll(".image-wrapper")
		);

		if (imageWrappers.length === 0) return;

		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		const centerX = containerWidth / 2;
		const centerY = containerHeight / 2;

		imageWrappers.forEach((wrapper, index) => {
			const randomOffsetX = (Math.random() - 0.5) * 20;
			const randomOffsetY = (Math.random() - 0.5) * 20;
			const randomRotation = (Math.random() - 0.5) * 15;

			// Z-index inverso: l'immagine corrente ha z-index più alto
			const zIndex = imageWrappers.length - index;
		  wrapper.style.zIndex = zIndex.toString();

			animate(wrapper, {
				translateX: centerX - 100 + randomOffsetX,
				translateY: centerY - 75 + randomOffsetY,
				rotate: randomRotation,
				scale: index === currentImageIndex ? 1 : 0.95 - index * 0.02,
				duration: 0.2,
				easing: "linear",
			});
		});
	}

	// Funzione per gestire lo swipe con trascinamento visibile
	function setupMobileSwipe() {
		const container = document.getElementById("gallery-container");
		if (!container) return;

		let startX = 0;
		let startY = 0;
		let currentX = 0;
		let currentY = 0;
		let initialTransform = { x: 0, y: 0, rotation: 0 };

		container.addEventListener("touchstart", e => {
			const imageWrappers = Array.from(
				document.querySelectorAll(".image-wrapper")
			);
			if (imageWrappers.length === 0) return;

			currentDragElement = imageWrappers[currentImageIndex];
			if (!currentDragElement) return;

			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			currentX = startX;
			currentY = startY;
			isDragging = true;

			// Salva la posizione iniziale
			const style = getComputedStyle(currentDragElement);
			const matrix = new DOMMatrix(style.transform);
			initialTransform = {
				x: matrix.m41,
				y: matrix.m42,
				rotation: Math.atan2(matrix.m12, matrix.m11) * (180 / Math.PI),
			};

			// Porta l'elemento in primo piano
			currentDragElement.style.zIndex = "1000";
			e.preventDefault();
		});

		container.addEventListener("touchmove", e => {
			if (!isDragging || !currentDragElement) return;

			currentX = e.touches[0].clientX;
			currentY = e.touches[0].clientY;

			const deltaX = currentX - startX;
			const deltaY = currentY - startY;

			// Calcola la rotazione basata sul movimento
			const rotation = deltaX * 0.1; // Moltiplicatore per controllare l'intensità

			// Calcola l'opacità basata sulla distanza
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			const opacity = Math.max(0.3, 1 - distance / 300);

			// Applica la trasformazione in tempo reale
			animate(currentDragElement, {
				translateX: initialTransform.x + deltaX,
				translateY: initialTransform.y + deltaY,
				rotate: initialTransform.rotation + rotation,
				opacity: opacity,
				duration: 0,
				easing: "linear",
			});

			e.preventDefault();
		});

		container.addEventListener("touchend", e => {
			if (!isDragging || !currentDragElement) return;

			isDragging = false;

			const deltaX = currentX - startX;
			const deltaY = currentY - startY;
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			const minSwipeDistance = 80;

			if (distance > minSwipeDistance) {
				// Swipe sufficientemente lungo - completa l'animazione di uscita
				completeSwipeAnimation(deltaX, deltaY);
			} else {
				// Swipe troppo breve - riporta l'immagine in posizione
				returnToPosition();
			}
		});
	}

	// Funzione per completare l'animazione di swipe
	function completeSwipeAnimation(deltaX, deltaY) {
		if (!currentDragElement) return;

		// Calcola la direzione di uscita amplificando il movimento
		const exitX = deltaX > 0 ? window.innerWidth + 200 : -200;
		const exitY = initialTransform.y + deltaY * 2;
		const exitRotation = deltaX > 0 ? 30 : -30;

		animate(currentDragElement, {
			translateX: exitX,
			translateY: exitY,
			rotate: exitRotation,
			opacity: 0,
			scale: 0.8,
			duration: 300,
			easing: "easeOutQuad",
			complete: () => {
				// Passa all'immagine successiva
				currentImageIndex =
					(currentImageIndex + 1) %
					document.querySelectorAll(".image-wrapper").length;
				repositionAfterSwipe();
				currentDragElement = null;
			},
		});
	}

	// Funzione per riportare l'immagine in posizione se lo swipe è troppo breve
	function returnToPosition() {
		if (!currentDragElement) return;

		animate(currentDragElement, {
			translateX: initialTransform.x,
			translateY: initialTransform.y,
			rotate: initialTransform.rotation,
			opacity: 1,
			scale: 1,
			duration: 300,
			easing: "easeOutBack(1.7)",
			complete: () => {
				// Ripristina il z-index
				const imageWrappers = Array.from(
					document.querySelectorAll(".image-wrapper")
				);
				const zIndex = imageWrappers.length - currentImageIndex;
				if (currentDragElement) {
					if (currentDragElement instanceof HTMLElement) {
						currentDragElement.style.zIndex = zIndex.toString();
					}
				}
				currentDragElement = null;
			},
		});
	}

	// Funzione per passare all'immagine successiva
	function swipeToNextImage() {
		const imageWrappers = Array.from(
			document.querySelectorAll(".image-wrapper")
		);

		if (imageWrappers.length === 0) return;

		const currentWrapper = imageWrappers[currentImageIndex];

		// Simula uno swipe casuale per il click
		const direction = Math.random() > 0.5 ? 1 : -1;

		// Porta l'elemento in primo piano
		currentWrapper.style.zIndex = "1000";

		animate(currentWrapper, {
			translateX: direction * (window.innerWidth + 200),
			translateY: (Math.random() - 0.5) * 200,
			rotate: direction * 25,
			scale: 0.8,
			opacity: 0,
			duration: 400,
			easing: "easeInOutQuad",
			complete: () => {
				currentImageIndex = (currentImageIndex + 1) % imageWrappers.length;
				repositionAfterSwipe();
			},
		});
	}

	// Funzione per riposizionare le immagini dopo lo swipe
	function repositionAfterSwipe() {
		const imageWrappers = Array.from(
			document.querySelectorAll(".image-wrapper")
		);

		const containerWidth = window.innerWidth;
		const containerHeight = window.innerHeight;
		const centerX = containerWidth / 2;
		const centerY = containerHeight / 2;

		imageWrappers.forEach((wrapper, index) => {
			const randomOffsetX = (Math.random() - 0.5) * 20;
			const randomOffsetY = (Math.random() - 0.5) * 20;
			const randomRotation = (Math.random() - 0.5) * 15;

			// Calcola il nuovo ordine relativo all'immagine corrente
			const relativeIndex =
				(index - currentImageIndex + imageWrappers.length) %
				imageWrappers.length;
			const zIndex = imageWrappers.length - relativeIndex;
			wrapper.style.zIndex = zIndex.toString();

			animate(wrapper, {
				translateX: centerX - 100 + randomOffsetX,
				translateY: centerY - 75 + randomOffsetY,
				rotate: randomRotation,
				scale: relativeIndex === 0 ? 1 : 0.95 - relativeIndex * 0.02,
				opacity: 1,
				duration: 300,
				easing: "easeOutQuad",
			});
		});
	}


  // FINE CODICE MOBILE 


  // Drag & Click
  function makeDraggableAndClickable() {
    const container = document.getElementById("gallery-container");
    if (!container) return;
    const draggableElements = container.querySelectorAll(".draggable");

    draggableElements.forEach(element => {
      createDraggable(element, {
        container: ".gallery-container",
        // onDrag: () => element.style.zIndex = "999",
        // onRelease: () => element.style.zIndex = "5"
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
    return true;
  }
}

function changeModal(slug) {
     window.history.pushState({}, '', `/${slug}`); // <-- cambia URL
openFromSlug();
}



  
	function initializeGallery() {
		isMobile = detectMobile();

		if (isMobile) {
			positionMobileStack();
			setupMobileSwipe();
		} else {
			randomizePositions();
			setTimeout(() => {
				makeDraggableAndClickable();
			}, 800);
		}
  }

  onMount(() => {
    
openFromSlug();
		initializeGallery();

          randomizePositions();
    animateImagesIn();
    



    // setTimeout(() => {
      
    //   makeDraggableAndClickable();
    // }, 800);

   	window.addEventListener("resize", () => {
			const wasMobile = isMobile;
			isMobile = detectMobile();

			if (wasMobile !== isMobile) {
				// Il tipo di dispositivo è cambiato, reinizializza
				initializeGallery();
			} else if (isMobile) {
				positionMobileStack();
			} else {
				randomizePositions();
			}
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
            style="z-index: 10"
          
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

      <!-- {#each openModals.filter(m => m.data.slug === img.slug) as modal (modal.data.slug)}
  <Modal client:load
    data={modal}
    isFullscreen={modal.isFullscreen}
    onClose={() => closeModal(modal.data.slug)}
    onExpand={() => expandModal(modal.data.slug)}
    onMinimize={() => minimizeModal(modal.data.slug)}
    onChange={(slug) => changeModal(slug)}
  />
     

  {/each} -->
    </div>

       

  {/each}
</div>
<!-- <div class="modals-container"> -->
{#each openModals as modal (modal.data.slug)}
 <Modal client:load
  data={modal}
  isFullscreen={modal.isFullscreen}
  onClose={() => closeModal(modal.data.slug)}
  onExpand={() => expandModal(modal.data.slug)}
  onMinimize={() => minimizeModal(modal.data.slug)}
  onChange={(slug) => changeModal(slug)}
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
    opacity: 0;
    position: absolute;
    cursor: grab;
  }
    .image-wrapper:hover {
    z-index: 100;
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
