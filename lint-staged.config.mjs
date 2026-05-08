const quote = (file) => `"${file.replaceAll('"', '\\"')}"`;
const list = (files) => files.map(quote).join(" ");

export default {
  "frontend/**/*.{ts,tsx,js,jsx}": (files) => [
    `npm --prefix frontend exec eslint -- --fix ${list(files)}`,
    `npm --prefix frontend exec prettier -- --write ${list(files)}`,
  ],
  "frontend/**/*.{css,json,md,mjs}": (files) =>
    `npm --prefix frontend exec prettier -- --write ${list(files)}`,
  "{README.md,docs/**/*.md,*.json,*.yml,*.yaml}": (files) =>
    `npm --prefix frontend exec prettier -- --write ${list(files)}`,
};
