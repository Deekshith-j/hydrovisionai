/**
 * Vercel Build Output API v3 assembler for TanStack Start projects.
 *
 * TanStack Start (v1.x) builds to:
 *   dist/client/  -> static assets (JS, CSS, images)
 *   dist/server/  -> Node.js server entry (server.js)
 *
 * This script translates that into .vercel/output/ following:
 * https://vercel.com/docs/build-output-api/v3
 */

import { cpSync, mkdirSync, writeFileSync, existsSync, rmSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");

const OUT = join(ROOT, ".vercel", "output");

// Clean previous output
if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}

// --- 1. Static assets ---------------------------------------------------------
// Copy dist/client/* -> .vercel/output/static/
const STATIC_SRC = join(ROOT, "dist", "client");
const STATIC_DEST = join(OUT, "static");

if (existsSync(STATIC_SRC)) {
  mkdirSync(STATIC_DEST, { recursive: true });
  cpSync(STATIC_SRC, STATIC_DEST, { recursive: true });
  console.log("+ Copied static assets -> .vercel/output/static/");
} else {
  console.error("! dist/client not found - did vite build succeed?");
  process.exit(1);
}

// --- 2. SSR function ----------------------------------------------------------
// Copy dist/server/* -> .vercel/output/functions/index.func/
const FN_DIR = join(OUT, "functions", "index.func");
const SERVER_SRC = join(ROOT, "dist", "server");

mkdirSync(FN_DIR, { recursive: true });
cpSync(SERVER_SRC, FN_DIR, { recursive: true });

// Write the Vercel function config
writeFileSync(
  join(FN_DIR, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
      shouldAddHelpers: true,
    },
    null,
    2
  )
);

// Write a Node.js wrapper that adapts the ESM fetch handler to Vercel
writeFileSync(
  join(FN_DIR, "index.js"),
  `
import "./server.js";
// Re-export the default handler from server.js
export { default } from "./server.js";
`.trim()
);

// --- 3. Output config ---------------------------------------------------------
writeFileSync(
  join(OUT, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: "^/_build/(.*)$",
          headers: { "cache-control": "public, max-age=31536000, immutable" },
          dest: "/_build/$1",
          continue: true,
        },
        { src: "/(.*)", dest: "/index" },
      ],
    },
    null,
    2
  )
);

console.log("+ Wrote .vercel/output/config.json");
console.log("+ Vercel Build Output API v3 structure ready in .vercel/output/");
