'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Truck, LayoutDashboard, LogOut, Fuel, Wrench } from 'lucide-react'

interface SidebarProps {
  email: string
}

export function Sidebar({ email }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname() // ใช้ตรวจสอบว่าปัจจุบันผู้ใช้เปิดอยู่หน้าไหน

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // 🔮 แหล่งรวมเมนู: คุณนันท์สามารถมาเพิ่ม-ลด หรือเปิดคอมเมนต์เมนูอื่น ๆ ตรงนี้ได้เลยในอนาคต!
  const menuItems = [
    {
      label: 'รายชื่อยานพาหนะ',
      icon: <LayoutDashboard size={18} />,
      href: '/',
      active: pathname === '/', // ไฮไลท์สีฟ้าออโต้เมื่ออยู่หน้านั้นจริง
    },
    /* 🚚 ตัวอย่างการเพิ่มเมนูใหม่ในอนาคต:
    {
      label: 'ระบบบันทึกการเติมน้ำมัน',
      icon: <Fuel size={18} />,
      href: '/refuel',
      active: pathname === '/refuel',
    },
    {
      label: 'รายงานการซ่อมบำรุง',
      icon: <Wrench size={18} />,
      href: '/maintenance',
      active: pathname === '/maintenance',
    },
    */
  ]

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-200 flex flex-col justify-between p-5 hidden md:flex shrink-0">
      <div className="space-y-6">
        
        {/* LOGO BRAND */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <Truck size={20} />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">TMS SYSTEM</span>
        </div>
        
        {/* NAVIGATION MENUS MAP */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left border border-transparent ${
                item.active
                  ? 'bg-slate-900 text-blue-400 border-slate-800/80 shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* USER PROFILE & LOGOUT BUTTON */}
      <div className="border-t border-slate-800 pt-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-blue-400 border border-slate-700 uppercase">
            {email ? email.charAt(0) : 'U'}
          </div>
          <div className="text-xs min-w-0 flex-1">
            <p className="font-medium text-slate-300 truncate">{email}</p>
            <p className="text-slate-500">ผู้ดูแลระบบ</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 h-10 text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded-xl transition-colors border border-transparent hover:border-rose-900/50 cursor-pointer"
        >
          <LogOut size={14} />
          <span>ออกจากระบบ</span>
        </Button>
      </div>
    </aside>
  )
}