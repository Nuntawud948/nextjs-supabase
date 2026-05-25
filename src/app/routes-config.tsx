'use client'

import React from 'react'
import { HumanResourceIndex } from '@/app/HumanResource/humanresourceIndex'
import { MenuManagementIndex } from '@/app/MenuManagement/menuManagementIndex'

export const MODULE_REGISTRY = {
  HUMAN_RESOURCE: 'humanresource',
  CUSTOMER: 'customer',
  PURCHASE: 'purchase',
  MAINTENANCE: 'maintenance',
  MENU_MANAGEMENT: 'menus' // 🟢 ลงทะเบียนคีย์เวิร์ดหน้า /menus
} as const

interface ModuleDispatcherProps {
  slug: string[]
  userEmail: string
}

export function ModuleDispatcher({ slug, userEmail }: ModuleDispatcherProps) {
  const currentModule = slug[0].toLowerCase()

  switch (currentModule) {
    case MODULE_REGISTRY.HUMAN_RESOURCE:
      return <HumanResourceIndex userEmail={userEmail} />

    case MODULE_REGISTRY.MENU_MANAGEMENT:
      return <MenuManagementIndex userEmail={userEmail} />  
      
    case MODULE_REGISTRY.CUSTOMER:
      return (
        <div className="p-8 bg-white border border-slate-200/60 rounded-2xl text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-800">📦 ระบบจัดการลูกค้า (Customer Workspace)</h2>
          <p className="text-sm text-slate-400 mt-2">พื้นที่เตรียมพร้อมพัฒนาฟังก์ชันระบบลูกค้าสัมพันธ์เร็ว ๆ นี้</p>
        </div>
      )
      
    case MODULE_REGISTRY.PURCHASE:
      return (
        <div className="p-8 bg-white border border-slate-200/60 rounded-2xl text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-800">💰 ระบบจัดซื้อและพัสดุ (Purchase Order)</h2>
          <p className="text-sm text-slate-400 mt-2">พื้นที่เตรียมพร้อมพัฒนาฟังก์ชันใบสั่งซื้อพัสดุระบบ TMS</p>
        </div>
      )
      
    case MODULE_REGISTRY.MAINTENANCE:
      return (
        <div className="p-8 bg-white border border-slate-200/60 rounded-2xl text-center shadow-xs">
          <h2 className="text-xl font-bold text-slate-800">🔧 ระบบรายงานซ่อมบำรุง (Maintenance Tracking)</h2>
          <p className="text-sm text-slate-400 mt-2">พื้นที่เตรียมพร้อมพัฒนาฟังก์ชันแจ้งซ่อมยานพาหนะตามระยะทาง</p>
        </div>
      )

    default:
      return (
        <div className="p-12 bg-white border border-slate-200/60 rounded-2xl text-center space-y-2 max-w-md mx-auto my-12">
          <h2 className="text-3xl font-black text-slate-300">404</h2>
          <h3 className="text-base font-bold text-slate-700">ไม่พบหน้าต่างระบบงาน</h3>
        </div>
      )
  }
}