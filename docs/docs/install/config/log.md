---
title: "日志配置"
sidebar_position: 7
hide_title: true
keywords: [日志,logger,模块日志,Jaeger,滚动]
description: '说明 logger 滚动与模块过滤，以及 jaeger 链路追踪地址。'
---

# 日志配置

对应 `logger:`。基于 GoFrame [glog](https://goframe.org/docs/core/glog-config)。

```yaml
logger:
  path: "resource/log/server"       # 空则只打终端
  file: "{Y-m-d}.log"
  prefix: ""
  level: "all"                      # all|debug|info|warn|error|critical
  ctxKeys: []
  header: true
  stdout: true
  rotateSize: 0                     # 按大小切分，0=关
  rotateExpire: "1d"                # 按天滚动
  rotateBackupLimit: 7              # 保留文件个数
  rotateBackupExpire: 0
  rotateBackupCompress: 0           # 0–9，0=不压缩
  rotateCheckInterval: "1h"
  stdoutColorDisabled: false
  writerColorEnable: false
  module:                           # 只输出列出的模块，便于排查
    - "worker"
    # - "mqtt"
    # - "device"
    # - "network"
    # - "system"
    # - "redis"
```

`module` 有值时，未列出的模块日志会被滤掉，生产全量排查请留空或按需增补。

SQL 日志在 `database.logger`，规则引擎在 `rule.log_file`，与本节独立。

## Jaeger

```yaml
jaeger:
  endpoint: "http://127.0.0.1:4318"
```

未部署 Jaeger 时可忽略；地址不可达时注意启动日志，避免误以为业务故障。
