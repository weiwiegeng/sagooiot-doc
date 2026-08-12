import clsx from "clsx"
import Heading from "@theme/Heading"
import styles from "./styles.module.css"
import Translate, { translate } from "@docusaurus/Translate"
import React from "react"

interface FeatureItem {
  title: string;
  description: JSX.Element;
  Svg?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const FeatureList: FeatureItem[] = [
  {
    title: "统一物模型",
    description: (
        <>
          以物模型统一描述属性、功能、事件与标签；支持自定义与导入导出，并可结合设备影子进行期望值与上报值管理。
        </>
    ),
  },
  {
    title: "多协议接入",
    description: (
        <>
          内建 MQTT、TCP、UDP、HTTP、WebSocket、CoAP、LwM2M 等接入；工业侧提供 Modbus、OPC UA、SNMP、IEC104、IEC61850、Siemens S7、DL/T645、CJ/T188、BACnet 等驱动插件，并支持自定义消息协议接入异构设备。
        </>
    ),
  },
  {
    title: "远程控制",
    description: (
        <>
          支持服务端功能调用（RPC）与属性设置下行；设备也可主动上报请求与事件，完成双向控制闭环。
        </>
    ),
  },
  {
    title: "场景联动",
    description: (
        <>
          支持手动、设备、定时触发；可按条件与防抖编排动作，串行/并行执行设备控制、通知、告警、延时与 Web 调用等联动。
        </>
    ),
  },
  {
    title: "OTA升级",
    description: (
        <>
          提供固件模块与版本管理，支持整包/差分包远程升级，可按产品、模块发起升级任务与策略调度。
        </>
    ),
  },
  {
    title: "远程配置",
    description: (
        <>
          支持配置模板管理与在线下发，批量更新设备运行参数，减少现场改参与运维中断。
        </>
    ),
  },
  {
    title: "安全保障",
    description: (
        <>
          支持接入侧 TLS/DTLS、AccessToken 鉴权；管理端与 OpenAPI 提供令牌与 AK/SK 认证，并可结合证书与访问控制提升整体安全性。
        </>
    ),
  },
  {
    title: "实时告警",
    description: (
        <>
          可按产品或设备实时检测异常并生成告警；支持企业微信、钉钉、短信、语音、邮件、Webhook 等多通道通知。
        </>
    ),
  },
  {
    title: "插件扩展",
    description: (
        <>
          强大的插件系统，支持跨语言接入，可以通过Golang,C/C++,Python等编写的插件进行功能增强。
        </>
    ),
  },
  {
    title: "灵活部署",
    description: (
        <>
          支持 Linux / Windows / macOS 多架构部署，核心、接入、告警、规则等可分服务运行，便于按规模裁剪与扩展。
        </>
    ),
  },
  {
    title: "告警治理",
    description: (
        <>
          支持告警处理与标记、合并抑制、升级、限流窗口、持续触发与自动恢复等治理策略，降低告警风暴、提高运维效率。
        </>
    ),
  },
  {
    title: "开放接口",
    description: (
        <>
          南向覆盖设备接入与下行控制，北向提供 OpenAPI（AK/SK）及应用接入；支持开放接口与数据权限控制，便于业务系统集成。
        </>
    ),
  },
]

interface FeatureProps extends FeatureItem {
  key?: number | string;
}

const Feature: React.FC<FeatureProps> = ({ title, description }) => {
  return (
      <div className={clsx("card col")} style={{ minWidth: "30%", marginBottom: 0 }}>
        <div className={styles["text--center"] + " padding-horiz--md"}>
          <Heading as="h4">{title}</Heading>
          <p className={styles.details}>{description}</p>
        </div>
      </div>
  )
}

const HomepageFeatures: React.FC = () => {
  return (
      <section className={styles.features}>
        <div className="container">
          <Heading as="h2" className={clsx("text--center")}>
            <Translate>系统特性</Translate>
          </Heading>
          <div className="row" style={{ gap: "20px" }}>
            {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
  )
}

export default HomepageFeatures
