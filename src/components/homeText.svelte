<script>
	import About from './About.svelte';
	import Map from './Map.svelte'
	import ModalComp from './ModalComp.svelte';
	import info from '../data/info.json';
	import { lang } from '../stores/lang.js';


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

	function setLang(l) {
		lang.set(l);
		console.log("lingua cambiata",$lang);
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
					{info.context[$lang][0]}<br />{info.context[$lang][1].short}<br /> {info.context[$lang][2]} <br /> {info.context[$lang][3]}
				</h2>
				<ul class="text-links no-select">
					<li>
                    <a href="" on:click|preventDefault={openAbout}>ABOUT</a>
					<a
							href="https://noncielodicono.freeforums.net/board/1/general-discussion"
							>FORUM</a
						>
					  <a href="" on:click|preventDefault={() => setLang('en')}>EN</a>
					  <span>/</span>
					  <a href="" on:click|preventDefault={() => setLang('it')}>IT</a>

					</li>
				</ul>
			</div>
		</div>
		<div class="text-bottom draggable" data-text-id="block3">
			<h3 class="no-select">
				{info.event.date[$lang]} <br /> {info.event.time[$lang]} <br />
				<a href="/#" on:click|preventDefault={openMap}>{info.event.location.name} <br /> {info.event.location.address}</a> 
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
 	.text-top h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	p,
	a,
	ul {
		color: var(--giallo);
		text-transform: uppercase;
		font-family: "Arial Narrow", Arial, sans-serif;
		line-height: 0.8;
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
		text-align: center;
	}
				

	

	.mobile-bottom-content {
		display: none;
	}

	.subtitle-mobile {
		display: none;
		font-weight: bold;
		font-size: clamp(2rem, 10vw, 4rem);
		filter: blur(1px);
		color: var(--giallo);
		text-align: center;
		margin-bottom: 2rem;
	}

	.subtitle-mobile p {
		font-family: "impact", sans-serif !important;
		line-height: 0.9;
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
	.subtitle-container {
			display: none;
		}

		.mobile-bottom-content {
			display: flex;
			flex-direction: column;
			width: 100%;
			gap: 2rem;
		}

		.subtitle-mobile {
			display: block;
			text-align: left;
			align-self: flex-start;
			margin-bottom: 0;
		}

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

		.title-svg {
			height: 100vh;
			width: 100vw;
		}
		.text-bottom {
			margin-bottom: 0;
			text-align: center;
			align-self: center;
		}
		.text-links li {
			gap: 0.5rem;
		}
	}
</style>