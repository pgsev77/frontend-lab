'use client'

// 对应 v2: state/01 Zustand + persist 持久化
// 用户偏好（跨刷新保留，对应 v1: 01-5 本地持久状态）

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PrefsState = {
  denseMode: boolean
  toggleDense: () => void
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      denseMode: false,
      toggleDense: () => set((s) => ({ denseMode: !s.denseMode })),
    }),
    { name: 'user-prefs' },   // 自动存 localStorage
  ),
)
