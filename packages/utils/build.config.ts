export default {
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      define: {
        'import.meta.vitest': 'undefined',
      },
    },
  },
}
