import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "main": "src/main.ts",
    },
    sourcemap: false,
    minify: true,
    splitting: false,
    clean: true,
    dts: true,
    format: ["esm"],
    outDir: "dist",
});
