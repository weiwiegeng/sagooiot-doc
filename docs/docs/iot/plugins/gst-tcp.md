---
title: 'GST-TCP'
sidebar_position: 13
hide_title: true
keywords: [海湾,GST,TCP,协议插件,粘拆包]
description: '说明海湾 GST-TCP 协议插件在网络服务、产品与设备上的配置方法。'
---

# 海湾 GST-TCP 协议插件

接入海湾传输装置 TCP 数据，帧为 JSON + `)))` 结束符。

## 网络服务配置

| 参数 | 建议值 | 说明 |
|------|--------|------|
| 类型 | tcp | TCP 服务 |
| 地址 | 如 `0.0.0.0:6666` | 监听地址 |
| 注册包规则 | `\{"id":(\d+),"data":\{.*?\}\}\)\)\)` | 正则提取设备 ID（与插件 README 一致） |
| 粘拆包规则 | `)))` | 分隔符拆包 |

## 产品与设备配置

| 项 | 值 |
|----|----|
| 消息协议 | `gst-tcp` |
| 网络服务 | 上述 TCP 服务 |
| 设备 Key | 与报文 `id` 一致 |
| 属性标识 | 与 `data` 内 JSON key 一致 |

- `data` 无 `alarm`/`event`：按属性上报  
- 含 `event`/`alarm`：按事件上报（`alarm` 时事件标识固定为 `alarm`）  
- 下行当前为透传
