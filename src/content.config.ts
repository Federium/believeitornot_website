import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/" }),

  schema: z.object({
    title: z.string(),
    slug: z.string(), 
    team: z.array(z.string()),

  }),
});

export const collections = {
  projects,
};
