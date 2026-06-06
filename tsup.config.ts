import { defineConfig } from "tsup";

export default defineConfig({
  // The main entry point of the application
  entry: ["src/server.ts"],

  // Output format set to modern ECMAScript Modules (ESM)
  format: ["esm"], 

  // Target the latest standard of JavaScript
  target: "esnext",

  // Output directory for the compiled code
  outDir: "dist",

  // Clean the output directory before each build
  clean: true,

  // Bundle all code and dependencies into single/optimized files
  bundle: true,

  // Disable code splitting to keep server bundle cohesive
  splitting: false,

  // Generate source maps for easier debugging in production
  sourcemap: true,

  // Inject a shim at the top of the bundle to support commonJS require() inside ESM
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});