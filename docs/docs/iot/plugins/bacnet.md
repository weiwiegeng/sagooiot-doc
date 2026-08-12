---
title: 'BACnet/IP'
sidebar_position: 4
hide_title: true
keywords: [BACnet,楼宇自控,驱动插件,Present_Value]
description: '说明 BACnet/IP 驱动插件的插件级、设备级与对象点位配置。'
---

# BACnet/IP 驱动插件

通过 UDP/IP 连接楼宇自动化设备，读写对象 Present_Value（默认端口 47808）。

## 插件级配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| interface | string | 0.0.0.0 | 绑定网卡 IP |
| port | integer | 47808 | 本地 UDP 端口 |
| broadcastAddress | string | 255.255.255.255 | Who-Is 广播地址 |

## 设备连接配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| deviceId | integer | 是 | - | BACnet 设备实例 ID |
| address | string | 是 | - | 设备 IP |
| net | integer | 否 | 0 | BACnet 网络号 |
| pollInterval | integer | 否 | 60 | 采集周期（秒） |

## 物模型点位配置

| 字段 | 说明 |
|------|------|
| objectType | `AnalogInput`/`AnalogOutput`/`AnalogValue`/`BinaryInput`/`BinaryOutput`/`BinaryValue`/`MultiStateInput`/`MultiStateOutput`/`MultiStateValue`（也可用枚举数值） |
| instance | 对象实例号 0–65535 |

```json
{
  "extConfig": {
    "protocol": "bacnet",
    "config": {"objectType": "AnalogInput", "instance": 0}
  }
}
```

写入时按对象类型自动转为 REAL / ENUMERATED，优先级 8。
