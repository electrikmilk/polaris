import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.js'),
            name: 'Polaris',
            // the proper extensions will be added
            fileName: 'polaris',
        },
    },
})