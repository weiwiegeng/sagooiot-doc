---
title: "MQTT配置"
sidebar_position: 4
hide_title: true
keywords: [MQTT,共享订阅,内置Broker,EMQX,sagoomqtt,adminAddr]
description: '说明内部 MQTT 客户端、内置 SagooMQTT、外置 Broker、共享订阅与设备在线主题。'
---

# MQTT 配置

`mqtt:` 首先是**平台内部消息通道**的客户端。是否拉起进程内 Broker，由 `system.useInternalMqttService` 决定（默认 true）。

```yaml
system:
  useInternalMqttService: true     # 使用 EMQX 等外置时改为 false

mqtt:
  mqttAppName: "sagoomqtt"         # sagoomqtt | emqx | coolpy7
  addr: 127.0.0.1:1883
  adminAddr: 127.0.0.1:18083       # 管理口，EMQX / SagooMQTT 常用
  clientId: sagooiot               # 建议带实例名，保证唯一
  deviceLiveDuration: 60           # 设备心跳相关（秒）
  sharedSubscribe: false           # 多实例消费，需 Broker 支持
  qos: 1
  auth:
    userName: admin
    userPassWord: public
  sagooMQTT:
    auth: false                    # 是否启用 SagooMQTT 鉴权文件
    authFilePath: "manifest/config/auth.yaml"
```

北向实时 Topic 见 [MQTT 北向接口](/develop/openapi/northbound/mqtt)。

---

## 内置 SagooMQTT

`mqttAppName: sagoomqtt` 且 `useInternalMqttService: true` 时使用内置 Broker，默认监听 `addr`。可选监听器、TLS、能力集在示例配置里以注释给出，需要时解开 `mqtt.sagooMQTT.listeners` / `tls` / `options`。

鉴权与 ACL 见 [SagooMQTT 权限配置](/docs/install/config/sagoomqtt)。

---

## 外置 Broker（如 EMQX）

1. `system.useInternalMqttService: false`  
2. `mqtt.mqttAppName: emqx`（或 `coolpy7`）  
3. `addr` / `auth` 指向外置实例  
4. `clientId` 每进程唯一  

---

## 设备在线 / 离线

平台订阅 `$SYS/brokers/+/clients/+/connected` 与 `.../disconnected`。须在 Broker ACL 中允许订阅 `$SYS`。

---

## 共享订阅

`sharedSubscribe: true` 时以 `$share/sagooiot/<topicFilter>` 消费，多节点并行、单条消息只处理一次。

| 要求 | 说明 |
|------|------|
| Broker | EMQX ≥ 5、HiveMQ、VerneMQ、Mosquitto ≥ 2 等需开启共享订阅 |
| 协议 | 建议 MQTT v5 |
| ACL | 允许 `$share/...` 与业务 Topic |

未开启则每实例独立订阅，可能重复消费。分体多实例部署时再打开。
