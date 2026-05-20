'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { VehicleResponseDTO } from '@/dto/vehicle'

export default function HomePage() {
  const [vehicles, setVehicles] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  // 🔐 STATE สำหรับระบบ AUTHENTICATION (เริ่มพาร์ท 3.1 ใหม่)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // ฟังก์ชันดึงข้อมูลรถยนต์คันเดิมจาก Supabase
  async function fetchVehicles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vehicles:', error.message)
    } else if (data) {
      setVehicles(data)
    }
    setLoading(false)
  }

  // ดึงข้อมูลรถยนต์เฉพาะตอนที่ผ่านการล็อกอินแล้วเท่านั้น
  useEffect(() => {
    if (isLoggedIn) {
      fetchVehicles()
    }
  }, [isLoggedIn])

  // 🚀 ฟังก์ชันจัดการการกดปุ่มเข้าสู่ระบบ (Login Logic)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วนครับ')
      return
    }

    setAuthLoading(true)
    
    // 💡 สเต็ปนี้เราจำลองเวลาการตรวจสอบสิทธิ์สั้น ๆ (เดี๋ยวเราค่อยเชื่อมกับ Supabase Auth ในอนาคต)
    setTimeout(() => {
      setIsLoggedIn(true)
      setAuthLoading(false)
    }, 600)
  }

  // 🚪 ฟังก์ชันออกจากระบบ (Logout)
  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
  }

  // 🛑 VIEW ที่ 1: หน้าฟอร์มล็อกอิน (แสดงเมื่อยังไม่ได้เข้าสู่ระบบ)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md p-6 border rounded-xl shadow-lg bg-card text-card-foreground">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">🚚 ระบบจัดการยานพาหนะ (TMS)</h1>
            <p className="text-sm text-gray-500">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลในระบบ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">อีเมลผู้ใช้งาน (Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tms.com"
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">รหัสผ่าน (Password)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button type="submit" disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {authLoading ? 'กำลังตรวจสอบสิทธิ์...' : '🔑 เข้าสู่ระบบ'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // 🛑 VIEW ที่ 2: หน้า Dashboard หลัก (แสดงผลเมื่อล็อกอินสำเร็จแล้ว)
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">ระบบจัดการยานพาหนะ (TMS)</h1>
          <p className="text-xs text-green-600 font-medium">● ผู้ใช้งาน: {email}</p>
        </div>
        
        <Button variant="destructive" onClick={handleLogout}>
          🚪 ออกจากระบบ
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📊 รายชื่อรถยนต์ในระบบปัจจุบัน</h2>
          <Button variant="outline" size="sm" onClick={fetchVehicles}>รีเฟรชข้อมูล</Button>
        </div>
        
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
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-lg text-blue-600">{vehicle.license}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'maintenance' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.status === 'available' ? 'ว่าง' :
                     vehicle.status === 'maintenance' ? 'ซ่อมบำรุง' : 'ติดงาน'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">ยี่ห้อ: {vehicle.brand} | รุ่น: {vehicle.model}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}