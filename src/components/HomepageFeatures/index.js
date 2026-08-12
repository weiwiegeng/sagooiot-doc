import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from "@docusaurus/Translate";

const FeatureList = [
  {
    title: '基于物模型的设备管理',
    Svg: require('@site/static/img/tsl.svg').default,
    description: (
      <>
        支持物模型定义设备接入标准，实现设备相关属性、服务、事件等数据的直接获取，同时支持开发者自定义物模型。
      </>
    ),
  },
  {
    title: '可视化规则引擎',
    Svg: require('@site/static/img/rule.svg').default,
    description: (
      <>
          强大的可视化规则设计器，灵活的规则模型配置,可通过托拽的方式处理数据输入、清洗、计算、测试、输出、推送、存储。
      </>
    ),
  },
  {
    title: '可视化组态工具',
    Svg: require('@site/static/img/configuration.svg').default,
    description: (
      <>
          提供Web组态工具，丰富的组态图库，动态数据绑定，直观展示设备运行状态。
      </>
    ),
  },
    {
        title: '视频监控中心',
        Svg: require('@site/static/img/media.svg').default,
        description: (
            <>
               支持GB28181、RTSP、RTMP、HLS等流媒体协议，提供高可用的流媒体服务。
            </>
        ),
    },
    {
        title: '统一的数据处理中心',
        Svg: require('@site/static/img/unidata.svg').default,
        description: (
            <>
                统一接入设备数据、业务库与第三方 API，经清洗与多源建模后计算业务指标，支持分析导出与告警联动。
            </>
        ),
    },
    {
        title: '可视化数据大屏',
        Svg: require('@site/static/img/dataview.svg').default,
        description: (
            <>
                提供丰富的交互控件和图表组件，报表图形任意切换，且不受维度,度量的限制。
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
          <Heading as="h2" className={clsx('margin-bottom--lg', 'text--center')}>
              <Translate> 核心组件 </Translate>
          </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
