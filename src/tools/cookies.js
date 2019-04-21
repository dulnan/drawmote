import Cookies from 'universal-cookie'

const cookie = new Cookies()

export function setState(state) {
  cookie.set('state', state, { path: '/' })
}

export function getState() {
  return cookie.get('state')
}

export function setLocale(locale) {
  cookie.set('locale', locale, { path: '/' })
}

export function getLocale() {
  return cookie.get('locale')
}
