---
title: "业务数据库"
sidebar_position: 11
hide_title: true
keywords: [MySQL,database,连接池,ORM]
description: '说明 database 节：业务库连接串、连接池与 SQL 日志。'
---

# 业务数据库

对应 `database:`，存放组织、设备档案、告警规则等**业务数据**。设备历史时序见 [时序数据库](/docs/install/config/tsd)。

```yaml
database:
  logger:
    path: "resource/log/sql"
    level: "error"
    stdout: false
    ctxKeys: [ "RequestId" ]
  default:
    link: "mysql:user:pass@tcp(127.0.0.1:3306)/sagooiot?loc=Local&parseTime=true"
    debug: false
    charset: "utf8mb4"
    dryRun: false              # true 时只读不写
    maxIdle: 50
    maxOpen: 1000
    maxLifetime: 120           # 连接可复用秒数
```

| 参数 | 说明 |
|------|------|
| link | GoFrame 连接串，含库名与 `parseTime=true` |
| debug | true 时 SQL 更详细（勿在生产长期开） |
| maxIdle / maxOpen / maxLifetime | 连接池 |

库需预先创建；表结构以产品安装/迁移脚本为准。完整示例见 [配置文件](/docs/install/config/config)。
