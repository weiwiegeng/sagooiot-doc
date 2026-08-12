---
title: '配置文件'
hide_title: true
sidebar_position: 0
keywords: [配置文件,系统配置,数据库,MQTT,时序数据库,Redis,告警,影子]
description: 'SagooIoT 主配置文件说明：文件位置、配置节索引，以及与当前 config.example.yaml 对齐的完整参考。'
---

# 配置文件

开发环境：将 `manifest/config/config.example.yaml` 复制为 `config.yaml` 后按环境修改。  
编译部署：一般为 `config/config.yaml`。

修改后需**重启**对应进程（一体化 `sagooiot`，或分体 `sagoo-admin` / `sagoo-core` 等）。

:::tip
若前面挂了 Nginx 且 API 文档打不开，把 `server.openapiPath` 改成与网关一致的路径（例如 `/base-api/swagger/api.json`）。
:::

## 配置节索引

- `system`：[系统与安全](/docs/install/config/system) · [设备日志缓存](/docs/install/config/device)
- `network.websocket`：[系统与安全](/docs/install/config/system)
- `server`：[Web 服务](/docs/install/config/server)
- `logger` / `jaeger`：[日志配置](/docs/install/config/log)
- `gfToken`：[系统与安全](/docs/install/config/system)
- `database`：[业务数据库](/docs/install/config/database)
- `mqtt`：[MQTT](/docs/install/config/mqtt) · [SagooMQTT 权限](/docs/install/config/sagoomqtt)
- `tsd`：[时序数据库](/docs/install/config/tsd)
- `cache` / `redis`：[缓存与 Redis](/docs/install/config/redis)
- `task`：[任务队列](/docs/install/config/tadk)
- `rule`：[规则引擎服务](/docs/install/config/rule)
- `alarm`：[告警](/docs/install/config/alarm)
- `shadow`：[影子服务](/docs/install/config/shadow)
- `upgrade`：[平台升级](/docs/install/config/upgrade)

权威字段以仓库 `manifest/config/config.example.yaml` 为准。

---

## 完整参考（对齐当前示例）

以下为结构摘录，密钥请换成自己的，不要照抄示例中的口令。

```yaml
# 系统
system:
  name: "sagooiot"
  version: "2.0"
  description: "SagooIoT Server"
  enablePProf: true
  debug: true
  ipMethod: "whois"                 # cz88 | whois
  isDemo: false
  isCluster: false                  # true 时必须配 Redis
  useInternalMqttService: true      # 外置 Broker 时改为 false
  useInternalRuleService: true      # 规则引擎独立部署时改为 false
  mcp:
    enable: true
    excludeTables: [ "sys_authorize" ]
  deviceCacheData:
    batchSize: 20
    batcher:
      maxMemoryMB: 100
      memoryCheckInterval: 10s
    flushInterval: 50ms
    workerCount: 0                  # 0=自动（CPU*2，夹在 8–32）
    taskQueueSize: 0                # 0=默认 1024
    pipelineBufferSize: 20
    poolSize: 500
    recordDuration: 300m
    recordLimit: 1000
    strictWriteError: false
  pluginsPath: "./plugins/built"
  upload:
    path: "upload"
    tls:
      insecureSkipVerify: true      # 生产建议 false
  i18n:
    file:
      path: "manifest/i18n"
      lang: "zh-CN"
  ssrf:
    enabled: false
    allowPrivateIP: false
    allowLocalhost: false
    whitelist: "api.example.com,*.internal.corp"
    blacklist: "evil.com"
  jsinterpreter:
    timeout: 5000
    timeoutEnabled: true

network:
  websocket:
    allowedOrigins: "https://example.com,*.internal.corp"  # 不配则允许全部来源

server:
  address: ":8199"
  dumpRouterMap: false
  routeOverWrite: true
  openapiPath: "/api.json"
  swaggerPath: "/swagger"
  NameToUriType: 3
  maxHeaderBytes: "20KB"
  clientMaxBodySize: "50MB"
  readTimeout: "60s"
  writeTimeout: "60s"
  idleTimeout: "120s"
  https: false
  httpsCertFile: ""
  httpsKeyFile: ""
  indexFiles: [ "index.html" ]
  indexFolder: false
  serverRoot: "resource/public"
  searchPaths: [ "/resource/public/" ]
  fileServerEnabled: true
  adminPprofPort: "58089"

logger:
  path: "resource/log/server"
  file: "{Y-m-d}.log"
  level: "all"
  header: true
  stdout: true
  rotateExpire: "1d"
  rotateBackupLimit: 7
  rotateCheckInterval: "1h"
  module:
    - "worker"

jaeger:
  endpoint: "http://127.0.0.1:4318"

gfToken:
  timeOut: 10800
  maxRefresh: 5400
  refreshGracePeriod: 0
  multiLogin: true
  encryptKey: "<32位密钥>"
  excludePaths:
    - "/api/v1/login"
    - "/api/v1/sysinfo"
    - "/api/v1/captcha"
    - "/api/v1/websocket/configureDiagram/ws"
    - "/api/v1/ai/mcp"

database:
  logger:
    path: "resource/log/sql"
    level: "error"
    stdout: false
    ctxKeys: [ "RequestId" ]
  default:
    link: "mysql:user:pass@tcp(127.0.0.1:3306)/sagooiot?loc=Local&parseTime=true"
    debug: false
    charset: "utf8mb4"
    dryRun: false
    maxIdle: 50
    maxOpen: 1000
    maxLifetime: 120

mqtt:
  mqttAppName: "sagoomqtt"          # sagoomqtt | emqx | coolpy7
  addr: 127.0.0.1:1883
  adminAddr: 127.0.0.1:18083
  clientId: sagooiot
  deviceLiveDuration: 60
  sharedSubscribe: false
  qos: 1
  auth:
    userName: admin
    userPassWord: public
  sagooMQTT:
    auth: false
    authFilePath: "manifest/config/auth.yaml"

tsd:
  enable: true
  database: "TdEngine"              # TdEngine | Influxdb | Influxdb3 | VictoriaMetrics
  # 详见「时序数据库配置」

cache:
  prefix: "SagooIot_Sys:"
  adapter: "redis"                  # memory | redis | file
  fileDir: "./storage/cache"

redis:
  default:
    ClientName: SagooIoT_Pro
    address: 127.0.0.1:6379
    db: 0
    mode: single                    # single | cluster | sentinel
    pass: ""
    user: ""
    sentinelMasterName: sagoo-master
    poolSize: 200
    minIdle: 50
    maxIdle: 120
    maxActive: 1000
    dialTimeout: 10s
    readTimeout: 5s
    writeTimeout: 5s
    idleTimeout: 300s
    ConnMaxIdleTime: 300s
    ConnMaxLifetime: 3600s
    maxRetries: 3
    minRetryBackoff: 100ms
    maxRetryBackoff: 1s

task:
  retention: 60
  maxRetry: 1
  clearArchived: 300
  timeout: 300
  concurrencyNum: 1000
  groupGracePeriod: 1
  groupMaxDelay: 1
  groupMaxSize: 2000

rule:
  jwt_secret_key: "<JWT密钥>"
  users:
    admin: admin,<passwordHash>
  data_dir: "./data"
  log_file: "resource/log/rule.log"
  cmd_white_list: "cp,scp,mvn,npm,yarn,git,make,cmake,docker,kubectl,helm,ansible,puppet,pytest,python,python3,pip,go,java,dotnet,gcc,g++,ctest"
  load_lua_libs: true
  server: ":9090"
  default_username: "admin"
  debug: true
  max_node_log_size: 40
  save_run_log: false
  script_max_execution_time: 5000
  mqtt:
    enabled: true

alarm:
  onlineOfflineStabilize: "5s"
  ruleWorkerCount: 100

shadow:
  initialCapacity: 50
  maxCapacity: 200
  taskQueueSize: 1000
  enqueueTimeout: 50ms
  updateConcurrency: 200
  handlers:
    diagram:
      enabled: true
      throttleMs: 100
  batchSize: 500
  workerCount: 20
  # 其余见「影子服务」专篇

upgrade:
  enable: false
  remoteURL: "https://127.0.0.1/upgrade/"
  backupDir: "./upgrade_backup"
  backupKeep: 3
  publicKeyPath: "./upgrade_rsa"
  downloadTimeout: 60
```

`upgrade` 为**平台自身**远程升级（与设备 OTA 不是同一套配置）。未启用可保持 `enable: false`。
