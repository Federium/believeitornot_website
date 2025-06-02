// @ts-check
import { defineConfig } from 'astro/config';
// import { mdsvex } from 'mdsvex'©
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import { imagetools } from 'vite-imagetools';
import { enhancedImages } from '@sveltejs/enhanced-img';


export default defineConfig({
  // output: 'static', // per fare fallback su index.html
  // trailingSlash: 'never',
  integrations: [svelte(), mdx()],

  vite: {
    plugins: [enhancedImages()]
  }
});