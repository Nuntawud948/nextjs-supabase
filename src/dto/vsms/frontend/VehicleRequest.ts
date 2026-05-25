import { BaseFrontendQueryRequest } from '@/dto/common/BaseRequest'

// สืบทอดคุณสมบัติ search, filter, page, limit มาจาก Base ทันที
export interface FrontendVehicleQueryRequest extends BaseFrontendQueryRequest {
  // คุณนันท์สามารถเพิ่มฟิลด์เฉพาะของรถยนต์ตรงนี้ได้ในอนาคต เช่น type?: string
}

// ตัว Request สำหรับฟอร์มเซฟข้อมูล (คงเดิมไว้)
export interface FrontendVehicleFormRequest {
  license: string
  brand: string
  model: string
  status: string
}