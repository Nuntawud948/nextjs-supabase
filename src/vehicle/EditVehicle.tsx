'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CustomButton } from '@/components/ui/custom-button'
import { CustomInputText } from '@/components/ui/custom-input-text'
import { CustomSelect } from '@/components/ui/custom-select'
import { CustomDialog } from '@/components/structure/custom-dialog'
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
  const [status, setStatus] = useState('available')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ดึงค่าเดิมของรถคันที่กดเลือกมาใส่ในฟอร์มทันทีก่อนแก้ไข
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
      .update({ license, brand, model, status })
      .eq('id', vehicle.id)

    if (error) {
      alert(error.message)
    } else {
      alert('อัปเดตข้อมูลรถยนต์เรียบร้อย!')
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose} title="📝 แก้ไขข้อมูลยานพาหนะ">
      <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-2">
        <CustomInputText label="เลขทะเบียนรถ" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="เช่น กข 1234" required />
        <CustomInputText label="ยี่ห้อ (Brand)" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="เช่น Toyota" required />
        <CustomInputText label="รุ่น (Model)" value={model} onChange={(e) => setModel(e.target.value)} placeholder="เช่น Hilux Revo" required />
        <CustomSelect 
          label="สถานะรถยนต์"
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'available', label: 'ใช้งานได้ (Available)' },
            { value: 'maintenance', label: 'กำลังซ่อมบำรุง (Maintenance)' },
            { value: 'busy', label: 'ติดงานขนส่ง (Busy)' }
          ]}
        />
        <div className="md:col-span-2 flex justify-end pt-4 space-x-2">
          <CustomButton type="button" variant="outline" onClick={onClose}>ยกเลิก</CustomButton>
          <CustomButton type="submit" loading={isSubmitting}>💾 บันทึกการแก้ไข</CustomButton>
        </div>
      </form>
    </CustomDialog>
  )
}