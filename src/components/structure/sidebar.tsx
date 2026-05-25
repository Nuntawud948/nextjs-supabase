'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import * as Icons from 'lucide-react' 
import { menuService } from '@/services/menuService'
import { MenuItemDTO } from '@/dto/menu'

interface SidebarProps {
  email: string
}

export function Sidebar({ email }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [menus, setMenus] = useState<MenuItemDTO[]>([])

  // 🛡️ 1. กำหนดเงื่อนไขสิทธิ์ Admin (คุณนันท์สามารถเปลี่ยนเป็น Email ของคุณนันท์ หรือเช็ก Role จาก DB ได้ครับ)
  const isAdmin = email === 'nuntawud.sudjai@gmail.com' || email.includes('admin')

  useEffect(() => {
    async function loadNavigation() {
      const activeMenus = await menuService.getActiveMenus()
      setMenus(activeMenus)
    }
    loadNavigation()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName]
    return LucideIcon ? <LucideIcon size={18} /> : <Icons.HelpCircle size={18} />
  }

  const groupedMenus = menus.reduce((acc, item) => {
    if (!acc[item.group_name]) acc[item.group_name] = []
    acc[item.group_name].push(item)
    return acc
  }, {} as Record<string, MenuItemDTO[]>)

  return (
    <aside className={`h-[calc(100vh-2rem)] my-4 ml-4 bg-slate-950/95 border border-slate-800/60 text-slate-200 flex flex-col justify-between p-4 hidden md:flex shrink-0 rounded-2xl shadow-xl transition-all duration-300 relative ${
      isCollapsed ? 'w-20' : 'w-66'
    }`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-slate-900 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center hover:text-white transition-all z-50 cursor-pointer"
        title={isCollapsed ? "ขยายแถบเมนู" : "ซ่อนแถบเมนู"}
      >
        {isCollapsed ? <Icons.ChevronRight size={14} /> : <Icons.ChevronLeft size={14} />}
      </button>

      <div className="space-y-7 overflow-y-auto no-scrollbar flex-1">
        {/* LOGO */}
        <div className={`flex items-center gap-3 py-1.5 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shrink-0">
            <Icons.Truck size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-base text-white tracking-wider">TMS SYSTEM</span>
              <span className="text-[10px] text-blue-400 font-bold tracking-widest">DYNAMIC UI</span>
            </div>
          )}
        </div>
        
        {/* DYNAMIC MENUS LAYER */}
        <div className="space-y-6">
          {Object.entries(groupedMenus).map(([groupTitle, items]) => (
            <div key={groupTitle} className="space-y-2">
              {!isCollapsed && (
                <p className="text-[10px] font-bold tracking-widest text-slate-500 px-3 uppercase">
                  {groupTitle}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center rounded-xl font-medium text-sm transition-all duration-300 group relative ${
                        isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                      } ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">{renderIcon(item.icon)}</div>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {isActive && !isCollapsed && (
                        <span className="w-1.5 h-5 bg-blue-500 rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* 🔒 2. เซกชันพิเศษ: ตรวจสอบสิทธิ์ยิงปุ่ม "จัดการเมนูระบบ" ให้เฉพาะ Admin เห็นเท่านั้น */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-800/60 space-y-2">
              {!isCollapsed && (
                <p className="text-[10px] font-bold tracking-widest text-amber-500 px-3 uppercase flex items-center gap-1.5">
                  <Icons.ShieldAlert size={10} />
                  <span>ผู้ดูแลระบบ (ADMIN ONLY)</span>
                </p>
              )}
              <button
                onClick={() => router.push('/menus')}
                className={`w-full flex items-center rounded-xl font-semibold text-sm transition-all duration-300 group relative ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'
                } ${
                  pathname === '/menus'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-amber-400 cursor-pointer'
                }`}
                title={isCollapsed ? "ตั้งค่าโครงสร้างเมนู" : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    <Icons.Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                  {!isCollapsed && <span className="truncate">⚙️ ตั้งค่าโครงสร้างเมนู</span>}
                </div>
                {pathname === '/menus' && !isCollapsed && (
                  <span className="w-1.5 h-5 bg-amber-500 rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* USER ACCOUNT & LOGOUT */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 space-y-3 mt-4">
        {!isCollapsed && (
          <div className="text-xs text-slate-400 truncate font-medium flex items-center gap-1.5">
            <span className="truncate">👤 {email}</span>
            {isAdmin && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded font-bold shrink-0">Admin</span>}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full h-9 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold cursor-pointer">
          <Icons.LogOut size={13} className="mr-1.5 inline" />{!isCollapsed && "ออกจากระบบ"}
        </Button>
      </div>
    </aside>
  )
}