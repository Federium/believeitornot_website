<script>
  import { onMount, setContext } from 'svelte';
  import { animate, createDraggable, stagger } from "animejs";
  import Modal from './Modal.svelte';

  import { draggableMap } from '../stores/draggableMap.js';

  import { mapCovers } from '../stores/mapImages.js';
  console.log(mapCovers);
  // export let images = [];
  export let data;
  setContext('progetti', data);

  export let lastZIndex = 10;
  let topZIndex = 11;

  let openModals = [];
  let initialSlug = null;
  let isMobile = false;
  let currentImageIndex = 0;
  let isDragging = false; 

  let currentDragElement;
  let initialTransform = { x: 0, y: 0, rotation: 0 };

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
    window.history.pushState({}, '', '/');
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

    d.disable();
    d.setX(0);
    d.setY(0);

    window.history.pushState({}, '', `/${slug}`);
  }

  function minimizeModal(slug) {
    console.log("Minimizing modal with slug:", slug);
    const id = "modal-"+slug;
    const element = document.getElementById(id);
    const d = draggableMap.get(element);
    if (d) {
      d.enable();
    }
    element.focus();
    document.getElementById(id).classList.remove('fullsize');
    
    window.history.pushState({}, '', '/'); 
  }

  function handleImageClick(slug) {
    console.log("Image clicked with slug:", slug, openModals);
    
    const isAlreadyOpen = openModals.some(modal => modal.data.slug === slug);

    if (isAlreadyOpen) {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('top-modal');
      });

      const modalEl = document.getElementById(`modal-${slug}`);
      console.log(modalEl);
      if (modalEl) {
        modalEl.classList.add('top-modal');
        modalEl.focus?.();
      }
    } else {
      // Apre il modale sia su desktop che su mobile
      openModal(slug);
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
		const centerY = containerHeight / 3;

		imageWrappers.forEach((wrapper, index) => {
			const randomOffsetX = (Math.random() - 0.5) * 20;
			const randomOffsetY = (Math.random() - 0.5) * 20;
			const randomRotation = (Math.random() - 0.5) * 15;

			// Z-index basato sulla distanza dall'immagine corrente
			let zIndex;
			if (index === currentImageIndex) {
				zIndex = imageWrappers.length; // L'immagine corrente ha z-index più alto
				// Aggiungi ombra alla prima immagine
				wrapper.style.filter = 'drop-shadow(0 10px 30px rgba(0, 0, 0, 1))';
			} else {
				// Le altre immagini hanno z-index decrescente
				const distance = Math.abs(index - currentImageIndex);
				zIndex = imageWrappers.length - distance;
				// Rimuovi ombra dalle altre immagini
				wrapper.style.filter = '';
			}
			wrapper.style.zIndex = zIndex.toString();

			animate(wrapper, {
				translateX: centerX - 100 + randomOffsetX,
				translateY: centerY - 75 + randomOffsetY,
				scale: index === currentImageIndex ? 1 : 0.95 - Math.abs(index - currentImageIndex) * 0.02,
				duration: 0,
				easing: "linear",
			});
		});
	}

	// Funzione per gestire lo swipe con trascinamento visibile
	function setupMobileScroll() {
		let lastScrollTime = 0;
		const scrollThrottle = 100; // Ridotto per maggiore reattività

		// Touch scroll per dispositivi touch su tutto il documento
		let touchStartY = 0;
		let touchStartTime = 0;
		let isScrolling = false;

		document.addEventListener("touchstart", e => {
			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();
			isScrolling = false;
		}, { passive: true });

		document.addEventListener("touchmove", e => {
			const now = Date.now();
			const touchY = e.touches[0].clientY;
			const deltaY = touchStartY - touchY;
			const timeDiff = now - touchStartTime;
			
			// Ridotta la soglia di movimento per maggiore sensibilità
			if (Math.abs(deltaY) > 30 && timeDiff > 80 && !isScrolling) {
				if (now - lastScrollTime < scrollThrottle) return;
				
				lastScrollTime = now;
				isScrolling = true;

				const imageWrappers = Array.from(document.querySelectorAll(".image-wrapper"));
				if (imageWrappers.length === 0) return;

				// Animazione molto leggera dell'immagine corrente
				const currentWrapper = imageWrappers[currentImageIndex];
				if (currentWrapper) {
					animate(currentWrapper, {
						scale: 0.98,
						duration: 100,
						easing: "linear"
					});
				}

				// Aggiorna l'indice
				if (deltaY > 0) {
					currentImageIndex = (currentImageIndex + 1) % imageWrappers.length;
				} else {
					currentImageIndex = (currentImageIndex - 1 + imageWrappers.length) % imageWrappers.length;
				}

				// Riposiziona lo stack con animazione leggera
				setTimeout(() => {
					positionMobileStackSmooth();
				}, 50);
				
				// Reset per evitare scroll multipli
				setTimeout(() => {
					isScrolling = false;
				}, scrollThrottle);
			}
		}, { passive: true });

		// Mouse wheel su tutto il window per testing su desktop
		window.addEventListener("wheel", e => {
			if (!isMobile) return;
			
			const now = Date.now();
			if (now - lastScrollTime < scrollThrottle) return;
			
			e.preventDefault();
			lastScrollTime = now;
			
			const imageWrappers = Array.from(document.querySelectorAll(".image-wrapper"));
			if (imageWrappers.length === 0) return;

			if (Math.abs(e.deltaY) > 20) {
				// Animazione molto leggera dell'immagine corrente
				const currentWrapper = imageWrappers[currentImageIndex];
				if (currentWrapper) {
					animate(currentWrapper, {
						scale: 0.98,
						duration: 100,
						easing: "linear"
					});
				}

				// Aggiorna l'indice
				if (e.deltaY > 0) {
					currentImageIndex = (currentImageIndex + 1) % imageWrappers.length;
				} else {
					currentImageIndex = (currentImageIndex - 1 + imageWrappers.length) % imageWrappers.length;
				}

				setTimeout(() => {
					positionMobileStackSmooth();
				}, 50);
			}
		}, { passive: false });
	}

	// Nuova funzione per posizionare lo stack con animazioni molto leggere
	function positionMobileStackSmooth() {
		const container = document.getElementById("gallery-container");
		if (!container) return;
		const imageWrappers = Array.from(
			container.querySelectorAll(".image-wrapper")
		);

		if (imageWrappers.length === 0) return;

		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;
		const centerX = containerWidth / 2;
		const centerY = containerHeight / 3;

		imageWrappers.forEach((wrapper, index) => {
			const randomOffsetX = (Math.random() - 0.5) * 20;
			const randomOffsetY = (Math.random() - 0.5) * 20;
			const randomRotation = (Math.random() - 0.5) * 15;

			// Z-index basato sulla distanza dall'immagine corrente
			let zIndex;
			if (index === currentImageIndex) {
				zIndex = imageWrappers.length;
			} else {
				const distance = Math.abs(index - currentImageIndex);
				zIndex = imageWrappers.length - distance;
				wrapper.style.filter = '';
			}
			wrapper.style.zIndex = zIndex.toString();

			// Animazione molto più leggera e veloce
			animate(wrapper, {
				translateX: centerX - 100 + randomOffsetX,
				translateY: centerY - 75 + randomOffsetY,
				rotate: randomRotation,
				scale: index === currentImageIndex ? 1 : 0.95 - Math.abs(index - currentImageIndex) * 0.02,
				duration: 250, // Ridotta da 400 a 250
				easing: "easeOutQuad", // Easing più leggero
				delay: index === currentImageIndex ? 0 : 20 // Solo un piccolo delay per le altre
			});
		});
	}

  function completeSwipeAnimation(deltaX, deltaY) {
        if (!currentDragElement) return;
        
        const imageWrappers = Array.from(document.querySelectorAll(".image-wrapper"));
        
        // Remove the current image from view
        animate(currentDragElement, {
            translateX: initialTransform.x + deltaX * 2,
            translateY: initialTransform.y + deltaY * 2,
            rotate: initialTransform.rotation + deltaX * 0.3,
            opacity: 0,
            scale: 0.8,
            duration: 300,
            easing: "easeOutQuad",
            complete: () => {
                // Move to next image
                currentImageIndex = (currentImageIndex + 1) % imageWrappers.length;
                
                // Reset the swiped image position and bring it to back
                if (currentDragElement) {
                    currentDragElement.style.zIndex = "";
                    animate(currentDragElement, {
                        translateX: initialTransform.x,
                        translateY: initialTransform.y,
                        rotate: initialTransform.rotation,
                        opacity: 1,
                        scale: 0.95 - imageWrappers.length * 0.02,
                        duration: 0,
                    });
                }
                
                // Reposition all images for new stack order
                positionMobileStack();
                currentDragElement = null;
            }
        });
    }

    function returnToPosition() {
        if (!currentDragElement) return;
        
        // Return the image to its original position
        animate(currentDragElement, {
            translateX: initialTransform.x,
            translateY: initialTransform.y,
            rotate: initialTransform.rotation,
            opacity: 1,
            scale: 1,
            duration: 300,
            easing: "easeOutBack",
            complete: () => {
                if (currentDragElement) {
                    currentDragElement.style.zIndex = "";
                    currentDragElement = null;
                }
            }
        });
    }

  function makeDraggableAndClickable() {
  const container = document.getElementById("gallery-container");
  if (!container) return;
  
  const imageWrappers = Array.from(container.querySelectorAll(".image-wrapper"));
  
  imageWrappers.forEach(wrapper => {
    // Rendi l'elemento draggable (solo su desktop)
    if (!detectMobile()) {
      const draggable = createDraggable(wrapper, {
        releaseStiffness: 1000,
        container: container,
        onGrab: () => {
          console.log("zindex",lastZIndex);
          wrapper.style.zIndex = topZIndex;
          container.classList.remove("notDragging");
          wrapper.classList.add("dragging");
          isDragging = true;

        },
        onRelease: () => {
          // wrapper.style.zIndex = "";
             isDragging = false;
          wrapper.style.zIndex = topZIndex;
          topZIndex++;
          container.classList.add("notDragging");
          wrapper.classList.remove("dragging");
    
          

        }
      });
    }
    
    // Aggiungi il click handler
    wrapper.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = wrapper.querySelector('.gallery-image')?.alt;
      if (slug) {
        handleImageClick(slug);
      }
    });
  });
}

// Funzione per abilitare click su mobile
  function enableMobileClick() {
    const container = document.getElementById("gallery-container");
    if (!container) return;
    const imageElements = container.querySelectorAll(".image-wrapper");

    imageElements.forEach(element => {
      // Su mobile abilita il click per aprire il modale
      element.addEventListener("click", (e) => {
        // Previeni il comportamento di swipe se è un click veloce
        e.preventDefault();
        e.stopPropagation();
        
        const slug = element.querySelector('.gallery-image')?.alt;
        if (slug) {
          handleImageClick(slug);
        }
      });
    });
  }

  function initializeGallery() {
    isMobile = detectMobile();

    if (isMobile) {
      positionMobileStack();
      setupMobileScroll(); // Cambiato da setupMobileSwipe()
      // Abilita il click anche su mobile
      setTimeout(() => {
        enableMobileClick();
      }, 800);
    } else {
      randomizePositions();
      setTimeout(() => {
        makeDraggableAndClickable();
      }, 800);
    }
  }

  // Animazione entrata
  function animateImagesIn() {
    const imageWrappers = document.querySelectorAll(".image-wrapper");
    animate(imageWrappers, {
      // scale: [0, 1],
      opacity: [0, 1],
      duration: 1,
      delay: stagger(200),
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



  
	onMount(() => {
    
openFromSlug();
		initializeGallery();
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

<div class="gallery-container notDragging" id="gallery-container">
   {#each Object.entries(mapCovers) as [slug, imgData]}
  <div
    class="image-wrapper draggable"
    style:--z-index={lastZIndex}
       style:--top-z-index={topZIndex}
    role="button"
    tabindex="0"
    aria-label="Open modal for image"
    on:click={() => handleImageClick(slug)}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleImageClick(slug);
      }
    }}
  >
    <enhanced:img
      src={imgData.static}
      alt={slug}
      width="200"
      class="gallery-image static"
      draggable="false"
    />

    <img
      src={imgData.gif.src}
      alt={slug}
      width="200"
      class="gallery-image gif"
      draggable="false"

    />
    
  </div>
{/each}
</div>

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

<style>
  .gallery-container {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    z-index: 2;
    pointer-events: none;
  }
  
  .image-wrapper {
    opacity: 0;
    position: absolute;
    cursor: grab;
    pointer-events: all;
    z-index: var(--z-index);
  }
  
.gallery-container.notDragging .image-wrapper:hover {
    z-index: var(--top-z-index);
  }
 :global(.image-wrapper.dragging) {
    z-index: var(--top-z-index);
  }
  
  .image-wrapper:active {
    cursor: grabbing;
  }

  .gallery-image {
    object-fit: cover;
  }


  
.gallery-container.notDragging .image-wrapper:hover .static,
:global(.gallery-container:not(.notDragging) .image-wrapper.dragging .static) { /**global per evitare che svelte ignori la regola, essendo che di default non c'è notDragging*/
  display: none;
}

.gallery-container.notDragging .image-wrapper:hover .gif,
:global(.gallery-container:not(.notDragging) .image-wrapper.dragging .gif) {
  display: block;
}

   .image-wrapper .static {
    display: block;
  }
  
  .image-wrapper .gif {
    display: none;
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

  /* Stili specifici per mobile */
  @media (max-width: 768px) {
    .image-wrapper {
      cursor: default;
      touch-action: none;
    }

    .gallery-container {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }

    .gallery-image {
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }
  }
</style>
