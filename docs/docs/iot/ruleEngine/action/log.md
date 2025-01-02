---
title: '日志'
sidebar_position: 6
hide_title: true
keywords: [规则引擎,日志节点,日志记录,脚本配置,日志格式化,调试工具,系统监控,错误处理,日志级别,性能优化]
description: '详细介绍SagooIOT平台规则引擎中日志节点的功能和使用方法，包括日志脚本编写、格式配置、最佳实践等内容，帮助用户实现灵活的日志记录和系统监控功能。'
---


## 节点说明

日志节点是一个专门用于记录系统日志的组件。它支持通过JavaScript脚本自定义日志格式，能够灵活地记录消息内容、元数据等信息，是系统调试和监控的重要工具。

## 界面配置说明

### 1. 基本设置

- **节点ID**: 节点的唯一标识符（示例中为 "node_56"）
- **名称**: 节点的显示名称
- **调试模式**: 可开启调试模式查看执行结果

### 2. 日志脚本配置

- **JavaScript脚本**: 用于自定义日志格式的脚本代码
- **默认函数结构**: 提供基础的日志格式化函数

## 脚本编写说明

:::tip 提示
JavaScript脚本支持ECMAScript 5.1(+) 语法规范和部分ES6规范，如：async/await/Promise/let。允许在脚本中调用Go自定义函数，请参考[udf](https://rulego.cc/pages/d59341/#udf) 。
:::


### 1. 函数结构

```
function ToString(msg, metadata, msgType) {
    // 在此处编写日志格式化逻辑
    return "格式化的日志字符串";
}
```

### 2. 参数说明

```
msg: 消息内容
- JSON类型：可使用msg.field访问
- 其他类型：作为string处理

metadata: 消息元数据
- 类型：jsonObject
- 访问方式：metadata.field

msgType: 消息类型
- 用于标识消息的类型信息
```

## 使用场景示例

### 1. 基础日志记录

```
// 记录基本消息内容
return 'Incoming message:\n' + JSON.stringify(msg);
```

### 2. 详细日志格式

```
// 记录详细信息
return `
时间: ${new Date().toISOString()}
消息类型: ${msgType}
消息内容: ${JSON.stringify(msg)}
元数据: ${JSON.stringify(metadata)}
`;
```

### 3. 条件日志记录

```
// 根据条件记录日志
if (msg.level === 'ERROR') {
    return `错误信息: ${msg.errorMessage}`;
} else {
    return `普通信息: ${JSON.stringify(msg)}`;
}
```

## 最佳实践

### 1. 日志格式设计

- 包含必要的时间戳
- 添加上下文信息
- 使用清晰的分隔符

### 2. 性能优化

- 控制日志数量
- 避免过多字符串拼接
- 合理使用条件判断

### 3. 错误处理

- 捕获可能的异常
- 提供友好的错误信息
- 保证日志完整性

## 注意事项

1. **格式化处理**
    - 确保返回字符串类型
    - 处理特殊字符
    - 控制日志长度
2. **性能考虑**
    - 避免过度日志记录
    - 控制日志大小
    - 注意内存使用
3. **安全性**
    - 过滤敏感信息
    - 控制日志访问权限
    - 防止日志注入

## 调试建议

1. **开启调试模式**
    - 验证日志格式
    - 检查脚本执行
    - 监控日志输出
2. **常见问题排查**
    - 检查语法错误
    - 验证数据类型
    - 确认日志输出
3. **性能监控**
    - 观察日志量
    - 检查响应时间
    - 监控资源使用

## 配置说明

### 1. 日志记录器配置

```
可配置项：
- 日志级别
- 输出格式
- 输出目标
```

### 2. 默认行为

```
特点：
- 默认输出到控制台
- 保持消息内容不变
- 支持配置自定义
```

## 路由说明

### 1. Success路由

- 日志记录成功
- 脚本执行正常
- 继续后续处理

### 2. Failure路由

- 脚本执行错误
- 格式化失败
- 日志写入失败

日志节点是系统监控和调试的重要工具，通过合理配置和使用，可以有效地跟踪系统运行状态和排查问题。在使用时要注意日志格式的设计和性能优化，确保日志记录的效率和可用性。