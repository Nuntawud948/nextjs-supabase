// src/dto/common/BaseRequest.ts

/**
 * 📥 Base Query สำหรับหน้าบ้าน (Frontend) ส่งเข้ามาหา Controller
 */
export interface BaseFrontendQueryRequest {
  search?: string | null  // คำค้นหากลาง เช่น ทะเบียนรถ หรือ ชื่อพนักงาน
  filter?: string | null  // ตัวคัดกรองหลัก เช่น ยี่ห้อ หรือ ฝ่ายงาน
  page?: number
  limit?: number
}

/**
 * 📥 Base Query สำหรับหลังบ้าน (Backend) ใช้คุยกันระหว่าง Controller และ Service
 */
export interface BaseBackendQueryRequest {
  search: string | null
  filter: string | null
  offset: number
  limit: number
}