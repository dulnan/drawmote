const path = require('path')

const PrerenderSpaPlugin = require('prerender-spa-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

const webpackPlugins = []

if (process.env.NODE_ENV === 'production') {
  webpackPlugins.push(new HtmlWebpackInlineSourcePlugin())
  webpackPlugins.push(new PrerenderSpaPlugin({
    staticDir: path.join(__dirname, 'dist'),
    routes: ['/'],
    renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
      injectProperty: '__PRERENDERING',
      inject: true,
      renderAfterDocumentEvent: 'render-event',
      skipThirdPartyRequests: true
    }),
    postProcess (context) {
      context.html = context.html.replace('id="drawmote"', 'id="drawmote" data-server-rendered="true"')
      return context
    }
  }))
}

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
  configureWebpack: {
    plugins: webpackPlugins
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('html')
        .tap(args => {
          args[0].inlineSource = '.(css)$'
          return args
        })
    }
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
