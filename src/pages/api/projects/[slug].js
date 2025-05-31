// src/pages/api/projects/[slug].js
import { getCollection, getEntry } from 'astro:content';

export async function GET({ params }) {
  const { slug } = params;
  
  try {
    // Ottieni il progetto specifico dalla collection
    const project = await getEntry('projects', slug);
    
    if (!project) {
      return new Response(JSON.stringify({ error: 'Progetto non trovato' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Renderizza il contenuto markdown
    const { Content } = await project.render();
    
    // Puoi anche processare il contenuto in HTML se necessario
    // const renderedContent = await markdownToHtml(project.body);
    
    return new Response(JSON.stringify({
      project: {
        ...project.data,
        slug: project.slug,
      },
      content: project.body, // O il contenuto renderizzato
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Errore interno del server' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
  }));
}