import RedirectByRole from "./RedirectByRole"
import type { RouteObject } from 'react-router-dom'

export const addRedirectByRoleToTree = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => {
    const r = { ...route }

    if (r.children && r.children.length > 0) {
      r.children = addRedirectByRoleToTree(r.children as RouteObject[])

      r.children.push({ index: true, element: <RedirectByRole /> })
      r.children.push({ path: '*', element: <RedirectByRole /> })
    }

    return r
  })
}
