'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CustomInputText } from '@/components/ui/custom-input-text'
import { CustomSelect } from '@/components/ui/custom-select'
import { CustomButton } from '@/components/ui/custom-button'
import { VehicleController } from '@/controller/vsms/VehicleController'
import { VehicleUIResponse } from '@/dto/vsms/frontend/VehicleResponse'
import { FrontendVehicleFormRequest } from '@/dto/vsms/frontend/VehicleRequest'

interface VehicleEditProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vehicleData: VehicleUIResponse | null
}

export const VehicleEdit: React.FC<VehicleEditProps> = ({ isOpen, onClose, onSuccess, vehicleData }) => {
  const [loading, setLoading] = useState(false)
  
  // 🟢 ปรับโครงสร้าง formData ให้ตรงเป๊ะตามมาตรฐานของ FrontendVehicleFormRequest
  const [formData, setFormData] = useState<FrontendVehicleFormRequest>({
    license: '',
    brand: '',
    model: '',
    status: 'available'
  })

  // ดึงข้อมูลจากยานพาหนะที่เลือกมากางไว้ในฟอร์มเมื่อโมดอลเปิดขึ้น
  useEffect(() => {
    if (vehicleData) {
      setFormData({
        license: vehicleData.license, // 🟢 ใช้ v.license ตามที่มีอยู่ในคลาส OOP DTO
        brand: vehicleData.brand,
        model: vehicleData.model,
        status: vehicleData.status
      })
    }
  }, [vehicleData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleData?.id) return

    setLoading(true)
    try {
      const result = await VehicleController.updateVehicle(vehicleData.id, formData)
      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล')
      }
    } catch (error) {
      console.error(error)
      alert('ระบบเชื่อมต่อหลังบ้านขัดข้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>📝 แก้ไขข้อมูลรถยนต์</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {/* 🟢 แกะค่าผ่าน e.target.value และผูกเข้าหาฟิลด์ license */}
          <CustomInputText
            label="ทะเบียนรถยนต์"
            value={formData.license}
            onChange={(e) => setFormData({ ...formData, license: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <CustomInputText
              label="ยี่ห้อ (Brand)"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            />
            <CustomInputText
              label="รุ่น (Model)"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          {/* 🟢 ซิงค์ป้ายตัวเลือก (Value) ให้ตรงกับฐานข้อมูล คือ available และ maintenance */}
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
            {/* 🟢 ปรับ variant ของปุ่มแก้ไขเป็น "default" ตามคลัง UI จริงของโปรเจกต์ */}
            <CustomButton variant="default" type="submit" loading={loading}>บันทึกการแก้ไข</CustomButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}