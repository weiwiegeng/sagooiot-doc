---
sidebar_position: 3
title: 'MQTT接口说明'
keywords: [MQTT北向,消息订阅,Topic,属性上报,共享订阅,messagingEnable,实时通信]
description: '说明 SagooIoT MQTT 北向：开关配置、Topic 清单、统一信封、常见报文样例、订阅建议与共享订阅。'
---

# MQTT 方式

实时设备数据与状态变更的标准北向数据面。选型与边界见 [北向接口概述](./introduce.md)。

---

## 开启北向消息

在 `manifest/config/config.yaml` 的 mqtt 段启用：

```yaml
mqtt:
  addr: 127.0.0.1:1885
  clientId: exampleClientId
  deviceLiveDuration: 30
  messagingEnable: true          # 必须为 true 才会发北向 Topic
  sharedSubscribe: false         # 多实例时平台侧共享订阅开关（可选）
  auth:
    userName: sagoo_admin
    userPassWorld: sagoo_admin
```

Broker 地址、账号以实际部署为准。业务订阅端使用独立 MQTT Client，建议配置持久会话与所需 QoS。

### 连接信息提示

1. 连接参数见上述配置文件（或运维提供的 Broker 信息）  
2. 部分部署场景下客户端标识可与开放接口凭证相关；若环境要求 `clientId = base64(AK:SK)`，可在「系统配置 → 基础配置」查看开放接口 AK/SK 后自行编码：

```go
akSk := ak + ":" + sk
clientId := base64.StdEncoding.EncodeToString([]byte(akSk))
```

具体以当前环境鉴权策略为准。

---

## Topic 清单

| 分类 | Topic | data 含义（摘要） |
|------|-------|-------------------|
| 设备 | `/message/device/online` | `timestamp`、`desc` |
| 设备 | `/message/device/offline` | `timestamp`、`desc` |
| 设备 | `/message/device/add` | 名称、部门、标签、版本、经纬度等 |
| 设备 | `/message/device/update` | 同添加结构 |
| 设备 | `/message/device/delete` | `timestamp`、`desc` |
| 物模型 | `/message/tsl/receive/property/report` | `properties`：属性标识 → 值与时间 |
| 物模型 | `/message/tsl/receive/event/report` | `eventId`、`events`、`timestamp` |
| 物模型 | `/message/tsl/send/service/call` | `serviceId`、`params`、`timestamp` |
| 物模型 | `/message/tsl/receive/service/reply` | `serviceId`、`code`、`data`、`timestamp` |
| 物模型 | `/message/tsl/send/property/set` | `properties`、`timestamp` |
| 物模型 | `/message/tsl/receive/property/reply` | `code`、`data`、`timestamp` |
| 配置 | `/message/tsl/send/config` | 配置下发载荷 |
| 配置 | `/message/tsl/receive/config/reply` | 配置下发回复 |
| 配置 | `/message/tsl/receive/config/get` | 设备侧拉取配置通知 |

---

## 统一信封

所有北向 MQTT 消息均为 JSON：

```json
{
  "meta": {},
  "messageId": "唯一消息 ID",
  "productKey": "产品标识",
  "deviceKey": "设备标识",
  "data": {}
}
```

`data` 随 Topic 变化；请按 Topic 反序列化，不要假设所有 Topic 的 `data` 字段相同。

对接时建议在联调环境抓一条真实报文固化解析逻辑（Go 结构体导出字段名以运行时序列化为准）。

---

## 订阅建议

| 需求 | 订阅建议 |
|------|----------|
| 实时遥测 | `/message/tsl/receive/property/report` |
| 事件加工 | `/message/tsl/receive/event/report` |
| 在线状态看板 | `/message/device/online`、`/offline` |
| 资产变更同步 | `/message/device/add`、`/update`、`/delete` |
| 关注控制结果 | 对应 `.../send/...` 与 `.../receive/.../reply` |

**多实例消费：** Broker 支持时可使用共享订阅，例如：

```text
$share/{group}/message/tsl/receive/property/report
```

**可靠性：** 依赖 Broker QoS 与会话；平台不提供北向消费位点 / 死信队列产品能力。

### 最小订阅样例（mosquitto）

```bash
mosquitto_sub -h {mqtt_host} -p {port} -u {user} -P {password} \
  -t '/message/tsl/receive/property/report' -v
```

---

## 常见 data 样例

以下为 `data` 段示意（外层仍有信封字段）。

### 设备上线 / 下线 / 删除

```json
{
  "timestamp": 1710000000000,
  "desc": "offline"
}
```

### 设备添加 / 更新

```json
{
  "name": "一号机",
  "deptId": 1,
  "desc": "",
  "version": "1.0.0",
  "lng": "116.3",
  "lat": "39.9",
  "Tags": [{"key": "area", "name": "区域", "value": "A"}],
  "timestamp": 1710000000000
}
```

### 属性上报

字段名以运行时序列化为准；常见为属性值与上报时间。联调时请对照真实报文：

```json
{
  "properties": {
    "temperature": {
      "Value": 25.6,
      "CreateTime": 1710000000000
    }
  }
}
```

### 事件上报

```json
{
  "eventId": "alarm",
  "events": {
    "level": 1
  },
  "timestamp": 1710000000000
}
```

### 服务调用（平台→设备过程）

```json
{
  "serviceId": "reboot",
  "params": {},
  "timestamp": 1710000000000
}
```

### 服务回复

```json
{
  "serviceId": "reboot",
  "code": 0,
  "data": {},
  "timestamp": 1710000000000
}
```

### 属性设置（过程）与回复

```json
{
  "properties": {
    "switch": 1
  },
  "timestamp": 1710000000000
}
```

```json
{
  "code": 0,
  "data": {},
  "timestamp": 1710000000000
}
```

配置类 Topic 的 `data` 随业务配置内容变化，请以联调抓包为准。

---

## 与 OpenAPI 的配合

- 用 OpenAPI 下发属性设置 / 服务调用后，仍可在北向收到对应 `send` 与 `reply` Topic  
- 不要用 Webhook 替代本页 Topic 承接遥测流  

调用示例见 [北向接口示例](./example.md)；HTTP 控制面见 [HTTP 接口说明](./http.md)。
