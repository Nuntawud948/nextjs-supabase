import { supabase } from '@/lib/supabase'
import { MenuItemDTO } from '@/dto/menu' // 🟢 ดึงโครงสร้าง Type จาก DTO ส่วนกลางเรียบร้อย

export const menuService = {
  // ดึงเฉพาะเมนูที่เปิดใช้งาน (สำหรับแสดงบน Sidebar)
  async getActiveMenus(): Promise<MenuItemDTO[]> {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('is_disabled', false)
      .order('sort_order', { ascending: true })
    if (error) {
      console.error('Error fetching active menus:', error)
      return []
    }
    return (data as MenuItemDTO[]) || []
  },

  // ดึงเมนูทั้งหมดในระบบ (รวมถึงอันที่โดนปิดใช้งานอยู่ด้วย)
  async getAllMenus(): Promise<MenuItemDTO[]> {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .order('group_name', { ascending: true })
      .order('sort_order', { ascending: true })
    if (error) {
      console.error('Error fetching all menus:', error)
      return []
    }
    return (data as MenuItemDTO[]) || []
  },

  // บันทึกข้อมูลเมนูหน้าใหม่ลงฐานข้อมูล
  async createMenu(menu: MenuItemDTO): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('menus')
      .insert([
        {
          label: menu.label,
          icon: menu.icon,
          href: menu.href,
          group_name: menu.group_name,
          sort_order: Number(menu.sort_order),
          is_disabled: menu.is_disabled,
        }
      ])

    if (error) {
      console.error('Error creating menu:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } ,

  async updateMenu(id: number, menu: MenuItemDTO): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('menus')
      .update({
        label: menu.label,
        icon: menu.icon,
        href: menu.href,
        group_name: menu.group_name,
        sort_order: Number(menu.sort_order),
        is_disabled: menu.is_disabled,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating menu:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  }
}