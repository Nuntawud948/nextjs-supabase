// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // 🚀 ใช้สำหรับสั่งเปลี่ยนหน้า
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return alert('กรุณากรอกข้อมูลให้ครบถ้วนครับ')

    setAuthLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`)
    } else if (data.user) {
      alert('เข้าสู่ระบบสำเร็จ!')
      // 🚀 พอล็อกอินผ่าน สั่งเปลี่ยน URL เด้งไปที่หน้า Dashboard หลักทันที
      router.push('/')
    }
    setAuthLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md p-6 border rounded-xl shadow-lg bg-card text-card-foreground">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">🚚 ระบบจัดการยานพาหนะ (TMS)</h1>
          <p className="text-sm text-gray-500">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">อีเมลผู้ใช้งาน</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@tms.com" 
              className="w-full px-3 py-2 border rounded-md text-sm bg-background" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">รหัสผ่าน</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-3 py-2 border rounded-md text-sm bg-background" 
              required 
            />
          </div>
          <Button type="submit" disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {authLoading ? 'กำลังตรวจสอบสิทธิ์...' : '🔑 เข้าสู่ระบบ'}
          </Button>
        </form>
      </div>
    </div>
  )
}