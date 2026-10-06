import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const matrix = JSON.parse(
  fs.readFileSync(path.join(root, "tools/architecture/boundary-matrix.json"), "utf8"),
);

const packageMeta = {
  commerce: { scope: "commerce", type: "domain" },
  content: { scope: "content", type: "domain" },
  services: { scope: "services", type: "domain" },
  seo: { scope: "platform", type: "platform" },
  analytics: { scope: "platform", type: "platform" },
  ui: { scope: "shared", type: "ui" },
  contracts: { scope: "core", type: "contract" },
  core: { scope: "core", type: "util" },
};

const failures = [];

for (const [name, meta] of Object.entries(packageMeta)) {
  const projectPath = path.join(root, "packages", name, "project.json");
  if (!fs.existsSync(projectPath)) {
    failures.push(`missing project.json: ${name}`);
    continue;
  }

  const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
  const tags = new Set(project.tags ?? []);
  for (const tag of [`scope:${meta.scope}`, `type:${meta.type}`]) {
    if (!tags.has(tag)) failures.push(`${name}: missing ${tag}`);
  }
}

for (const [source, target] of matrix.forbidden) {
  if (matrix.allowed[source]?.includes(target)) {
    failures.push(`matrix contradiction: ${source} -> ${target}`);
  }
}

function packageFixture(name, meta, importTarget) {
  return {
    packageJson: JSON.stringify({
      name: `@vicuna/architecture-fixture-${name}`,
      version: "0.0.0",
      private: true,
      type: "module",
    }, null, 2) + "\n",
    projectJson: JSON.stringify({
      name: `architecture-fixture-${name}`,
      root: `packages/__architecture-fixture-${name}`,
      sourceRoot: `packages/__architecture-fixture-${name}/src`,
      projectType: "library",
      tags: [`scope:${meta.scope}`, `type:${meta.type}`],
    }, null, 2) + "\n",
    source: `import "@vicuna/${importTarget}";\nexport const boundaryFixture = true;\n`,
  };
}

const packageTargets = Object.keys(packageMeta);
const allowedEdges = [];
for (const source of packageTargets) {
  for (const target of matrix.allowed[source] ?? []) {
    if (packageMeta[target]) allowedEdges.push([source, target]);
  }
}

const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "vicuna-boundaries-"));
const created = [];

function writeFixture(kind, index, source, target, shouldFail) {
  const name = `${kind}-${index}-${source}-to-${target}`;
  const dir = path.join(root, "packages", `__architecture-fixture-${name}`);
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });
  const fixture = packageFixture(name, packageMeta[source], target);
  fs.writeFileSync(path.join(dir, "package.json"), fixture.packageJson);
  fs.writeFileSync(path.join(dir, "project.json"), fixture.projectJson);
  fs.writeFileSync(path.join(dir, "src", "index.ts"), fixture.source);
  created.push(dir);
  return { dir, shouldFail };
}

const cases = [
  ...allowedEdges.map(([source, target], index) =>
    writeFixture("allowed", index, source, target, false),
  ),
  ...matrix.forbidden
    .filter(([source, target]) => packageMeta[source] && packageMeta[target])
    .map(([source, target], index) =>
      writeFixture("forbidden", index, source, target, true),
    ),
];

try {
  const eslintBin = path.join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "eslint.cmd" : "eslint",
  );

  if (!fs.existsSync(eslintBin)) {
    failures.push("architecture verification requires installed ESLint; node_modules/.bin/eslint is missing");
  } else {
    const allowedFiles = cases
      .filter((test) => !test.shouldFail)
      .map((test) => path.relative(root, path.join(test.dir, "src", "index.ts")));
    const forbiddenFiles = cases
      .filter((test) => test.shouldFail)
      .map((test) => path.relative(root, path.join(test.dir, "src", "index.ts")));

    const runLint = (files) =>
      spawnSync(
        eslintBin,
        ["--config", "eslint.config.mjs", "--no-error-on-unmatched-pattern", ...files],
        { cwd: root, encoding: "utf8" },
      );

    const allowedResult = runLint(allowedFiles);
    if (allowedResult.status !== 0) {
      failures.push(
        `allowed fixture lint failed unexpectedly:\n${allowedResult.stdout ?? ""}${allowedResult.stderr ?? ""}`,
      );
    }

    const forbiddenResult = runLint(forbiddenFiles);
    if (forbiddenResult.status === 0) {
      failures.push("forbidden fixture lint passed unexpectedly; boundary constraints are not being enforced");
    } else {
      console.log("Forbidden fixture lint failed as expected.");
    }
  }
} finally {
  for (const dir of created) fs.rmSync(dir, { recursive: true, force: true });
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error("Architecture boundary verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Architecture boundary verification passed: ${allowedEdges.length} allowed package edges passed and forbidden package edges failed as expected.`,
);
