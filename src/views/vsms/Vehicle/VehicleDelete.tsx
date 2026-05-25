'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CustomButton } from '@/components/ui/custom-button'
import { VehicleController } from '@/controller/vsms/VehicleController'
import { VehicleUIResponse } from '@/dto/vsms/frontend/VehicleResponse'

interface VehicleDeleteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vehicleData: VehicleUIResponse | null // 🟢 ปรับมารับวัตถุตัวรถจากหน้าหลักตรงๆ เหมือนหน้า Edit
}

export const VehicleDelete: React.FC<VehicleDeleteProps> = ({ isOpen, onClose, onSuccess, vehicleData }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!vehicleData?.id) return
    
    setLoading(true)
    try {
      const result = await VehicleController.deleteVehicle(vehicleData.id)
      if (result.success) {
        onSuccess()
        onClose()
      } else {
        alert(result.error || 'ไม่สามารถลบข้อมูลได้')
      }
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 font-bold flex items-center gap-2">
            ⚠️ ยืนยันการลบข้อมูล
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-2 text-center">
          <p className="text-xs font-medium text-slate-500">คุณต้องการลบข้อมูลรถยนต์ทะเบียน</p>
          <p className="text-lg font-black text-slate-800 bg-slate-100 py-2.5 px-4 rounded-xl border border-slate-200/60 inline-block min-w-[200px]">
            {vehicleData?.license || '---'}
          </p>
          <p className="text-[11px] text-rose-500 font-bold mt-1">*การดำเนินการนี้จะลบข้อมูลออกจากระบบถาวรและไม่สามารถย้อนกลับได้</p>
        </div>
        
        <div className="flex justify-center gap-2 pt-2 border-t border-slate-100">
          <CustomButton variant="outline" onClick={onClose} type="button">
            ยกเลิก
          </CustomButton>
          {/* 🟢 ใช้ variant="destructive" ตามคลังปุ่มของโปรเจกต์สำหรับปุ่มลบสีแดง */}
          <CustomButton variant="destructive" onClick={handleDelete} loading={loading}>
            ยืนยันลบข้อมูล
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}