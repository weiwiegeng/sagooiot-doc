---
title: 'LwM2M'
sidebar_position: 12
hide_title: true
keywords: [LwM2M,协议插件,SenML,网络服务]
description: '说明 LwM2M 协议插件与 LwM2M 网络服务配合时的产品、设备配置要点。'
---

# LwM2M 协议插件

将网络组件 **LwM2M 服务端** 上报的信封解码为物模型属性 JSON。MVP **不支持** Encode（平台主动 Read/Write/Execute）。

## 配合配置

1. 网络组件 → 服务器类型选 `lwm2m`
2. 产品「消息协议」选 `lwm2m`
3. 设备 `DeviceKey` = LwM2M Endpoint Name（注册 `POST /rd?ep={DeviceKey}`）

## 上报信封格式

```json
{
  "lwm2m": true,
  "path": "/3303/0/5700",
  "contentFormat": "senml-json",
  "payload": "[{\"bn\":\"/3303/0/\",\"n\":\"5700\",\"v\":25.5}]"
}
```

支持 `contentFormat`：`senml-json` / `json` / `text`；`tlv`/`octet` 暂作 base64 opaque。
