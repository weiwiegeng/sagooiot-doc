---
title: "SagooMQTT权限配置"
sidebar_position: 5
hide_title: true
keywords: [SagooMQTT,ACL,认证,auth.yaml]
description: '说明内置 SagooMQTT 的 auth.yaml：连接认证与主题 ACL，以及与主配置的关联。'
---

# SagooMQTT 权限配置

仅当使用**内置** SagooMQTT 且打开鉴权时生效。

主配置：

```yaml
mqtt:
  sagooMQTT:
    auth: true
    authFilePath: "manifest/config/auth.yaml"   # 相对运行目录
```

`auth: false` 时默认允许连接与操作。文件路径以进程工作目录为准，部署包里常放到 `config/auth.yaml` 并改 `authFilePath`。

---

## 认证（Auth）

控制能否连上 Broker。规则**自上而下**，命中即停。

---

## ACL

控制主题读写。未匹配时默认允许。

| 数值 | 含义 |
|------|------|
| 0 | 禁止 |
| 1 | 只订（读） |
| 2 | 只发（写） |
| 3 | 读写 |

| 参数 | 说明 |
|------|------|
| client | Client ID |
| username | 用户名 |
| remote | IP/主机，支持通配，如 `localhost:*` |
| filters | 主题过滤器 → 权限 |

建议顺序：本地特权 → 业务用户 → 全局默认。

---

## 示例

```yaml
auth:
  - username: peach
    password: password1
    allow: true
  - username: melon
    password: password2
    allow: true

acl:
  - remote: "127.0.0.1:*"
  - username: melon
    filters:
      "melon/#": 3
      "updates/#": 2
  - filters:
      "#": 1
      "updates/#": 0
```

- `#` 多级、`+` 单级  
- `remote` 为 `IP:端口`，`*` 通配  

平台自身客户端（`mqtt.auth`）也需要能连上并订阅业务与 `$SYS` 主题。更多 MQTT 项见 [MQTT 配置](/docs/install/config/mqtt)。
