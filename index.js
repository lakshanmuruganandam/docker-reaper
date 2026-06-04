#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import pc from 'picocolors';
import { Command } from 'commander';
import boxen from 'boxen';

const program = new Command();

program
  .name('docker-reaper')
  .description('Interactively hunt down and obliterate dead Docker containers and dangling images.')
  .version('1.0.0')
  .parse(process.argv);

const banner = `
    ██████╗  ██████╗  ██████╗██╗  ██╗███████╗██████╗     ██████╗ ███████╗ █████╗ ██████╗ ███████╗██████╗ 
    ██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
    ██║  ██║██║   ██║██║     █████╔╝ █████╗  ██████╔╝    ██████╔╝█████╗  ███████║██████╔╝█████╗  ██████╔╝
    ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗    ██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██╔══╝  ██╔══██╗
    ██████╔╝╚██████╔╝╚██████╗██║  ██╗███████╗██║  ██║    ██║  ██║███████╗██║  ██║██║     ███████╗██║  ██║
    ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
`;

console.log(pc.cyan(banner));
console.log(pc.gray('    Time to reclaim your hard drive.'));
console.log(pc.dim('    Architected by @lakshanmuruganandam\n'));

try {
  // Check if docker is installed and running
  execSync('docker info', { stdio: 'ignore' });
} catch (e) {
  console.log(pc.red('❌ Docker is not running or not installed. Please start Docker first.'));
  process.exit(1);
}

try {
  const rawContainers = execSync(`docker ps -a --filter "status=exited" --format "{{.ID}}|{{.Names}}|{{.Status}}"`).toString().trim();
  const rawImages = execSync(`docker images -f "dangling=true" --format "{{.ID}}|{{.Repository}}:{{.Tag}}|{{.Size}}"`).toString().trim();

  const targets = [];

  if (rawContainers) {
    rawContainers.split('\n').forEach(line => {
      const [id, name, status] = line.split('|');
      targets.push({ type: 'Container', id, name, details: status });
    });
  }

  if (rawImages) {
    rawImages.split('\n').forEach(line => {
      const [id, repoTag, size] = line.split('|');
      targets.push({ type: 'Image', id, name: repoTag, details: size });
    });
  }

  if (targets.length === 0) {
    console.log(pc.green('✨ Your Docker environment is completely clean. No dead containers or dangling images found.'));
    process.exit(0);
  }

  const choices = targets.map(t => {
    const typeColored = t.type === 'Container' ? pc.yellow('[Container]') : pc.magenta('[Image]');
    return {
      name: `${typeColored} ${t.name.padEnd(25)} ${pc.gray(t.id)} | ${pc.red(t.details)}`,
      value: t,
      short: t.name
    };
  });

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: 'Select dead Docker resources to obliterate:',
    choices: choices,
    pageSize: 10,
    loop: false
  }]);

  if (selected.length === 0) {
    console.log(pc.gray('\nMission aborted. No resources deleted.'));
    process.exit(0);
  }

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: pc.bgRed(pc.white(` WARNING: You are about to permanently delete ${selected.length} Docker resources. Proceed? `)),
    default: false
  }]);

  if (!confirm) {
    console.log(pc.gray('\nMission aborted.'));
    process.exit(0);
  }

  console.log();
  let deleted = 0;
  for (const target of selected) {
    try {
      if (target.type === 'Container') {
        execSync(`docker rm ${target.id}`, { stdio: 'ignore' });
      } else {
        execSync(`docker rmi -f ${target.id}`, { stdio: 'ignore' });
      }
      console.log(pc.green(`✔ Obliterated ${target.type}: `) + pc.white(target.name));
      deleted++;
    } catch (e) {
      console.log(pc.red(`❌ Failed to delete ${target.type}: `) + pc.white(target.name));
    }
  }

  console.log(
    boxen(
      pc.green(`Mission Accomplished.\n`) + pc.white(`Reaped ${deleted} dead Docker resources.`),
      { padding: 1, margin: { top: 1 }, borderStyle: 'round', borderColor: 'green' }
    )
  );

} catch (error) {
  console.error(pc.red('\nAn unexpected error occurred:'), error.message);
  process.exit(1);
}
