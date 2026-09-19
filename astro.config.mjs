import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  output: 'static',
  site: 'https://joanmoret.cat',
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
