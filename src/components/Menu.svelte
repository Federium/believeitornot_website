<script>
import { getContext } from 'svelte'

const progetti = getContext('progetti')


const { onChange } = $props(); 
  const currentSlug = window.location.pathname.slice(1); // rimuove lo slash iniziale

function changeModal(slug){ 
    console.log("change",slug, currentSlug);
    onChange(slug);
    // open(slug);
}

</script>



<nav>
  <ul>
    {#each progetti as project}
      <li>
        <!-- <a href={"/" + project.data.slug}>
          {project.data.title}
        </a> -->
        <button onclick={() => changeModal(project.data.slug)}>{project.data.title}</button>
      </li>
    {/each}
  </ul>
</nav>

<style>
      nav {
    max-width:40% ;
  }
  nav ul {
    margin-top: 0;
    margin-bottom: 0;
    padding-inline-start: 1em;
  }
  nav li {
white-space: nowrap; 
  }
  nav button {
	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;  }

  nav button:active {
    color: var(--rosso);
  }
  nav button:hover {
    color: var(--rosso);
  }

  h2 {
    font-family: 'Arial Narrow';
    margin-top: 0;
    margin-bottom: 4px;
  }



</style>