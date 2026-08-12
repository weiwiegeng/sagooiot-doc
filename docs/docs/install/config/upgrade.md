---
title: "平台升级"
sidebar_position: 14
hide_title: true
keywords: [upgrade,平台升级,备份]
description: '说明 upgrade 节：平台自身远程升级（与设备 OTA 不是同一套配置）。'
---

# 平台升级

对应 `upgrade:`，用于**平台程序**远程升级，**不是**设备 OTA（设备见 [OTA 升级](/docs/iot/operate/ota)）。

```yaml
upgrade:
  enable: false
  remoteURL: "https://127.0.0.1/upgrade/"
  backupDir: "./upgrade_backup"
  backupKeep: 3
  publicKeyPath: "./upgrade_rsa"
  downloadTimeout: 60
```

| 参数 | 说明 |
|------|------|
| enable | 默认关闭 |
| remoteURL | 升级包文件服务器 |
| backupDir / backupKeep | 备份目录与保留份数 |
| publicKeyPath | 验签公钥 |
| downloadTimeout | 下载超时（秒） |

未使用平台升级能力时保持 `enable: false` 即可。
