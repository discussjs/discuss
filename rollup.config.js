import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import { svelteSVG } from 'rollup-plugin-svelte-svg'
import json from '@rollup/plugin-json'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = require('child_process').spawn('npm', ['run', 'start:sirv', '--', '--dev', '--port', '6871'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

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
  !production && serve(),

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
      name: 'Discuss',
      file: production ? 'dist/Discuss.js' : 'public/dist/Discuss.js'
    },
    plugins
  },
  {
    input: 'src/client/admin.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'DiscussAdmin',
      file: production ? 'dist/Discuss.admin.js' : 'public/dist/Discuss.admin.js'
    },
    plugins
  },
  {
    input: 'src/client/emot.js',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'DiscussEmot',
      file: production ? 'dist/emot.js' : 'public/dist/emot.js'
    },
    plugins
  }
]
