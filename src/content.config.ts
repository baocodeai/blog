import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: () => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    domain: z.string().optional(),
    stage: z.string().optional(),
    specs: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(true),
    badge: z.string().optional(),
    domain: z.string().optional(),
    techStack: z.array(z.string()).default([]),
    coverImage: image().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
});

export const collections = {
  blog,
  projects,
};

