<script>
  import creditsData from '../data/credits.json';

  // Variabile di lingua: "it" o "en"
  export let lang = 'it';

  // Funzione helper per scegliere il titolo giusto
  const getTitle = (section) => {
    return lang === 'it' ? section.title_it : section.title_en;
  };
</script>

<div class="about-content">
<header>
<h1>Believe It or Not</h1>
<p>Speculating on &#40;un&#41;real conspiracy theories</p>
</header>

<section id="about-description">
<p>Quest’anno l’evento/mostra di presentazione dei progetti realizzati nel <b>Laboratorio di Sintesi Finale C1</b> del Corso di Laurea in <b>Design della Comunicazione, Scuola del Design, Politecnico di Milano</b> (a.a. 2024–2025, prof. Francesco E. Guida, Pietro Buffa di Castelalto, Alessandro Masserdotti e Giacomo Scandolara), si tiene il <b>14 giugno 2025</b> presso <b>Dotdotdot</b> (via Tertulliano 68, Milano, dalle 11 alle 19). </p>
<p><b>Believe It or Not</b> presenta 11 progetti di design della comunicazione, 11 macchine comunicative, 11 scenari speculativi.</p>
<p>11 progetti che raccontano realtà possibili basate su teorie del complotto, usate come punto di partenza per riflettere su immaginari, media e strutture del potere. </p>
<p>11 sistemi comunicativi che interrogano il nostro presente per discutere dei confini tra realtà, finzione e manipolazione e tentano di ridefinire il ruolo del designer della comunicazione.</p>
</section>

<a href="/assets/fogliodisala.pdf">Scarica il foglio di sala</a>

<section id="altri-progetti">

  <h4>Altri progetti</h4>
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
  <h4>Laboratorio di Sintesi Finale C1</h4>
        <p>Corso di Laurea in Design della Comunicazione</p>
        <p>Scuola del Design</p>
        <p>Politecnico di Milano</p>
        <p>A.A. 2024/2025</p>
</section>

<section id="credits">
        {#each creditsData.credits as section}
        <div class="credits-group">
            <h4>{getTitle(section)}</h4>
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