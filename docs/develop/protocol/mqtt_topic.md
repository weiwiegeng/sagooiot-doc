---
sidebar_position: 1
title: 'MQTT Topic说明'
keywords: [MQTT Topic,消息主题,设备通信,属性上报,事件上报,服务调用,远程配置,OTA升级,Topic格式,通信规范]
description: '详细说明SagooIOT平台的MQTT Topic结构，包括设备属性上报、事件上报、服务调用等各类消息主题的定义和使用方法。'
---
# Topic 说明

`SagooMqtt协议` ，涉及的topic如下：

## 数据上行下行通讯

1. [设备上报属性(设备端发起)](mqtt_report.md#设备上报属性)

    请求:`/sys/${productKey}/${deviceKey}/thing/event/property/post`

    响应:`/sys/${productKey}/${deviceKey}/thing/event/property/post_reply`

2. [设备上报事件(设备端发起)](mqtt_report.md#设备上报事件)

    请求:`/sys/${productKey}/${deviceKey}/thing/event/${eventIdentifier}/post`

    响应:`/sys/${productKey}/${deviceKey}/thing/event/${eventIdentifier}/post_reply`

3. [设备属性设置(平台侧发起)](mqtt_report.md#设备属性设置)

    请求:`/sys/${productKey}/${deviceKey}/thing/service/property/set`

    响应:`/sys/${productKey}/${deviceKey}/thing/service/property/set_reply`

4. [服务调用(平台侧发起)](mqtt_report.md#服务调用)

    请求:`/sys/${productKey}/${deviceKey}/thing/service/${tsl.service.identifier}`

    响应:`/sys/${productKey}/${deviceKey}/thing/service/${tsl.service.identifier}_reply`

5. [网关批量上传事件和属性(网关发起)](mqtt_report.md#网关批量上传事件和属性)

  请求:`/sys/${productKey}/${deviceKey}/thing/event/property/pack/post`

  响应:`/sys/${productKey}/${deviceKey}/thing/event/property/pack/post`

6. [设备影子Topic](mqtt_shadow.md)

    发布:`/sys/${productKey}/${deviceKey}/thing/shadow/update`

    获取:`/sys/${productKey}/${deviceKey}/thing/shadow/get`

7. [设备标签Topic](mqtt_shadow.md)

   发布:`/sys/${productKey}/${deviceKey}/thing/tags`

:::note 提示
网关上报的topic中的 `${productKey}` 为网关的产品标识，`${deviceKey}` 为网关的设备标识。子设备在数据中`subDevices`下的 `productKey` 和 `deviceKey` 为子设备的产品标识和设备标识。

::::
      
## OTA升级
1. [上报ota相关信息(设备端发起)](mqtt_ota.md#上报ota相关信息)

    请求:`/ota/device/inform/${productKey}/${deviceKey}`
   
2. [推送ota升级包(平台侧发起)](mqtt_ota.md#推送ota升级包)

    请求:`/ota/device/upgrade/${productKey}/${deviceKey}`
   
3. [上报升级进度信息(设备端发起)](mqtt_ota.md#上报升级进度信息)

    请求:`/ota/device/progress/${productKey}/${deviceKey}`

## 注意事项

`${productKey}` 这种类型的说明为替换数据
