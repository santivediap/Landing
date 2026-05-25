import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://santiagovedia.com',
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  integrations: [sitemap()]
});