import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/eventos-react-vite-rest-graphql/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'src/mocks/',
        'src/data/',
        '**/*.config.js',
        '**/main.jsx',
        '**/*.json',
      ],
      thresholds: {
        statements: 50,
        functions: 50,
        lines: 50,
      }
    },
  },
}))
