#!/usr/bin/env node
import { resolve } from 'node:path';
import {
  PROJECT_CONFIG_CONTRACT,
  discoverProjects,
  getDefaultProjectsDir,
} from './project-config.mjs';

function parseArgs(argv) {
  const options = {
    json: false,
    showContract: false,
    projectsDir: getDefaultProjectsDir(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      options.json = true;
      continue;
    }
    if (arg === '--contract') {
      options.showContract = true;
      continue;
    }
    if (arg === '--projects-dir') {
      const value = argv[i + 1];
      if (!value) throw new Error('--projects-dir requires a path');
      options.projectsDir = resolve(value);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHumanResult(result) {
  console.log(`Projects directory: ${result.projectsDir}`);

  for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`Error: ${error}`);
    }
    return;
  }

  if (result.projects.length === 0) {
    console.log('No valid projects discovered.');
    return;
  }

  console.log(`Discovered ${result.projects.length} project(s):`);
  for (const project of result.projects) {
    console.log(`- ${project.slug}: ${project.name} (${project.type})`);
  }
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (options.showContract) {
    console.log(JSON.stringify(PROJECT_CONFIG_CONTRACT, null, 2));
    process.exit(0);
  }

  const result = discoverProjects({ projectsDir: options.projectsDir });

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printHumanResult(result);
  }

  if (result.errors.length > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
