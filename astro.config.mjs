// @ts-check
import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';


// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), mdx()],
      vite: {
        plugins: [imagetools(),enhancedImages()]
    }
});
