import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser"

export default defineConfig([
    {
        input: "./src/main.ts",
        output: {
            file: "dist/main.js",
            format: "esm",
        },
        plugins: [typescript(), terser()],
    },
    {
        input: "./src/main.ts",
        output: {
            file: "dist/main.d.ts",
            format: "es",
        },
        plugins: [dts()],
    },
]);
