'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CustomButton } from '@/components/ui/custom-button'
import { CustomDataTable } from '@/components/structure/custom-data-table'

// 🟢 อิมพอร์ตกลุ่มฟีเจอร์แยกชิ้นส่วนจากโฟลเดอร์ภายนอกล่าสุด
import { CreateVehicle } from '@/vehicle/CreateVehicle'
import { EditVehicle } from '@/vehicle/EditVehicle'
import { DeleteVehicle } from '@/vehicle/DeleteVehicle'
import { VehicleResponseDTO } from '@/dto/vehicle'

export default function HomePage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  // 🔄 States สำหรับควบคุม Dialog ของแต่ละ Action
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  // 👤 เก็บรอบข้อมูลคันที่ถูกเลือก
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponseDTO | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else {
        setEmail(user.email || '')
        fetchVehicles()
      }
    }
    checkUser()
  }, [router])

  async function fetchVehicles() {
    setLoading(true)
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
    if (data) setVehicles(data)
    setLoading(false)
  }

  const tableHeaders = ['ทะเบียนรถ', 'ยี่ห้อ', 'รุ่น', 'สถานะ', 'จัดการข้อมูล']

  if (!email) return <p className="p-8 text-center text-sm">กำลังตรวจสอบสิทธิ์...</p>

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col p-4 hidden md:flex">
        <div className="text-xl font-bold tracking-wider text-blue-400 border-b border-slate-700 pb-4 mb-6">🚚 TMS SYSTEM</div>
        <nav className="flex-1 text-sm"><button className="w-full text-left px-3 py-2 rounded-md bg-blue-600 text-white font-medium">📊 รายชื่อยานพาหนะ</button></nav>
        <div className="border-t border-slate-700 pt-4">
          <div className="text-xs text-slate-400 mb-2 truncate">👤 {email}</div>
          <CustomButton variant="destructive" onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="w-full text-xs h-8">🚪 ออกจากระบบ</CustomButton>
        </div>
      </aside>

      {/* MAJOR CONTENT */}
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-slate-800">📊 ระบบจัดการยานพาหนะ</h1>
            <CustomButton onClick={() => setIsCreateOpen(true)}>➕ เพิ่มข้อมูลรถยนต์</CustomButton>
          </div>

          <CustomDataTable
            headers={tableHeaders}
            data={vehicles}
            loading={loading}
            renderRow={(vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{vehicle.license}</td>
                <td className="px-6 py-4">{vehicle.brand}</td>
                <td className="px-6 py-4">{vehicle.model}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${vehicle.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {vehicle.status === 'available' ? 'ว่าง' : 'ซ่อมบำรุง'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <CustomButton variant="outline" className="h-8 px-3 text-xs" onClick={() => { setSelectedVehicle(vehicle); setIsEditOpen(true); }}>📝 แก้ไข</CustomButton>
                  <CustomButton variant="destructive" className="h-8 px-3 text-xs" onClick={() => { setSelectedVehicle(vehicle); setIsDeleteOpen(true); }}>🗑️ ลบ</CustomButton>
                </td>
              </tr>
            )}
          />
        </div>

        {/* ======================================================== */}
        {/* 🚀 DIALOG MANAGER SECTION (แยกตัวเป็นเอกเทศไม่ปนกับเนื้อหาหลัก) */}
        {/* ======================================================== */}
        
        {/* ➕ Dialog เพิ่มข้อมูล */}
        <CreateVehicle isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => { fetchVehicles(); setIsCreateOpen(false); }} />

        {/* 📝 Dialog แก้ไขข้อมูล */}
        <EditVehicle isOpen={isEditOpen} vehicle={selectedVehicle} onClose={() => { setIsEditOpen(false); setSelectedVehicle(null); }} onSuccess={() => { fetchVehicles(); setIsEditOpen(false); setSelectedVehicle(null); }} />

        {/* 🗑️ Dialog ลบข้อมูล */}
        <DeleteVehicle isOpen={isDeleteOpen} vehicleId={selectedVehicle?.id || null} license={selectedVehicle?.license || null} onClose={() => { setIsDeleteOpen(false); setSelectedVehicle(null); }} onSuccess={() => { fetchVehicles(); setIsDeleteOpen(false); setSelectedVehicle(null); }} />

      </main>
    </div>
  )
}