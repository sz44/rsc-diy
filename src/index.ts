import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as esbuild from 'esbuild'
import * as React from 'react'
import * as Server from 'react-dom/server'

const app = new Hono()

app.get('/', async (c) => {
  // @ts-ignore
  const Page = await import('./build/page.js');
  const html = Server.renderToString(React.createElement(Page.default))
  return c.html(html);

})

async function build() {
  await esbuild.build({
    entryPoints: [resolveApp()],
    bundle: true,
    format:'esm',
    logLevel: 'error',
    outdir: resolveBuild(),
    packages: 'external',
  })
}

const port = 3005

serve(app, async (info) => {
  await build();
  console.log(`Server is running on port ${port}`)
})

const appDir = new URL('./app/', import.meta.url);
const buildDir = new URL('./build/', import.meta.url);

function resolveApp() {
  const outURL = new URL('page.tsx', appDir)
  const path = outURL.pathname;
  return path.slice(1, path.length)
}

function resolveBuild() {
  const outURL = new URL('', buildDir)
  const path = outURL.pathname;
  return path.slice(1, path.length)
}