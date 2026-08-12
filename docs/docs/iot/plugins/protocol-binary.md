---
title: 'Binary 协议'
sidebar_position: 14
hide_title: true
keywords: [二进制协议,帧规则,checksum,协议插件]
description: '说明通用二进制协议插件的产品帧规则与属性偏移解析配置。'
---

# Binary 协议插件

按产品级帧规则（`policy`）+ 属性 `extConfig` 解析完整上报帧。产品消息协议选择 `binary`。

## 产品帧规则（policy）示例

```json
{
  "version": 1,
  "header": {"hex": "AA55", "match": "prefix"},
  "payloadOffset": 4,
  "checksum": {
    "algorithm": "xor8",
    "offset": "last",
    "width": 1,
    "range": {"start": 2, "end": "beforeChecksum"},
    "byteOrder": "big"
  },
  "byteOrder": "big",
  "maxFrameLength": 255,
  "trailingBytes": "reject"
}
```

## 属性扩展配置

```json
{
  "protocol": "binary",
  "config": {
    "offset": 4,
    "length": 2,
    "dataType": "int16",
    "byteOrder": "big",
    "scale": 0.1,
    "bias": 0
  }
}
```

- `offset` 相对完整帧起始（含帧头）  
- 字段越界/类型失败跳过该字段；帧头/校验失败则整帧失败  
- 网络层完成粘拆包后由宿主统一 `Decode`
