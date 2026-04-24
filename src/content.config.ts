import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    kicker: z.string().optional(),
    readingMinutes: z.number().default(7),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    next: z.string().optional(),
    nextHook: z.string().optional(),
  }),
});

export const collections = { blog };
