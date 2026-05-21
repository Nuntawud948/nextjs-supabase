'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ActionDropdownProps {
  onEdit: () => void
  onDelete: () => void
}

export function CustomActionDropdown({ onEdit, onDelete }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      {/* 🟢 แก้ไขจุดนี้: เอา asChild ออก แล้วเปลี่ยนโครงสร้างให้ DropdownMenuTrigger ทำหน้าที่เป็นปุ่มในตัวมันเองเลย */}
      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white h-8 w-8 p-0 hover:bg-slate-100 hover:text-slate-900 transition-colors">
        ⚙️
      </DropdownMenuTrigger>
      
      {/* ส่วนเนื้อหาเมนูลอยพ้นตารางออโต้ */}
      <DropdownMenuContent align="end" className="w-32 bg-white border border-slate-200 rounded-md shadow-md z-50">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 rounded-sm">
          📝 แก้ไขข้อมูล
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 cursor-pointer px-3 py-2 text-sm hover:bg-red-50 rounded-sm">
          🗑️ ลบข้อมูล
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}