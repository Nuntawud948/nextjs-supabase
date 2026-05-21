'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CustomButton } from '@/components/ui/custom-button'
import { CustomInputText } from '@/components/ui/custom-input-text'
import { CustomSelect } from '@/components/ui/custom-select'
import { CustomDialog } from '@/components/structure/custom-dialog'

interface CreateVehicleProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateVehicle({ isOpen, onClose, onSuccess }: CreateVehicleProps) {
  const [license, setLicense] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [status, setStatus] = useState('available')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInsert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!license || !brand || !model) return alert('กรุณากรอกข้อมูลให้ครบครับ')

    setIsSubmitting(true)
    const { error } = await supabase
      .from('vehicles')
      .insert([{ license, brand, model, status }])

    if (error) {
      alert(error.message)
    } else {
      alert('บันทึกข้อมูลรถยนต์เรียบร้อย!')
      setLicense('')
      setBrand('')
      setModel('')
      setStatus('available')
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <CustomDialog isOpen={isOpen} onClose={onClose} title="📥 เพิ่มยานพาหนะคันใหม่">
      <form onSubmit={handleInsert} className="grid gap-4 md:grid-cols-2">
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
          <CustomButton type="submit" loading={isSubmitting}>➕ บันทึกข้อมูลรถ</CustomButton>
        </div>
      </form>
    </CustomDialog>
  )
}