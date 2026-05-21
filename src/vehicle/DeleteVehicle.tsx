'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CustomButton } from '@/components/ui/custom-button'
import { CustomDialog } from '@/components/structure/custom-dialog'

interface DeleteVehicleProps {
  isOpen: boolean
  vehicleId: string | null
  license: string | null
  onClose: () => void
  onSuccess: () => void
}

export function DeleteVehicle({ isOpen, vehicleId, license, onClose, onSuccess }: DeleteVehicleProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!vehicleId) return

    setIsDeleting(true)
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)

    if (error) {
      alert(`ลบไม่สำเร็จ: ${error.message}`)
    } else {
      alert('ลบข้อมูลยานพาหนะออกจากระบบแล้ว')
      onSuccess()
    }
    setIsDeleting(false)
  }

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose} title="⚠️ ยืนยันการลบข้อมูล">
      <div className="space-y-4 text-left">
        <p className="text-sm text-slate-600">
          คุณแน่ใจหรือไม่ว่าต้องการลบยานพาหนะทะเบียน <strong className="text-red-600">"{license}"</strong> คันนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div className="flex justify-end space-x-2 pt-2">
          <CustomButton variant="outline" onClick={onClose} disabled={isDeleting}>ยกเลิก</CustomButton>
          <CustomButton variant="destructive" loading={isDeleting} onClick={handleDelete}>🗑️ ยืนยันลบข้อมูล</CustomButton>
        </div>
      </div>
    </CustomDialog>
  )
}