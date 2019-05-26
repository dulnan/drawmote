import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default {
  install(Vue) {
    const handler = {
      setUser() {},
      setMode() {}
    }

    if (!window.__PRERENDERING && process.env.VUE_APP_SERVER_ENV !== 'local') {
      Sentry.init({
        dsn: 'https://b0df1bd1d041480f9e8e4dd2c3b56ed5@sentry.io/1342499',
        release: `drawmote@${process.env.PKG_VERSION}`,
        environment: process.env.VUE_APP_SERVER_ENV,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })]
      })

      handler.setUser = function (id) {
        Sentry.configureScope(scope => {
          scope.setUser({ id: id })
        })
      }

      handler.setMode = function (mode) {
        Sentry.configureScope(scope => {
          scope.setTag({ mode: mode })
        })
      }
    }

    Vue.prototype.$sentry = handler
  }
}
