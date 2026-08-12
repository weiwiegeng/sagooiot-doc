---
sidebar_position: 1
title: '北向接口示例'
keywords: [接口示例,设备详情,JAVA示例,签名生成,接口调用,设备信息,API调用,开发示例,北向接口,实践指南]
description: '提供SagooIOT平台北向接口的调用示例，包括设备详情获取、签名生成和接口调用等具体实现方法。'
---

# 使用示例

对接选型见 [北向接口概述](./introduce.md)。鉴权见 [AK/SK 认证说明](../authority/start.md)。

可通过运行环境 Swagger，或「系统监控 → API 文档」搜索 `openapi/v1/product`（推荐）或 `openapi/v1/north`（兼容）查看接口。

本文以 Java 调用 **获取设备详情**（`/north` 路径）为例；新项目可改为 `/openapi/v1/product/device/detail` 等推荐路径。

## 前提条件

* 在[应用管理](../../../docs/config/application)已创建对应的应用并启用。
* 在[设备](../../../docs/iot/device/)已创建对应的设备信息。

## 获取设备详情信息

* sign计算

首先对ak、timestamp进行拼接。拼接方式如下：

``` JAVA
// 获取当前时间戳
String timestamp = java.lang.String.valueOf(Instant.now().getEpochSecond());
// 生成签名
String message = "ak=" + ak + "&time=" + timestamp;
```

使用HmacSHA256加密方式，使用ak、sk作为密钥进行加密。
具体的可以查看JAVA版本的[签名生成方式](../authority/example.md)

* 请求接口获取设备详情

``` JAVA
public static void main() {
    String host = "127.0.0.1:8200";
    String serverUrl = ""; // 如果调用的是线上，则需要增加base-api，如果调用的是本地则不需要(主要是线上有nginx中间件)
    String appid = "dzy2sv0az80cweu3wgkp4smcb7dluuzb"; // Secret Key

    // 获取当前时间戳
    String timestamp = java.lang.String.valueOf(Instant.now().getEpochSecond());

    // 生成签名
    String message = "ak=" + ak + "&time=" + timestamp;
    String sign = generateSignature(message, sk);

    //根据设备KEY获取指定设备信息
    String getDeviceInfoByDeviceKey = "http://" + host + serverUrl + "/openapi/v1/north/device/detail?deviceKey=192_168_107_251-40&appId=" + appid + "&time=" + timestamp + "&sign=" + sign;

    doGet(getDeviceInfoByDeviceKey);
}

public static void doGet(String requestURL) {
    // 创建 HttpClient 实例
    CloseableHttpClient httpClient = HttpClients.createDefault();

    // 创建 GET 请求对象
    HttpGet httpGet = new HttpGet(requestURL);

    try {
        // 发送请求并获取响应
        CloseableHttpResponse response = httpClient.execute(httpGet);

        // 获取响应实体
        HttpEntity entity = response.getEntity();

        // 输出响应状态码和响应体
        System.out.println("Response Code: " + response.getStatusLine().getStatusCode());
        System.out.println("Response Body: " + EntityUtils.toString(entity));

        // 关闭响应
        response.close();
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        try {
            // 关闭 HttpClient
            httpClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

| 参数 | 含义 | 是否必填 |
|---|---|---|
| deviceKey | 设备Key | 是 |
| appId | 应用管理中的APPID | 是 |
| time | 当前时间戳 | 是 |
| sign | 签名 | 是 |
| orgIds | 组织ID | 否 |

## 请求结果
![java示例请求结果](./img/example/respose_java.png)

**注意事项**

* JAVA需使用JDK1.8
* 其他语言的AKSK鉴权可参考[相关文档](../authority/example.md)