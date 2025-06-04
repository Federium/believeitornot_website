<script>
	import About from './About.svelte';
	import Map from './Map.svelte'
	import ModalComp from './ModalComp.svelte';

	let aboutModalOpen, mapModalOpen = false;
	function openAbout() {
		aboutModalOpen = true;
	}

	function closeAbout() {
		aboutModalOpen = false;
	}

	function openMap() {
		mapModalOpen = true;
	}

	function closeMap() {
		mapModalOpen = false;
	}


	
    
    // import '../style/background.css';
</script>


<div class="text-container blur">
	<div class="text-content">
		<div class="text-top">
			<div class="text-block draggable" data-text-id="block1">
				<h1 class="no-select">
					Antidiciplinary <br /> Communication <br /> Design Lab
				</h1>
			</div>
			<div class="text-top-right draggable" data-text-id="block2">
				<h2 class="no-select">
					Final Synthesis Studio C1 <br /> BA Communication Design <br /> Politecnico
					di Milano <br /> School of Design
				</h2>
				<ul class="text-links no-select">
					<li>
                    <a href="#" on:click|preventDefault={openAbout}>ABOUT</a>
						<a href="">EN/ITA</a>

						<a href="">EN/ITA</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="text-bottom draggable" data-text-id="block3">
			<h3 class="no-select">
				14 June 2025 <br /> 11AM–7PM <br />
				<a href="/#" on:click|preventDefault={openMap}>@DotDotDot <br /> Via Tertulliano 68,
				MI</a> 
			</h3>
		</div>
	</div>
</div>

{#if aboutModalOpen}
<ModalComp  onClose={closeAbout} isFullscreen={true} id="modal-about" slug="about" Content={About}/>
{/if}

{#if mapModalOpen}
<ModalComp  onClose={closeMap} isFullscreen={false} id="modal-map" slug="map" Content={Map}/>
{/if}

<style>
    	.text-top h1,h2,h3,h4,h5,h6,p,a,ul{
		color: var(--giallo);
		text-transform: uppercase;
	}


	.text-container {
		position: absolute;
		top: 0;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		justify-content: right;
	}

	.text-content {
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-width: 0;
	}

	.text-top {
		display: flex;
		padding: 0 2rem;
		text-wrap: nowrap;
		overflow: hidden;
		min-width: 0;
		gap: 2rem;
	}

	.text-top-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.text-links li {
		display: flex;
		gap: 1rem;
	}

	.text-bottom {
		margin-bottom: 12rem;
	}

	h1,
	h3 {
		filter: blur(1px);
	}
	h2,
	.text-links {
		filter: blur(0.6px);
	}

	@media (max-width: 768px) {
		.text-container {
			justify-content: left;
		}
		.text-content {
			width: 100%;
		}
		.text-top {
			padding: 1rem 1rem;
			gap: 0;
			justify-content: space-between;
		}

	}
</style>