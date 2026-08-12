---
title: 'Modbus'
sidebar_position: 1
hide_title: true
keywords: [Modbus,Modbus TCP,Modbus RTU,驱动插件,寄存器,功能码,采集配置]
description: '说明 Modbus 驱动插件的连接参数、点位定义与功能下发配置。'
---

# Modbus 驱动插件

支持 Modbus TCP / RTU / ASCII 主动采集（Master），可读写线圈与寄存器。

## 设备连接配置

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| deviceKey | string | 设备唯一标识 | `device_001` |
| mode | string | 协议模式 | `tcp` / `rtu` / `ascii` |
| address | string | TCP 为 `IP:端口`，串口为设备路径 | `192.168.1.100:502` / `/dev/ttyUSB0` |
| slaveId | int | 从站 ID | `1` |
| timeout | int | 超时（秒） | `5` |
| baudRate | int | 波特率（串口） | `9600` |
| dataBits | int | 数据位（串口） | `8` |
| stopBits | int | 停止位（串口） | `1` |
| parity | string | 校验位 | `N` / `E` / `O` |
| byteOrder | string | 多寄存器字节序 | `ABCD` / `DCBA` / `BADC` / `CDAB` |
| points | json | 点位定义列表（字符串化 JSON） | 见下表 |

## 点位定义

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 属性标识 |
| address | int | 寄存器/线圈地址 |
| function | int | `1` 读线圈，`2` 读离散输入，`3` 读保持寄存器，`4` 读输入寄存器 |
| type | string | `int16`/`uint16`/`int32`/`uint32`/`float32`/`float64`/`bool` |
| scale | float | 系数 |
| offset | float | 偏移量 |

## 功能下发

按物模型 `key` 写入即可；插件根据点位配置的地址与功能码执行写操作。Float32/Int32 会按字节序拆成两个 16 位寄存器。

```json
{"key": "temp_setting", "value": 35.5}
```
