---
title: 前端link工具：npm link 与 yalc
date: 2021-11-19 21:30:01
tags:
    - npm
    - npm link
---

## 前言

最近学习到一点npm package相关知识，动手写了一个`no-ssr`组件打算发布到 npm 仓库。

在这之前，笔者之前写过一个`quill`封装的 react 组件，已经发布到 npm 仓库。组件在本地开发，还得在本地另开一个测试工程来测试，整个开发过程在打包`yarn build`、发布`npm publish`和测试`yarn dev`之间反复横跳，短短两天，就以迭代数个版本。这个组件虽然简单，但整个调试过程让却人苦不堪言。

我必不能再干这样的傻事儿！那么问题来了，有什么办法能够优雅的在本地调试package呢？还真有，那就是`npm link`.

## npm link 基本使用

> 在项目的前期开发工作中，通常都会将一些可复用的代码抽离成公共组件，方便管理和维护。或者是将一些非业务性的、而且公用率很高的发布成`npm`包，作为项目的依赖去安装使用。但是在开发调试中需要频繁的打包发布，然后项目中再安装依赖，这种重复的操作非常的繁琐和不便，为了解决这一系列重复的操作，可以使用`npm link`指令将模块软链接`symlink`到项目中。

### 1 建立连接

假设项目名称为 `project`，需要发布到`npm`仓库的组件名称（`package.json`中的`name`所指定的）为`component`。

首先，使用`npm link`指令将`component`模块构建成本地依赖包。在`component`目录下执行如下命令：

```shell
npm link
```

然后，进入到项目`project`目录，和`component`模块建立连接。在`project`目录下执行如下命令：

```shell
npm link component // component 为component模块package.json中name字段的值，而非目录名
```

> **注意**：`npm link <package name>` 命令的\<package name\>指的是`package.json`的`name`字段的值，而非目录名称。

执行完成之后，点开`node_modules`目录可以发现`component`模块已经存在。

<u>之后修改`component`模块的内容将会实时更新，不用打包发布再安装。</u>

现在，你就可以开开心心的开始coding了

### 2 解除连接

#### 解除项目依赖

在`project`目录输入命令：

```shell
npm unlink component
```

#### 解除本地`component`包

直接在`component`目录输入命令：

```
npm unlink component
```

如此，本地component包就被解除了，其他项目的软连接也将失效

### 3 问题

如果本地npm模块包含`peerDependicies`或者本地npm模块和项目拥有同一个依赖，`npm link`到项目之后不会报错，但在运行时将会出现`xxx not resolved`报错。这是因为**「因为 Npm 和 项目属于不同的项目，它们有自己的 node_modules」**，他们只会在各自的`node_modules`目录去找。

出现这个问题的解决时，笔者的解决方案有二：`npm link workspace`和`yalc`。

#### npm link workspace



## 更好的调试方式 —— yalc

`yalc` 选择了一个与`npm link`不同的解决方案：直接将文件复制进依赖目录。

> `yalc` 可以在本地将`npm包`模拟发布，将发布后的资源存放在一个全局存储中。然后可以通过`yalc`将包添加进需要引用的项目中。
>
> 这时候`package.json`的依赖表中会多出一个`file:.yalc/...`的依赖包，这就是`yalc`创建的`flie:`软链接。同时也会在项目根目录创建一个`yalc.lock`确保引用资源的一致性。因此，测试完项目还需要执行删除`yalc`包的操作，才能正常使用。当然，`yalc`也是支持`link:`链接方式.

### 安装

```shell
npm i yalc -g
# or
yarn global add yalc
```

### 发布依赖

在本地npm模块目录执行：

```shell
yalc publish
```

> 如果存在`npm 生命周期`脚本，将按照`prepublish`、`prepare`、`prepublishOnly`、`prepack`、`preyalcpublish`的顺序执行。
>
> 如果存在：`postyalcpublish`、`postpack`、`publish`、`postpublish`，也会按此顺序逐一执行。
>
> 想要禁用脚本则使用：
>
> ```shell
> yalc publish --no-scripts
> ```

此时，npm模块就已发布到本地仓库了。注意，此命令只是发布，并不会主动推送，也就意味着你的npm模块的最新修改将不会同步到仓库，想要同步，需要执行`yalc publish --push`或`yalc push`命令。

当有新修改的包需要发布并且推送时，可以使用推送命令快速更新**所有**依赖

```armasm
yalc publish --push
yalc push // 简写
```

参数:

- `--changed`，快速检查文件是否被更改
- `--replace`，强制替换包

### 添加依赖

进入到项目目录执行：

```shell
yalc add <package-name>
```

这时可以看到项目中添加了`yalc.lock`文件，`package.json`对应的包名会有个地址为`file:.yalc/`开头的项目。

可以锁定版本来斌面因本地新包推送产生影响。

```shell
yalc add <package-name@[version]>	# [version]指的是你的包版本version 
```

### 更新依赖

```tcl
yalc update
yalc update <package-name>
```

会根据`yalc.lock`查找更新所有依赖，当发包后并未主动`push`，可以用此命令在项目内单独更新依赖。

### 移除依赖

```shell
yalc remove <package-name>

yalc remove --all # 移除所有依赖并还原
```

### 查看仓库信息

当我们要查看本地仓库里存在的包时

```dart
yalc installations show
```

要清理不需要的包时

```perl
yalc installations clean <package-name>
```

---

更多见：[wclr/yalc: Work with yarn/npm packages locally like a boss. (github.com)](https://github.com/wclr/yalc)


