// src/app/vsms/vehicle/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/structure/sidebar'
import { VehicleIndex } from '@/views/vsms/Vehicle/VehicleIndex'

export default function VsmsVehiclePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setEmail(user.email || '')
      }
    }
    checkUser()
  }, [router])

  // ช่วงที่กำลังโหลดเช็ก Session ให้แสดง UI รอแบบเนียน ๆ
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xs font-semibold text-slate-400 animate-pulse">กำลังเข้าสู่ระบบระบบจัดการยานพาหนะ...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 font-sans w-full">
      {/* 1. แสดงแถบเมนูด้านข้างตามสิทธิ์ของผู้ใช้งาน */}
      <Sidebar email={email} />

      {/* 2. โซนพื้นที่ทำงานหลักของหน้าตารางรถยนต์ */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
        <VehicleIndex userEmail={email} />
      </main>
    </div>
  )
}