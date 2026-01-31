---
title: Grow, mark and tweak your common history (扩展与调整历史)
date: 2026-01-31
preview: 详解 branch, commit, merge, rebase, reset, switch, tag 等核心版本控制命令。
---

# Grow, mark and tweak your common history

这是 Git 的核心功能区：提交代码、管理分支、合并修改。

## `git switch` & `git branch`

分支管理。

```bash
# 创建并切换到新分支 (Git 2.23+ 推荐)
git switch -c feature-new

# 查看所有本地分支
git branch

# 删除分支
git branch -d feature-old
```

## `git commit`

记录变更。

```bash
# 提交暂存区的修改
git commit -m "feat: add user login"

# 修正上一次提交（如果忘了改某行代码，或者写错了 message）
# 注意：不要修改已经 push 的 commit
git commit --amend
```

## `git merge`

合并分支。

```bash
# 将 feature 分支合并到当前分支
git merge feature
```

## `git rebase`

变基。将当前分支的修改“移植”到另一个分支的最新提交之上。保持提交历史线性整洁。

```bash
# 假设你在 feature 分支
# 你的 base 是 main，但 main 已经更新了
git rebase main

# 如果有冲突，解决后：
# git rebase --continue
```

## `git reset`

重置 HEAD 指针。危险操作，请谨慎。

```bash
# 软重置：移动 HEAD，保留暂存区和工作区（撤销 commit 但保留代码）
git reset --soft HEAD~1

# 硬重置：移动 HEAD，丢弃暂存区和工作区（彻底回到过去，修改会丢失！）
git reset --hard HEAD~1
```

## `git tag`

打标签，通常用于发布版本。

```bash
# 打一个轻量标签
git tag v1.0.0

# 列出标签
git tag
```
