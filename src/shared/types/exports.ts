export type ExportRow = Record<string, string | number | boolean | null>

export type ColumnConfig<T> = {
  id: keyof T | 'actions'
  label: string
  renderCell: (item: T) => React.ReactNode
  className?: string
}
