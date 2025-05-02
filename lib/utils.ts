import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

export function getMediaTypeFromDataURL(dataURL: string): string | null {
  const matches = dataURL.match(/^data:([A-Za-z-+\/]+);base64/)
  return matches ? matches[1] : null
}

export function getBase64FromDataURL(dataURL: string): string | null {
  const matches = dataURL.match(/^data:[A-Za-z-+\/]+;base64,(.*)$/)
  return matches ? matches[1] : null
}

export function extractScheduleFromMarkdown(markdown: string): {
  time: string
  activity: string
  note?: string
}[] {
  const lines = markdown.split("\n")

  const scheduleLines = lines
    .map(line => line.trim())
    .filter(
      line =>
        /^\|[^|]*\|[^|]*\|[^|]*\|?$/.test(line) && // パイプ3つで区切られた行（| 時間 | 活動 | メモ |）
        /[0-9]{1,2}:[0-9]{2}/.test(line) && // 時刻が含まれている
        !/^\|[- ]+\|[- ]+\|[- ]+\|?$/.test(line) // 区切り線を除外
    )

  return scheduleLines.map(line => {
    const [, time, activity, note] = line.split("|").map(cell => cell.trim())
    return { time, activity, note }
  })
}
