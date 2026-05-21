'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 🟢 1. อิมพอร์ตกลุ่ม Shadcn UI Components แท้ ๆ ให้ครบถ้วน
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// 🟢 2. อิมพอร์ตกลุ่มฟีเจอร์แยกชิ้นส่วน Modals จากโฟลเดอร์ภายนอก
import { CreateVehicle } from '@/vehicle/CreateVehicle'
import { EditVehicle } from '@/vehicle/EditVehicle'
import { DeleteVehicle } from '@/vehicle/DeleteVehicle'
import { VehicleResponseDTO } from '@/dto/vehicle'

export default function HomePage() {
  const router = useRouter()
  
  // 💾 State เก็บรายการรถยนต์เดี่ยว (อิงตามตัวแปรของคุณนันท์ที่ชื่อ vehicle)
  const [vehicle, setVehicle] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  // 🔄 3. ประกาศกลุ่มสเตตัสสำหรับควบคุมหน้าต่าง Dialog บรรจุอยู่ภายในฟังก์ชันหลักให้ถูกต้อง
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponseDTO | null>(null)

  // 🔐 ฟังก์ชันตรวจเซสชันสิทธิ์ล็อกอินจากคลาวด์ Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setEmail(user.email || '')
        fetchVehicles()
      }
    }
    checkUser()
  }, [router])

  // 🔄 ดึงข้อมูลตารางเรียลไทม์
  async function fetchVehicles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching vehicles:', error.message)
    else if (data) setVehicle(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!email) {
    return <p className="p-8 text-center text-sm text-gray-500">กำลังตรวจสอบสิทธิ์การเข้าถึงระบบ...</p>
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* SIDEBAR MAIN MENU */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between p-4 hidden md:flex">
        <div className="space-y-6">
          <div className="text-xl font-bold tracking-wider text-blue-400 border-b border-slate-700 pb-4">
            🚚 TMS DASHBOARD
          </div>
          <nav className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white">
              📊 รายชื่อยานพาหนะ
            </button>
          </nav>
        </div>
        
        <div className="border-t border-slate-700 pt-4 space-y-2">
          <div className="text-xs text-slate-400 truncate">👤 {email}</div>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full text-xs">
            🚪 ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* MAJOR CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">📊 ระบบจัดการยานพาหนะ</h1>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 text-white">
              ➕ เพิ่มข้อมูลรถยนต์
            </Button>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">กำลังดึงข้อมูลจาก Supabase...</p>
          ) : vehicle.length === 0 ? (
            <div className="p-12 text-center border border-dashed rounded-xl text-gray-500 bg-white">
              ยังไม่มีข้อมูลรถยนต์ในระบบ
            </div>
          ) : (
            /* 🚀 4. ส่วนจัดแสดงผลตาราง Shadcn UI แท้แบบไร้รอยต่อ */
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ทะเบียนรถ</TableHead>
                    <TableHead>ยี่ห้อ</TableHead>
                    <TableHead>รุ่น</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการข้อมูล</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicle.map((v) => (
                    <TableRow key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <TableCell className="font-medium text-slate-900">{v.license}</TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          v.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {v.status === 'available' ? 'ว่าง' : 'ซ่อมบำรุง'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => { setSelectedVehicle(v); setIsEditOpen(true); }}
                        >
                          📝 แก้ไข
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => { setSelectedVehicle(v); setIsDeleteOpen(true); }}
                        >
                          🗑️ ลบ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 📥 5. DIALOG MANAGER SECTION (เรียกใช้จากข้างนอก feature/vehicle) */}
        {/* ======================================================== */}
        
        {/* กล่องเปิด Dialog เพิ่มรถคันใหม่ */}
        <CreateVehicle 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
          onSuccess={() => { fetchVehicles(); setIsCreateOpen(false); }} 
        />

        {/* กล่องเปิด Dialog แก้ไขข้อมูลรถยนต์ */}
        <EditVehicle 
          isOpen={isEditOpen} 
          vehicle={selectedVehicle} 
          onClose={() => { setIsEditOpen(false); setSelectedVehicle(null); }} 
          onSuccess={() => { fetchVehicles(); setIsEditOpen(false); setSelectedVehicle(null); }} 
        />

        {/* กล่องเปิด Dialog ยืนยันการลบรถยนต์ออกจากระบบ */}
        <DeleteVehicle 
          isOpen={isDeleteOpen} 
          vehicleId={selectedVehicle?.id || null} 
          license={selectedVehicle?.license || null} 
          onClose={() => { setIsDeleteOpen(false); setSelectedVehicle(null); }} 
          onSuccess={() => { fetchVehicles(); setIsDeleteOpen(false); setSelectedVehicle(null); }} 
        />

      </main>
    </div>
  )
}