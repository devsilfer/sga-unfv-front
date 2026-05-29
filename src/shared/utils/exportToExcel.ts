import * as XLSX from 'xlsx-js-style'
import { saveAs } from 'file-saver'
import type { ExportRow } from '@/shared/types/exports'

export const exportToExcel = (data: ExportRow[], fileName = 'export.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data)

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: 'A63C3C' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { auto: 1 } },
      bottom: { style: 'thin', color: { auto: 1 } },
      left: { style: 'thin', color: { auto: 1 } },
      right: { style: 'thin', color: { auto: 1 } },
    },
  }

  const columnCount = Object.keys(data[0] ?? {}).length
  for (let col = 0; col < columnCount; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = headerStyle
    }
  }

  for (let row = 1; row <= data.length; row++) {
    for (let col = 0; col < columnCount; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = {
          alignment: { vertical: 'center' },
          border: {
            top: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
          },
        }
      }
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  })
  saveAs(dataBlob, fileName)
}
