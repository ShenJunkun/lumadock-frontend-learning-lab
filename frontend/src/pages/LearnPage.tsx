import { BookOpenCheck, Code2, GitBranch, Rocket, Sparkles } from "lucide-react";

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
    </section>
  );
}

