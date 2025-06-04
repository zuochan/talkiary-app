"use client"

import { ChatUI } from "@/components/chat/chat-ui"
import { useState } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { insertSchedule } from "@/lib/supabase/save-schedule"

export default function ChatIDPage() {
  const [schedule, setSchedule] = useState<
    { time: string; activity: string; note?: string }[]
  >([])

  // 保存ボタンをクリックしたときの処理
  const handleSaveSchedule = async () => {
    // 現在のログインユーザーを取得
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) {
      alert("Please log in to save your schedule.")
      return
    }
    // 今日の日付を取得（YYYY-MM-DD形式）
    const today = new Date().toISOString().slice(0, 10)
    // スケジュールをデータベースに保存
    const result = await insertSchedule(user.id, today, schedule)
    if (result) {
      alert("✅ Schedule saved!")
    }
  }

  console.log("[DEBUG] setSchedule is defined:", !!setSchedule)

  return (
    <>
      <ChatUI
        setSchedule={setSchedule}
        schedule={schedule}
        onSaveSchedule={handleSaveSchedule}
      />
    </>
  )
}
