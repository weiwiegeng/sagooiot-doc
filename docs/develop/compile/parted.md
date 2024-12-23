---
title: '分体运行'
sidebar_position: 10
hide_title: true
keywords: [分布式部署,服务拆分,高性能架构,微服务,任务队列,设备处理,Web服务,MQTT服务,规则引擎,系统部署]
description: '详细介绍SagooIOT平台的分布式部署方案，包括服务拆分、独立运行和性能优化等高级部署指南。'
---

SagooIoT为了进一步提高对高性能的支持，提供分体运行的方式。也就是将单一服务拆分多个部分进行分别独立运行。
SagooIoT 支持web服务、设备处理服务、分布式任务队列服务分开独立运行的方式。可以将这三个服务分别部署到不同的服务器上，也可以将web服务和设备处理服务部署到同一台服务器上，将分布式任务队列服务部署到另一台服务器上。

通常情况下只需要运行web服务和设备处理服务即可，分布式任务队列服务是可选的。在运行web服务和设备处理服务时，已经启用了任务列队处理的程序。如果单独再启用任务列队服务，相当又启用了一个处理节点服务，加快处理。

## 目录说明
分体运行的入口程序在工程根目录下的cmd目录中。

* sagoo-admin是web服务
* sagoo-core是设备处理服务
* sagoo-task是分布式任务队列服务
* sagoo-rule是规则引擎服务
* sagoo-task是任务处理服务
* sagoo-mqtt是mqtt服务

进入这些目录可以分别编译与运行。

启用sagoo-admin之外，还需要启用sagoo-core服务。

其它可以跟据需要启用。


## 一键编译
在工程的根目录提供了`Makefile` 编译脚本。

在脚本提供了本地环境下编译、mac、windows、linux等环境的交叉编译脚本。


**在命令行使用**

编译所有分体程序：
```shell
 make

```
注：可以用 `make linux`、`make windows`、`make mac` 分别为不同的系统进行交叉编译。

清除所有编译后的文件
```shell
 make clean

```
