---
title: Git 命令总览 & 常用操作清单
date: 2026-01-31
preview: 基于 git --help 的命令全集速查表，包含工作区初始化操作。
---

# Git 命令总览

本文档基于 `git --help` 的标准分类，列出了 Git 的常用命令。点击对应的标题可查看详细的使用指南。

## 1. [Start a working area (开始工作区)](/notes/git-git-overview)

这部分操作通常只需要执行一次。

- **`git clone <url>`**
  克隆一个远程仓库到新目录。

  > 例子：`git clone https://github.com/vuejs/core.git`

- **`git init`**
  初始化一个空的 Git 仓库，或者重新初始化已存在的仓库。
  > 例子：`git init` (在当前目录下生成 .git 文件夹)

---

## 2. [Work on the current change (处理当前变更)](/notes/git-work-on-current-change)

日常最频繁使用的文件操作。

- **`git add`**: 添加文件内容到索引（暂存区）。
- **`git mv`**: 移动或重命名文件/目录。
- **`git restore`**: 恢复工作区文件（撤销修改）。
- **`git rm`**: 从工作区和索引中删除文件。

## 3. [Examine the history and state (检查历史和状态)](/notes/git-examine-history-state)

用来“看”代码库发生了什么。

- **`git bisect`**: 通过二分查找定位引入 Bug 的 commit。
- **`git diff`**: 显示 commit、工作区、暂存区之间的差异。
- **`git grep`**: 在代码库中搜索匹配的行。
- **`git log`**: 显示提交日志。
- **`git show`**: 显示各类对象（如 commit）的详细信息。
- **`git status`**: 显示工作区状态（是否有修改、暂存）。

## 4. [Grow, mark and tweak your common history (扩展、标记和调整历史)](/notes/git-grow-mark-tweak-history)

涉及版本迭代、分支管理的核心操作。

- **`git branch`**: 列出、创建或删除分支。
- **`git commit`**: 将变更记录（存档）到仓库。
- **`git merge`**: 合并两个或多个开发历史。
- **`git rebase`**: 在另一个基准之上重新应用 commit（变基）。
- **`git reset`**: 重置当前 HEAD 到指定状态。
- **`git switch`**: 切换分支。
- **`git tag`**: 创建、列出、删除或验证标签（GPG 签名）。

## 5. [Collaborate (协作)](/notes/git-collaborate)

与他人或远程仓库同步代码。

- **`git fetch`**: 从另一个仓库下载对象和引用（不合并）。
- **`git pull`**: 获取并并集成另一个仓库/分支（Fetch + Merge）。
- **`git push`**: 更新远程引用及相关对象。
