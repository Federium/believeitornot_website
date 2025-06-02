<script>
  const { src, alt, slug} = $props(); 

  import { mapImages } from '../stores/mapImages.js';

  // Ottieni l'array di immagini per lo slug corrente
  const images = mapImages[slug] || [];

  // Cattura src del tipo "{img0}", "{img1}", ...
  let match = src?.match?.(/^\{img(\d+)\}$/);
  let resolvedSrc = match ? images[parseInt(match[1])] : src;

  
</script>

<enhanced:img class="no-drag" src={src} alt={alt} />

<style>
.no-drag {
          user-drag: none;
    -webkit-user-drag: none;

  }
</style>