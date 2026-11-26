---
title: Vue 3 前端性能优化实战清单
description: 从打包体积、首屏渲染（LCP）到长列表虚拟滚动，总结中后台与门户项目中最实用的性能调优手段。
date: 2026-11-20
tags:
  - Vue3
  - 性能优化
  - 前端工程
---

## 1. 先测量，再优化

性能优化的第一原则是**数据驱动**。在动手改代码之前，先用以下工具定位瓶颈：

- **Lighthouse / PageSpeed Insights**：查看 LCP、CLS、INP 核心 Web 指标。
- **rollup-plugin-visualizer**：分析 Vite 构建产物中体积最大的第三方依赖。
- **Chrome Performance 面板**：排查长任务（Long Tasks）和主线程阻塞。

## 2. 路由与重组件按需加载

对于图表（ECharts）、富文本编辑器、弹窗等非首屏必需的模块，使用异步组件拆分 chunk：

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() => import('~/components/HeavyChart.vue'))
</script>
```

## 3. 大数据列表优化

在渲染上万条表格或列表数据时，避免把所有节点一次性挂载到 DOM：

- **只读大数组使用 `shallowRef`**：跳过深层 Proxy 响应式劫持，内存和初始化耗时立竿见影地下降。
- **引入虚拟滚动**：只渲染视口内可见的几十条 DOM 节点，保持 60fps 流畅滚动。

## 总结

性能优化不是一次性工程，把构建体积检查和核心指标监控纳入日常开发习惯，才能让项目长期保持轻快。
