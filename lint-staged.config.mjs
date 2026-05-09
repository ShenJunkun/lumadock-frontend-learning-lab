const quote = (file) => `"${file.replaceAll('"', '\\"')}"`;
const list = (files) => files.map(quote).join(" ");

export default {
  "apps/web/**/*.{ts,tsx,js,jsx}": (files) => [
    `npm --workspace @lumadock/web exec eslint -- --fix ${list(files)}`,
    `npm --workspace @lumadock/web exec prettier -- --write ${list(files)}`,
  ],
  "apps/web/**/*.{css,json,md,mjs}": (files) =>
    `npm --workspace @lumadock/web exec prettier -- --write ${list(files)}`,
  "{README.md,docs/**/*.md,*.json,*.yml,*.yaml}": (files) =>
    `npm --workspace @lumadock/web exec prettier -- --write ${list(files)}`,
};
