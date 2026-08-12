---
title: 'JSON 协议'
sidebar_position: 15
hide_title: true
keywords: [JSON协议,消息协议,编解码,协议插件]
description: '说明 JSON 协议插件的解析模式、编解码约定与可选二进制帧配置。'
---

# JSON 协议插件

解析标准 JSON 设备报文，适用于 MQTT/HTTP 等接入；另内置一套示例二进制帧编解码。

## 插件配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| decodeStrict | boolean | true | 严格模式：忽略未知字段 |
| byteOrder | select | big | 内置二进制帧字节序 big/little |

## 物模型约定

JSON 模式通常**无需**额外 `extConfig`：

1. 属性 key 与上报 JSON 字段名一致  
2. 事件需在上报 JSON 中带对应事件标识  
3. 下发命令类型：

| 命令 | 输出 |
|------|------|
| write | `{"action":"write","params":{...}}` |
| read | `{"action":"read","keys":[...]}` |
| custom | 透传参数 |

上报示例：`{"temperature":25.5,"humidity":60.0}` 将映射为对应属性。

内置二进制帧（可选）格式为 `0xAA55` + 长度 + 命令 + 负载 + XOR 校验，命令 `0x01/0x02/0x03` 对应温度湿度、状态、电压电流等固定解析，一般用于样例联调。
