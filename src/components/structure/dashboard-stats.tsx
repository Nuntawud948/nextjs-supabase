'use client'

import React from 'react'
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react'

// 💡 กำหนด Type ให้ Props เพื่อความปลอดภัยตามมาตรฐาน TypeScript
interface DashboardStatsProps {
  totalVehicles: number
  availableVehicles: number
  maintenanceVehicles: number
}

export function DashboardStats({
  totalVehicles = 0,
  availableVehicles = 0,
  maintenanceVehicles = 0,
}: DashboardStatsProps) {
  
  // จัดกลุ่มข้อมูลแบบ Array เพื่อใช้คำสั่ง .map() ช่วยลดการเขียนโค้ดซ้ำ
  const statItems = [
    {
      label: 'รถยนต์ทั้งหมด',
      count: totalVehicles,
      unit: 'คัน',
      textColor: 'text-slate-900',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      icon: <Truck size={22} />,
    },
    {
      label: 'สถานะว่างพร้อมใช้',
      count: availableVehicles,
      unit: 'คัน',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: <CheckCircle2 size={22} />,
    },
    {
      label: 'กำลังซ่อมบำรุง',
      count: maintenanceVehicles,
      unit: 'คัน',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: <AlertCircle size={22} />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs flex items-center justify-between transition-all hover:shadow-sm"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {item.label}
            </span>
            <p className={`text-3xl font-black ${item.textColor}`}>
              {item.count}{' '}
              <span className="text-xs font-normal text-slate-400">
                {item.unit}
              </span>
            </p>
          </div>
          <div className={`p-3 ${item.bgColor} ${item.iconColor} rounded-xl`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  )
}