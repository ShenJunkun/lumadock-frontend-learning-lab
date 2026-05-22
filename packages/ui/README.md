# @lumadock/ui

Shared presentational primitives for the LumaDock learning workspace.

## Boundaries

- Depends on React types and the host application's CSS variables.
- Does not import routes, stores, API clients, React Query, Ant Design, or app data.
- Exports source TypeScript for the workspace; build tooling is owned by the consuming app.

## Current exports

- `designTokens`
- `Button`
- `SurfaceCard`
- `EmptyState`
- `StatusBadge`
- `LearningArchitecturePanel`

## Storybook

P8 adds a package-local Storybook for component states, theme review, and responsive previews:

```powershell
npm.cmd run ui:storybook
npm.cmd run ui:build-storybook
```
