---
sidebar_position: 0
title: '北向接口概述'
keywords: [北向接口,OpenAPI,MQTT北向,AK/SK,Webhook,规则引擎,系统集成,对接指南]
description: 'SagooIoT 北向对接指南：OpenAPI（AK/SK）管理控制、MQTT Topic 实时数据、告警通知与规则引擎出站选型说明。'
---

# 北向接口对接指南

第三方系统对接 SagooIoT 时，推荐标准做法：

> **管理与控制走 OpenAPI（AK/SK）；实时设备数据与状态变更走 MQTT 北向 Topic；告警走通知渠道（含 Webhook）。需要入 Kafka / 自有 HTTP 时，通过规则引擎或客户侧 MQTT 桥接完成。**

详细 HTTP 报文见 [HTTP 接口说明](./http.md)；MQTT Topic 与报文见 [MQTT 接口说明](./mqtt.md)；签名过程见 [AK/SK 认证说明](../authority/start.md)。

---

## 能力总览

| 通道 | 用途 | 入口 | 鉴权 |
|------|------|------|------|
| OpenAPI | 管设备/物模型、查最新值/时序、属性设置、服务调用、OTA 等 | `/openapi/v1/...` | AK/SK |
| MQTT 北向 Topic | 实时推送：上下线、设备增删改、属性/事件上报、下行过程通知 | MQTT Broker 上的 `/message/...` | MQTT 账号与 ACL |
| 组态 WebSocket | 组态大屏点位实时值（展示用，非通用北向总线） | `/api/v1/websocket/configureDiagram/ws` 等 | 管理端 Token / OpenAPI AK/SK |
| 通知 Webhook | 告警、业务通知投递到企微/钉钉/自有网关 | 通知插件 Webhook | 插件配置 |
| 规则引擎 | 订北向消息后过滤，再 HTTP/MQTT 等出站 | 规则链 + 设备入站节点 | 按规则节点各自配置 |

**边界约定：**

- 设备遥测 / 生命周期 → 用 MQTT 北向，**不要**用通知 Webhook，也**不要**把组态 WebSocket 当通用数据总线  
- 告警进外部系统 → 用通知插件；不要把 Webhook 当成通用数据总线  
- 组态 / 大屏点位刷新 → 用 [WebSocket（组态推送）](./websocket.md)  
- `/openapi/v1/product/...` 与 `/openapi/v1/north/...` 能力有重叠；**推荐统一走业务语义更清晰的 `/openapi/v1/product` 等分组**，`/north` 作为历史/精简控制面兼容入口  

---

## 对接选型

| 客户类型 | 怎么接 | 典型场景 |
|----------|--------|----------|
| 同步型 | 只调 OpenAPI | ERP/工单控设备、定时拉最新值、设备档案同步 |
| 流式型 | 常驻订阅 MQTT 北向 Topic | 实时看板、中间件转发、自建告警加工 |
| 混合型 | OpenAPI + MQTT（**推荐默认**） | 既要控设备，又要实时数据 |
| 要进 Kafka / 自有 HTTP | MQTT 订阅后桥接，或规则引擎出站 | 大数据、多消费组削峰 |

当前**不提供**平台级 AMQP 消费组、Kafka 一等目的地配置台；上述场景用桥接即可。

---

## OpenAPI（管理面 / 控制面）

### 入口与鉴权

- 前缀：`/openapi/v1`（若网关加了 `/base-api` 等前缀，请一并加上）  
- 鉴权参数见 [AK/SK 认证说明](../authority/start.md)：

| 参数 | 说明 |
|------|------|
| `appId` | 系统应用 ID（须已创建且启用） |
| `time` | Unix 时间戳（秒） |
| `sign` | 签名 |

```text
message = "ak=" + AccessKey + "&time=" + time
sign    = hex( HMAC-SHA256(message, SecureKey) )
```

`AccessKey` / `SecureKey` 来自「系统配置 → 应用管理」；`appId` 用于查找应用并校验状态。

```bash
# 示意：先按算法算出 SIGN
curl -X POST "https://{host}/openapi/v1/product/property/set?appId={APP_ID}&time={TS}&sign={SIGN}" \
  -H "Content-Type: application/json" \
  -d '{"deviceKey":"dev001","params":{"switch":1}}'
```

完整清单以运行环境 Swagger /「系统监控 → API 文档」为准。

### 推荐常用能力

优先使用 `/openapi/v1` 下业务分组（以 `/product` 为例）；`/north` 同名能力可作兼容对照，见 [HTTP 接口说明](./http.md)。

| 能力 | 方法 | 路径（示例） |
|------|------|----------------|
| 设备详情 / 按 key 查 | GET | `/openapi/v1/product/device/detail`、`/device/getinfo` |
| 设备分页列表 | GET | `/openapi/v1/product/device/page_list` |
| 添加 / 编辑 / 删除设备 | POST/PUT/DELETE | `/openapi/v1/product/device/add` 等 |
| 启用 / 禁用 | POST | `/openapi/v1/product/device/deploy`、`/undeploy` |
| 最新属性 | GET | `/openapi/v1/product/device/get_latest_property` |
| 指定属性 | GET | `/openapi/v1/product/device/property/get` |
| 属性设置 | POST | `/openapi/v1/product/property/set` |
| 服务（功能）调用 | POST | `/openapi/v1/product/function/do` |
| 批量服务调用 | POST | `/openapi/v1/product/function/batchDo` |
| 时序 / 分析数据 | GET | OpenAPI 中 `deviceData`、`deviceDataForTsd` 等 |
| OTA | — | OpenAPI 中 OTA / operate 相关接口 |

**属性设置：**

```json
{
  "deviceKey": "dev001",
  "params": {
    "temperature": 26.5,
    "switch": 1
  }
}
```

**服务调用：**

```json
{
  "deviceKey": "dev001",
  "funcKey": "reboot",
  "params": {}
}
```

控制类接口成功后，平台仍会发布对应 MQTT 北向「下行过程」消息，流式订阅方可感知下发与回复。

---

## MQTT 北向 Topic（数据面）

所有北向 MQTT 消息为统一 JSON 信封（细节与样例见 [MQTT 接口说明](./mqtt.md)）：

```json
{
  "meta": {},
  "messageId": "唯一消息 ID",
  "productKey": "产品标识",
  "deviceKey": "设备标识",
  "data": {}
}
```

| 类别 | Topic |
|------|-------|
| 上线 / 下线 | `/message/device/online`、`/offline` |
| 设备增删改 | `/message/device/add`、`/update`、`/delete` |
| 属性 / 事件上报 | `/message/tsl/receive/property/report`、`/event/report` |
| 服务调用与回复 | `/message/tsl/send/service/call`、`/receive/service/reply` |
| 属性设置与回复 | `/message/tsl/send/property/set`、`/receive/property/reply` |
| 配置下发 / 回复 / 拉取 | `/message/tsl/send/config`、`/receive/config/reply`、`/receive/config/get` |

**订阅建议：** 只要遥测订属性上报；看板订上下线；资产生命周期订 add/update/delete；关注控制结果订 send 与对应 reply。

多消费者可使用 MQTT **共享订阅**（需 Broker 支持），例如 `$share/{group}/message/tsl/receive/property/report`。平台侧可配置 `mqtt.sharedSubscribe`。

:::info 可靠性预期
依赖 Broker QoS 与会话；平台不额外提供「北向消费位点 / 死信队列」。离线缓冲、至少一次、顺序等由 Broker 与订阅端实现。
:::

使用前确认配置中 `mqtt.messagingEnable: true`。

---

## 告警与 Webhook（通知面）

- 告警走告警规则 + 通知插件（邮件 / 短信 / 钉钉 / 企微 / **Webhook** 等）  
- Webhook 面向**告警与通知内容**，不是设备属性流总线  
- 默认无独立「告警北向 Topic」；若要和 MQTT 总线统一，可在业务侧从 Webhook 再转发  

---

## 规则引擎作轻量数据流转

需要「过滤后再推到 HTTP / 另一个 MQTT」时：

1. 规则链入口使用设备入站节点（`devicein`），其订阅的是**北向**属性/事件 Topic（覆盖 MQTT、Modbus、插件等多种南向接入后的北向输出）  
2. 在链内按 `productKey` / `deviceKey` 或表达式过滤  
3. 使用 HTTP / MQTT 等出站节点写到业务系统  

适合中等消息量、快速上线；强消费组、超大吞吐、严格投递审计更适合客户侧 MQTT→Kafka 桥。规则节点说明见用户手册「规则引擎」。

---

## 推荐集成架构

```text
                    ┌──────────────────┐
   控设备/查历史 ──►│ OpenAPI (AK/SK)  │
                    └────────┬─────────┘
                             │
设备数据 ──► SagooIoT 核心 ──┼── MQTT 北向 Topic ──► 业务订阅服务
                             │                          │
告警规则 ──► 通知插件 ────────┘                          ├─►（可选）Kafka/HTTP 桥
                             Webhook ──► 告警接收端      └─► 规则引擎出站
```

---

## 验收清单

- [ ] 使用应用 AK/SK 成功调用 OpenAPI：查设备详情、设属性或调服务各至少 1 次  
- [ ] MQTT 订阅到属性上报或上下线，并能解析 `messageId` / `productKey` / `deviceKey` / `data`  
- [ ] 告警（如已启用）到达约定通知渠道；未把遥测误配到 Webhook  
- [ ] 若有多消费者，共享订阅或业务侧分片策略已明确  

---

## 当前不承诺的范围

- 平台级 AMQP 服务端订阅 / 消费组管理台  
- Kafka / RocketMQ 等作为一等「数据流转目的地」产品配置  
- 通用设备数据 HTTP 推送订阅中心（与告警 Webhook 不同）  
- 北向专用消费位点、死信队列、跨协议顺序保证  

强依赖上述能力时优先客户侧桥接。

---

## 相关文档

| 内容 | 链接 |
|------|------|
| AK/SK 认证 | [认证说明](../authority/start.md) |
| HTTP 接口明细（含 `/north`） | [HTTP 接口说明](./http.md) |
| MQTT Topic 与报文 | [MQTT 接口说明](./mqtt.md) |
| 组态 WebSocket 推送 | [WebSocket 接口说明](./websocket.md) |
| 调用示例 | [北向接口示例](./example.md) |
| OpenAPI 总述 | [OpenAPI 概述](../intro.md) |
