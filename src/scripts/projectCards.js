// src/scripts/projectCards.js
import { openModal } from '../stores/modalStore.js';

// Funzione per inizializzare i click handlers delle card
function initProjectCards() {
  console.log('🚀 Inizializzando project cards...'); // Debug
  
  const cards = document.querySelectorAll('.project-card');
  console.log('📦 Trovate', cards.length, 'cards'); // Debug
  
  cards.forEach((card, index) => {
    console.log(`📋 Configurando card ${index}:`, card.dataset.projectSlug); // Debug
    
    // Rimuovi listener esistenti per evitare duplicati
    card.removeEventListener('click', handleCardClick);
    
    // Aggiungi il nuovo listener
    card.addEventListener('click', handleCardClick);
    
    // Aggiungi supporto keyboard per accessibilità
    card.addEventListener('keydown', handleCardKeydown);
    
    // Rendi la card focusable
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Apri dettagli del progetto ${card.querySelector('h3')?.textContent || ''}`);
  });
}

function handleCardClick(event) {
  console.log('🎯 Card cliccata!', event.currentTarget); // Debug
  
  const card = event.currentTarget;
  const slug = card.dataset.projectSlug;
  
  console.log('🏷️ Slug trovato:', slug); // Debug
  
  if (slug) {
    console.log('✅ Aprendo modale per:', slug); // Debug
    openModal(slug);
  } else {
    console.error('❌ Nessuno slug trovato nella card'); // Debug
  }
}

function handleCardKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    console.log('⌨️ Tasto premuto:', event.key); // Debug
    event.preventDefault();
    handleCardClick(event);
  }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 DOM caricato, inizializzando cards...'); // Debug
  initProjectCards();
});

// Anche dopo che la pagina è completamente caricata (per sicurezza)
window.addEventListener('load', () => {
  console.log('🔄 Pagina caricata, re-inizializzando cards...'); // Debug
  initProjectCards();
});

// Esporta la funzione per re-inizializzare se necessario
export { initProjectCards };