---
title: "系统与安全"
sidebar_position: 1
hide_title: true
keywords: [system,MCP,SSRF,gfToken,上传,WebSocket Origin,集群]
description: '说明 system、network.websocket、gfToken、cache 等系统级与安全相关配置。'
---

# 系统与安全

对应 `system:`、`network.websocket`、`gfToken`、`cache`。设备缓存字段见 [设备日志缓存](/docs/install/config/device)。

---

## 运行形态

| 参数 | 默认 | 说明 |
|------|------|------|
| debug | false | 调试模式 |
| enablePProf / pprofPort | — | 进程 pprof |
| isDemo | false | 演示环境限制 |
| isCluster | false | 集群模式，**必须配 Redis** |
| useInternalMqttService | true | 使用进程内 MQTT Broker；外置 EMQX 等请设 `false` |
| useInternalRuleService | true | 内置规则引擎；独立部署规则服务时设 `false` |
| ipMethod | whois | IP 归属：`cz88` / `whois` |
| pluginsPath | `./plugins/built` | 插件扫描目录 |

---

## MCP

```yaml
system:
  mcp:
    enable: true
    excludeTables: [ "sys_authorize" ]
```

启用后提供 MCP 工具调用；`excludeTables` 中的表不会暴露给工具。对应 Token 排除路径常含 `/api/v1/ai/mcp`。

---

## 上传与 i18n

```yaml
system:
  upload:
    path: "upload"
    tls:
      insecureSkipVerify: true   # 拉远程文件时跳过证书校验；生产建议 false
  i18n:
    file:
      path: "manifest/i18n"
      lang: "zh-CN"
```

---

## SSRF 防护

用于 OpenAPI 数据源、Webhook 等出站 URL 校验。

```yaml
system:
  ssrf:
    enabled: false
    allowPrivateIP: false
    allowLocalhost: false
    whitelist: "api.example.com,*.internal.corp"
    blacklist: "evil.com"
```

开启后业务 URL 与 Token URL 均可能被拦截，见 [HTTP API 数据源](/docs/datahub/source-api) 排障说明。

---

## JS 解释器

规则/脚本节点执行超时：

```yaml
system:
  jsinterpreter:
    timeout: 5000          # 毫秒
    timeoutEnabled: true
```

---

## WebSocket Origin

组态等平台 WebSocket 的浏览器 Origin 限制（**南向设备 WebSocket 接入**不走这项）：

```yaml
network:
  websocket:
    allowedOrigins: "https://example.com,https://app.example.com,*.internal.corp"
```

不配置则允许所有来源。组态接口见 [WebSocket 接口说明](/develop/openapi/northbound/websocket)。

---

## 登录 Token（gfToken）

```yaml
gfToken:
  timeOut: 10800              # 有效期（秒）
  maxRefresh: 5400            # 自动刷新窗口（秒）
  refreshGracePeriod: 0       # 过期后再刷新的宽限，0=不允许刷过期 Token
  multiLogin: true
  encryptKey: "<32位>"
  excludePaths:
    - "/api/v1/login"
    - "/api/v1/sysinfo"
    - "/api/v1/captcha"
    - "/api/v1/websocket/configureDiagram/ws"
    - "/api/v1/ai/mcp"
```

OpenAPI 北向走 AK/SK，不走 gfToken。

---

## 缓存

```yaml
cache:
  prefix: "SagooIot_Sys:"
  adapter: "redis"              # memory | redis | file
  fileDir: "./storage/cache"    # adapter=file 时必填
```

集群或设备缓存依赖 Redis 时，`adapter` 用 `redis`，并配好 `redis.default`（见 [缓存与 Redis](/docs/install/config/redis)）。
