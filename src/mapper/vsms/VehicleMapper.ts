// src/mapper/vsms/VehicleMapper.ts

import { VehicleRowEntity } from '@/data/vsms/vehicleEntity'
import { BackendVehicleItem, BackendVehicleListResponse } from '@/dto/vsms/backend/VehicleResponse'
import { BackendVehicleSaveRequest } from '@/dto/vsms/backend/VehicleRequest'
import { VehicleUIResponse } from '@/dto/vsms/frontend/VehicleResponse'
import { FrontendVehicleFormRequest } from '@/dto/vsms/frontend/VehicleRequest'

export const VehicleMapper = {
  /**
   * 🗄️ แปลงจากตารางฐานข้อมูลดิบ (Entity) -> DTO ของหลังบ้าน (Backend DTO Item)
   */
  toBackendItem(entity: VehicleRowEntity): BackendVehicleItem {
    return {
      id: entity.id,
      license: entity.license,
      brand: entity.brand,
      model: entity.model,
      status: entity.status,
      created_at: entity.created_at
    }
  },

  /**
   * 🗄️ แปลงจากกลุ่มตารางดิบ (Entity Array) -> กลุ่ม DTO หลังบ้าน (Bulk Transform)
   */
  toBackendItemList(entities: VehicleRowEntity[]): BackendVehicleItem[] {
    return entities.map(entity => this.toBackendItem(entity))
  },

  /**
   * 📥 แปลงจาก DTO หลังบ้าน -> คลาส OOP ของหน้าบ้านเพื่อให้ UI เอาไปใช้งาน (Backend DTO -> Frontend Response)
   */
  toUIResponse(backendItem: BackendVehicleItem): VehicleUIResponse {
    return new VehicleUIResponse(backendItem)
  },

  /**
   * 📥 แปลงจากกลุ่ม DTO หลังบ้าน -> กลุ่มคลาส OOP ของหน้าบ้าน (View Model Array)
   */
  toUIResponseList(backendItems: BackendVehicleItem[]): VehicleUIResponse[] {
    return backendItems.map(item => this.toUIResponse(item))
  },

  /**
   * 📤 แปลงจากฟอร์มหน้าจอ UI -> โครงสร้างพัสดุสำหรับเตรียมส่งไปเซฟหลังบ้าน (Frontend Request -> Backend Save Request)
   */
  toBackendSaveRequest(frontendReq: FrontendVehicleFormRequest): BackendVehicleSaveRequest {
    return {
      license: frontendReq.license || null,
      brand: frontendReq.brand || null,
      model: frontendReq.model || null,
      status: frontendReq.status || null
    }
  }
}