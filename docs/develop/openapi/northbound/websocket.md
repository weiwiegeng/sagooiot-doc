---
sidebar_position: 4
title: 'WebSocket接口说明'
keywords: [WebSocket,组态推送,实时数据,configureDiagram,设备影子,北向接口,监控]
description: '说明 SagooIoT 平台侧 WebSocket 能力边界：组态图实时推送与服务监控接口；设备遥测北向请使用 MQTT Topic。'
---

# WebSocket 接口说明

## 先分清三类 WebSocket

SagooIoT 里容易混淆的有三条线：

| 类型 | 用途 | 是否北向数据总线 | 入口 |
|------|------|------------------|------|
| **组态 / 监控推送** | 管理端或组态大屏收设备点位实时值 | **否**（面向展示） | `/api/v1/websocket/...`（亦挂在 OpenAPI 下） |
| **MQTT 北向 Topic** | 第三方订阅设备属性/事件/上下线等 | **是**（标准北向数据面） | 见 [MQTT 接口说明](./mqtt.md) |
| **网络组件 WebSocket 服务** | **设备接入平台**（南向） | 否 | 「网络组件 → 服务器」类型选 `websocket` |

**结论：** 开发手册「北向接口 → WebSocket」对应的是 **组态拓扑图实时推送**（以及服务监控），**不是**单独的通用北向遥测订阅通道。第三方要实时设备总线，请用 MQTT 北向；OpenAPI(AK/SK) 负责查询与控制。

选型见 [北向接口概述](./introduce.md)。

---

## 组态 WebSocket（平台推送）

设备影子更新后，可按组态图点位配置，把相关属性推到已连接的 WebSocket 客户端（首屏快照 + 增量推送）。

### 启用配置

```yaml
shadow:
  handlers:
    diagram:
      enabled: true    # 启用组态实时推送
      throttleMs: 100  # 同一设备推送节流（毫秒），建议 50–200
```

修改后需重启相关服务。

### 连接地址

接口定义：`GET` 升级为 WebSocket。

| 场景 | URL（示例） |
|------|-------------|
| 管理端（推荐组态前端） | `ws(s)://{host}/api/v1/websocket/configureDiagram/ws?id={diagramId}` |
| OpenAPI 前缀（同控制器） | `ws(s)://{host}/openapi/v1/websocket/configureDiagram/ws?id={diagramId}` |
| `/north` 兼容挂载 | `ws(s)://{host}/openapi/v1/north/websocket/configureDiagram/ws?id={diagramId}` |

| 参数 | 必填 | 说明 |
|------|------|------|
| id | 是 | 组态图 ID（整数） |

:::info 鉴权说明
- `/api/v1/...`：走管理端 Token 中间件（与登录态一致；WebSocket 子路由本身未再套一层业务 Auth）。  
- `/openapi/v1/...`：走 OpenAPI 组的 **AK/SK** 中间件，升级请求需能按 [AK/SK 认证](../authority/start.md) 带上验签参数。  
实际以网关前缀（如 `/base-api`）与部署为准。
:::

### 连接后行为

1. 建立连接，加入房间 `configureDiagram,{diagramId}`  
2. 读取该组态图的点位（`deviceKey` + `propertyKey`），注册设备→组态映射  
3. **首屏快照**：尽量从设备影子拉取点位当前值并推送一次（分布式下 Shadow 不可用时可能跳过快照，后续仍可事件推送）  
4. 设备属性变更时，按映射 **增量推送** 相关点位（受 `throttleMs` 节流）  
5. 断开时清理映射  

映射在 **WebSocket 连接建立时** 绑定：须先有已配置点位的组态图，再连接对应 `id`。

### 推送消息格式

正常推送为 **点位数组**（首屏与增量同一结构）。`WsDiagramOut` 字段无自定义 json tag，序列化一般为 `Pk` / `Val`：

```json
[
  {
    "Pk": {
      "deviceKey": "dev001",
      "propertyKey": "temperature"
    },
    "Val": 25.6
  },
  {
    "Pk": {
      "deviceKey": "dev001",
      "propertyKey": "humidity"
    },
    "Val": 60
  }
]
```

影子更新失败时可能推送错误对象（与点位数组形态不同）：

```json
{
  "type": "deviceUpdateError",
  "deviceKey": "dev001",
  "productKey": "product001",
  "error": "失败原因",
  "timestamp": 1697012345
}
```

联调时请以真实环境报文为准。

### 前端示例

```javascript
const diagramId = '123';
const ws = new WebSocket(
  `ws://${location.host}/api/v1/websocket/configureDiagram/ws?id=${diagramId}`
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data && data.type === 'deviceUpdateError') {
    console.error(data.error);
    return;
  }
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const deviceKey = item.Pk?.deviceKey;
      const propertyKey = item.Pk?.propertyKey;
      const value = item.Val;
      // 按点位更新组态控件
    });
  }
};

ws.onclose = () => {
  // 建议自建重连
};
```

### 客户端上行（可选）

平台也识别一种客户端 JSON（房间广播用），一般组态页只需收推送即可：

```json
{
  "id": "",
  "type": "attribute_reporting",
  "from": "",
  "to": "",
  "room": "configureDiagram,123",
  "message_body": "要广播的字符串载荷"
}
```

`type` 非 `attribute_reporting` 时，服务端会回复 `{"error":true,"message":"Invalid action"}`。

### 故障排查

| 现象 | 排查 |
|------|------|
| 完全无推送 | `shadow.handlers.diagram.enabled`；连接 URL/`id`；组态是否配置了点位 |
| 仅无首屏 | 分布式部署时 Shadow 可能不在本进程，属预期；关注后续增量 |
| 延迟大 | 调小 `throttleMs`；检查网络与 Shadow 负载 |
| 断线丢数 | 客户端重连；平台不做离线补推队列 |

日志可检索：`组态实时推送`、`WebSocket连接`。

---

## 服务监控 WebSocket

同一控制器另有监控通道：

```text
ws(s)://{host}/api/v1/websocket/monitorServer/ws
```

用于管理端「服务监控」类实时信息（房间键为 `monitorServer,{启动时间}`），**不是**设备北向数据接口。一般仅管理控制台使用。

---

## 南向：设备经 WebSocket 接入（勿与上文混淆）

若要把 **设备** 接到平台，请在 **网络组件 → 服务器** 创建类型为 `websocket` 的网络服务，并配置消息协议插件、TLS/鉴权等。这与组态推送 WebSocket 不是同一条链路。详见用户手册网络组件、设备接入相关文档。

---

## 与其它北向通道怎么选

| 需求 | 建议 |
|------|------|
| 组态 / 大屏点位刷新 | 本文 **组态 WebSocket** |
| 第三方实时总线、转发 Kafka | [MQTT 北向 Topic](./mqtt.md) |
| 查设备、设属性、调服务 | [HTTP / OpenAPI](./http.md) + AK/SK |
| 告警到业务系统 | 通知插件（Webhook 等），见概述 |

**标准话术补充：** 管理与控制走 OpenAPI；实时设备总线走 MQTT 北向；组态展示走平台组态 WebSocket；告警走通知渠道。
