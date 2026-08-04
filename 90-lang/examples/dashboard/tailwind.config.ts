import type { Config } from 'tailwindcss'

// 对应 v2: styling/01 Tailwind 配置、styling/02 设计令牌
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',          // 对应 v2: styling/03 next-themes 用 class 切换
  theme: {
    extend: {
      colors: {
        // 语义令牌绑定 CSS 变量（对应 v2: styling/02 换主题只改语义层）
        primary: 'var(--color-primary)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
}
export default config
