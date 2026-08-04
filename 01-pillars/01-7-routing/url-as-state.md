# URL 即状态（URL as State）

> "当前在第几页、筛了什么条件、选了哪个 Tab"——这些状态放哪？最该放的地方是 URL。很多前端把它们藏进 Redux，结果链接分享就废了、刷新就丢了。这篇讲透"哪些状态该进 URL"。

## 是什么

URL 即状态（URL as State）指**把应用的部分状态编码进 URL**，让 URL 本身成为状态存储。这样 URL 完整描述了"用户当前看到什么"：

```
/products?category=phone&sort=price&page=3
     ↑        ↑          ↑         ↑
   哪个页面   筛选条件   排序       分页
```
这个 URL 包含了"商品列表页、手机类、按价格排序、第 3 页"的完整状态。

一句话边界：**URL 不只是"地址"，它是可分享、可刷新、可后退的状态载体。**

> 这呼应 [01-5 状态分类](../01-5-state-management/state-classification.md)：URL 状态是五大状态类型之一，且是**最该优先使用**的那种。

## 为什么：URL 状态的三大独特优势

### 优势 1：可分享
把 URL 发给别人，他打开看到的是**完全一样的视图**（同样筛选、同样分页）。藏在 Redux 里的状态，分享链接只会打开默认页。

### 优势 2：可刷新
刷新页面，URL 状态天然保留——还是在第 3 页、还是同样的筛选。Redux/组件 state 一刷新就丢，用户要重新操作。

### 优势 3：可后退
用户点后退，回到上一个**完整状态**（包括筛选条件），而非空白初始态。浏览器历史天然成为应用的"撤销"。

> 这三个优势让 URL 成为**视图状态的理想存储**。能用 URL 就别用 store，是状态架构的重要原则（呼应 [01-5 状态架构](../01-5-state-management/state-architecture.md) 的决策树）。

## 怎么用：哪些状态该进 URL

### 该进 URL 的状态（视图状态）
| 状态 | URL 位置 | 例子 |
|---|---|---|
| 当前页面/路由 | 路径 | `/products` |
| 资源 ID | 路径参数 | `/product/123` |
| 筛选条件 | 查询参数 | `?category=phone` |
| 排序 | 查询参数 | `?sort=price` |
| 分页 | 查询参数 | `?page=3` |
| 当前 Tab | 查询参数 | `?tab=detail` |
| 搜索关键词 | 查询参数 | `?q=iphone` |

**判断标准**：这个状态是否"用户会想通过 URL 重现"？是 → 进 URL。

### 不该进 URL 的状态
- 临时 UI 细节（弹窗瞬时开关、输入焦点）→ 组件 state。
- 敏感信息（token）→ 绝不进 URL（URL 会进历史/日志/Referer，呼应 [01-11 安全](../01-11-security/README.md)）。
- 大量数据 → URL 有长度限制，别塞大对象。

### 路径参数 vs 查询参数
| | 路径参数 `/user/:id` | 查询参数 `?key=value` |
|---|---|---|
| 语义 | 资源标识（"哪个"） | 视图参数（"怎么看"） |
| 可选性 | 必需（缺了路由不匹配） | 可选（任意附加） |
| 例子 | `/user/123` 的 123 | `?sort=name` 的 sort |

资源 ID 用路径参数（标识"哪个"），筛选/排序/分页用查询参数（描述"怎么看同一批资源"）。

### 双向同步：URL 与 UI
URL 状态要和 UI 双向同步：
- **改状态 → 更新 URL**：用户点"第 3 页"，更新 URL 的 `?page=3`（用 pushState 或路由库的 setSearchParams）。
- **URL 变 → 更新 UI**：用户点后退/分享链接进来，从 URL 读状态初始化 UI。
现代路由库（React Router 的 useSearchParams）自动处理这个同步。

## 常见坑

- ❌ **筛选/分页藏进 Redux**：分享链接丢筛选、刷新回第一页。
  - ✅ 正例：能进 URL 的视图状态进 URL。
- ❌ **敏感信息进 URL**：token/session 放查询参数，URL 进历史/日志泄露。呼应 [01-11 安全](../01-11-security/README.md)。
- ❌ **URL 和 store 双重存储同一状态**：两处打架，难同步。
  - ✅ 正例：单一来源，URL 是视图状态的真理。
- ❌ **大对象塞 URL**：URL 超长被截断。URL 只放精简的标识和参数。

## 关联（双向打通）

- **依赖 ↓**：[路由模型](./routing-model.md)、[01-5 状态分类](../01-5-state-management/state-classification.md)
- **属于 ↑**：[01-7 路由与导航](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - URL 状态归属决策 → [01-5 状态架构](../01-5-state-management/state-architecture.md)
  - token 存储安全 → [01-11 安全](../01-11-security/README.md)
