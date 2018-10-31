const path = require('path')

const PrerenderSpaPlugin = require('prerender-spa-plugin')

module.exports = {
  productionSourceMap: false,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/assets/scss/vue_include.scss')
      ]
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('prerender-spa-plugin')
        .use(PrerenderSpaPlugin, [
          {
            staticDir: path.join(__dirname, 'dist'),
            routes: ['/'], // List of routes to prerender.
            renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
              injectProperty: '__PRERENDERING',
              inject: {
                isPrerendering: true
              },
              renderAfterDocumentEvent: 'render-event',
              skipThirdPartyRequests: true
            })
          }
        ])
    }
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
