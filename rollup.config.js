import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import { svelteSVG } from 'rollup-plugin-svelte-svg'
import json from '@rollup/plugin-json'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH

const plugins = [
  svelte({
    emitCss: false,
    preprocess: sveltePreprocess(),
    compilerOptions: {
      dev: !production
    }
  }),
  svelteSVG({
    svgo: {}
  }),
  resolve({
    browser: true,
    dedupe: ['svelte']
  }),
  json(),
  commonjs(),

  // In dev mode, call `npm run start` once
  // the bundle has been generated
  !production && serve({ port: 6871, host: '127.0.0.1', contentBase: ['dist', 'public'] }),

  // Watch the `public` directory and refresh the
  // browser on changes when not in production
  !production && livereload('public'),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser()
]

export default [
  {
    input: 'src/client/main.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'discuss',
      file: 'dist/discuss.js'
    },
    plugins
  },
  {
    input: 'src/client/admin.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'discussAdmin',
      file: 'dist/discuss.admin.js'
    },
    plugins
  }
]
