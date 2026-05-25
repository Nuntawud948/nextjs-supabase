'use client'

import React from 'react'
import { Users, Award, ShieldAlert, UserPlus } from 'lucide-react'

interface HRIndexProps {
  userEmail: string
}

export function HumanResourceIndex({ userEmail }: HRIndexProps) {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200/60 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">👥 ระบบจัดการบุคคล (Human Resource)</h1>
        <p className="text-sm text-slate-500 mt-0.5">ยินดีต้อนรับคุณ {userEmail} เข้าสู่ห้องควบคุมพนักงานและจัดตารางคนขับรถระบบ TMS</p>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">พนักงานขับรถทั้งหมด</span>
            <p className="text-3xl font-black text-slate-900">24 <span className="text-xs font-normal text-slate-400">คน</span></p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={22} /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ปฏิบัติงานอยู่ (On Duty)</span>
            <p className="text-3xl font-black text-emerald-600">18 <span className="text-xs font-normal text-slate-400">คน</span></p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={22} /></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ลางาน/สแตนด์บาย</span>
            <p className="text-3xl font-black text-amber-600">6 <span className="text-xs font-normal text-slate-400">คน</span></p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ShieldAlert size={22} /></div>
        </div>
      </div>

      {/* WORKSPACE AREA */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/60 text-center min-h-[260px] flex flex-col items-center justify-center space-y-3 shadow-xs">
        <div className="p-4 bg-slate-50 text-slate-400 rounded-full"><UserPlus size={32} /></div>
        <h3 className="text-base font-bold text-slate-800">พื้นที่พัฒนาฟังก์ชันทรัพยากรบุคคล</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          ระบบนำทางและฐานสถาปัตยกรรมใหม่ผูกติดเสร็จสมบูรณ์ร้อยเปอร์เซ็นต์แล้วครับ คุณนันท์สามารถเริ่มเชื่อมต่อ API หลังบ้านมาวนลูปแสดงรายชื่อตรงเซกชันนี้ต่อได้เลย!
        </p>
      </div>

    </div>
  )
}