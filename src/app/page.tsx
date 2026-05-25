'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'
import { Plus } from 'lucide-react'

// 🟢 อิมพอร์ตกลุ่มโมดูลย่อยที่จัดสรรอย่างเป็นระเบียบ
import { Sidebar } from '@/components/structure/sidebar'
import { DashboardStats } from '@/components/structure/dashboard-stats'
import { CustomDataTable } from '@/components/structure/custom-data-table'
import { CustomActionDropdown } from '@/components/ui/custom-action-dropdown'

import { CreateVehicle } from '@/vehicle/CreateVehicle'
import { EditVehicle } from '@/vehicle/EditVehicle'
import { DeleteVehicle } from '@/vehicle/DeleteVehicle'
import { VehicleResponseDTO } from '@/dto/vehicle'

export default function HomePage() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<VehicleResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleResponseDTO | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else {
        setEmail(user.email || '')
        fetchVehicles()
      }
    }
    checkUser()
  }, [router])

  async function fetchVehicles() {
    setLoading(true)
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
    if (data) setVehicle(data)
    setLoading(false)
  }

  // คำนวณยอดสถิติจริงจากข้อมูลอาเรย์อัตโนมัติ
  const totalVehicles = vehicle.length
  const availableVehicles = useMemo(() => vehicle.filter(v => v.status === 'available').length, [vehicle])
  const maintenanceVehicles = useMemo(() => vehicle.filter(v => v.status !== 'available').length, [vehicle])

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 font-sans">
      
      {/* 🔮 เรียกใช้งาน Sidebar Component ที่แยกไฟล์ออกไปเพื่อความยืดหยุ่นในอนาคต */}
      <Sidebar email={email} />

      {/* 🚀 MAJOR CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">📊 ระบบจัดการยานพาหนะ</h1>
            <p className="text-sm text-slate-500 mt-0.5">ตรวจสอบสถานะ ติดตามการซ่อมบำรุง และค้นหาข้อมูลรถยนต์ทั้งหมด</p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl font-medium gap-2 self-start sm:self-center px-4 h-11 cursor-pointer"
          >
            <Plus size={18} />
            <span>เพิ่มข้อมูลรถยนต์</span>
          </Button>
        </div>

        {/* 📊 BENTO STATS CARDS */}
        <DashboardStats 
          totalVehicles={totalVehicles}
          availableVehicles={availableVehicles}
          maintenanceVehicles={maintenanceVehicles}
        />

        {/* 📋 SMART DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden p-1">
          <CustomDataTable
            columns={[
              { header: 'ลำดับ', accessorKey: 'index', sortable: false },
              { header: 'ทะเบียนรถ', accessorKey: 'license', sortable: true },
              { header: 'ยี่ห้อ', accessorKey: 'brand', sortable: true },
              { header: 'รุ่น', accessorKey: 'model', sortable: false },
              { header: 'สถานะ', accessorKey: 'status', sortable: true },
              { header: 'จัดการข้อมูล', accessorKey: 'actions', sortable: false },
            ]}
            data={vehicle}
            loading={loading}
            emptyMessage="ไม่พบข้อมูลยานพาหนะตามเงื่อนไขที่ระบุ"
            filterFields={[
              { key: 'license', label: 'ทะเบียนรถ', placeholder: 'เช่น 5กภ 9588' },
              { key: 'brand', label: 'ยี่ห้อ (Brand)', placeholder: 'เช่น Honda' },
              { key: 'model', label: 'รุ่น (Model)', placeholder: 'เช่น PCX' }
            ]}
            renderRow={(v, runningIndex) => (
              <TableRow key={v.id} className="hover:bg-slate-50/60 border-b border-slate-100 last:border-none transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-400">{runningIndex}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{v.license}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{v.brand}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{v.model}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    v.status === 'available' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      v.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`} />
                    {v.status === 'available' ? 'ว่าง' : 'ซ่อมบำรุง'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <CustomActionDropdown 
                    onEdit={() => { setSelectedVehicle(v); setIsEditOpen(true); }}
                    onDelete={() => { setSelectedVehicle(v); setIsDeleteOpen(true); }}
                  />
                </td>
              </TableRow>
            )}
          />
        </div>

        {/* 📥 GROUP DIALOG MANAGER */}
        <CreateVehicle isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => { fetchVehicles(); setIsCreateOpen(false); }} />
        <EditVehicle isOpen={isEditOpen} vehicle={selectedVehicle} onClose={() => { setIsEditOpen(false); setSelectedVehicle(null); }} onSuccess={() => { fetchVehicles(); setIsEditOpen(false); setSelectedVehicle(null); }} />
        <DeleteVehicle isOpen={isDeleteOpen} vehicleId={selectedVehicle?.id || null} license={selectedVehicle?.license || null} onClose={() => { setIsDeleteOpen(false); setSelectedVehicle(null); }} onSuccess={() => { fetchVehicles(); setIsDeleteOpen(false); setSelectedVehicle(null); }} />
      </main>
    </div>
  )
}