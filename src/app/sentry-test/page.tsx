'use client'

import { Button } from '@/components/ui/button'

export default function SentryTestPage() {
  
  // 💣 ฟังก์ชันจงใจโยน Error ฝั่งหน้าบ้าน (Client Component)
  const triggerClientError = () => {
    throw new Error('🔥 บั๊กทดสอบระบบ TMS: ปุ่มระเบิดตัวเองทำงานฝั่ง Client!')
  }

  return (
    <div className="p-8 max-w-md mx-auto my-12 border rounded-2xl bg-white shadow-sm space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-slate-800">🧪 Sentry Integration Test</h1>
        <p className="text-sm text-slate-500">กดปุ่มด้านล่างเพื่อทดสอบระบบดักจับ Error และส่งไปยัง Sentry Dashboard</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="destructive" onClick={triggerClientError}>
          💣 ระเบิดบั๊กฝั่ง Client (React Error)
        </Button>
      </div>
    </div>
  )
}