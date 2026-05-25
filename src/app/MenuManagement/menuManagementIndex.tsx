'use client'

import React, { useEffect, useState } from 'react'
import { menuService } from '@/services/menuService'
import { MenuItemDTO } from '@/dto/menu'
import { CustomButton } from '@/components/ui/custom-button'
import { CustomDataTable } from '@/components/structure/custom-data-table'
import { TableRow } from '@/components/ui/table'
import { CustomActionDropdown } from '@/components/ui/custom-action-dropdown' // 🟢 อิมพอร์ตปุ่มสามจุดส่วนกลาง
import { MenuManagementCreate } from './menuManagementCreate'
import { MenuManagementEdit } from './menuManagementEdit' // 🟢 อิมพอร์ต Dialog ตัวแก้ไขข้อ 2
import { Plus } from 'lucide-react'
import * as Icons from 'lucide-react'

interface MenuManagementIndexProps {
  userEmail: string
}

export function MenuManagementIndex({ userEmail }: MenuManagementIndexProps) {
  const [allMenus, setAllMenus] = useState<MenuItemDTO[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false) // สวิตช์เปิดปิดโมดอลแก้ไข
  const [selectedMenu, setSelectedMenu] = useState<MenuItemDTO | null>(null) // รหัสเมนูตัวที่ถูกเลือกกด

  async function loadMenus() {
    setLoading(true)
    const data = await menuService.getAllMenus()
    setAllMenus(data)
    setLoading(false)
  }

  useEffect(() => {
    loadMenus()
  }, [])

  const handleActionSuccess = () => {
    setIsCreateOpen(false)
    setIsEditOpen(false)
    setSelectedMenu(null)
    loadMenus()
    // บังคับรีเฟรชหน้าต่างเพื่อให้เมนูนำทางฝั่งซ้ายอัปเดตตามทันที
    window.location.reload()
  }

  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName]
    return LucideIcon ? <LucideIcon size={16} className="text-slate-400 shrink-0" /> : <Icons.HelpCircle size={16} />
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* TOP BAR / HEADER CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">⚙️ ระบบจัดการหน้าต่างนำทาง (Dynamic UI Controller)</h1>
          <p className="text-sm text-slate-500 mt-0.5">ผู้ควบคุมสิทธิ์: {userEmail} | ตรวจสอบสิทธิ์และปรับแก้จัดลำดับหน้าเว็บ</p>
        </div>
        
        <CustomButton 
          onClick={() => setIsCreateOpen(true)} 
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-md rounded-xl font-bold gap-2 px-4 h-11 cursor-pointer text-xs"
        >
          <Plus size={16} />
          <span>เพิ่มหน้าระบบงานใหม่</span>
        </CustomButton>
      </div>

      {/* 📋 SMART DATA TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden p-1">
        <CustomDataTable
          columns={[
            { header: 'ลำดับการแสดง', accessorKey: 'sort_order', sortable: true },
            { header: 'ชื่อหน้าเว็บระบบ', accessorKey: 'label', sortable: true },
            { header: 'กลุ่มเซกชันจัดหมวด', accessorKey: 'group_name', sortable: true },
            { header: 'ไอคอน (Lucide)', accessorKey: 'icon', sortable: false },
            { header: 'เส้นทางลิงก์ปลายทาง', accessorKey: 'href', sortable: false },
            { header: 'สถานะระบบ', accessorKey: 'status', sortable: true },
            { header: 'จัดการข้อมูล', accessorKey: 'actions', sortable: false }, // 🟢 เพิ่มคอลัมน์ปุ่มกดแก้ไข
          ]}
          data={allMenus}
          loading={loading}
          emptyMessage="ไม่พบพิกัดหน้าต่างระบบงานที่ลงทะเบียนในสารบัญข้อมูล"
          filterFields={[
            { key: 'label', label: 'ชื่อหน้าเว็บ', placeholder: 'ค้นหาชื่อหน้า เช่น ฝ่ายบุคคล...' },
            { key: 'group_name', label: 'กลุ่มเซกชัน', placeholder: 'เช่น MAIN, ADVANCED...' }
          ]}
          renderRow={(menu, runningIndex) => (
            <TableRow key={menu.id} className="hover:bg-slate-50/60 border-b border-slate-100 last:border-none transition-colors text-xs font-medium text-slate-600">
              <td className="px-6 py-4 font-bold text-slate-400 text-center">{menu.sort_order}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-sm">{menu.label}</td>
              <td className="px-6 py-4 text-slate-500">{menu.group_name}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg w-fit font-mono text-[10px]">
                  {renderIcon(menu.icon)}
                  <span>{menu.icon}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-blue-600 font-semibold">{menu.href}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  !menu.is_disabled 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${!menu.is_disabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {!menu.is_disabled ? 'เปิดใช้งาน' : 'ซ่อนเก็บไว้'}
                </span>
              </td>
              {/* 🟢 เรียกปุ่ม Dropdown สามจุดส่วนกลางเพื่อสั่งเปิดโมดอลแก้ไขข้อมูล */}
              <td className="px-6 py-4 text-sm text-right">
                <CustomActionDropdown 
                  onEdit={() => { setSelectedMenu(menu); setIsEditOpen(true); }}
                  onDelete={() => {}} // สามารถเว้นไว้หรือผูก Delete ต่อไปในอนาคตได้ครับ
                />
              </td>
            </TableRow>
          )}
        />
      </div>

      {/* 📥 DIALOG MANAGER SUB-MODULES */}
      <MenuManagementCreate 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={handleActionSuccess}
        nextSortOrder={allMenus.length + 1}
      />

      <MenuManagementEdit 
        isOpen={isEditOpen}
        menu={selectedMenu}
        onClose={() => { setIsEditOpen(false); setSelectedMenu(null); }}
        onSuccess={handleActionSuccess}
      />
    </div>
  )
}