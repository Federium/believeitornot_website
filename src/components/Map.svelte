<!-- 


<script>
    import {onMount} from 'svelte';

    onMount(() => {
  const iframe = document.getElementById("map-iframe");
  const modal = document.getElementById("modal-map")
  iframe.addEventListener("mousZ", () => {
    modal.focus();
    modal.classList.add("top-modal");
  });
    });
</script>

     -->
<script>
  import { onMount } from 'svelte';

  onMount(() => {
    const iframe = document.getElementById("map-iframe").children;

    if (iframe) {
        console.log("cc");
      iframe.addEventListener("click", () => {
                console.log("cc");

        if (iframe.parentElement) {
          iframe.parentElement.classList.add("classe-attiva");
        }
      });
    }
  });
</script>
     

 
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.8499051754434!2d9.219822612423147!3d45.448176134386095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c42c54e18e01%3A0x826e830f1b8826b4!2sdotdotdot!5e1!3m2!1sit!2sit!4v1749075778933!5m2!1sit!2sit" width="100%" height="100%" id="map-iframe" style="border:0;min-width: 100px; min-height: 100px" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
<div class="corner"></div>



<style>
    .overlay{
        width: 100%;
        height: 100%;
    }
    .corner {
        height: 10px;
        width: 10px;
        position: absolute;
        bottom: 0;
        right: 0;

    }
</style>



