'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

import { DashboardStats } from '@/components/structure/dashboard-stats'
import { CustomDataTable } from '@/components/structure/custom-data-table'
import { CustomActionDropdown } from '@/components/ui/custom-action-dropdown'

// 🟢 เปลี่ยนเส้นทาง Import มาเรียกใช้โมดอลเวอร์ชัน OOP DTO ที่เราล้างบั๊กแล้วในโฟลเดอร์เดียวกัน
import { VehicleCreate } from './VehicleCreate'
import { VehicleEdit } from './VehicleEdit'
import { VehicleDelete } from './VehicleDelete'

// ดึงโครงสร้างชุดควบคุมด่านหน้า และ OOP Class DTO มาสตรีมมิ่งใช้งาน
import { VehicleController } from '@/controller/vsms/VehicleController'
import { VehicleUIResponse } from '@/dto/vsms/frontend/VehicleResponse'

interface VehicleIndexProps {
  userEmail: string // ดักรับอีเมลผู้ใช้ส่งต่อมาจากตัว Dispatcher ส่วนกลาง
}

export function VehicleIndex({ userEmail }: VehicleIndexProps) {
  const [vehicles, setVehicles] = useState<VehicleUIResponse[]>([])
  const [loading, setLoading] = useState(true)

  // คุมสถานะโมดอลป๊อปอัพต่าง ๆ
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleUIResponse | null>(null)

  // โหลดข้อมูลผ่านคอนโทรลเลอร์ด่านหน้า
  async function fetchVehicles() {
    setLoading(true)
    const result = await VehicleController.getFilteredDashboard({
      search: null,
      filter: null,
      page: 1,
      limit: 100 // ดึงไอเทมมาสแตนด์บายพักรอบนตารางงาน
    })
    setVehicles(result.items)
    setLoading(false)
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  // สรุปยอดรวมจำลองผ่าน useMemo 
  const totalVehicles = vehicles.length
  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'available').length, [vehicles])
  const maintenanceVehicles = useMemo(() => vehicles.filter(v => v.status !== 'available').length, [vehicles])

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* TOP CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">🚗 ระบบจัดการยานพาหนะ (VSMS Workspace)</h1>
          <p className="text-sm text-slate-500 mt-0.5">ผู้รับผิดชอบระบบ: {userEmail} | ตรวจสอบสถานะ ติดตามการซ่อมบำรุง และจัดการข้อมูลรถยนต์</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl font-medium gap-2 px-4 h-11 cursor-pointer text-xs"
        >
          <Plus size={18} />
          <span>เพิ่มข้อมูลรถยนต์</span>
        </Button>
      </div>

      {/* DASHBOARD STATS */}
      <DashboardStats 
        totalVehicles={totalVehicles} 
        availableVehicles={availableVehicles} 
        maintenanceVehicles={maintenanceVehicles} 
      />

      {/* CUSTOM DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden p-1">
        <CustomDataTable
          columns={[
            { header: 'ลำดับ', accessorKey: 'index', sortable: false },
            { header: 'ทะเบียนรถ', accessorKey: 'license', sortable: true },
            { header: 'ยี่ห้อ', accessorKey: 'brand', sortable: true },
            { header: 'รุ่น', accessorKey: 'model', sortable: false },
            { header: 'สถานะระบบ', accessorKey: 'status', sortable: true },
            { header: 'จัดการข้อมูล', accessorKey: 'actions', sortable: false },
          ]}
          data={vehicles}
          loading={loading}
          emptyMessage="ไม่พบข้อมูลยานพาหนะตามเงื่อนไขที่ระบุในคลังระบบ"
          filterFields={[
            { key: 'license', label: 'ทะเบียนรถ', placeholder: 'เช่น 5กภ 9588' },
            { key: 'brand', label: 'ยี่ห้อ (Brand)', placeholder: 'เช่น Honda' },
            { key: 'model', label: 'รุ่น (Model)', placeholder: 'เช่น PCX' }
          ]}
          renderRow={(v, runningIndex) => (
            <TableRow key={v.id} className="hover:bg-slate-50/60 border-b border-slate-100 last:border-none transition-colors text-xs font-medium text-slate-600">
              <td className="px-6 py-4 text-slate-400">{runningIndex}</td>
              <td className="px-6 py-4 font-bold text-slate-900 text-sm">{v.license}</td>
              <td className="px-6 py-4 text-slate-600">{v.brand}</td>
              <td className="px-6 py-4 text-slate-600">{v.model}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  v.status === 'available' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {v.getThaiStatusText()}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <CustomActionDropdown 
                  onEdit={() => { setSelectedVehicle(v); setIsEditOpen(true); }} 
                  onDelete={() => { setSelectedVehicle(v); setIsDeleteOpen(true); }} 
                />
              </td>
            </TableRow>
          )}
        />
      </div>

      {/* 🟢 CRUD MODALS LAYER: เรียกใช้คอมโพเนนต์ใหม่ที่รับค่าและสเปกตรงแบบแผน OOP 100% */}
      <VehicleCreate 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={() => { fetchVehicles(); setIsCreateOpen(false); }} 
      />
      
      <VehicleEdit 
        isOpen={isEditOpen} 
        vehicleData={selectedVehicle} // ถอด Type Casting (as any) ออกเรียบร้อย ปลอดภัยตามหลักออบเจกต์
        onClose={() => { setIsEditOpen(false); setSelectedVehicle(null); }} 
        onSuccess={() => { fetchVehicles(); setIsEditOpen(false); setSelectedVehicle(null); }} 
      />
      
      <VehicleDelete 
        isOpen={isDeleteOpen} 
        vehicleData={selectedVehicle} // ส่ง Object ตัวเต็มลงไปให้ป๊อปอัพแกะวาดทะเบียนรถได้ทันที
        onClose={() => { setIsDeleteOpen(false); setSelectedVehicle(null); }} 
        onSuccess={() => { fetchVehicles(); setIsDeleteOpen(false); setSelectedVehicle(null); }} 
      />
    </div>
  )
}