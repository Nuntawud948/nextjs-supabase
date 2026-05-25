// src/services/vsms/VehicleService.ts

import { supabase } from '@/lib/supabase'
import { IVehicleService } from '@/interface/vsms/IVehicleService'
import { VehicleRowEntity } from '@/data/vsms/vehicleEntity'
import { VehicleMapper } from '@/mapper/vsms/VehicleMapper'
import { BackendVehicleQueryRequest, BackendVehicleSaveRequest } from '@/dto/vsms/backend/VehicleRequest'
import { BackendVehicleListResponse } from '@/dto/vsms/backend/VehicleResponse'

export class VehicleService implements IVehicleService {
  
  /**
   * 🔍 ค้นหา จัดเรียง และแบ่งหน้าข้อมูลรถยนต์จากฐานข้อมูล
   */
async getVehiclesByCriteria(options: BackendVehicleQueryRequest): Promise<BackendVehicleListResponse> {
    let query = supabase.from('vehicles').select('*', { count: 'exact' })

    if (options.search) {
      query = query.ilike('license', `%${options.search}%`) // ค้นหาจากทะเบียน
    }
    if (options.filter) {
      query = query.eq('brand', options.filter) // คัดกรองจากยี่ห้อ
    }

    query = query.order('created_at', { ascending: false })
    query = query.range(options.offset, options.offset + options.limit - 1)

    const { data, error, count } = await query

    // 🚨 1. ดักจัดการกรณีเกิด Error จาก Supabase (ต้องส่ง Return ให้ตรง Type เสมอ)
    if (error) {
      console.error('🔥 เกิดข้อผิดพลาดในชั้น Service Layer:', error)
      return {
        items: [],
        totalCount: 0
      }
    }

    const entities = (data as VehicleRowEntity[]) || []

    // 🟢 2. เรียกใช้โรงงาน Mapper แปลงร่างจาก Entity ดิบ -> หลังบ้าน DTO Item 
    // เพื่อตัดขาดไม่ให้ชั้น Entity หลุดรอดออกไปด้านนอกตามกฎที่วางไว้
    const backendItems = VehicleMapper.toBackendItemList(entities)

    // 🟢 3. ยิง Return ส่งพัสดุออกไปในรูปแบบ BackendVehicleListResponse ครบถ้วนร้อยเปอร์เซ็นต์
    return {
      items: backendItems,
      totalCount: count ?? 0
    }
  }

  /**
   * ➕ เพิ่มข้อมูลรถยนต์คันใหม่
   */
  async createVehicle(request: BackendVehicleSaveRequest): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('vehicles')
      .insert([
        {
          license: request.license,
          brand: request.brand,
          model: request.model,
          status: request.status
        }
      ])

    if (error) {
      console.error('🔥 Service cannot insert vehicle:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  /**
   * ✏️ อัปเดตแก้ไขข้อมูลรถยนต์เดิม
   */
  async updateVehicle(id: string, request: BackendVehicleSaveRequest): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('vehicles')
      .update({
        license: request.license,
        brand: request.brand,
        model: request.model,
        status: request.status
      })
      .eq('id', id)

    if (error) {
      console.error('🔥 Service cannot update vehicle:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  /**
   * ❌ ลบข้อมูลรถยนต์ออกจากระบบ
   */
  async deleteVehicle(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('🔥 Service cannot delete vehicle:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }
}