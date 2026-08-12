---
title: 'OPC UA'
sidebar_position: 2
hide_title: true
keywords: [OPC UA,驱动插件,NodeID,安全策略,功能下发]
description: '说明 OPC UA 驱动插件的插件级配置、设备连接与物模型 NodeID 绑定。'
---

# OPC UA 驱动插件

平台作为 OPC UA 客户端连接 PLC/SCADA 等服务器，支持批量读节点与写节点。

## 插件级配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| defaultTimeout | integer | 10 | 请求超时（秒） |
| autoReconnect | boolean | true | 自动重连 |

## 设备连接配置

| 参数 | Key | 必填 | 说明 | 示例 |
|------|-----|------|------|------|
| 服务地址 | endpoint | 是 | OPC UA 地址 | `opc.tcp://192.168.1.10:4840` |
| 用户名 | username | 否 | 认证用户名 | `admin` |
| 密码 | password | 否 | 认证密码 | - |
| 安全策略 | securityPolicy | 否 | `None` / `Basic256` / `Basic256Sha256` | `None` |
| 安全模式 | securityMode | 否 | `None` / `Sign` / `SignAndEncrypt` | `None` |

## 物模型点位配置

在属性 `extConfig` 中绑定 NodeID：

- `extConfig.protocol`：固定 `opcua`
- `extConfig.config.address`：NodeID，如 `ns=2;s=Device1.Temperature`

```json
{
  "key": "temperature",
  "dataType": "float",
  "extConfig": {
    "protocol": "opcua",
    "config": {"address": "ns=2;s=Device1.Temperature"}
  }
}
```

:::warning 类型匹配
OPC UA 对类型校验严格。设备点为 Int16 时物模型需选整型；误选 float 可能导致 `BadTypeMismatch`。
:::

## 功能下发

按物模型 Key 写入，插件自动查 NodeID 并按 `dataType` 转换类型：

```json
{"key": "control_switch", "value": 1}
```
