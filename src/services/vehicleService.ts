import { supabase } from '@/lib/supabase'
import { VehicleResponseDTO } from '@/dto/vehicle' // 🟢 ผูก DTO ของตัวรถยนต์ด้านบน

export const vehicleService = {
  /**
   * ดึงข้อมูลยานพาหนะทั้งหมดจากฐานข้อมูล Supabase
   * โดยทำการเรียงลำดับจากรถยนต์ที่เพิ่มเข้ามาล่าสุด (created_at: desc)
   */
  async getAllVehicles(): Promise<VehicleResponseDTO[]> {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('🔥 เกิดข้อผิดพลาดในการดึงข้อมูลรถยนต์จาก vehicleService:', error)
      return []
    }
    
    // แปลงข้อมูลและส่งกลับออกไปในรูปแบบของอาเรย์ DTO
    return (data as VehicleResponseDTO[]) || []
  }
}