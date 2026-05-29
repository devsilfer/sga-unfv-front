import { useMemo, useState } from 'react'

type UsePaginationAndFilterOptions<T extends Record<string, unknown>> = {
  data: T[]
  itemsPerPage?: number
  searchTerm?: string
}

export const usePaginationAndFilter = <T extends Record<string, unknown>>({
  data,
  itemsPerPage = 10,
  searchTerm = ''
}: UsePaginationAndFilterOptions<T>) => {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    const term = searchTerm.toLowerCase()
    return data.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(term)))
  }, [data, searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  return {
    currentData,
    filteredData,
    currentPage,
    setCurrentPage,
    indexOfFirstItem,
    indexOfLastItem
  }
}
