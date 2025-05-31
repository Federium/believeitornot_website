import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/" }),

  schema: z.object({
    title: z.string(),
    whatif: z.string(),
    slug: z.string(), 
    team: z.array(z.string()),
    images: z.array(z.string()),    // <-- aggiungi questa riga

  }),
});

export const collections = {
  projects,
};
