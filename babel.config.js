module.exports = {
  presets: [
    [
      '@vue/app', {
        polyfills: [
          'es6.symbol'
        ]
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
