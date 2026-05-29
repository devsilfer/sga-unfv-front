import { appPath } from './publicPath'

export function redirectTo(path: string) {
  if (!path || path === '/') {
    window.location.assign(appPath('/'))
    return
  }

  if (/^https?:\/\//i.test(path)) {
    window.location.assign(path)
    return
  }

  window.location.assign(appPath(path))
}
