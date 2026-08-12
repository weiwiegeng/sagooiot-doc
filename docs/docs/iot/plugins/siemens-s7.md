---
title: 'Siemens S7'
sidebar_position: 5
hide_title: true
keywords: [Siemens S7,PLC,DB区,驱动插件]
description: '说明西门子 S7 驱动插件的连接参数与数据区点位配置。'
---

# Siemens S7 驱动插件

通过 TCP（默认 102）访问 S7-200/300/400/1200/1500。

## 插件级配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| defaultTimeout | integer | 5 | 请求超时（秒） |
| maxConnections | integer | 10 | 连接池上限 |

## 设备连接配置

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| host | string | 是 | - | PLC IP |
| port | integer | 否 | 102 | 端口 |
| rack | integer | 否 | 0 | 机架号 |
| slot | integer | 否 | 自动 | 插槽：300/400 默认 2，1200/1500 默认 1 |
| plcType | select | 否 | s7-1200 | `s7-200`/`s7-300`/`s7-400`/`s7-1200`/`s7-1500` |
| timeout | integer | 否 | 5 | 连接与读写超时（秒） |
| idleTimeout | integer | 否 | 60 | 空闲断开（秒） |

## 物模型点位配置

| 字段 | 说明 |
|------|------|
| area | `DB`/`MB`/`EB`/`AB`/`TM`/`CT` |
| dbNumber | DB 编号（仅 DB 区） |
| start | 起始字节地址 |
| dataType | `bool`/`int8`/`uint8`/`int16`/`uint16`/`int32`/`uint32`/`float32`/`float64`/`string` |
| bitPos | bool 位偏移 0–7 |
| size | 字节长度 1–255 |
| scale / offset | 数值变换 |
| writable | 是否可写 |

最终值 = 原始值 × scale + offset。
