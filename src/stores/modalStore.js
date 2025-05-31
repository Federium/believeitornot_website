// src/stores/modalStore.js
import { writable } from 'svelte/store';

export const isModalOpen = writable(false);
export const currentProject = writable(null);
export const projectContent = writable(null);
export const isLoading = writable(false);

export function openModal(projectSlug) {
  isLoading.set(true);
  isModalOpen.set(true);
  
  // Carica il contenuto del progetto
  fetch(`/api/projects/${projectSlug}`)
    .then(response => response.json())
    .then(data => {
      currentProject.set(data.project);
      projectContent.set(data.content);
    })
    .catch(error => {
      console.error('Errore nel caricamento del progetto:', error);
    })
    .finally(() => {
      isLoading.set(false);
    });
}

export function closeModal() {
  isModalOpen.set(false);
  currentProject.set(null);
  projectContent.set(null);
}