# Examine the history and state

这一组命令用于观测仓库的状态、回溯历史以及调试定位问题。

## `git status`

查看工作区状态。这是除了 `ls` 之外你最应该频繁敲的命令。

```bash
git status

# 精简模式，输出更紧凑
git status -s
```

## `git log`

查看提交日志历史。

```bash
# 查看详细日志
git log

# 单行显示，更清晰
git log --oneline

# 查看最近 5 条
git log -n 5

# 查看某个文件的修改历史
git log src/App.vue
```

## `git show`

查看某个具体对象的详细信息（通常是 commit）。

```bash
# 查看最新一次 commit 的改动
git show HEAD

# 查看指定 hash 的 commit 改动
git show a1b2c3d
```

## `git diff`

查看差异。

```bash
# 查看 工作区 vs 暂存区 （即你改了什么但还没 add）
git diff

# 查看 暂存区 vs 版本库 （即 add 了但在 commit 前再检查一遍）
git diff --staged

# 查看 两个分支之间的差异
git diff main dev
```

## `git grep`

在代码库中搜索。比普通的 grep 更快，因为它利用了 Git 的索引，且忽略 `.gitignore` 的文件。

```bash
# 搜索字符串 "hello"
git grep "hello"

# 在特定版本中搜索
git grep "hello" v1.0.0
```

## `git bisect`

二分查找定位 Bug。神器！当你不知道 Bug 是哪一次提交引入的时候。

```bash
# 1. 开始二分查找
git bisect start

# 2. 标记当前（坏）版本
git bisect bad

# 3. 标记一个已知的（好）版本（比如 v1.0）
git bisect good v1.0

# Git 会自动切到一个中间的 commit
# 你运行代码测试...
# 如果是好的：git bisect good
# 如果是坏的：git bisect bad
# ...重复直到找到罪魁祸首
```
