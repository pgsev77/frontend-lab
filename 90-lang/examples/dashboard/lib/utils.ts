// 对应 v2: styling/01 clsx 辅助 + 通用工具

import { clsx, type ClassValue } from 'clsx'

// 合并 className（Tailwind 场景常用）
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// 格式日期（对应 v1: 01-10 国际化用 Intl 而非手拼）
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
}
