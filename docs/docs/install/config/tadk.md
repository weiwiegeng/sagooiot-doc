---
title: "任务队列配置"
sidebar_position: 8
hide_title: true
keywords: [task,任务队列,聚合,超时]
description: '说明异步任务队列 retention、超时、并发与分组聚合参数。'
---

# 任务队列配置

对应 `task:`。

```yaml
task:
  retention: 60           # 任务保留（秒）
  maxRetry: 1             # 最大重试
  clearArchived: 300      # 清理归档间隔（秒）
  timeout: 300            # 单任务超时（秒）；耗时任务勿设过小
  concurrencyNum: 1000    # 并发
  groupGracePeriod: 1     # 入组后等待更多任务（秒）
  groupMaxDelay: 1        # 最长等待（秒）
  groupMaxSize: 2000      # 一组最大条数
```

| 参数 | 作用 |
|------|------|
| groupGracePeriod | 入组后再等一会，便于凑批 |
| groupMaxDelay | 即使没凑满也最多等到该时长 |
| groupMaxSize | 达到条数立即处理 |

三者一起在延迟与吞吐之间折中。示例默认超时 **300 秒**（不再是 30），避免长任务被误杀。
