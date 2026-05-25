// src/interface/vsms/IVehicleService.ts

import { BackendVehicleQueryRequest, BackendVehicleSaveRequest } from '@/dto/vsms/backend/VehicleRequest'
import { BackendVehicleListResponse } from '@/dto/vsms/backend/VehicleResponse'

export interface IVehicleService {
  /**
   * สัญญา: ดึงข้อมูลรถยนต์คัดกรองตามเงื่อนไข พร้อมทำแบ่งหน้า (Pagination)
   * @param options ชุดเงื่อนไขคัดกรองและแบ่งหน้าจากหลังบ้าน
   */
  getVehiclesByCriteria(options: BackendVehicleQueryRequest): Promise<BackendVehicleListResponse>

  /**
   * สัญญา: สร้างบันทึกข้อมูลรถยนต์คันใหม่ลงระบบ
   * @param request ชุดข้อมูลโครงสร้างเซฟหลังบ้าน
   */
  createVehicle(request: BackendVehicleSaveRequest): Promise<{ success: boolean; error?: string }>

  /**
   * สัญญา: อัปเดตแก้ไขข้อมูลรถยนต์ที่มีอยู่เดิม
   * @param id รหัสรถยนต์ที่จะแก้ไข (UUID / String)
   * @param request ชุดข้อมูลที่ต้องการอัปเดตใหม่
   */
  updateVehicle(id: string, request: BackendVehicleSaveRequest): Promise<{ success: boolean; error?: string }>

  /**
   * สัญญา: ลบข้อมูลรถยนต์ออกจากระบบ
   * @param id รหัสรถยนต์ที่จะลบ
   */
  deleteVehicle(id: string): Promise<{ success: boolean; error?: string }>
}