export const BASE_PATH = import.meta.env.VITE_BASE_URL ?? '/'

function joinPath(base: string, path: string) {
  const b = base.replace(/\/+$/, '')
  const p = path.replace(/^\/+/, '')
  return `${b}/${p}`.replace(/\/+$/, '') || '/'
}

export function appPath(pathname: string): string {
  const base = BASE_PATH === '/' ? '' : BASE_PATH
  return joinPath(base || '/', pathname).startsWith('/')
    ? joinPath(base || '/', pathname)
    : `/${joinPath(base || '/', pathname)}`
}

export function publicPath(pathname: string): string {
  return appPath(pathname)
}
