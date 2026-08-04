# 乐观更新（Optimistic Update）

> 点了"点赞"，界面立刻 +1，而不是等服务器确认——这就是乐观更新。它让操作"感觉瞬间完成"，是体验优化的利器，但失败时要会回滚。

## 是什么

乐观更新（Optimistic Update）指**在服务器确认之前，先假设操作成功并更新 UI**，等服务端响应回来再确认或回滚。

对比两种更新策略：
| 策略 | 流程 | 体验 |
|---|---|---|
| **悲观更新** | 等服务端确认成功，再更新 UI | 慢，每次操作都有等待 |
| **乐观更新** | 先假设成功更新 UI，后台等确认 | 快，操作即时反馈 |

一句话边界：**乐观更新用"假设成功"换"即时反馈"，代价是失败时要回滚。**

## 为什么：为什么用乐观更新

回到 [前端的本质](../../00-foundation/frontend-essence.md) 差异 1——前端是用户感知层，体验决定去留。点赞、收藏、勾选这类操作，如果每次都等服务端确认（悲观），用户会感觉"点一下卡一下"，体验差。

乐观更新让操作**瞬间生效**（先改 UI），用户感觉"立刻响应"。等服务端真正确认（通常几百毫秒后），如果成功就保持，失败就回滚——大多数情况下用户根本感知不到这个延迟。

> 这是 [感知性能](../01-9-performance-ux/README.md) 的极致体现：不是真的更快，而是让用户**感觉**更快。

### 适用前提
乐观更新有风险，前提是**操作成功率很高**（如点赞、已读标记、勾选）。如果操作经常失败（如提交订单有库存冲突、支付有余额不足），乐观更新反而让用户看到"成功又撤销"，更糟。这种场景用悲观更新更稳妥。

## 怎么用：乐观更新 + 失败回滚

### 流程
```
1. 用户触发操作（如点赞）
2. ★ 立即在缓存里把数据改成"已点赞"（UI 瞬间更新）
3. 后台发请求给服务端
4. 服务端响应：
   - 成功 → 保持（确认）
   - 失败 → 回滚到操作前（撤销 + 提示）
```

### TanStack Query 的 onMutate / rollback 模式
```
useMutation(toggleLike, {
  onMutate: async (newLike) => {
    // ★ 先取消相关查询，避免覆盖乐观值
    await queryClient.cancelQueries(['post', postId])
    // 保存旧值（用于回滚）
    const prevPost = queryClient.getQueryData(['post', postId])
    // ★ 乐观更新：先假设成功
    queryClient.setQueryData(['post', postId], { ...prevPost, liked: newLike })
    return { prevPost }   // 作为 context 传给 onError
  },
  onError: (err, vars, context) => {
    // ★ 失败：回滚
    queryClient.setQueryData(['post', postId], context.prevPost)
    showToast('操作失败，已撤销')
  },
  onSettled: () => {
    queryClient.invalidateQueries(['post', postId])  // 最终以服务端为准
  }
})
```

### 关键点：保存旧值以便回滚
乐观更新的核心风险是"失败后要恢复"。所以**改之前先存旧值**（onMutate 里），失败时（onError）用旧值回滚。漏了这步，失败就回不去。

## 常见坑

- ❌ **乐观更新不存旧值**：失败时无法回滚，数据永远停留在错误的乐观状态。
  - ✅ 正例：onMutate 存旧值，onError 回滚。
- ❌ **对低成功率操作用乐观更新**：如提交订单，库存常冲突，乐观后频繁回滚，体验更差。
  - ✅ 正例：成功率高的轻操作用乐观；涉及关键状态变更的用悲观。
- ❌ **乐观更新与缓存失效冲突**：乐观改了缓存，紧接着 invalidate 又用服务端旧数据覆盖。
  - ✅ 正例：乐观更新先 cancel 相关 query，避免并发请求覆盖乐观值。
- ❌ **多字段乐观更新不一致**：只乐观改了一个字段，关联字段没改，界面矛盾。

## 关联（双向打通）

- **依赖 ↓**：[客户端缓存](./client-cache.md)、[异步四态](./async-four-states.md)
- **属于 ↑**：[01-6 数据获取与缓存](./README.md) → [01 核心支柱](../README.md)
- **相关 →**：
  - 乐观更新的感知价值 → [01-9 性能与体验](../01-9-performance-ux/README.md)
  - 失败处理 → [错误处理与重试](./error-handling-retry.md)
