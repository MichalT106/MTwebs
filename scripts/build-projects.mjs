#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { discoverProjects, getDefaultProjectsDir } from './project-config.mjs';

const DEFAULT_OUT_DIR = resolve('dist');

function parseArgs(argv) {
  const options = {
    dryRun: false,
    projectsDir: getDefaultProjectsDir(),
    outDir: resolve(process.env.PROJECTS_OUT_DIR ?? DEFAULT_OUT_DIR),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--projects-dir') {
      const value = argv[i + 1];
      if (!value) throw new Error('--projects-dir requires a path');
      options.projectsDir = resolve(value);
      i += 1;
      continue;
    }
    if (arg === '--out-dir') {
      const value = argv[i + 1];
      if (!value) throw new Error('--out-dir requires a path');
      options.outDir = resolve(value);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function createProjectEnv(project) {
  const env = { ...process.env };

  for (const key of Object.keys(env)) {
    if (key.startsWith('VITE_')) {
      delete env[key];
    }
  }

  for (const key of project.env) {
    if (process.env[key] !== undefined) {
      env[key] = process.env[key];
    }
  }

  return env;
}

function getMissingEnv(project) {
  return project.env.filter((key) => process.env[key] === undefined || process.env[key] === '');
}

function runCommand(command, { cwd, env, dryRun }) {
  if (dryRun) {
    console.log(`[dry-run] ${cwd}> ${command}`);
    return;
  }

  const result = spawnSync(command, {
    cwd,
    env,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed (${result.status ?? 1}): ${command}`);
  }
}

function getInstallCommand(project) {
  if (project.installCommand) return project.installCommand;
  if ((project.type === 'vite' || project.type === 'custom') && existsSync(resolve(project.projectDir, 'package.json'))) {
    return 'npm ci';
  }
  return null;
}

function shouldCopyStaticPath(sourcePath) {
  const name = basename(sourcePath);
  return name !== 'project.json' && name !== 'node_modules' && name !== '.git';
}

function copyDirectory(source, destination, { dryRun, staticProject = false }) {
  if (!existsSync(source)) {
    throw new Error(`Output directory not found: ${source}`);
  }

  if (dryRun) {
    console.log(`[dry-run] copy ${source} -> ${destination}`);
    return;
  }

  rmSync(destination, { recursive: true, force: true });
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, {
    recursive: true,
    filter: staticProject ? shouldCopyStaticPath : undefined,
  });
}

function buildStaticProject(project, options) {
  const source = resolve(project.projectDir, project.sourceDir);
  const destination = resolve(options.outDir, project.slug);
  copyDirectory(source, destination, { dryRun: options.dryRun, staticProject: true });
}

function buildCommandProject(project, options) {
  const missingEnv = getMissingEnv(project);
  if (missingEnv.length > 0) {
    throw new Error(`${project.slug}: missing required environment variable(s): ${missingEnv.join(', ')}`);
  }

  const env = createProjectEnv(project);
  const installCommand = getInstallCommand(project);

  if (installCommand) {
    runCommand(installCommand, { cwd: project.projectDir, env, dryRun: options.dryRun });
  }

  runCommand(project.buildCommand, { cwd: project.projectDir, env, dryRun: options.dryRun });

  const source = resolve(project.projectDir, project.outputDir);
  const destination = resolve(options.outDir, project.slug);
  copyDirectory(source, destination, { dryRun: options.dryRun });
}

function buildProject(project, options) {
  console.log(`Building ${project.slug} (${project.type})`);

  if (project.type === 'static') {
    buildStaticProject(project, options);
    return;
  }

  if (project.type === 'vite' || project.type === 'custom') {
    buildCommandProject(project, options);
    return;
  }

  throw new Error(`${project.slug}: unsupported project type "${project.type}"`);
}

try {
  const options = parseArgs(process.argv.slice(2));
  const result = discoverProjects({ projectsDir: options.projectsDir });

  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`Error: ${error}`);
    }
    process.exit(1);
  }

  if (result.projects.length === 0) {
    console.log('No valid projects discovered. Nothing to build.');
    process.exit(0);
  }

  for (const project of result.projects) {
    buildProject(project, options);
  }

  console.log(`Built ${result.projects.length} project(s) into ${options.outDir}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
