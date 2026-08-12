---
title: 'HTTP REST'
sidebar_position: 8
hide_title: true
keywords: [HTTP REST,API,OAuth2,驱动插件,JSON Path]
description: '说明 HTTP REST 驱动插件的鉴权、TLS、设备连接与端点点位配置。'
---

# HTTP REST 驱动插件

通过 HTTP/HTTPS 对 REST 设备做采集（GET）与指令下发（POST/PUT/DELETE/PATCH）。

## 插件级配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| defaultTimeout | integer | 30 | 请求超时（秒） |
| maxConnections | integer | 100 | 最大连接数 |
| keepAlive | switch | true | HTTP Keep-Alive |
| idleConnTimeout | integer | 90 | 空闲超时（秒） |

## 设备连接配置

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| baseURL | 是 | - | API 基础 URL |
| authType | 是 | none | `none`/`basic`/`bearer`/`apikey`/`oauth2`/`custom_header` |
| defaultHeaders | 否 | `{"Content-Type":"application/json"}` | 默认 Header（JSON） |
| timeout | 否 | 30 | 超时（秒） |
| retryCount | 否 | 3 | 重试次数 |
| retryInterval | 否 | 1000 | 重试间隔（毫秒） |

### 鉴权附加参数

| authType | 参数 |
|----------|------|
| basic | authUsername、authPassword |
| bearer | authToken |
| apikey | apiKeyName、apiKeyValue、apiKeyIn（header/query） |
| oauth2 | oauth2GrantType、oauth2TokenURL、oauth2ClientID、oauth2ClientSecret、oauth2Scope |
| custom_header | customHeaders（JSON） |

### TLS

| 参数 | 说明 |
|------|------|
| tlsInsecureSkipVerify | 跳过证书校验（仅测试） |
| tlsCert / tlsKey | 客户端证书与私钥（PEM） |

## 物模型点位配置

| 字段 | 说明 |
|------|------|
| endpoint | 路径或完整 URL |
| method | GET/POST/PUT/DELETE/PATCH |
| dataType | 结果类型 |
| jsonPath | 如 `data.value`、`data.sensors[0].temp` |
| scale / offset | 数值变换 |
| headers | 单点自定义 Header（JSON） |
| bodyTemplate | 写入模板，可用 `{{value}}` |
| timeout / retryCount | 单点超时与重试 |
