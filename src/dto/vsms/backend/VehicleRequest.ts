import { BaseBackendQueryRequest } from '@/dto/common/BaseRequest'

// สืบทอดคุณสมบัติ search, filter, offset, limit มาจาก Base หลังบ้าน
export interface BackendVehicleQueryRequest extends BaseBackendQueryRequest {
  // เพิ่มฟิลด์เฉพาะพาร์ทคิวรี่หลังบ้านของรถยนต์ได้ที่นี่ ถ้ามี
}

export interface BackendVehicleSaveRequest {
  license: string | null
  brand: string | null
  model: string | null
  status: string | null
}