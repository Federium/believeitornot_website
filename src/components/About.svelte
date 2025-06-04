<script>
	export let isOpen = false;
	export let onClose = () => {};
</script>

{#if isOpen}
	<div class="modal-overlay" on:click={onClose}>
		<div class="modal-content" on:click|stopPropagation>
			<h2>About</h2>
			<p>Contenuto del modale.</p>
			<button on:click={onClose}>Chiudi</button>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.modal-content {
		background: white;
		padding: 2rem;
		border-radius: 8px;
	}
</style>
