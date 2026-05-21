'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { VehicleResponseDTO } from '@/dto/vehicle'

interface EditVehicleProps {
  isOpen: boolean
  vehicle: VehicleResponseDTO | null
  onClose: () => void
  onSuccess: () => void
}

export function EditVehicle({ isOpen, vehicle, onClose, onSuccess }: EditVehicleProps) {
  const [license, setLicense] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  
  // 🟢 1. ปรับสเตตัสรองรับค่า null ร่วมกับ Shadcn Select ได้อย่างราบรื่น
  const [status, setStatus] = useState<string | null>('available')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ดึงค่าเดิมของรถคันที่กดเลือกมาใส่ในฟอร์มทันทีก่อนทำการแก้ไข
  useEffect(() => {
    if (vehicle) {
      setLicense(vehicle.license)
      setBrand(vehicle.brand || '')
      setModel(vehicle.model || '')
      setStatus(vehicle.status || 'available')
    }
  }, [vehicle])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('vehicles')
      .update({ 
        license, 
        brand, 
        model, 
        status: status ?? 'available' 
      })
      .eq('id', vehicle.id)

    if (error) {
      alert(error.message)
    } else {
      alert('อัปเดตข้อมูลเรียบร้อย!')
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>📝 แก้ไขข้อมูลยานพาหนะ</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
          
          {/* 🟢 ฟิลด์กรอกข้อมูลที่นำกลับมาใส่ให้อย่างครบถ้วน */}
          <div className="space-y-1">
            <label className="text-sm font-medium">เลขทะเบียนรถ</label>
            <Input 
              value={license} 
              onChange={(e) => setLicense(e.target.value)} 
              placeholder="เช่น 5กภ 9588" 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">ยี่ห้อ (Brand)</label>
            <Input 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)} 
              placeholder="เช่น Honda" 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">รุ่น (Model)</label>
            <Input 
              value={model} 
              onChange={(e) => setModel(e.target.value)} 
              placeholder="เช่น PCX 2025" 
              required 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">สถานะรถยนต์</label>
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
              {isSubmitting ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}