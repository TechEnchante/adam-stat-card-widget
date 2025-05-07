import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  input:  'src/index.js',
  output: {
    file:   'dist/stat-card.js',
    format: 'iife',
    name:   'StatCardWidget'
  },
  plugins: [
    // now card.html + card.css end up in dist/
    copy({
      targets: [
        { src: 'src/card.html', dest: 'dist' },
        { src: 'src/card.css',  dest: 'dist' },
      ]
    })
  ]
});