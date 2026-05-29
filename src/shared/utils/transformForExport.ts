import type { ColumnConfig, ExportRow } from '@/shared/types/exports'

export const transformDataForExport = <T>(
  data: T[],
  columnsConfig: ColumnConfig<T>[]
): ExportRow[] => {
  return data.map((item) => {
    const row: ExportRow = {}

    columnsConfig.forEach((col) => {
      if (col.id !== 'actions') {
        const value = col.renderCell(item)
        row[col.label] =
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
            ? value
            : value === null || value === undefined
            ? ''
            : String(value)
      }
    })

    return row
  })
}
