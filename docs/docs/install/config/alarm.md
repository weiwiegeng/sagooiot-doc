---
title: "告警配置"
sidebar_position: 9
hide_title: true
keywords: [告警,上下线,稳定窗口,ruleWorkerCount]
description: '说明 alarm 节：设备上下线告警稳定窗口与规则处理 Worker 数。'
---

# 告警配置

对应 `alarm:`。规则内容、通知渠道仍在管理端「告警中心」配置；本节只影响**何时判定**与**处理并发**。

```yaml
alarm:
  # 上下线告警稳定窗口：状态变化后持续该时长未再翻转，才触发告警 Check
  # 窗口内 offline↔online 再翻转会取消旧待触发，按最新状态重新计时
  # 不影响设备日志、北向 MQTT、设备影子
  # 0s = 关闭（立即告警，与历史行为一致）
  onlineOfflineStabilize: "5s"
  ruleWorkerCount: 100          # 告警规则 Worker；未配/≤0 时按 1
```

| 参数 | 说明 |
|------|------|
| onlineOfflineStabilize | 抑制抖动上下线导致的告警风暴。默认 `5s`；要立刻告警设 `0s` |
| ruleWorkerCount | 规则匹配并发。设备量大可适当加大，注意 CPU |

告警投递渠道见 [告警中心](/docs/iot/alarm/config)、[通知服务](/docs/iot/notice/access)，不要用 Webhook 当设备遥测总线。
