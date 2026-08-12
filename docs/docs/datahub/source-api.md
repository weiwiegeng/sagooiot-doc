---
title: 'HTTP API 数据源'
sidebar_position: 2
hide_title: true
keywords: [HTTP API,API数据源,鉴权,OAuth2,Bearer,API Key,自定义Token,数据中心]
description: '详细说明数据中心 API 导入数据源的创建步骤、请求参数、五种鉴权方式及 Token 缓存与排障。'
---

# HTTP API 数据源

通过 HTTP/HTTPS 定期拉取第三方接口数据，经数据节点映射后入库，供建模、指标与可视化使用。

路径：**数据中心 → 数据源 → 新增 → 数据来源选「api导入」**。

鉴权相关能力来自平台运行时自动处理：

```text
（可选）取 Token → 注入 Header/Query → 调用业务 API → 按数据节点映射入库
```

未配置鉴权或类型为「无」时，行为与静态请求一致；仍可在「请求参数」中手动填写 `Authorization` 等 Header。

---

## 创建步骤

1. 填写数据源标识、名称、描述  
2. 数据来源选择 **api导入**  
3. 配置请求方法、业务 URL、更新时间（cron）  
4. 配置 **鉴权**（见下文）  
5. （可选）配置请求参数组（Header / Body / Query）  
6. 保存后配置数据节点（JSON 路径映射）  
7. 预览查询确认有数据，再 **发布** 数据源  

更新周期使用 cron，说明见 [定时任务设置](../other/cron.md)，可用 [在线 Cron 生成器](https://cron.qqe2.com/)。

### 基础字段

| 字段 | 说明 |
|------|------|
| 请求方法 | `get` / `post` / `put` |
| 请求地址 | 业务 API 的完整 URL |
| 更新时间 | cron 表达式，控制定时同步 |

### 请求参数组

每组参数对应一次业务请求（多组 = 多次拉取）。参数类型：

| type | 含义 |
|------|------|
| header | HTTP Header |
| body | 请求体字段 |
| param | Query 参数 |

鉴权注入发生在参数组装之后：同名 Header 以鉴权写入为准。动态 Token 用「鉴权配置」，分页、过滤条件用「请求参数」。同一轮同步内 Token 走缓存，不会因多组参数重复打鉴权接口。

---

## 鉴权类型一览

| 类型 | 界面选项 | 是否调用鉴权接口 | 是否缓存 Token | 适用场景 |
|------|----------|------------------|----------------|----------|
| `none` | 无 | 否 | — | 无需鉴权，或自行在请求参数写死 Header |
| `bearer` | Bearer Token | 否 | — | 长期有效的 Bearer Token |
| `apikey` | API Key | 否 | — | 固定 API Key（Header 或 Query） |
| `oauth2` | OAuth2 | 是（按缓存） | 是 | 标准 OAuth2（client_credentials / password） |
| `custom_token` | 自定义 Token | 是（按缓存） | 是 | 非标准登录/换票接口返回 Token |

选择建议：

```text
第三方要什么？
├─ 固定 API Key          → apikey
├─ 长期 Bearer           → bearer
├─ 标准 OAuth2 Token 接口 → oauth2（优先）
└─ 先登录/换票再访问      → custom_token
```

---

## 运行时顺序与 Token 缓存

每次预览或定时同步时：

1. 校验业务 URL（若启用 SSRF 策略会拦截不安全地址）  
2. 组装请求参数组中的 Header / Body / Param  
3. 按鉴权类型处理  
   - `bearer` / `apikey`：直接注入凭证  
   - `oauth2` / `custom_token`：先取 Token（命中缓存则跳过），再按注入规则写入  
4. 发起业务 HTTP 请求  
5. 按数据节点路径解析 JSON 并入库  

### 缓存规则（仅 oauth2 / custom_token）

| 项 | 说明 |
|----|------|
| 维度 | 按数据源 `sourceId` |
| 位置 | 进程内存（单机有效；多实例各自缓存） |
| 有效期优先级 | ① 响应 `expires_in` → ② 配置「有效秒数」→ ③ 默认 3600 秒 |
| 提前失效 | 约提前 60 秒视为过期，避免边界失效 |
| 清缓存 | 编辑并保存数据源；或进程重启 |

---

## 各类型配置说明

### 无（none）

不启用平台鉴权。调试时可在请求参数中增加：

| 参数类型 | 参数标题 | 参数名 | 参数值 |
|----------|----------|--------|--------|
| header | 授权 | Authorization | Bearer eyJhbGciOi... |

---

### Bearer Token

要求业务请求：

```http
Authorization: Bearer <token>
```

| 字段 | 必填 | 说明 |
|------|------|------|
| Token | 是 | 完整 token，**不要**带 `Bearer ` 前缀 |

```json
{
  "method": "get",
  "url": "https://api.example.com/v1/devices",
  "cronExpression": "0 */5 * * * *",
  "auth": {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### API Key

| 字段 | 默认 | 必填 | 说明 |
|------|------|------|------|
| Key 名称 | `X-API-Key` | 否 | 参数名 |
| API Key | — | 是 | 密钥值 |
| 注入位置 | `header` | 否 | `header` 或 `query` |

Header 注入示例：

```json
{
  "auth": {
    "type": "apikey",
    "apiKey": "sk_live_abc123",
    "apiKeyName": "X-API-Key",
    "apiKeyIn": "header"
  }
}
```

Query 注入时等价于：`GET /sensors?api_key=sk_live_abc123`（`apiKeyName` 为 `api_key`）。

---

### OAuth2

适用于标准 Token 接口响应：

```json
{
  "access_token": "xxxx",
  "token_type": "Bearer",
  "expires_in": 7200
}
```

平台行为：

1. `POST` Token 地址，`Content-Type: application/x-www-form-urlencoded`  
2. 读取 `access_token` / `expires_in`  
3. 缓存后对业务请求注入 `Authorization: Bearer <access_token>`  

:::info
管理端 OAuth2 表单不单独暴露注入模板字段，固定按 Bearer Header 注入。若对方要求自定义 Header 名，请使用「自定义 Token」。
:::

| 字段 | 默认 | 必填 | 说明 |
|------|------|------|------|
| 授权类型 | `client_credentials` | 否 | 或 `password` |
| Token 地址 | — | 是 | 获取 token 的 URL |
| Client ID | — | 视类型 | 客户端 ID |
| Client Secret | — | 视类型 | 客户端密钥 |
| Scope | 空 | 否 | 权限范围 |
| 用户名 / 密码 | — | password 时 | 仅 password 模式 |

#### client_credentials

表单字段：`grant_type`、`client_id`、`client_secret`，可选 `scope`。

```json
{
  "method": "get",
  "url": "https://api.example.com/v1/orders",
  "cronExpression": "0 */10 * * * *",
  "auth": {
    "type": "oauth2",
    "grantType": "client_credentials",
    "tokenURL": "https://auth.example.com/oauth/token",
    "clientId": "my-client",
    "clientSecret": "my-secret",
    "scope": "read"
  }
}
```

#### password

额外提交 `username`、`password`（及 `client_id` / 可选 `client_secret`、`scope`）。

```json
{
  "auth": {
    "type": "oauth2",
    "grantType": "password",
    "tokenURL": "https://auth.example.com/oauth/token",
    "clientId": "my-client",
    "clientSecret": "my-secret",
    "username": "api_user",
    "password": "api_pass",
    "scope": "api"
  }
}
```

curl 对照：

```bash
curl -X POST 'https://auth.example.com/oauth/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials&client_id=my-client&client_secret=my-secret'

curl 'https://api.example.com/v1/orders' \
  -H 'Authorization: Bearer <access_token>'
```

---

### 自定义 Token

适用于登录/换票接口响应非标准，例如 token 在 `data.access_token` 或 `result.token`。

| 字段 | 默认 | 必填 | 说明 |
|------|------|------|------|
| 鉴权请求方法 | POST | 否 | GET / POST |
| 鉴权请求地址 | — | 是 | 登录或换票 URL |
| Token 字段路径 | `access_token` | 建议 | gjson 点路径，如 `data.token` |
| 有效秒数 | — | 建议 | 响应无 `expires_in` 时的兜底（界面常填 7200） |
| 注入参数名 | `Authorization` | 否 | 写入业务请求的参数名 |
| 注入模板 | `Bearer {{token}}` | 否 | 用 `{{token}}` 占位 |
| 注入位置 | header | 否 | `header` / `query` |
| 鉴权请求 Body | `{}` | 视接口 | JSON 对象，**保留数字/布尔原始类型** |

#### 登录后 Bearer 访问业务 API

| 项 | 值 |
|----|----|
| 鉴权类型 | 自定义 Token |
| 鉴权请求方法 | POST |
| 鉴权请求地址 | `https://iot-vendor.com/api/login` |
| Token 字段路径 | `data.access_token` |
| 有效秒数 | `3600` |
| 注入参数名 | `Authorization` |
| 注入模板 | `Bearer {{token}}` |
| 注入位置 | Header |
| 鉴权请求 Body | `{"username":"admin","password":"Secret123"}` |
| 业务 URL | `https://iot-vendor.com/api/devices` |

```json
{
  "method": "get",
  "url": "https://iot-vendor.com/api/devices",
  "cronExpression": "0 */5 * * * *",
  "auth": {
    "type": "custom_token",
    "tokenMethod": "POST",
    "tokenReqURL": "https://iot-vendor.com/api/login",
    "tokenBody": {
      "username": "admin",
      "password": "Secret123"
    },
    "tokenPath": "data.access_token",
    "expiresIn": 3600,
    "injectType": "header",
    "injectName": "Authorization",
    "injectTpl": "Bearer {{token}}"
  }
}
```

#### 自定义 Header / Query

要求 `X-Access-Token: xxx` 时：

| 字段 | 值 |
|------|----|
| 注入参数名 | `X-Access-Token` |
| 注入模板 | `{{token}}` |
| 注入位置 | Header |

放在 Query 时：`injectType=query`，`injectName=access_token`，`injectTpl={{token}}`。

#### 鉴权请求额外 Header

界面暂无 Token Header 编辑器，可通过接口保存时写入 `tokenHeaders`：

```json
{
  "auth": {
    "type": "custom_token",
    "tokenMethod": "POST",
    "tokenReqURL": "https://vendor.com/login",
    "tokenHeaders": {
      "Content-Type": "application/json",
      "X-App-Id": "app001"
    },
    "tokenBody": {"user": "admin", "pwd": "123456"},
    "tokenPath": "data.token",
    "expiresIn": 7200
  }
}
```

---

## 落地检查清单

1. 用 Postman / curl 确认鉴权接口与业务接口均可通  
2. 在平台新建 API 数据源并选择鉴权类型  
3. 保存后点 **查询** 预览 JSON  
4. 配置数据节点（JSON 路径）  
5. **发布** 数据源，确认按 cron 入库  
6. 修改密钥/密码后保存，下次会重新取 Token  

---

## 常见问题

**为什么每次都在打鉴权接口？**  
有效期过短、`expiresIn` 过小、多实例各自缓存，或刚保存过数据源（清缓存）。

**预览报「鉴权接口未返回 token」**  
检查 `tokenPath` 是否匹配真实响应，例如 `{"data":{"token":"xxx"}}` 应填 `data.token`。

**业务接口 401**  
Token 是否过期、注入模板前缀是否正确（如需 `Token {{token}}`）、注入位置是否选错。

**SSRF / URL 安全检查失败**  
业务 URL 与 Token URL 均可能受 `system.ssrf` 策略限制，请使用允许范围内的地址。

**能否同时写 oauth2 与请求参数里的 Authorization？**  
可以，但不建议。动态鉴权交给鉴权配置，避免重复与排查困难。

---

## 配置字段速查

```json
{
  "method": "get|post|put",
  "url": "业务 API 地址",
  "cronExpression": "cron 表达式",
  "requestParams": [[{ "type": "header|body|param", "key": "", "name": "", "value": "" }]],
  "auth": {
    "type": "none|bearer|apikey|oauth2|custom_token",
    "token": "",
    "apiKey": "",
    "apiKeyName": "X-API-Key",
    "apiKeyIn": "header|query",
    "grantType": "client_credentials|password",
    "tokenURL": "",
    "clientId": "",
    "clientSecret": "",
    "scope": "",
    "username": "",
    "password": "",
    "tokenMethod": "POST",
    "tokenReqURL": "",
    "tokenHeaders": {},
    "tokenBody": {},
    "tokenPath": "access_token",
    "expiresIn": 7200,
    "injectType": "header|query",
    "injectName": "Authorization",
    "injectTpl": "Bearer {{token}}"
  }
}
```

配置完成后，继续阅读 [数据源管理](./source.md) 中的节点与注意事项，以及 [数据建模](./modeling.md)。
