import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import dependencies from '@/tools/dependencies'

export default {
  install(Vue) {
    const handler = {
      setUser() {},
      setMode() {},
      setSupport() {}
    }

    if (!window.__PRERENDERING && process.env.VUE_APP_SERVER_ENV !== 'local') {
      Sentry.init({
        dsn: 'https://b0df1bd1d041480f9e8e4dd2c3b56ed5@sentry.io/1342499',
        release: `drawmote@${process.env.PKG_VERSION}`,
        environment: process.env.VUE_APP_SERVER_ENV,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })]
      })

      Sentry.configureScope(scope => {
        Object.keys(dependencies).forEach(key => {
          scope.setTag('library_' + key, dependencies[key])
        })
      })

      handler.setUser = function (id) {
        Sentry.configureScope(scope => {
          scope.setUser({ id: id })
        })
      }

      handler.setMode = function (mode) {
        Sentry.configureScope(scope => {
          scope.setTag('mode', mode)
        })
      }

      handler.setSupport = function (feature, supportState) {
        Sentry.configureScope(scope => {
          scope.setTag('supports_' + feature, supportState)
        })
      }
    }

    Vue.prototype.$sentry = handler
  }
}
