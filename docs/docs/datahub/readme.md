---
title: '数据中心概述'
hide_title: true
sidebar_position: 0
keywords: [数据中心,数据处理,数据源,数据建模,指标,数据聚合,设备数据,数据库集成,API集成]
description: 'SagooIOT 数据中心概述：数据源、建模与指标链路，以及设备/库/API 多源接入能力说明。'
---

# 概要说明

SagooIoT 数据中心提供实用的数据处理能力，统一接入设备数据、业务库数据与第三方 API，完成清洗、关联建模与业务指标计算。

典型链路：

```text
数据源 → 数据建模（多源宽表 / 聚合）→ 业务指标 → 分析导出 / 告警联动
```

## 能力构成

| 模块 | 作用 |
|------|------|
| **数据源** | 接入 API / 设备 / MySQL·MSSQL，定时同步并落节点数据 |
| **数据建模** | 多源关联、字段处理、时间窗聚合，形成业务宽表 |
| **指标** | 基于模型定义聚合、累计、公式等策略，支持按需或定时计算 |

API 导入支持 OAuth2、Bearer、API Key、自定义 Token 等鉴权，详见 [HTTP API 数据源](./source-api.md)。

## 文档导航

- [数据源管理](./source.md) — 通用概念与三类来源  
- [HTTP API 数据源](./source-api.md) — API 接入与鉴权详解  
- [数据建模](./modeling.md)  
- [指标管理](./indicator.md)  
