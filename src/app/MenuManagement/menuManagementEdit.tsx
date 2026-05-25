'use client'

import React, { useState, useEffect } from 'react'
import { menuService } from '@/services/menuService'
import { CustomButton } from '@/components/ui/custom-button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { Edit, HelpCircle } from 'lucide-react'
import { MenuItemDTO } from '@/dto/menu'

interface MenuManagementEditProps {
  isOpen: boolean
  menu: MenuItemDTO | null
  onClose: () => void
  onSuccess: () => void
}

export function MenuManagementEdit({ isOpen, menu, onClose, onSuccess }: MenuManagementEditProps) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<MenuItemDTO>({
    label: '',
    icon: 'LayoutDashboard',
    href: '/',
    group_name: 'เมนูหลัก (MAIN)',
    sort_order: 1,
    is_disabled: false
  })

  // 🟢 ดึงข้อมูลเมนูตัวที่จะแก้ไขมาหยอดลงฟอร์มทันทีกดเปิด Dialog
  useEffect(() => {
    if (isOpen && menu) {
      setFormData({
        label: menu.label,
        icon: menu.icon,
        href: menu.href,
        group_name: menu.group_name,
        sort_order: menu.sort_order,
        is_disabled: menu.is_disabled
      })
    }
  }, [isOpen, menu])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!menu?.id) return
    if (!formData.label || !formData.href) {
      alert('กรุณากรอกหัวข้อเมนูและลิงก์เชื่อมโยงให้ครบถ้วนครับ')
      return
    }

    setSubmitting(true)
    const result = await menuService.updateMenu(menu.id, formData) // 🚀 ยิงอัปเดตผ่านหลังบ้าน
    setSubmitting(false)

    if (result.success) {
      alert('🎉 อัปเดตโครงสร้างระบบนำทางเรียบร้อยแล้วครับ!')
      onSuccess()
    } else {
      alert(`🚨 เกิดข้อผิดพลาด: ${result.error}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border border-slate-100 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="flex flex-row items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Edit size={20} />
          </div>
          <div className="text-left">
            <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
              แก้ไขข้อมูลหน้าเว็บระบบ
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              ปรับปรุงเส้นทางระบบนำทาง ชื่อเมนู หรือการจัดลำดับแถวบนแดชบอร์ด
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">ชื่อเมนูที่ต้องการแสดง (Label)</label>
            <Input 
              type="text" 
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="rounded-xl border-slate-200 text-sm h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">ลิงก์ปลายทาง URL Path (Href)</label>
            <Input 
              type="text" 
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              className="rounded-xl border-slate-200 text-sm h-11 font-mono text-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">ชื่อไอคอนระบบ (Lucide Icon Name)</label>
            <Input 
              type="text" 
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="rounded-xl border-slate-200 text-sm h-11 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">กลุ่มประเภทเมนู (Group Name)</label>
            <select 
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="เมนูหลัก (MAIN)">เมนูหลัก (MAIN)</option>
              <option value="ระบบบริหาร (MANAGEMENT)">ระบบบริหาร (MANAGEMENT)</option>
              <option value="ฟีเจอร์อนาคต (ADVANCED)">ฟีเจอร์อนาคต (ADVANCED)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">ลำดับการแสดงผล (Sort Order)</label>
              <Input 
                type="number" 
                min="1"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="rounded-xl border-slate-200 text-sm h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500">สถานะระบบ</label>
              <select 
                value={formData.is_disabled ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_disabled: e.target.value === 'true' })}
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="false">🔓 เปิดใช้งานปกติ</option>
                <option value="true">🔒 ซ่อนปิดใช้งาน</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-50 mt-4 flex gap-2 sm:gap-0">
            <CustomButton 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl h-11 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50"
            >
              ยกเลิก
            </CustomButton>
            <CustomButton 
              type="submit" 
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 px-5 text-xs font-bold shadow-md shadow-amber-500/10"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </CustomButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}