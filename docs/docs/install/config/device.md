---
title: "设备日志缓存"
sidebar_position: 3
hide_title: true
keywords: [设备缓存,Redis,deviceCacheData,批处理]
description: '说明 system.deviceCacheData：设备近期数据在 Redis 中的缓存时长、条数与写入批处理参数。'
---

# 设备日志缓存

对应 **`system.deviceCacheData`**（不是 `server` 节）。数据在 **Redis** 中做短期缓冲，不适合海量长期存储；历史时序见 [时序数据库](/docs/install/config/tsd)。

```yaml
system:
  deviceCacheData:
    batchSize: 20
    batcher:
      maxMemoryMB: 100
      memoryCheckInterval: 10s
    flushInterval: 50ms
    workerCount: 0              # 0=自动：CPU 核心数×2，限制在 8–32；手动 4–128
    taskQueueSize: 0            # 0=默认 1024；设备多、上报集中时调大（256–65536）
    pipelineBufferSize: 20      # 每次写入 Redis 的条数
    poolSize: 500               # 缓存池连接数
    recordDuration: 300m        # 缓存时长，超时清理
    recordLimit: 1000           # 单设备条数上限
    strictWriteError: false     # false：写失败只打日志；true：Insert/Set/Del 返回真实错误
```

| 参数 | 说明 |
|------|------|
| recordDuration / recordLimit | 过期或超条数即清理 |
| workerCount / taskQueueSize | 刷新并发与队列；上报突发打满队列时调大 `taskQueueSize` |
| strictWriteError | 兼容旧行为默认 false；需要调用方感知写失败时再打开 |

集群部署须 `system.isCluster: true` 且 Redis 可用。
