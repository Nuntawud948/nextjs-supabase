'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ColumnConfig<T> {
  header: string
  accessorKey: keyof T | string
  sortable?: boolean
}

interface FilterFieldConfig<T> {
  key: keyof T
  label: string
  placeholder?: string
}

interface CustomDataTableProps<T> {
  columns: ColumnConfig<T>[]
  data: T[]
  renderRow: (item: T, runningIndex: number) => React.ReactNode
  loading?: boolean
  emptyMessage?: string
  filterFields?: FilterFieldConfig<T>[] 
}

export function CustomDataTable<T extends Record<string, any>>({
  columns,
  data,
  renderRow,
  loading = false,
  emptyMessage = 'ไม่พบข้อมูลในระบบ',
  filterFields = [],
}: CustomDataTableProps<T>) {
  
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)

  // Logic กรองข้อมูลซ้อนกันหลายมิติ
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return filterFields.every((field) => {
        const term = searchTerms[field.key as string] || ''
        if (!term) return true
        
        const itemValue = item[field.key]
        return itemValue ? String(itemValue).toLowerCase().includes(term.toLowerCase()) : false
      })
    })
  }, [data, searchTerms, filterFields])

  // Logic จัดเรียงลำดับ
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [filteredData, sortConfig])

  const totalItems = sortedData.length
  const totalPages = Math.ceil(totalItems / pageSize)
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const handleSearchChange = (key: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  // 🧮 🟢 ฟังก์ชันคำนวณคลาส Grid ของ Tailwind ตามจำนวนช่องที่คุณนันท์ระบุเข้ามา
  const getGridColsClass = () => {
    const count = filterFields.length
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' // รองรับกรณี 4 ช่องขึ้นไป
  }

  return (
    <div className="space-y-4">
      
      {/* ส่วนพื้นที่โซนช่องอินพุตค้นหาแยกหลายช่อง */}
      {filterFields.length > 0 && (
        <div className="p-4 rounded-xl border bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="text-sm font-semibold text-slate-700">🔍 ตัวกรองค้นหาข้อมูล</span>
            <div className="text-xs text-slate-500 font-medium">
              ผลการกรอง: <span className="text-blue-600 font-bold">{totalItems}</span> จากทั้งหมด <span className="font-bold">{data.length}</span> รายการ
            </div>
          </div>
          
          {/* 🚀 🟢 เรียกใช้ Dynamic Grid ตรงนี้ เพื่อขยายขนาดตามจำนวนช่องที่กำหนดออโต้ */}
          <div className={`grid gap-3 ${getGridColsClass()}`}>
            {filterFields.map((field) => (
              <div key={field.key as string} className="space-y-1">
                <label className="text-xs font-medium text-slate-500">{field.label}</label>
                <Input
                  placeholder={field.placeholder || `ค้นหาตาม${field.label}...`}
                  value={searchTerms[field.key as string] || ''}
                  onChange={(e) => handleSearchChange(field.key as string, e.target.value)}
                  className="bg-white h-9 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* โครงสร้างตารางหลักของ Shadcn */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={idx === columns.length - 1 ? 'text-right' : ''}>
                  {col.sortable ? (
                    <button type="button" onClick={() => requestSort(col.accessorKey as string)} className="inline-flex items-center space-x-1 hover:text-slate-900 transition-colors font-semibold">
                      <span>{col.header}</span>
                      <span>{sortConfig?.key === col.accessorKey ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ' ↕️'}</span>
                    </button>
                  ) : (
                    <span className="font-semibold">{col.header}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400">กำลังโหลดข้อมูล...</td>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 bg-white italic">{emptyMessage}</td>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => {
                const runningIndex = (currentPage - 1) * pageSize + index + 1
                return renderRow(item, runningIndex)
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* แถบควบคุมการเปลี่ยนหน้าข้อมูลด้านล่าง (Pagination) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-xs text-slate-500">แสดงผลหน้า {currentPage} จากทั้งหมด {totalPages} หน้า</div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>⬅️ ก่อนหน้า</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>ถัดไป ➡️</Button>
          </div>
        </div>
      )}
    </div>
  )
}