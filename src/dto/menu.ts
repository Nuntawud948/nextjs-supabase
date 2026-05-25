// 🟢 ชนิดข้อมูล (Data Transfer Object) สำหรับระบบควบคุมเมนูนำทางส่วนกลาง
export interface MenuItemDTO {
  id?: number          // ใส่ ? เพื่อเป็นตัวเลือกเสริม (Optional) สำหรับตอนสร้างใหม่ที่ยังไม่มี ID ใน DB
  label: string        // หัวข้อที่แสดงบนเมนู เช่น 'ระบบจัดการบุคคล (HR)'
  icon: string         // ชื่อไอคอนของ Lucide เช่น 'Users', 'Fuel'
  href: string         // เส้นทาง URL ของหน้านั้น เช่น '/humanresource'
  group_name: string   // กลุ่มเมนู เช่น 'เมนูหลัก (MAIN)', 'ระบบบริหาร (MANAGEMENT)'
  sort_order: number   // ตัวจัดลำดับหน้า (เลขน้อยขึ้นก่อน)
  is_disabled: boolean // สถานะบล็อก/ปิดการใช้งานเมนู
  created_at?: string  // เวลาที่บันทึกข้อมูลเข้าฐานข้อมูล
}