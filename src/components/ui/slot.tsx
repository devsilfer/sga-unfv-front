import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

interface SlotProps {
  children?: ReactNode
  [key: string]: unknown
}

function Slot({ children, ...props }: SlotProps) {
  if (isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      ...props,
      ...(children.props as Record<string, unknown>),
    })
  }
  return null
}

export { Slot }
export type { SlotProps }
