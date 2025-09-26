import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module'
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/schema'
  ],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})