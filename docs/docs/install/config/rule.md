---
title: "规则引擎服务"
sidebar_position: 13
hide_title: true
keywords: [规则引擎,rule,JWT,Lua]
description: '说明 rule 节：规则引擎进程端口、账号、脚本超时与内置开关。'
---

# 规则引擎服务

对应 `rule:`。是否在本进程拉起引擎，由 `system.useInternalRuleService` 控制（默认 true）。独立部署时设为 false，并保证 `rule.server` 地址可达。

```yaml
system:
  useInternalRuleService: true

rule:
  jwt_secret_key: "<JWT密钥>"
  users:
    admin: admin,<passwordHash>
  data_dir: "./data"
  log_file: "resource/log/rule.log"
  cmd_white_list: "cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest"
  load_lua_libs: true
  server: ":9090"
  default_username: "admin"
  debug: true
  max_node_log_size: 40
  save_run_log: false
  script_max_execution_time: 5000    # 毫秒
  mqtt:
    enabled: true
```

| 参数 | 说明 |
|------|------|
| server | 规则引擎 HTTP 端口 |
| jwt_secret_key / users | 引擎控制台鉴权 |
| script_max_execution_time | 脚本最长执行时间 |
| cmd_white_list | 允许规则节点调用的外部命令 |
| mqtt.enabled | 规则侧 MQTT 能力 |

节点说明见用户手册 [规则引擎](/docs/iot/ruleEngine/instance)。JS 超时另见 [系统与安全](/docs/install/config/system) 的 `jsinterpreter`。
