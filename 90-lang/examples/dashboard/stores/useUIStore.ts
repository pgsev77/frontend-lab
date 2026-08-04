'use client'

// 对应 v2: state/01 Zustand 客户端状态
// 只放跨组件共享的客户端 UI 状态（对应 v1: 01-5 状态分类的 UI 状态）

import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
