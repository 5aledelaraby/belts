import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const matrix = JSON.parse(
  fs.readFileSync(path.join(root, "tools/architecture/boundary-matrix.json"), "utf8"),
);

const expectedScopes = {
  commerce: "commerce",
  content: "content",
  services: "services",
  seo: "platform",
  analytics: "platform",
  ui: "shared",
  contracts: "core",
  core: "core",
};

const expectedTypes = {
  commerce: "domain",
  content: "domain",
  services: "domain",
  seo: "platform",
  analytics: "platform",
  ui: "ui",
  contracts: "contract",
  core: "util",
};

const failures = [];

for (const [name, scope] of Object.entries(expectedScopes)) {
  const projectPath = path.join(root, "packages", name, "project.json");
  if (!fs.existsSync(projectPath)) {
    failures.push(`missing project.json: ${name}`);
    continue;
  }

  const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
  const tags = new Set(project.tags ?? []);
  if (!tags.has(`scope:${scope}`)) {
    failures.push(`${name}: missing scope:${scope}`);
  }
  if (!tags.has(`type:${expectedTypes[name]}`)) {
    failures.push(`${name}: missing type:${expectedTypes[name]}`);
  }
}

function targetForImport(specifier) {
  const match = /^@vicuna\/([^/]+)$/.exec(specifier);
  return match?.[1] ?? null;
}

function domainForPackage(name) {
  return name === "seo" || name === "analytics" ? name : name;
}

for (const name of Object.keys(expectedScopes)) {
  const sourceDir = path.join(root, "packages", name, "src");
  if (!fs.existsSync(sourceDir)) continue;

  for (const file of fs.readdirSync(sourceDir)) {
    if (!/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(file)) continue;
    const source = fs.readFileSync(path.join(sourceDir, file), "utf8");
    for (const match of source.matchAll(/(?:from\s+|import\s*\(\s*|require\(\s*)["'](@vicuna\/[^"']+)["']/g)) {
      const target = targetForImport(match[1]);
      if (!target || !expectedScopes[target]) continue;
      const sourceName = domainForPackage(name);
      const targetName = domainForPackage(target);
      if (!matrix.allowed[sourceName]?.includes(targetName)) {
        failures.push(`${name}: forbidden dependency on @vicuna/${target}`);
      }
    }
  }
}

for (const [source, target] of matrix.forbidden) {
  if (matrix.allowed[source]?.includes(target)) {
    failures.push(`matrix contradiction: ${source} -> ${target} is both allowed and forbidden`);
  }
}

if (failures.length) {
  console.error("Architecture boundary verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Architecture boundary verification passed.");
