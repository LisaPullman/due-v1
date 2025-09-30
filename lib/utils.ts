import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = '¥'): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function getWeekRange(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

export function getMonthRange(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

export function getRemainingTime(riskStartTime: string): { hours: number; minutes: number; seconds: number; totalMs: number } {
  const riskStart = new Date(riskStartTime)
  const now = new Date()
  const endTime = new Date(riskStart.getTime() + 24 * 60 * 60 * 1000)
  const diffMs = endTime.getTime() - now.getTime()

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, totalMs: diffMs }
}

export function formatRemainingTime(hours: number, minutes: number, seconds: number): string {
  return `${hours}小时${minutes}分钟${seconds}秒`
}