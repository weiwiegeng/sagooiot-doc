---
title: '组态图设计'
sidebar_position: 4
hide_title: true
keywords: [组态图设计,状态组合,图元设计,数据绑定,开关显示,状态切换,图形组合,可视化设计,组态编辑,设计指南]
description: '详细说明SagooIOT平台组态图的设计方法，包括状态组合、图元设计、数据绑定等具体操作步骤。'
---
# 组态图设计

## 状态组合（开关显示等）

1. 先拖入两个状态的图元，先拖入断开状态的图元，后拖入闭合状态的图元。

![](../../imgs/configure/tow-pic.png)

2. 将两个图元重合放置（拖动到一起，一个在另一个上方），然后全部框选上，鼠标右键，选择组合为状态。

![](../../imgs/configure/zuhe.png)

3. 可以在外观属性操作栏里的状态属性下切换状态来查看显示效果。

![](../../imgs/configure/view-status.png)

4. 对这个状态进行数据绑定，绑定设备中具有 `0/1` 值的属性，如通信状态，开关状态等属性。

![](../../imgs/configure/bind-attr.png)

5. 保存这个图形之后，通过iot的组态列表页面点击这个图形的预览按钮，在弹出的图形页面中，如果实时获取到的绑定的属性值为 `0`，则这个组合会展示断开状态的图元，`1` 会展示闭合状态的图元。
