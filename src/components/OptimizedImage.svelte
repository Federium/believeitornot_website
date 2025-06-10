<script>
  export let src;
  export let alt = '';
  export let widths = [400, 800, 1200];
  export let formats = ['webp', 'jpeg'];

  const images = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg}', { import: 'default', eager: true });

  const imgSrc = images[src];

  if (!imgSrc) {
    console.warn(`Image not found: ${src}`);
  }
</script>

{#if imgSrc}
  <picture>
    {#each formats as format}
      <source
        srcset={widths.map(w => `${imgSrc}?w=${w}&format=${format} ${w}w`).join(', ')}
        type={`image/${format}`} />
    {/each}
    <img
      src={`${imgSrc}?w=${widths[1]}&format=jpeg`}
      alt={alt}
      loading="lazy"
      decoding="async"
      style="max-width: 100%; height: auto;" />
  </picture>
{:else}
  <p style="color:var(--rosso);">Immagine non trovata: {src}</p>
{/if}
