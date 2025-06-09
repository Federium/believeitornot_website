<script>
  const { src, alt, slug} = $props(); 

  import { mapImages } from '../stores/mapImages.js';

  // Ottieni l'array di immagini per lo slug corrente
  const images = mapImages[slug] || [];

  // Cattura src del tipo "{img0}", "{img1}", ...
  let match = src?.match?.(/^\{img(\d+)\}$/);
  let resolvedSrc = match ? images[parseInt(match[1])] : src;

  
</script>

<enhanced:img class="no-drag full-width" src={src} alt={alt} sizes="min(1920px, 100vw)" />

<style>
.no-drag {
          user-drag: none;
    -webkit-user-drag: none;

  }

  .full-width {
    margin: 0 0;
    max-width: 100%;
    height: auto;
  }
</style>