#!/usr/bin/env node
// Runs every linter (and the test suite) and prints a compact per-tool
// result. On success only a green check is shown; on failure the relevant
// error output is printed.

import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import path from "node:path";
import pc from "picocolors";

const root = path.resolve(import.meta.dirname, "..");

const bin = (name: string): string => {
  const base = path.join(root, "node_modules", ".bin", name);
  // On Windows the npm shims are `.cmd` files and must be spawned through the
  // shell; spawning the extension-less shim yields ENOENT.
  return process.platform === "win32" ? `${base}.cmd` : base;
};

// Windows command-line escaping, ported from `cross-spawn`. The repo sits under
// a path containing spaces ("F:\My Projects\..."), so a `.cmd` shim's full path
// is split by cmd.exe when spawned through `spawnSync`'s `shell` option (which
// joins the tokens without quoting). Escape each token and run it verbatim via
// cmd.exe instead.
const WINDOWS_META_CHARS = /([()\][%!^"`<>&|;, *?])/g;

function escapeWindowsCommand(arg: string): string {
  return arg.replace(WINDOWS_META_CHARS, "^$1");
}

function escapeWindowsArgument(arg: string, doubleEscapeMetaChars: boolean): string {
  let value = arg;
  value = value.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
  value = value.replace(/(?=(\\+?)?)\1$/, "$1$1");
  value = '"' + value + '"';
  value = value.replace(WINDOWS_META_CHARS, "^$1");
  if (doubleEscapeMetaChars) {
    value = value.replace(WINDOWS_META_CHARS, "^$1");
  }
  return value;
}

function spawnBin(cmd: string, args: string[]): SpawnSyncReturns<string> {
  if (process.platform === "win32" && cmd.endsWith(".cmd")) {
    // A `.cmd` shim proxies args through `%*`, so meta characters are parsed a
    // second time and must be `^`-escaped twice.
    const shellCommand = [escapeWindowsCommand(cmd), ...args.map((arg) => escapeWindowsArgument(arg, true))].join(" ");
    return spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `"${shellCommand}"`], {
      cwd: root,
      encoding: "utf8",
      windowsVerbatimArguments: true,
    });
  }
  return spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

// Strip markdownlint-cli2 banner/summary noise and prettier's status header.
const NOISE = /^(markdownlint-cli2 v|Finding:|Linting:|Summary:|Checking formatting\.\.\.)/;

function clean(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !NOISE.test(line))
    .join("\n");
}

interface LintStep {
  label: string;
  cmd: string;
  args: string[];
}

const steps: LintStep[] = [
  { label: "ESLint", cmd: bin("eslint"), args: [".", "--max-warnings", "0"] },
  {
    label: "Markdown",
    cmd: bin("markdownlint-cli2"),
    args: ["--config", ".markdownlint-cli2.json", "**/*.md", "#node_modules"],
  },
  { label: "Prettier", cmd: bin("prettier"), args: ["--check", ".", "--ignore-path", ".gitignore"] },
  { label: "Shell", cmd: bin("shellcheck"), args: [".husky/pre-commit"] },
  { label: "TypeScript", cmd: bin("tsc"), args: ["-p", "tsconfig.check.json"] },
  { label: "Tests", cmd: "npm", args: ["test"] },
];

console.log(pc.bold("Lint"));
let failed = false;
for (const step of steps) {
  const res = spawnBin(step.cmd, step.args);
  const output = clean(`${res.stdout}${res.stderr}`);
  if (res.status === 0) {
    console.log(`  ${pc.green("✔")} ${step.label}`);
  } else {
    failed = true;
    console.log(`  ${pc.red("✖")} ${step.label}`);
    if (output) {
      console.log(indent(output));
    }
  }
}
console.log(failed ? pc.red("Failed") : pc.green("Passed"));
process.exit(failed ? 1 : 0);

function indent(text: string): string {
  return text
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
}
