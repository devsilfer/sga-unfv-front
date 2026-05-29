import { Suspense, type ComponentType } from 'react'

export function withSuspense(Component: ComponentType) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <Component />
    </Suspense>
  )
}
