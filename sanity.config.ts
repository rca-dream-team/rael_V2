import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { media } from 'sanity-plugin-media';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
   name: 'default',
   title: 'rael-cms',
   projectId: 'rrmy9xks',
   dataset: 'production',
   basePath: '/studio',
   plugins: [structureTool(), visionTool(), media()],
   schema: {
      types: schemaTypes,
   },
});
