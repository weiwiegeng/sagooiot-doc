---
title: 'CoAP'
sidebar_position: 11
hide_title: true
keywords: [CoAP,DTLS,驱动插件,资源路径]
description: '说明 CoAP 驱动插件的连接、DTLS 与资源路径点位配置。'
---

# CoAP 驱动插件

基于 UDP 的通用 CoAP 驱动；配置 `username` 时自动启用 DTLS（PSK）。

## 设备连接配置

| 参数 | 说明 | 示例 |
|------|------|------|
| address | Host:Port | `192.168.1.100:5683` |
| timeout | 超时（秒） | `5` |
| username | DTLS PSK Identity（选填） | `user_id` |
| password | DTLS PSK Key（选填） | `secret_key` |

## 物模型点位配置

采集（GET）/写入（PUT）使用扩展配置：

| 字段 | 说明 |
|------|------|
| path | 资源路径，未配置写时默认 `/<Key>` |
| contentFormat | `text`/`json`/`cbor`/`octet`/`xml`（或对应数字码） |

```json
{
  "extConfig": {
    "config": {
      "path": "/sensors/temp",
      "contentFormat": "json"
    }
  }
}
```
