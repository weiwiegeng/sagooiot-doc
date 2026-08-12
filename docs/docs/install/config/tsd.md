---
title: "时序数据库配置"
sidebar_position: 6
hide_title: true
keywords: [时序数据库,TDengine,InfluxDB,InfluxDB3,VictoriaMetrics,tsd,设备时序]
description: '说明 SagooIoT 时序数据库（TSD）配置：支持 TDengine、InfluxDB 2.x、InfluxDB 3 Core、VictoriaMetrics，以及切换方式与初始化。'
---

# 时序数据库配置

设备属性历史、聚合分析、设备日志等落在时序库（TSD）。业务通过统一接口 `tsd.DB()` 访问，切换后端只需改配置，**无需改业务代码**。

配置节：`config.yaml` 中的 `tsd:`。

---

## 支持的后端

| `tsd.database` 取值 | 产品 | 默认端口 | 能力对齐 | 适用 |
|---------------------|------|----------|----------|------|
| `TdEngine`（**默认**） | TDengine 3.x | 6041 | 完整参考实现 | 生产默认 |
| `Influxdb3` | **InfluxDB 3 Core** | **8181** | 与 TDengine 同一套接口（读写、聚合、建库建表、标签、管理端看表） | 新部署优先于 V2 |
| `Influxdb` | InfluxDB 2.x | 8086 | 写入/查询可用；Schema、管理端看表等有空洞 | 存量 V2 环境 |
| `VictoriaMetrics` | VictoriaMetrics | 8428 | 写入等基础能力；Schema/部分管理能力弱于前两者 | 已有 VM 监控栈时 |

生产默认仍为 **TDengine**。新项目若选 Influx，请用 **`Influxdb3`（Core）**，不要用 `Influxdb`（2.x）。二者是**独立后端**，配置节也不同，不能把 V2 的 `sagoo_iot` 库名直接套到 Core。

同一时刻只能启用一种后端。平台**不提供**跨库数据迁移，换库后历史需自行导入或放弃。

---

## 公共配置

```yaml
tsd:
  enable: true                          # 是否启用时序库；默认 true。false 时不上报落库、不建设备表
  database: "TdEngine"                  # TdEngine | Influxdb | Influxdb3 | VictoriaMetrics
  batcher:
    maxBatchSize: 5000                  # 正常批次大小，100–50000
    minBatchSize: 500                   # 内存紧张时降级批次
    flushIntervalMs: 2000               # 强制刷新间隔（毫秒）
    bufferCapacity: 50000               # 内存缓冲；日志出现「数据被丢弃」时调大
    workerCount: 4                      # 并发写入协程，1–32
    memThresholdPercent: 80             # 超阈值进入保护模式
```

| 参数 | 说明 |
|------|------|
| enable | `false` 时设备上报不写时序、物模型/标签不同步到时序。演示或仅联调接入时可关 |
| database | 后端类型，**大小写与上表一致** |
| batcher | 设备数据写入批处理。丢数先加大 `bufferCapacity` / `workerCount` |

改完配置后重启对应进程（一体化 `sagooiot`，或分体 `sagoo-core`）。首次启用或换库后执行初始化：

```bash
./sagooiot -tsd          # 一体化
./sagoo-core -tsd        # 分体
```

会按当前后端建库（及 TDengine 下的超级表等）。InfluxDB 3 会校验库名并 `POST` 创建 database。

---

## TDengine（默认）

```yaml
tsd:
  database: "TdEngine"
  tdengine:
    type: "taosWS"                              # taosWS（推荐）或 taosRestful
    dsn: "root:taosdata@ws(127.0.0.1:6041)/"    # Restful 用 http(...) 端口同样 6041
    dbName: "sagoo_iot"
    precision: "ms"                             # ms | us | ns，仅新建库生效
    keep: 3650                                  # 数据保留天数，仅新建库；存量需手工 ALTER DATABASE
    duration: 10                                # 单个数据文件覆盖天数
    buffer: 16                                  # 写入内存池 MB
    maxOpenConns: 0                             # 0=不限制
    maxIdleConns: 10
    connMaxLifetime: 0
    connMaxIdleTime: 0
    queryTimeout: 60                            # 单次查询超时（秒）
```

- 驱动：`taosWS`（WebSocket）或 `taosRestful`（HTTP），端口均为 **6041**  
- 版本建议 TDengine **≥ 3.3**  
- `precision` / `keep` 只在**新建库**时生效  

---

## InfluxDB 3 Core（推荐的 Influx 选项）

独立类型 `Influxdb3`，客户端为官方 `influxdb3-go`，查询走 **SQL**（Arrow Flight），写入 Line Protocol。目标产品为 **InfluxDB 3 Core**（不含 Cloud Dedicated / Clustered / Enterprise 专项适配）。

```yaml
tsd:
  enable: true
  database: "Influxdb3"
  influxdb3:
    addr: "http://localhost:8181"
    dbName: "sagoo-iot"                 # 禁止下划线，见下文
    token: "<DATABASE_OR_ADMIN_TOKEN>"
    retentionPeriod: "3650d"            # 可选；建库时传入，省略则数据不过期
```

| 参数 | 默认 | 说明 |
|------|------|------|
| addr | `http://localhost:8181` | Core HTTP 地址，**不是** V2 的 8086 |
| dbName | `sagoo-iot` | 库名 |
| token | 空 | Database Token 或 Admin Token |
| retentionPeriod | 空 | 如 `3650d`；空表示不过期。按时间删历史主要依赖保留策略，而非 TDengine 那种按天 DELETE |

### 库名约束（务必遵守）

InfluxDB 3 Core **不允许库名含 `_`**，须字母或数字开头结尾，中间仅允许字母、数字、`-`。

| 可用 | 不可用 |
|------|--------|
| `sagoo-iot`、`sagooiot` | `sagoo_iot`（V2 示例名，Core 会直接报错） |

配置了带 `_` 的 `dbName` 时，初始化会返回明确错误，不会静默连上。

### 与 V2 的差异

| 项 | InfluxDB 2.x（`Influxdb`） | InfluxDB 3 Core（`Influxdb3`） |
|----|---------------------------|--------------------------------|
| 配置节 | `tsd.influxdb` | `tsd.influxdb3` |
| 端口 | 8086 | **8181** |
| 资源 | org + bucket | **database**（无强制 org） |
| 查询 | Flux | **SQL** |
| Schema / 管理端看表 | 多处空实现 | 对齐 TDengine 调用契约（建表、字段、标签、列库列表等） |

不要把 V2 的 `addr`/`dbName`/`org` 原样拷到 `influxdb3`。换到 Core 后需新建库并重新写入数据。

### Token

在 InfluxDB 3 Core 中创建具备该 database 读写权限的 Token，填入 `token`。建库一般需要 Admin Token；日常读写可用 Database Token。

---

## InfluxDB 2.x（存量）

仅建议已有 InfluxDB 2.x 集群继续使用。新项目请改用 `Influxdb3`。

```yaml
tsd:
  database: "Influxdb"
  influxdb:
    addr: "http://localhost:8086"
    org: "sagoo"                        # 组织，默认 sagoo
    dbName: "sagoo_iot"                 # 实际为 bucket 名
    token: "<INFLUX_V2_TOKEN>"
```

`dbName` 在 V2 中对应 **bucket**。物模型改字段、管理端「表结构/表数据」、标签清理等路径存在能力空洞，换库后部分操作可能无持久效果。

---

## VictoriaMetrics

已有 VM 时可选：

```yaml
tsd:
  database: "VictoriaMetrics"
  victoriametrics:
    addr: "http://localhost:8428"
    dbName: "sagoo_iot"
    username: ""
    password: ""
    token: ""
    maxOpenConns: 20
    maxIdleConns: 10
    connMaxIdleTime: 90
```

写入走 Remote Write。Schema、超级表语义、部分管理查询弱于 TDengine / Influxdb3，生产若强依赖物模型变更同步与管理端看表，优先前两者。

---

## 切换检查清单

1. 停服务，改 `tsd.database` 及对应子节  
2. InfluxDB 3：确认 `addr` 为 **8181**、`dbName` **不含下划线**、Token 有效  
3. `tsd.enable: true`  
4. 启动后执行 `./sagooiot -tsd`（或 `sagoo-core -tsd`）  
5. 用一台测试设备上报，在分析/设备历史中确认能查到  
6. 组态、指标等依赖历史数据的功能再验收  

:::warning
切换后端不会迁移旧数据。TDengine ↔ Influx 之间表/超级表模型也不相同，不要指望改一行配置后历史自动可见。
:::

相关安装步骤见 [环境安装](/docs/install/steps)、[SagooIoT 安装](/docs/install/sagooiot-install)。
