<script setup lang="ts">
import {
  defaultArchitectureItems,
  LearningArchitecturePanel,
} from "@lumadock/ui-vue";
import {
  BookOpenCheck,
  Code2,
  GitBranch,
  Rocket,
  Sparkles,
} from "lucide-vue-next";

import AntdWorkbenchPreview from "../components/AntdWorkbenchPreview.vue";
import { p3LearningMilestones } from "../data/p3Architecture";
import { p4LearningMilestones } from "../data/p4LearningRoadmap";
import { p5LearningMilestones } from "../data/p5LearningRoadmap";

const chapters = [
  {
    icon: Rocket,
    title: "01 环境搭建",
    copy: "安装 Node、创建 conda 环境、启动 Vite 与 FastAPI。",
  },
  {
    icon: Code2,
    title: "02 前端基础",
    copy: "用 HTML 结构、CSS 布局、TypeScript 类型把界面拆清楚。",
  },
  {
    icon: BookOpenCheck,
    title: "03 Vue 工程",
    copy: "组件、路由、Vue Query、Pinia、表单校验。",
  },
  {
    icon: Sparkles,
    title: "04 动画与 3D",
    copy: "Three.js、Vue 响应式状态、reduced-motion。",
  },
  {
    icon: GitBranch,
    title: "05 测试与提交",
    copy: "Vitest、Testing Library、Playwright、构建和 git commit。",
  },
];
</script>

<template>
  <section class="page-section">
    <div class="section-heading">
      <span class="eyebrow">Learning chapters</span>
      <h1>从产品界面学前端工程</h1>
      <p>每个章节都对应仓库中的源码、测试或文档。</p>
    </div>

    <div
      class="mb-6 grid gap-3 rounded-ui border border-line bg-surface p-4 shadow-soft md:grid-cols-3"
    >
      <div>
        <span class="eyebrow">Tailwind</span>
        <p class="mt-1 text-sm text-muted">
          Utility classes handle local spacing and responsive layout.
        </p>
      </div>
      <div>
        <span class="eyebrow">Global CSS</span>
        <p class="mt-1 text-sm text-muted">
          Design variables and product visuals stay centralized.
        </p>
      </div>
      <div>
        <span class="eyebrow">Breakpoints</span>
        <p class="mt-1 text-sm text-muted">
          Use xs, sm, md, lg, xl, and 2xl as shared responsive steps.
        </p>
      </div>
    </div>

    <div class="chapter-list">
      <article
        v-for="chapter in chapters"
        :key="chapter.title"
        class="chapter-item"
      >
        <span class="chapter-icon" aria-hidden="true">
          <component :is="chapter.icon" :size="22" />
        </span>
        <div>
          <h2>{{ chapter.title }}</h2>
          <p>{{ chapter.copy }}</p>
        </div>
      </article>
    </div>

    <section class="mt-8">
      <div class="section-heading">
        <span class="eyebrow">P3 architecture</span>
        <h2>Architecture track</h2>
        <p>
          CSS-in-JS、monorepo 边界、shared UI 和微前端取舍都有文档和测试记录。
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-4">
        <article
          v-for="milestone in p3LearningMilestones"
          :key="milestone.label"
          class="rounded-ui border border-line bg-surface p-4 shadow-soft"
        >
          <span class="eyebrow">{{ milestone.status }}</span>
          <h3 class="mb-2 mt-3 text-lg font-extrabold">
            {{ milestone.label }}
          </h3>
          <p class="m-0 text-sm text-muted">{{ milestone.evidence }}</p>
        </article>
      </div>
    </section>

    <LearningArchitecturePanel
      eyebrow="P3 architecture"
      title="Shared UI package prototype"
      summary="A small @lumadock/ui-vue package is consumed by the Vue app through an alias for parallel framework parity."
      :items="defaultArchitectureItems"
    />

    <section class="mt-8">
      <div class="section-heading">
        <span class="eyebrow">P4 production</span>
        <h2>Production readiness track</h2>
        <p>SEO、telemetry、数据预取和表单草稿会按小提交继续补齐。</p>
      </div>

      <div class="grid gap-3 md:grid-cols-4">
        <article
          v-for="milestone in p4LearningMilestones"
          :key="milestone.id"
          class="rounded-ui border border-line bg-surface p-4 shadow-soft"
        >
          <span class="eyebrow">{{ milestone.status }}</span>
          <h3 class="mb-2 mt-3 text-lg font-extrabold">
            {{ milestone.label }}
          </h3>
          <p class="m-0 text-sm text-muted">{{ milestone.evidence }}</p>
        </article>
      </div>
    </section>

    <section class="mt-8">
      <div class="section-heading">
        <span class="eyebrow">P5 mastery</span>
        <h2>Frontend mastery track</h2>
        <p>
          PWA、性能预算、安全隐私、视觉回归、设计系统和状态建模会继续拆小提交推进。
        </p>
      </div>

      <div class="grid gap-3 md:grid-cols-3">
        <article
          v-for="milestone in p5LearningMilestones"
          :key="milestone.id"
          class="rounded-ui border border-line bg-surface p-4 shadow-soft"
        >
          <span class="eyebrow">{{ milestone.status }}</span>
          <h3 class="mb-2 mt-3 text-lg font-extrabold">
            {{ milestone.label }}
          </h3>
          <p class="m-0 text-sm text-muted">{{ milestone.evidence }}</p>
        </article>
      </div>
    </section>

    <AntdWorkbenchPreview />
  </section>
</template>
