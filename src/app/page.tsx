// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // 🚀 ใช้สำหรับดีดผู้ใช้กลับหน้า login
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { CreateVehicle } from '@/components/vehicle/CreateVehicle'
import { VehicleResponseDTO } from '@/dto/vehicle'

export default function HomePage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'create'>('list')
  const [email, setEmail] = useState('')

  // 🔐 ฟังก์ชันเช็กสถานะการล็อกอินจริงจากระบบ Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // 🛑 ถ้าตรวจสอบแล้วไม่มีประวัติผู้ใช้ล็อกอินค้างไว้ ให้ดีดไปหน้า /login ทันที
        router.push('/login')
      } else {
        setEmail(user.email || '')
        fetchVehicles()
      }
    }
    checkUser()
  }, [router])

  async function fetchVehicles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching vehicles:', error.message)
    else if (data) setVehicles(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // 🚪 ออกจากระบบเสร็จปุ๊บ ดีดกลับไปหน้าล็อกอินทันที
    router.push('/login')
  }

  // กำหนดหน้าจอระหว่างเช็ก Session สั้น ๆ
  if (!email) {
    return <p className="p-8 text-center text-sm text-gray-500">กำลังตรวจสอบสิทธิ์การเข้าถึงระบบ...</p>
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between p-4 hidden md:flex">
        <div className="space-y-6">
          <div className="text-xl font-bold tracking-wider text-blue-400 border-b border-slate-700 pb-4">
            🚚 TMS DASHBOARD
          </div>
          <nav className="space-y-1">
            <button onClick={() => setView('list')} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
              📊 รายชื่อยานพาหนะ
            </button>
            <button onClick={() => setView('create')} className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'create' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
              📥 เพิ่มรถยนต์คันใหม่
            </button>
          </nav>
        </div>
        
        <div className="border-t border-slate-700 pt-4 space-y-2">
          <div className="text-xs text-slate-400 truncate">👤 {email}</div>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full text-xs">🚪 ออกจากระบบ</Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        {view === 'create' ? (
          <CreateVehicle 
            onSuccess={() => {
              fetchVehicles()
              setView('list')
            }} 
            onCancel={() => setView('list')} 
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">📊 รายชื่อรถยนต์ในระบบ</h1>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setView('create')} className="bg-blue-600 text-white md:hidden">➕ เพิ่มรถ</Button>
                <Button variant="outline" size="sm" onClick={fetchVehicles}>🔄 รีเฟรชข้อมูล</Button>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-500 text-sm">กำลังดึงข้อมูลจาก Supabase...</p>
            ) : vehicles.length === 0 ? (
              <div className="p-12 text-center border border-dashed rounded-xl text-gray-500 bg-white">ยังไม่มีข้อมูลรถยนต์ในระบบ</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border rounded-xl shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-lg text-blue-600">{vehicle.license}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status === 'available' ? 'ว่าง' : 'ซ่อมบำรุง'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">ยี่ห้อ: {vehicle.brand} | รุ่น: {vehicle.model}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}