import { defineConfig } from "tsdown";

// Migrated from tsup, which is no longer maintained ("This project is not
// actively maintained anymore. Please consider using tsdown instead.").
export default defineConfig([
  // Client bundle — the only module that carries "use client".
  {
    entry: { client: "src/client.ts" },
    format: ["cjs", "esm"],
    fixedExtension: false,
    dts: { sourcemap: false },
    clean: true,
    sourcemap: true,
    treeshake: true,
    minify: false,
    // Replaces the former esbuild banner, which tsup silently dropped under
    // `treeshake: true` -- this package shipped with no directive at all for
    // its entire published life as a result.
    banner: '"use client";',
    deps: { neverBundle: ["react", "react-dom"] },
    // src/styles.css is a documented, optional stylesheet for consumers not
    // using Tailwind (README line 301, and the `./styles` export). The build
    // never copied it, so that import resolved to a file that did not exist in
    // any published version.
    copy: [{ from: "src/styles.css", to: "dist" }],
  },
  // Root barrel — deliberately NOT a client module. It composes the compound
  // ConsentBanner.Content API out of ./client's client references, which only
  // works while this stays a server module.
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    fixedExtension: false,
    dts: { sourcemap: false },
    // The client bundle above already emptied dist/.
    clean: false,
    sourcemap: true,
    treeshake: true,
    minify: false,
    // Load-bearing: bundling ./client in here would flatten away its
    // "use client" directive and strip the compound's properties.
    deps: {
      neverBundle: [
        "react",
        "react-dom",
        "@silverassist/consent-banner/client",
      ],
    },
  },
]);
