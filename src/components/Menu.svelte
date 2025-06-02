<script>
import { getContext } from 'svelte'

const progetti = getContext('progetti')
console.log(progetti);
</script>


<h2>Believe it or not</h2>

<nav>
  <ul>
    {#each progetti as project}
      <li>
        <a href={"/" + project.data.slug}>
          {project.data.title}
        </a>
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
  nav a {
    color: black;
  }

  nav a:active {
    color: red;
  }
  nav a:hover {
    color: red;
  }

  h2 {
    font-family: 'Arial Narrow';
    margin-top: 0;
    margin-bottom: 4px;
  }



</style>