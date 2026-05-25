import { VehicleRowEntity } from '@/data/vsms/vehicleEntity'

export class VehicleUIResponse {
  id: string
  license: string
  brand: string
  model: string
  status: string
  createdAt: string

  // คอนสตรัคเตอร์คอยรับ Entity ดิบจากเลเยอร์ data มาแกะและทำ Fallback ดักค่า Null
  constructor(entity: VehicleRowEntity) {
    this.id = entity.id
    this.license = entity.license ?? 'ไม่ระบุทะเบียน'
    this.brand = entity.brand ?? '-'
    this.model = entity.model ?? '-'
    this.status = entity.status ?? 'unknown'
    this.createdAt = entity.created_at
  }

  // 🟢 OOP Method: แปลงสถานะภาษาอังกฤษออกเป็นข้อความภาษาไทยสวยๆ
  getThaiStatusText(): string {
    return this.status === 'available' ? 'ว่างปฏิบัติงาน' : 'อยู่ในระหว่างซ่อมบำรุง'
  }

  // 🟢 OOP Method: จัดฟอร์แมตวันที่ดิบให้กลายเป็นวันที่อ่านง่ายสไตล์ไทย
  getFormattedDate(): string {
    if (!this.createdAt) return '-'
    return new Date(this.createdAt).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}