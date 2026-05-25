// src/controller/vsms/VehicleController.ts

import { VehicleService } from '@/services/vsms/VehicleService'
import { VehicleMapper } from '@/mapper/vsms/VehicleMapper'
import { BackendVehicleQueryRequest } from '@/dto/vsms/backend/VehicleRequest'
import { FrontendVehicleFormRequest, FrontendVehicleQueryRequest } from '@/dto/vsms/frontend/VehicleRequest'
import { VehicleUIResponse } from '@/dto/vsms/frontend/VehicleResponse'

// 🟢 เปลี่ยนโครงสร้างเป็น Class สไตล์ OOP แท้เพื่อตัดปัญหาเรื่องลืมเครื่องหมายจุลภาค (Comma) คั่นฟังก์ชัน
export class VehicleControllerClass {
  // สร้างอินสแตนซ์เรียกใช้ระบบท่อบริการภายใน
  private vehicleService = new VehicleService();

  /**
   * 🎛️ รับคำสั่งคัดกรองแบ่งหน้าจาก UI -> ส่งมอบผลลัพธ์คลาส OOP คืนหน้าบ้าน
   */
  async getFilteredDashboard(queryDto: FrontendVehicleQueryRequest): Promise<{ items: VehicleUIResponse[]; totalCount: number }> {
    const limit = queryDto.limit && queryDto.limit > 0 ? queryDto.limit : 10
    const page = queryDto.page && queryDto.page > 0 ? queryDto.page : 1
    const offset = (page - 1) * limit

    // แมปค่าส่งต่อเข้าพัสดุหลังบ้านผ่าน search และ filter ตัวใหม่
    const backendOptions: BackendVehicleQueryRequest = {
      search: queryDto.search ?? null,
      filter: queryDto.filter ?? null,
      offset: offset,
      limit: limit
    }

    const backendResult = await this.vehicleService.getVehiclesByCriteria(backendOptions)
    const frontendItems = VehicleMapper.toUIResponseList(backendResult.items)

    return {
      items: frontendItems,
      totalCount: backendResult.totalCount
    }
  } // 🟢 รูปแบบ Class ไม่ต้องใช้เครื่องหมายจุลภาคคั่นระหว่างฟังก์ชัน สามารถต่อฟังก์ชันถัดไปได้ทันที

  /**
   * 🎛️ รับคำสั่งบันทึกข้อมูลรถยนต์ใหม่จากฟอร์มหน้าจอ UI
   */
  async createVehicle(formRequest: FrontendVehicleFormRequest): Promise<{ success: boolean; error?: string }> {
    const backendSaveReq = VehicleMapper.toBackendSaveRequest(formRequest)
    return await this.vehicleService.createVehicle(backendSaveReq)
  }

  /**
   * 🎛️ รับคำสั่งอัปเดตแก้ไขข้อมูลรถยนต์เดิมจากฟอร์มหน้าจอ UI
   */
  async updateVehicle(id: string, formRequest: FrontendVehicleFormRequest): Promise<{ success: boolean; error?: string }> {
    const backendSaveReq = VehicleMapper.toBackendSaveRequest(formRequest)
    return await this.vehicleService.updateVehicle(id, backendSaveReq)
  }

  /**
   * 🎛️ รับคำสั่งลบข้อมูลรถยนต์จากปุ่มกด UI
   */
  async deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    return await this.vehicleService.deleteVehicle(id)
  }
}

// 🟢 ทำการ Export ออกไปในรูปแบบ Singleton Instance ชื่อเดิมเพื่อให้หน้าบ้านอิมพอร์ตใช้งานได้โดยไม่ต้องเปลี่ยนพาธ
export const VehicleController = new VehicleControllerClass()