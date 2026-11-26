#!/usr/bin/env node
/**
 * 一键同步 Obsidian + 构建校验 + 提交推送触发 Vercel 自动部署
 *
 * 使用方式：
 *   pnpm release
 *   pnpm release "publish: 新增动态高度虚拟列表实战文章"
 */

import { execFileSync, execSync } from 'node:child_process'

const isWin = process.platform === 'win32'
const pnpmCmd = isWin ? 'pnpm.cmd' : 'pnpm'

function run(command, args = [], label = '', useShell = false) {
  if (label) console.log(`\n▶ ${label}`)
  execFileSync(command, args, { stdio: 'inherit', shell: useShell })
}

function getGitStatus() {
  return execSync('git status --porcelain', { encoding: 'utf-8' }).trim()
}

function main() {
  const rawArgs = process.argv.slice(2)
  const skipBuild = rawArgs.includes('--skip-build')
  const customMessage = rawArgs.filter((arg) => arg !== '--skip-build').join(' ').trim()

  // 1. Sync from Obsidian vault
  run(pnpmCmd, ['sync:obsidian'], '1/4 正在从 Obsidian 同步最新文章与图片...', isWin)

  // 2. Check if there are changes to publish
  const status = getGitStatus()
  if (!status) {
    console.log('\n✨ 工作区没有新变更，无需发布。')
    return
  }

  console.log('\n📋 检测到以下变更：')
  console.log(status)

  // 3. Validate static build before pushing
  if (!skipBuild) {
    run(pnpmCmd, ['generate'], '2/4 正在执行静态构建校验 (pnpm generate)...', isWin)
  } else {
    console.log('\n▶ 2/4 已跳过静态构建校验 (--skip-build)')
  }

  // 4. Stage, commit & push (never pass shell: true to git so commit messages with spaces/& are safe)
  const today = new Date().toISOString().split('T')[0]
  const commitMsg = customMessage || `content: publish obsidian updates (${today})`

  run('git', ['add', '-A'], '3/4 正在暂存并提交变更...', false)
  run('git', ['commit', '-m', commitMsg], '', false)

  run('git', ['push', 'origin', 'main'], '4/4 正在推送到 GitHub (自动触发 Vercel 部署)...', false)

  console.log('\n🚀 发布完成！Vercel 约 30 秒内完成线上更新：https://my-portal-bay.vercel.app')
}

try {
  main()
} catch (err) {
  console.error('\n❌ 发布流程中断，请检查上方错误日志。')
  process.exit(1)
}
