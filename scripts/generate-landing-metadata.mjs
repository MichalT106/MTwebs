#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { discoverProjects, getDefaultProjectsDir } from './project-config.mjs';

const DEFAULT_OUTPUT = resolve('landing', 'src', 'generated-projects.json');

function parseArgs(argv) {
  const options = {
    projectsDir: getDefaultProjectsDir(),
    output: resolve(process.env.LANDING_PROJECTS_FILE ?? DEFAULT_OUTPUT),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--projects-dir') {
      const value = argv[i + 1];
      if (!value) throw new Error('--projects-dir requires a path');
      options.projectsDir = resolve(value);
      i += 1;
      continue;
    }
    if (arg === '--output') {
      const value = argv[i + 1];
      if (!value) throw new Error('--output requires a path');
      options.output = resolve(value);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function projectImageUrl(project) {
  if (!project.image) return undefined;
  return `/${project.slug}/${project.image.replace(/^\/+/, '')}`;
}

function toLandingProject(project) {
  return {
    name: project.name,
    slug: project.slug,
    href: `/${project.slug}/`,
    description: project.description,
    image: projectImageUrl(project),
    category: project.category,
    featured: project.featured,
  };
}

function sortLandingProjects(projects) {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function createLandingMetadata(projects) {
  return {
    schemaVersion: 1,
    projects: sortLandingProjects(projects.map(toLandingProject)),
  };
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

  const metadata = createLandingMetadata(result.projects);
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, `${JSON.stringify(metadata, null, 2)}\n`);

  console.log(`Generated landing metadata for ${metadata.projects.length} project(s): ${options.output}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
