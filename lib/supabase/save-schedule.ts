import { supabase } from "./browser-client"

/**
 * AIが提案したスケジュールをSupabaseのdiary_sessionsテーブルに保存する関数
 *
 * @param user_id Supabase認証ユーザーのUUID
 * @param date "YYYY-MM-DD"形式の文字列
 * @param schedule JSON配列形式のスケジュール
 */
export async function insertSchedule(
  user_id: string,
  date: string,
  schedule: {
    time: string
    activity: string
    note?: string
  }[]
) {
  const { data, error } = await supabase
    .from("diary_sessions")
    .insert([{ user_id, date, schedule_json: schedule }])

  if (error) {
    console.error("❌ Supabase insert error:", error.message)
    return null
  }

  return data
}
