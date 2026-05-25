'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { 
  Truck, 
  LayoutDashboard, 
  LogOut, 
  Fuel, 
  Wrench, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  disabled?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface SidebarProps {
  email: string
}

export function Sidebar({ email }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // 🟢 สวิตช์คุมสถานะการ เปิด (Full) / ปิด (Collapsed) ของสไลด์บาร์
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuGroups: MenuGroup[] = [
    {
      title: 'เมนูหลัก (MAIN)',
      items: [
        {
          label: 'รายชื่อยานพาหนะ',
          icon: <LayoutDashboard size={18} />,
          href: '/',
          active: pathname === '/',
        }
      ]
    },
    {
      title: 'ฟีเจอร์อนาคต (ADVANCED)',
      items: [
        {
          label: 'ระบบบันทึกเติมน้ำมัน',
          icon: <Fuel size={18} />,
          href: '#',
          disabled: true,
        },
        {
          label: 'รายงานซ่อมบำรุง',
          icon: <Wrench size={18} />,
          href: '#',
          disabled: true,
        }
      ]
    }
  ]

  return (
    // 💡 ปรับความกว้างให้ยืดหยุ่น (w-66 สลับเป็น w-20) พร้อมแอนิเมชันสไลด์สมูท ๆ ด้วย transition-all
    <aside className={`h-[calc(100vh-2rem)] my-4 ml-4 bg-slate-950/95 border border-slate-800/60 text-slate-200 flex flex-col justify-between p-4 hidden md:flex shrink-0 rounded-2xl shadow-xl shadow-slate-950/40 backdrop-blur-md relative transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-66'
    }`}>
      
      {/* 🎯 ปุ่มลูกศรเปิด/ปิด (Floating Edge Toggle Button) ลอยอยู่กึ่งกลางเส้นขอบขวาพอดี */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-slate-900 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center hover:text-white hover:border-slate-500 transition-all shadow-md z-50 cursor-pointer hover:scale-110"
        title={isCollapsed ? "ขยายแถบเมนู" : "ซ่อนแถบเมนู"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="space-y-7">
        
        {/* 🔮 BRAND LOGO */}
        <div className={`flex items-center gap-3 py-1.5 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20 group transition-transform duration-300 hover:scale-105 shrink-0">
            <Truck size={20} className="transition-transform duration-500 group-hover:rotate-12" />
          </div>
          
          {/* ซ่อนตัวหนังสือชื่อระบบทันทีเมื่อหดพับแถบเก็บ */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden animate-in fade-in duration-300">
              <span className="font-black tracking-wider text-base text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 truncate">
                TMS SYSTEM
              </span>
              <span className="text-[10px] text-blue-400/80 font-bold tracking-widest uppercase">
                V1.0 PRO
              </span>
            </div>
          )}
        </div>
        
        {/* 📋 LIST OF MENU GROUPS */}
        <div className="space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              {/* ซ่อนหัวข้อกลุ่มเมนูเมื่อหดแถบ */}
              <p className={`text-[10px] font-bold tracking-widest text-slate-500 uppercase transition-all duration-300 ${
                isCollapsed ? 'opacity-0 h-0 overflow-hidden hidden' : 'px-3 block'
              }`}>
                {group.title}
              </p>
              
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    disabled={item.disabled}
                    onClick={() => !item.disabled && router.push(item.href)}
                    className={`w-full flex items-center rounded-xl font-medium text-sm transition-all duration-300 group relative border border-transparent ${
                      isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                    } ${
                      item.active
                        ? 'bg-gradient-to-r from-blue-600/15 via-blue-600/5 to-transparent text-blue-400 border-blue-500/20 shadow-inner'
                        : item.disabled 
                          ? 'text-slate-600 opacity-50 cursor-not-allowed'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 cursor-pointer'
                    }`}
                    title={isCollapsed ? item.label : undefined} // ขึ้น Tooltip บอกชื่อเมนูตอนหดจอ
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`transition-transform duration-300 shrink-0 ${!item.disabled && 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                        {item.icon}
                      </div>
                      {/* ซ่อนตัวอักษรของเมนู */}
                      {!isCollapsed && <span className="truncate animate-in fade-in duration-300">{item.label}</span>}
                    </div>

                    {/* สัญลักษณ์ขีดบอกตำแหน่งหน้าปัจจุบัน */}
                    {item.active && (
                      <span className={`bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 absolute transition-all duration-300 ${
                        isCollapsed 
                          ? 'w-1 h-2 right-1 top-1/2 -translate-y-1/2' 
                          : 'w-1.5 h-5 right-0 top-1/2 -translate-y-1/2'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👤 USER ACCOUNT & LOGOUT BLOCK */}
      <div className={`bg-slate-900/40 border border-slate-900 rounded-xl transition-all duration-300 ${isCollapsed ? 'p-1.5 space-y-2' : 'p-3 space-y-3'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700/60 shadow-inner uppercase shrink-0">
            {email ? email.charAt(0) : 'U'}
          </div>
          
          {/* ซ่อนชื่อผู้ใช้งานระบบ */}
          {!isCollapsed && (
            <div className="text-xs min-w-0 flex-1 animate-in fade-in duration-300">
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <span className="truncate">{email.split('@')[0]}</span>
                <ShieldCheck size={12} className="text-blue-400 shrink-0" />
              </div>
              <p className="text-slate-500 text-[10px] truncate">{email}</p>
            </div>
          )}
        </div>
        
        {/* ปุ่มออกจากระบบ: ปรับเป็นปุ่มไอคอนสี่เหลี่ยมมินิมอลเมื่อย่อแถบ */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className={`w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-all border border-transparent hover:border-rose-500/20 cursor-pointer ${
            isCollapsed ? 'h-9 p-0' : 'h-9'
          }`}
          title={isCollapsed ? "ออกจากระบบ" : undefined}
        >
          <LogOut size={13} className="shrink-0" />
          {!isCollapsed && <span>ออกจากระบบ</span>}
        </Button>
      </div>
    </aside>
  )
}