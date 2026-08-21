import { defineConfig } from "tsdown";

// Migrated from tsup, which is no longer maintained ("This project is not
// actively maintained anymore. Please consider using tsdown instead.").
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  // tsdown defaults to fixed .mjs/.cjs. This package is `type: module`, so
  // `false` yields .js for ESM and .cjs for CJS — the names the published
  // `exports` map already points at. Changing them would break consumers.
  fixedExtension: false,
  dts: { sourcemap: false },
  clean: true,
  sourcemap: true,
  treeshake: true,
  minify: false,
  deps: { neverBundle: ["react", "react-dom"] },
  // "use client" must survive to the emitted bundles. Under tsup this was an
  // `esbuildOptions` banner, which `treeshake: true` silently dropped: tsup
  // post-processes with rollup in that mode and never applies esbuild's banner.
  // The published package therefore shipped with no directive at all, which
  // breaks it in a Next.js App Router server context. Asserted by a build check.
  banner: '"use client";',
});
