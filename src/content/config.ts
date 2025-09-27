import { defineCollection, z } from 'astro:content';

const notas = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.date().optional(),
  }),
});

export const collections = {
  notas,
}; 