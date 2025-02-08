import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		// Mark the module as external for SSR
		external: [],
	},
	build: {
		rollupOptions: {
			// Also mark it as external during bundling
			external: ["@node-rs/argon2-wasm32-wasi"],
		},
	},
});
