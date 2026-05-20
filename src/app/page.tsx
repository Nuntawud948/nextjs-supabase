'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { VehicleResponseDTO } from '@/dto/vehicle'


export default function HomePage() {
  const [vehicles, setVehicles] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      // ดึงข้อมูลทั้งหมดจากตาราง vehicles
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')

      if (error) {
        console.error('Error fetching vehicles:', error)
      } else if (data) {
        setVehicles(data)
      }
      setLoading(false)
    }

    fetchVehicles()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">ระบบจัดการยานพาหนะ (TMS)</h1>
        <Button onClick={() => window.location.reload()}>รีเฟรชข้อมูล</Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">รายชื่อรถยนต์ในระบบ</h2>
        
        {loading ? (
          <p className="text-gray-500">กำลังโหลดข้อมูลจาก Supabase...</p>
        ) : vehicles.length === 0 ? (
          <div className="p-6 text-center border border-dashed rounded-lg text-gray-500">
            ยังไม่มีข้อมูลรถยนต์ในระบบ (ตารางว่างเปล่า)
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
                <div className="font-semibold text-lg text-blue-600">{vehicle.plate_number}</div>
                <div className="text-sm text-gray-600">ยี่ห้อ: {vehicle.brand} | รุ่น: {vehicle.model}</div>
                <div className="mt-2 text-xs inline-block px-2 py-1 rounded bg-secondary">
                  สถานะ: {vehicle.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}