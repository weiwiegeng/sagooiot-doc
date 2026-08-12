---
title: "缓存与 Redis"
sidebar_position: 12
hide_title: true
keywords: [Redis,cache,连接池,集群]
description: '说明 cache 与 redis 节：缓存驱动、连接池、超时与重试。'
---

# 缓存与 Redis

设备短期缓存、集群、Token 等依赖 Redis。`system.isCluster: true` 时必须可用。

```yaml
cache:
  prefix: "SagooIot_Sys:"
  adapter: "redis"                 # memory | redis | file
  fileDir: "./storage/cache"       # adapter=file 时必填

redis:
  default:
    ClientName: SagooIoT_Pro
    address: 127.0.0.1:6379
    db: 0
    mode: single                   # single | cluster | sentinel
    pass: ""
    user: ""
    sentinelMasterName: sagoo-master
    poolSize: 200
    minIdle: 50
    maxIdle: 120
    maxActive: 1000
    dialTimeout: 10s
    readTimeout: 5s
    writeTimeout: 5s
    idleTimeout: 300s
    ConnMaxIdleTime: 300s
    ConnMaxLifetime: 3600s
    maxRetries: 3
    minRetryBackoff: 100ms
    maxRetryBackoff: 1s
```

| 项 | 说明 |
|----|------|
| adapter | 单机试用可用 `memory`；生产/集群用 `redis` |
| mode | 单机 / 集群 / 哨兵 |
| poolSize | 建议约 CPU×10–50；空闲连接约为池的 20%–60% |

设备缓存字段见 [设备日志缓存](/docs/install/config/device)。
