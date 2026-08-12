---
title: "web服务配置"
sidebar_position: 2
hide_title: true
keywords: [HTTP,server,超时,HTTPS,Swagger,静态文件]
description: '说明 SagooIoT HTTP 服务端口、读写超时、HTTPS、OpenAPI/Swagger 与静态资源配置。'
---

# Web 服务配置

对应 `server:`。

```yaml
server:
  serverAgent: "SagooIOT Server"
  address: ":8199"
  dumpRouterMap: false
  routeOverWrite: true
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  NameToUriType: 3                    # 1 驼峰转下划线 2 下划线转驼峰 3 不转换
  maxHeaderBytes: "20KB"
  clientMaxBodySize: "50MB"
  readTimeout: "60s"                  # 读超时
  writeTimeout: "60s"                 # 写超时
  idleTimeout: "120s"                 # Keep-Alive 空闲后服务端关闭，减轻 TIME_WAIT
  https: false
  httpsCertFile: ""
  httpsKeyFile: ""
  indexFiles: [ "index.html" ]
  indexFolder: false
  serverRoot: "resource/public"
  searchPaths: [ "/resource/public/" ]
  fileServerEnabled: true
  adminPprofPort: "58089"
# allowedDomains:
#   - https://example.com
```

| 参数 | 说明 |
|------|------|
| address | 管理 API 监听，示例 `:8199` |
| openapiPath / swaggerPath | OpenAPI JSON 与 Swagger UI；前面有网关时路径需与 Nginx 一致 |
| readTimeout / writeTimeout | 单次读写超时 |
| idleTimeout | 空闲连接超时，用于回收 Keep-Alive |
| https* | 进程内 HTTPS；生产更常见是前面 Nginx 终结 TLS |
| adminPprofPort | 管理端 pprof 端口 |
| allowedDomains | 允许的跨域来源列表（按需解开注释） |

通用 GoFrame 项还可参考 [GoFrame Web 服务配置](https://goframe.org/docs/web/server-config-file-template)。
