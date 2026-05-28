export function toItemsRecord<T extends { value: number | string; label: string }>(
  items: T[]
): Record<string, string> {
  return Object.fromEntries(
    items.map((item) => [String(item.value), item.label])
  )
}
