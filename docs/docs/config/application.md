---
title: '应用管理'
hide_title: true
sidebar_position: 0
keywords: [应用管理,第三方授权,AK/SK管理,应用授权,访问控制,安全管理,应用配置,权限管理,系统集成,API授权]
description: '详细说明SagooIOT平台的应用管理功能，包括第三方应用授权、AK/SK管理和访问控制等应用管理指南。'
---
# 应用管理

应用管理是指为第三方客户端**授权访问**SagooIOT系统设备数据的功能。通过应用管理，您可以：

* 创建应用：为第三方客户端创建一个应用，并指定其可以访问的设备数据范围。
* 管理应用：编辑应用信息，或删除应用。
* 查看应用授权：查看已授权给应用的访问权限。

**优势**

* **提高安全性**：通过细粒度的授权控制，确保只有授权的第三方客户端才能访问您的设备数据。
* **提高效率**：无需为每个第三方客户端单独配置授权，只需创建一个应用即可。
* **简化管理**：集中管理所有第三方客户端的授权，方便您查看和管理授权情况。

**操作步骤**

1. 登录SagooIOT系统控制台。
2. 点击左侧菜单中的“系统配置->应用管理”。
3. 点击“添加应用”。
4. 输入应用名称、上传应用图标、AK、SK、组织、应用描述、状态等信息。
6. 点击“确认”。

| 字段 | 含义 | 是否必填 |
|---|---|---|
| 应用名称 | 应用的名称 | 是 |
| 应用图标 | 应用的图标 | 是 |
| AK | 应用的AK | 是 |
| SK | 应用的SK | 是 |
| 组织 | 应用所属的组织 | 是 |
| 应用描述 | 应用的描述 | 否 |
| 状态 | 应用的状态 | 是 |
| 回调地址 | 应用回调地址 | 否 |

**说明：**

* 应用名称：用于表示不用应用的名称信息。
* 应用图标：应用的图标，用于展示应用形象。
* AK：应用的Access Key，用于授权应用访问设备数据。
* SK：应用的Secret Key，用于授权应用访问设备数据。
* 组织：应用所属的组织，用户获取不同组织下的数据权限划分。
* 应用描述：应用的描述，用于说明应用的功能和用途。
* 状态：应用的状态，包括“启用”、“禁用”等。
* 回调地址：回调地址是指第三方客户端用于接收来自SagooIOT系统消息的地址。

**注意事项**

* 创建应用时，请务必为应用设置合理的授权范围，以确保数据安全。
* 定期检查应用授权情况，并及时清理不再使用的应用。