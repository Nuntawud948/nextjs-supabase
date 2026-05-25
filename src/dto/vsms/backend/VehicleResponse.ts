// src/dto/vsms/backend/VehicleResponse.ts

// สร้างโครงสร้างสำหรับการส่งถ่ายข้อมูลคันรถของฝั่งหลังบ้านเองโดยเฉพาะ ไม่ยุ่งกับ Entity
export interface BackendVehicleItem {
  id: string
  license: string | null
  brand: string | null
  model: string | null
  status: string | null
  created_at: string
}

// กล่องพัสดุผลลัพธ์รายการรถยนต์ที่ส่งออกมาจากเลเยอร์บริการหลังบ้าน
export interface BackendVehicleListResponse {
  items: BackendVehicleItem[]
  totalCount: number
}