'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/structure/sidebar'
import { ModuleDispatcher } from '../routes-config'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default function CatchAllModulesPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setEmail(user.email || '')
    }
    checkUser()
  }, [router])

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">กำลังตรวจสอบสิทธิ์ระบบโมดูล...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 font-sans">
      <Sidebar email={email} />

      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* ส่งค่า URL ต่อไปให้สารบัญกลางวิเคราะห์และสลับ UI หน้าจอ */}
        <ModuleDispatcher 
          slug={resolvedParams.slug} 
          userEmail={email} 
        />
      </main>
    </div>
  )
}