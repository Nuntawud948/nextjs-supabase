'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'

// 🟢 อิมพอร์ตโมดูลตารางเวอร์ชัน Smart สมบูรณ์แบบ
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

  // 🟢 1 & 2. ตั้งค่าคอลัมน์และกำหนดสิทธิ์ว่าคอลัมน์ไหนต้องการให้เรียงลำดับ (Sortable) ได้บ้าง
  const tableColumns = [
    { header: 'ทะเบียนรถ', accessorKey: 'license', sortable: true },
    { header: 'ยี่ห้อ', accessorKey: 'brand', sortable: true },
    { header: 'รุ่น', accessorKey: 'model', sortable: false },
    { header: 'สถานะ', accessorKey: 'status', sortable: true },
    { header: 'จัดการข้อมูล', accessorKey: 'actions', sortable: false },
  ]

  if (!email) return <p className="p-8 text-center text-sm">กำลังตรวจสอบสิทธิ์...</p>

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR ... (เหมือนเดิมทุกประการ) */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col p-4 hidden md:flex">
        <div className="text-xl font-bold tracking-wider text-blue-400 border-b border-slate-700 pb-4 mb-6">🚚 TMS SYSTEM</div>
        <nav className="flex-1 text-sm"><button className="w-full text-left px-3 py-2 rounded-md bg-blue-600 text-white font-medium">📊 รายชื่อยานพาหนะ</button></nav>
        <div className="border-t border-slate-700 pt-4">
          <div className="text-xs text-slate-400 mb-2 truncate">👤 {email}</div>
          <Button variant="destructive" size="sm" onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="w-full text-xs h-8">🚪 ออกจากระบบ</Button>
        </div>
      </aside>

      {/* MAJOR CONTENT AREA */}
      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-slate-800">📊 ระบบจัดการยานพาหนะ</h1>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 text-white">➕ เพิ่มข้อมูลรถยนต์</Button>
          </div>

          {/* 🚀 เรียกใช้งาน CustomDataTable พร้อมความสามารถเสริมครบเครื่อง */}
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

      // 🚀 🟢 ปรับเปลี่ยนตรงนี้เพื่อแยกช่องค้นหาออกเป็น 3 ช่องชัดเจนอย่างสวยงาม
      filterFields={[
        { key: 'license', label: 'ทะเบียนรถ', placeholder: 'เช่น 5กภ 9588' },
        { key: 'brand', label: 'ยี่ห้อ (Brand)', placeholder: 'เช่น Honda' },
        { key: 'model', label: 'รุ่น (Model)', placeholder: 'เช่น PCX' }
      ]}
      
      renderRow={(v, runningIndex) => (
        <TableRow key={v.id} className="hover:bg-slate-50/70 transition-colors">
          <TableCell className="font-medium text-slate-500">{runningIndex}</TableCell>
          <TableCell className="font-medium text-slate-900">{v.license}</TableCell>
          <TableCell>{v.brand}</TableCell>
          <TableCell>{v.model}</TableCell>
          <TableCell>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              v.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {v.status === 'available' ? 'ว่าง' : 'ซ่อมบำรุง'}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <CustomActionDropdown 
              onEdit={() => { setSelectedVehicle(v); setIsEditOpen(true); }}
              onDelete={() => { setSelectedVehicle(v); setIsDeleteOpen(true); }}
            />
          </TableCell>
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