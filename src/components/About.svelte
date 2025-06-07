<script>
  import creditsData from '../data/info.json';

  // Variabile di lingua: "it" o "en"
  import {lang} from '../stores/lang.js';

  // Funzione helper per scegliere il titolo giusto

</script>

<div class="about-content">
<header>
<h1>Believe It or Not</h1>
<p>Speculating on &#40;un&#41;real conspiracy theories</p>
</header>

<section id="about-description">
  {#if $lang === "it"}
<p>Quest’anno l’evento/mostra di presentazione dei progetti realizzati nel <b>Laboratorio di Sintesi Finale C1</b> del Corso di Laurea in <b>Design della Comunicazione, Scuola del Design, Politecnico di Milano</b> (a.a. 2024–2025, prof. Francesco E. Guida, Pietro Buffa di Castelalto, Alessandro Masserdotti e Giacomo Scandolara), si tiene il <b>14 giugno 2025</b> presso <b>Dotdotdot</b> (via Tertulliano 68, Milano, dalle 11 alle 19). </p>
<p><b>Believe It or Not</b> presenta 11 progetti di design della comunicazione, 11 macchine comunicative, 11 scenari speculativi.</p>
<p>11 progetti che raccontano realtà possibili basate su teorie del complotto, usate come punto di partenza per riflettere su immaginari, media e strutture del potere. </p>
<p>11 sistemi comunicativi che interrogano il nostro presente per discutere dei confini tra realtà, finzione e manipolazione e tentano di ridefinire il ruolo del designer della comunicazione.</p>
{:else if $lang === "en"}
<p>This year, the event/exhibition presenting the projects developed in the <b>Final Synthesis Communication Design Studio C1, BSc in Communication Design, School of Design, Politecnico di Milano</b> (via Tertulliano 68, Milan, from 11 am to 7 pm).</p>
<p><b>Believe It or Not</b> presents 11 communication design projects, 11 communicative machines, and 11 speculative scenarios.</p>
<p>11 projects that explore possible scenarios based on conspiracy theories, used as a starting point to reflect on imaginaries, media and power structures. </p>
<p>11 communication systems that question our present to discuss the boundaries between reality, fiction and manipulation, trying to redefine the role of the communication designer.</p>
{/if}

</section>

<a href="/assets/fogliodisala.pdf">
  {#if $lang === "it"}
Scarica il poster
{:else if $lang === "en"}
Download the poster
{/if}
</a>

<section id="altri-progetti">

  <h4>  {#if $lang === "it"}
Progetti precedenti
{:else if $lang === "en"}
Previous projects
{/if}

  </h4>
  <ul>
    <li>
      <a href="http://anthropogenicnarratives.antidisciplinarylab.it/index.html" target="_blank">Anthropogenic Narratives</a>
    </li>
    <li>
      <a href="http://fattididati.antidisciplinarylab.it/home.html" target="_blank">Fatti_di_dati</a>
    </li>
    <li>
      <a href="http://retuals.antidisciplinarylab.it/" target="_blank">Retuals</a>
    </li>
    <li>
      <a href="http://morte13.antidisciplinarylab.it/" target="_blank">Morte. 13 solidi dubbi</a>
    </li>
    <li>
      <a href="http://humans.antidisciplinarylab.it/" target="_blank">What makes humans human?</a>
    </li>
    <li>
      <a href="http://wordsworks.antidisciplinarylab.it/" target="_blank">WordsWorks</a>
    </li>
    <li>
      <a href="http://whatif.antidisciplinarylab.it/" target="_blank">What if</a>
    </li>
  </ul>
</section>

<section id="lab-description">
  <h4>{creditsData.context[$lang][0]}</h4>
        <p>{creditsData.context[$lang][1].full}</p>
        <p>{creditsData.context[$lang][2]}</p>
        <p>{creditsData.context[$lang][3]}</p>
        <p>{creditsData.context[$lang][4]}</p>
</section>

<section id="credits">
        {#each creditsData.credits as section}
        <div class="credits-group">
            <h4>{(section.title[$lang])}</h4>
                <ul>
                    {#each section.names as name}
                    <li>{name}</li>
                    {/each}
                </ul>
        </div>
    
        {/each}
     
</section>



</div>

<style>
    

    header h1 {
        font-family: 'Impact';
        text-transform: uppercase;
        font-size: 4em;
    } 

    header p, h4 {
        font-family: 'Arial Narrow';
        font-weight: bold;
    }

    header p {
        font-size: 2em;
    }

    h4 {
        font-size: 1.2em;
    }
    .about-content {
        display: flex;
        flex-direction: column;
        row-gap: 1em;
    }

    #about-description{
        display: flex;
        flex-direction: column;
        row-gap: 1em;
        max-width: 800px;
    }

    ul {
        font-weight: normal;
        list-style-type: disc;
        list-style-position: inside

    }

    #credits {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: 1em;
        column-gap: 1em;
    }
    .credits-group {
        width: 30%;
        min-width: fit-content;
    }
    #credits li {
        text-wrap: nowrap;
    }
</style>