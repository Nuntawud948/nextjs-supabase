'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/structure/sidebar'
import { Button } from '@/components/ui/button'
import { 
  Truck, 
  Users, 
  ShieldAlert, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Layers 
} from 'lucide-react'

// 🟢 แยกเนื้อหาของ Dashboard ออกมาเพื่อให้ใช้ useSearchParams() ภายใต้ Suspense ได้อย่างปลอดภัยตามกฎ Next.js
function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')

  // ดึงค่าสเตทของ Tab จาก URL (?tab=vsms หรือ ?tab=hrms) ค่าเริ่มต้นจะเป็น vsms
  const activeTab = searchParams.get('tab') || 'vsms'

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

  const handleTabChange = (tabName: string) => {
    router.push(`/?tab=${tabName}`)
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">กำลังตรวจสอบสิทธิ์หน้าหลัก...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 font-sans w-full">
      {/* Sidebar โครงร่างเดิมของคุณนันท์ */}
      <Sidebar email={email} />

      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">📊 Executive Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">ยินดีต้อนรับ: {email} | ศูนย์รวมการวิเคราะห์ข้อมูลและสถิติภาพรวมองค์กร</p>
          </div>
          
          {/* ปุ่มทางลัดวิ่งไปหน้าจัดการเมนูหลักระบบ */}
          <Button 
            onClick={() => router.push('/menus')} 
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs rounded-xl font-medium gap-2 px-4 h-11 cursor-pointer text-xs"
          >
            <Layers size={16} />
            <span>จัดการระบบเมนู</span>
          </Button>
        </div>

        {/* ⚙️ NAVIGATION TABBAR (สลับสเตทด้วย URL ไม่กระพริบตา) */}
        <div className="flex border-b border-slate-200 bg-slate-200/60 p-1 rounded-xl w-fit gap-1">
          <button
            onClick={() => handleTabChange('vsms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vsms'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck size={15} />
            <span>ระบบยานพาหนะ (VSMS)</span>
          </button>
          
          <button
            onClick={() => handleTabChange('hrms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hrms'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={15} />
            <span>ระบบบริหารบุคคล (HRMS)</span>
          </button>
        </div>

        {/* 📊 BENTO GRID CONTENT */}
        {activeTab === 'vsms' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* กล่อง Bento 3 ช่องบน */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ยานพาหนะทั้งหมด</p>
                  <p className="text-3xl font-black text-slate-900">12 คัน</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Truck size={22} /></div>
              </div>
              
              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">พร้อมปฏิบัติงาน</p>
                  <p className="text-3xl font-black text-emerald-600">10 คัน</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={22} /></div>
              </div>

              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">อยู่ระหว่างซ่อมบำรุง</p>
                  <p className="text-3xl font-black text-rose-600">2 คัน</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={22} /></div>
              </div>
            </div>

            {/* กล่องใหญ่ Bento สถิติกราฟและปุ่ม Link */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs min-h-[250px] flex flex-col justify-center items-center text-center text-slate-400 space-y-2">
                <BarChart3 size={36} className="text-slate-300" />
                <p className="text-sm font-bold text-slate-700">สถิติอัตราสิ้นเปลืองน้ำมันเชื้อเพลิงของยานพาหนะ</p>
                <p className="text-xs max-w-sm">พื้นที่เตรียมพล็อตสถิติกราฟความสัมพันธ์ของระบบเติมน้ำมันและ維護รายงานเร็ว ๆ นี้</p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">เข้าสู่พื้นที่ทำงาน VSMS</h3>
                  <p className="text-xs text-blue-100/80 leading-relaxed">
                    จัดการข้อมูลรถยนต์ คัดกรอง ค้นหาสถานะ และบันทึกประวัติการบำรุงรักษาอย่างเต็มรูปแบบผ่านระบบสถาปัตยกรรมใหม่
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/vsms/vehicle')} 
                  className="bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl text-xs w-full gap-2 mt-4 shadow-sm h-10 cursor-pointer"
                >
                  <span>เปิดตารางจัดการรถยนต์</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* กล่อง Bento 3 ช่องบนฝั่ง HRMS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">พนักงานขับรถทั้งหมด</p>
                  <p className="text-3xl font-black text-slate-900">24 คน</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={22} /></div>
              </div>

              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Duty (กำลังเดินรถ)</p>
                  <p className="text-3xl font-black text-amber-600">15 คน</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp size={22} /></div>
              </div>

              <div className="bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">สแตนด์บาย / ลางาน</p>
                  <p className="text-3xl font-black text-slate-500">9 คน</p>
                </div>
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Users size={22} /></div>
              </div>
            </div>

            {/* กล่องสรุปวิเคราะห์ฝั่งบุคคล */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white p-6 border border-slate-200/60 rounded-2xl shadow-xs min-h-[250px] flex flex-col justify-center items-center text-center text-slate-400 space-y-2">
                <BarChart3 size={36} className="text-slate-300" />
                <p className="text-sm font-bold text-slate-700">ดัชนีประสิทธิภาพรอบเวลาพนักงานขับรถ (HR KPI)</p>
                <p className="text-xs max-w-sm">พื้นที่วิเคราะห์เวลาตีเที่ยวเฉลี่ยและคะแนนพฤติกรรมการขับขี่ของบุคคลเร็ว ๆ นี้</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white flex flex-col justify-between shadow-md">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">เข้าสู่พื้นที่ทำงาน HRMS</h3>
                  <p className="text-xs text-indigo-100/80 leading-relaxed">
                    จัดการข้อมูลพนักงานบุคคล หน่วยธุรกิจ สิทธิ์การเข้าถึง และสถิติการลงเวลาปฏิบัติหน้าที่ของผู้ขับรถส่วนกลาง
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/humanresource')} 
                  className="bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs w-full gap-2 mt-4 shadow-sm h-10 cursor-pointer"
                >
                  <span>เปิดระบบบริหารพนักงาน</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 🟢 ตัวครอบหลักส่งออกไฟล์หน้าแรกสุด (Root Page Wrapper) พ่วงด้วย Suspense กันการแครชตอนอ่าน URL Params
export default function RootDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">กำลังโหลดสถาปัตยกรรมหน้าแรก...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}