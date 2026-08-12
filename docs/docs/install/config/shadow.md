---
title: "影子服务配置"
sidebar_position: 10
hide_title: true
keywords: [设备影子,shadow,组态推送,并发]
description: '说明 shadow 节：影子更新协程池、批量推送与组态 WebSocket 节流。'
---

# 影子服务配置

对应 `shadow:`。设备影子更新与组态实时推送共用本节；**两组并发参数不是同一条路径**。

```yaml
shadow:
  # 影子更新 gpool（上报写入影子）
  initialCapacity: 50
  maxCapacity: 200
  taskQueueSize: 1000           # 千台高频上报可 5000+
  enqueueTimeout: 50ms          # 队列满等待；超时丢弃并打 WARN

  # 批量更新 / 推送（与上面 gpool 分开）
  updateConcurrency: 200        # 大量同时上线时限制并发，建议 100–500

  handlers:
    diagram:
      enabled: true             # 组态 WebSocket 实时推送
      throttleMs: 100           # 同设备推送节流（毫秒）

  batchSize: 500
  batchTimeout: 200ms
  circuitBreakerThreshold: 0.9
  fastFailTimeout: 50ms
  maxQueuePressure: 0.8
  maxRetries: 2
  retryBackoff: 200ms
  safetyTimeout: 3s
  updateQueueSize: 100000
  workerCount: 20               # 批量推送 worker
```

| 项 | 说明 |
|----|------|
| initialCapacity / maxCapacity / taskQueueSize | 上报落影子的协程池；队列满见 WARN「丢弃」时调大 |
| updateConcurrency | 影子批量更新并发，防上线风暴打满协程 |
| handlers.diagram | 组态推送开关与节流；接口见 [WebSocket](/develop/openapi/northbound/websocket) |

组态推送失败不影响影子主路径。改配置后重启服务。
