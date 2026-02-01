# Work on the current change

这一组命令专注于**工作区（Working Tree）**和**暂存区（Index/Staging Area）**之间的交互。

## `git add`

将文件内容的修改添加到暂存区。这是从“已修改”变为“已暂存”的关键步骤。

```bash
# 添加指定文件
git add App.vue

# 添加当前目录下所有变更（及新文件）
git add .
```

## `git mv`

移动或重命名文件、目录。

```bash
# 将 oldName.js 重命名为 newName.js
git mv oldName.js newName.js

# 相当于手动重命名后，再执行 git add 和 git rm
# mv oldName.js newName.js
# git add newName.js
# git rm oldName.js
```

## `git restore`

恢复工作区的文件。这是后悔药，用于撤销未暂存的修改。

```bash
# 场景：你修改了 main.js 但发现改错了，想回到修改前的状态
git restore main.js

# 场景：你已经 git add 了 main.js，现在想把它把暂存区移出来（变为未暂存）
git restore --staged main.js
```

## `git rm`

从工作区和索引中删除文件。

```bash
# 删除文件，并将这次删除操作暂存
git rm config.js

# 如果只是想从 Git 版本控制中移除（不再追踪），但保留本地文件
git rm --cached config.js
```
