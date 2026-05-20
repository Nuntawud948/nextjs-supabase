// src/dto/vehicle.ts

// 1. สำหรับข้อมูลที่ส่งมาจาก Supabase
export interface VehicleResponseDTO {
  id: string
  plate_number: string
  brand: string
  model: string
  status: string
  created_at: string
}
// 2. สำหรับส่งข้อมูลไปบันทึก หรือ อัปเดต (Request)
export interface VehicleRequestDTO {
  plate_number: string
  brand: string
  model: string
  status: string
}