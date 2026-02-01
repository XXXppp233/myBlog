# Collaborate

与远程仓库（Remote）交互。

## `git fetch`

下载对象和引用。这是“安全”的操作，它更新你的远程跟踪分支（如 `origin/main`），但不会改变你的本地工作区。

```bash
# 获取所有远程分支的更新
git fetch origin
```

## `git pull`

拉取并集成。实际上等于 `git fetch` + `git merge`。

```bash
# 拉取 origin 的 main 分支并合并到当前分支
git pull origin main

# 如果你喜欢线性的历史（不产生 merge commit）
git pull --rebase origin main
```

## `git push`

推送本地修改到远程。

```bash
# 推送当前分支到远程的同名分支
git push origin main

# 如果是新分支，需要设置上游（upstream）
git push -u origin feature-new
```
