import { defaultArchitectureItems, LearningArchitecturePanel } from "@lumadock/ui";
import { BookOpenCheck, Code2, GitBranch, Rocket, Sparkles } from "lucide-react";

import { AntdWorkbenchPreview } from "../components/AntdWorkbenchPreview";
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
    title: "03 React 工程",
    copy: "组件、路由、React Query、Zustand、表单校验。",
  },
  {
    icon: Sparkles,
    title: "04 动画与 3D",
    copy: "Framer Motion、React Three Fiber、reduced-motion。",
  },
  {
    icon: GitBranch,
    title: "05 测试与提交",
    copy: "Vitest、Testing Library、Playwright、构建和 git commit。",
  },
];

export function LearnPage() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Learning chapters</span>
        <h1>从产品界面学前端工程</h1>
        <p>每个章节都对应仓库中的源码、测试或文档。</p>
      </div>

      <div className="mb-6 grid gap-3 rounded-ui border border-line bg-surface p-4 shadow-soft md:grid-cols-3">
        <div>
          <span className="eyebrow">Tailwind</span>
          <p className="mt-1 text-sm text-muted">
            Utility classes handle local spacing and responsive layout.
          </p>
        </div>
        <div>
          <span className="eyebrow">Global CSS</span>
          <p className="mt-1 text-sm text-muted">
            Design variables and product visuals stay centralized.
          </p>
        </div>
        <div>
          <span className="eyebrow">Breakpoints</span>
          <p className="mt-1 text-sm text-muted">
            Use xs, sm, md, lg, xl, and 2xl as shared responsive steps.
          </p>
        </div>
      </div>

      <div className="chapter-list">
        {chapters.map((chapter) => {
          const Icon = chapter.icon;
          return (
            <article className="chapter-item" key={chapter.title}>
              <span className="chapter-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <div>
                <h2>{chapter.title}</h2>
                <p>{chapter.copy}</p>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="section-heading">
          <span className="eyebrow">P3 architecture</span>
          <h2>Architecture track</h2>
          <p>CSS-in-JS、monorepo 边界、shared UI 和微前端取舍都有文档和测试记录。</p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {p3LearningMilestones.map((milestone) => (
            <article
              className="rounded-ui border border-line bg-surface p-4 shadow-soft"
              key={milestone.label}
            >
              <span className="eyebrow">{milestone.status}</span>
              <h3 className="mb-2 mt-3 text-lg font-extrabold">{milestone.label}</h3>
              <p className="m-0 text-sm text-muted">{milestone.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <LearningArchitecturePanel
        eyebrow="P3 architecture"
        title="Shared UI package prototype"
        summary="A small @lumadock/ui package is consumed by the web app through an alias before the project moves to a full workspace layout."
        items={defaultArchitectureItems}
      />

      <section className="mt-8">
        <div className="section-heading">
          <span className="eyebrow">P4 production</span>
          <h2>Production readiness track</h2>
          <p>SEO、telemetry、数据预取和表单草稿会按小提交继续补齐。</p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {p4LearningMilestones.map((milestone) => (
            <article
              className="rounded-ui border border-line bg-surface p-4 shadow-soft"
              key={milestone.id}
            >
              <span className="eyebrow">{milestone.status}</span>
              <h3 className="mb-2 mt-3 text-lg font-extrabold">{milestone.label}</h3>
              <p className="m-0 text-sm text-muted">{milestone.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="section-heading">
          <span className="eyebrow">P5 mastery</span>
          <h2>Frontend mastery track</h2>
          <p>PWA、性能预算、安全隐私、视觉回归、设计系统和状态建模会继续拆小提交推进。</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {p5LearningMilestones.map((milestone) => (
            <article
              className="rounded-ui border border-line bg-surface p-4 shadow-soft"
              key={milestone.id}
            >
              <span className="eyebrow">{milestone.status}</span>
              <h3 className="mb-2 mt-3 text-lg font-extrabold">{milestone.label}</h3>
              <p className="m-0 text-sm text-muted">{milestone.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <AntdWorkbenchPreview />
    </section>
  );
}
