'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

interface CreateVehicleProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreateVehicle({ onSuccess, onCancel }: CreateVehicleProps) {
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
      onSuccess()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b pb-4">
        <Button variant="outline" size="sm" onClick={onCancel}>⬅️ กลับหน้ารายชื่อ</Button>
        <h1 className="text-xl font-bold">📥 เพิ่มรถยนต์คันใหม่เข้าระบบ</h1>
      </div>

      <form onSubmit={handleInsert} className="p-6 border rounded-xl bg-card shadow-sm grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">เลขทะเบียนรถ</label>
          <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="เช่น กข 1234" className="w-full px-3 py-2 border rounded-md text-sm bg-background" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">ยี่ห้อ (Brand)</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="เช่น Toyota" className="w-full px-3 py-2 border rounded-md text-sm bg-background" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">รุ่น (Model)</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="เช่น Hilux Revo" className="w-full px-3 py-2 border rounded-md text-sm bg-background" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">สถานะรถยนต์</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-background">
            <option value="available">ใช้งานได้ (Available)</option>
            <option value="maintenance">กำลังซ่อมบำรุง (Maintenance)</option>
            <option value="busy">ติดงานขนส่ง (Busy)</option>
          </select>
        </div>
        <div className="md:col-span-2 flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white w-full md:w-auto">
            {isSubmitting ? 'กำลังบันทึก...' : '➕ บันทึกข้อมูลรถ'}
          </Button>
        </div>
      </form>
    </div>
  )
}