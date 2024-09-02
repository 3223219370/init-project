#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 解决 __dirname 在 ES 模块中的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];
const targetPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, '../template');

if (fs.existsSync(targetPath)) {
  console.error(`Directory ${projectName} already exists!`);
  process.exit(1);
}

fs.mkdirSync(targetPath);

console.log(`Creating project in ${targetPath}...`);

// 递归复制目录和文件
function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const stat = fs.statSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

// 执行复制操作
copyFolderSync(templatePath, targetPath);

// 切换到新项目目录
process.chdir(targetPath);

// 安装依赖
console.log('Installing dependencies...');
execSync('yarn', { stdio: 'inherit' });

console.log('Project created successfully!');
