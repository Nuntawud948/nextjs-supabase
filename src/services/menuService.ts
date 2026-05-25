import { supabase } from '@/lib/supabase'

// กำหนดโครงสร้างข้อมูล (DTO) ของเมนูระบบนำทาง
export interface MenuItemDTO {
  id: number
  label: string
  icon: string
  href: string
  group_name: string
  sort_order: number
  is_disabled: boolean
}

export const menuService = {
  /**
   * ดึงรายการเมนูทั้งหมดที่ไม่ถูกเปิดสวิตช์ปิดใช้งาน (is_disabled = false)
   * และทำการเรียงลำดับตาม sort_order จากฐานข้อมูลโดยตรง
   */
  async getActiveMenus(): Promise<MenuItemDTO[]> {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('is_disabled', false)
      .order('sort_order', { ascending: true }) // 🟢 ควบคุมจัดลำดับหน้าตามสเปกข้อ 2
    
    if (error) {
      console.error('🔥 เกิดข้อผิดพลาดในการดึงข้อมูลเมนูนำทาง:', error)
      return []
    }
    return (data as MenuItemDTO[]) || []
  }
}