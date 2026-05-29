import { useState } from 'react'

type Column = {
  id: string
  label: string
}

export const useVisibleColumns = (columnsConfig: Column[]) => {
  const allColumns = columnsConfig.map((c) => ({ id: c.id, label: c.label }))
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map((c) => c.id))

  const toggleColumn = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId) ? prev.filter((col) => col !== columnId) : [...prev, columnId]
    )
  }

  return {
    allColumns,
    visibleColumns,
    toggleColumn,
    setVisibleColumns
  }
}
