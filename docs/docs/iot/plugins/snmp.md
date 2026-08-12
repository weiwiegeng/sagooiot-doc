---
title: 'SNMP'
sidebar_position: 3
hide_title: true
keywords: [SNMP,OID,v2c,v3,驱动插件,网管采集]
description: '说明 SNMP 驱动插件的版本鉴权、设备连接与 OID 点位配置。'
---

# SNMP 驱动插件

支持 SNMP v1 / v2c / v3，用于交换机、路由器等网络设备的 Get/Set。

## 插件级配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| maxRetries | integer | 3 | 最大重试次数 |
| timeout | integer | 10 | 默认超时（秒） |

## 设备连接配置

| 参数 | 类型 | 必填 | 默认值 | 适用版本 | 说明 |
|------|------|------|--------|----------|------|
| host | string | 是 | - | 全部 | 设备 IP |
| port | integer | 否 | 161 | 全部 | 端口 |
| version | select | 否 | v2c | 全部 | `v1`/`v2c`/`v3` |
| community | string | 否 | public | v1/v2c | Community |
| v3SecurityLevel | select | 否 | noAuthNoPriv | v3 | 安全级别 |
| v3Username | string | 否 | - | v3 | 用户名 |
| v3AuthProtocol | select | 否 | MD5 | v3 | `MD5`/`SHA` |
| v3AuthPassword | password | 否 | - | v3 | 认证密码 |
| v3PrivProtocol | select | 否 | DES | v3 | `DES`/`AES` |
| v3PrivPassword | password | 否 | - | v3 | 加密密码 |

v3 安全级别：`noAuthNoPriv` / `authNoPriv` / `authPriv`。

## 物模型点位配置

| 字段 | 说明 |
|------|------|
| oid | OID，如 `1.3.6.1.2.1.1.5.0` |
| operation | `get` / `getnext` / `walk`（实际以 Get 为主） |
| dataType | `auto`/`int`/`gauge`/`string`/`counter`/`timeticks`/`ipaddress`/`oid` |
| scale / offset | 数值变换：原始值 × scale + offset |
| writable | 是否允许 SNMP Set |
| timeout | 单点超时 1–60 秒 |

```json
{
  "extConfig": {
    "protocol": "snmp",
    "config": {
      "oid": "1.3.6.1.2.1.1.5.0",
      "operation": "get",
      "dataType": "string"
    }
  }
}
```
