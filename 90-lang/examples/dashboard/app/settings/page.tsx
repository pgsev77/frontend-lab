'use client'

// 对应 v2: state/01 Zustand 持久化偏好
// /settings：演示 Zustand persist 跨刷新保留

import { usePrefsStore } from '@/stores/usePrefsStore'

export default function SettingsPage() {
  const denseMode = usePrefsStore((s) => s.denseMode)       // 对应 v2: state/01 selector 订阅
  const toggleDense = usePrefsStore((s) => s.toggleDense)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">设置</h1>
      <div className="rounded-lg bg-surface p-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={denseMode} onChange={toggleDense} className="h-4 w-4" />
          <span>紧凑模式（偏好存 localStorage，刷新保留）</span>
        </label>
      </div>
      <p className="text-sm text-muted">
        当前紧凑模式：{denseMode ? '开启' : '关闭'}。刷新页面看偏好是否保留。
      </p>
    </div>
  )
}
