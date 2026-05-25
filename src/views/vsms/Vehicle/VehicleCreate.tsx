'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CustomInputText } from '@/components/ui/custom-input-text'
import { CustomSelect } from '@/components/ui/custom-select'
import { CustomButton } from '@/components/ui/custom-button'
import { VehicleController } from '@/controller/vsms/VehicleController'
import { FrontendVehicleFormRequest } from '@/dto/vsms/frontend/VehicleRequest'

interface VehicleCreateProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const VehicleCreate: React.FC<VehicleCreateProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<FrontendVehicleFormRequest>({
    license: '',
    brand: '',
    model: '',
    status: 'available'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await VehicleController.createVehicle(formData)
      if (result.success) {
        onSuccess()
        onClose()
        setFormData({ license: '', brand: '', model: '', status: 'available' })
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (error) {
      console.error(error)
      alert('ระบบเชื่อมต่อฐานข้อมูลขัดข้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>🚛 เพิ่มข้อมูลรถยนต์ใหม่</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {/* 🟢 ปรับ onChange แกะค่า e.target.value เพื่อให้ตรงสเปกคอมโพเนนต์เดิม */}
          <CustomInputText
            label="ทะเบียนรถยนต์"
            placeholder="เช่น 5กภ 9588"
            value={formData.license}
            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomInputText
              label="ยี่ห้อ (Brand)"
              placeholder="เช่น Honda, Toyota"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
            <CustomInputText
              label="รุ่น (Model)"
              placeholder="ระบุรุ่นรถ เช่น PCX"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          {/* 🟢 ปรับ onChange ฝั่ง Select แกะค่า e.target.value เช่นเดียวกัน */}
          <CustomSelect
            label="สถานะการใช้งานระบบ"
            options={[
              { value: 'available', label: 'ว่างปฏิบัติงาน (Available)' },
              { value: 'maintenance', label: 'อยู่ในระหว่างซ่อมบำรุง (Maintenance)' }
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <CustomButton variant="outline" onClick={onClose} type="button">ยกเลิก</CustomButton>
            {/* 🟢 ปรับ variant ของปุ่มบันทึกเป็น "default" ตามคลัง UI จริงของโปรเจกต์ */}
            <CustomButton variant="default" type="submit" loading={loading}>บันทึกข้อมูล</CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}