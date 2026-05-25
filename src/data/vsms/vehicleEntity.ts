// src/data/vsms/vehicleEntity.ts

export interface VehicleRowEntity {
  id: string
  license: string | null   // รองรับ Nullable เผื่อข้อมูลในเบสว่าง
  brand: string | null
  model: string | null
  status: string | null
  created_at: string       // มักจะไม่เป็น Null เพราะเบสจะเจนให้อัตโนมัติ
}