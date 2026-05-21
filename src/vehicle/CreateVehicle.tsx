'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface CreateVehicleProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateVehicle({ isOpen, onClose, onSuccess }: CreateVehicleProps) {
  const [license, setLicense] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  
  // 🟢 1. ปรับ State ตรงนี้ให้รองรับ string | null ได้อย่างสมบูรณ์แบบตามที่ Shadcn ต้องการ
  const [status, setStatus] = useState<string | null>('available')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!license || !brand || !model) return alert('กรุณากรอกข้อมูลให้ครบครับ')

    setIsSubmitting(true)
    
    const { error } = await supabase
      .from('vehicles')
      .insert([{ 
        license, 
        brand, 
        model, 
        status: status ?? 'available' // 🟢 ป้องกันกรณีหลุดเป็น null ตอนลง Database (Fallback ค่าเริ่มต้นไว้)
      }])

    if (error) {
      alert(error.message)
    } else {
      alert('บันทึกข้อมูลเรียบร้อย!')
      setLicense('')
      setBrand('')
      setModel('')
      setStatus('available')
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>📥 เพิ่มยานพาหนะคันใหม่</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleInsert} className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">เลขทะเบียนรถ</label>
            <Input value={license} onChange={(e) => setLicense(e.target.value)} placeholder="เช่น 5กภ 9588" required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">ยี่ห้อ (Brand)</label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="เช่น Honda" required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">รุ่น (Model)</label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="เช่น PCX 2025" required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">สถานะรถยนต์</label>
            
            {/* 🟢 2. ตอนนี้ค่าสเตตัสพ่นใส่ onValueChange={setStatus} ได้ตรง ๆ เลย ตัวแดง ts(2322) จะหายไปทันที */}
            <Select value={status ?? undefined} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">ใช้งานได้ (Available)</SelectItem>
                <SelectItem value="maintenance">กำลังซ่อมบำรุง (Maintenance)</SelectItem>
                <SelectItem value="busy">ติดงานขนส่ง (Busy)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>ยกเลิก</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังบันทึก...' : '➕ บันทึกข้อมูล'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}