---
title: gulpfile示例
date: 2021-11-25 16:22:27
tags:
  - gulp
---

## 前言

刚刚接触并使用gulp打包不久，对gulp的理解还很生涩，甚至在编写`gulpfile`时感到无所适从，不知从何写起。

所以现在趁热打铁，在这里记录写过的`gulpfile`代码作为示例，以便日后查阅。

你可以快速转到[示例](#示例)与[技巧](#技巧)查看。

## 基础

> Gulp 是基于 NodeJS 的项目，一个用作自动化构建的工具，业界一般用来建造前端的工作流。

gulp的核心原理很简单，主要是通过各种转换流（transform stream）来实现文件的处理，然后进行输出。`transform stream`是`NodeJS Stream`的一种，可读可写，它会对接受的对象做一些转换的操作。

> 文件输入 → Gulp 插件处理 → 文件输出

原则上，gulp可以针对文件做任何事，而自动化构建，是大家使用的方向。

### 基本概念

#### glob

> Glob 是一种用来匹配路径与文件的模式。有点类似于正则表达式，但是语法又有点差异。这种模式被广泛用于命令行、Shell 等场景，大家熟悉的 `.gitignore` 文件也是使用这种模式。

gulp 的 `watch` 和 `src`方法都有用到 Glob 来匹配对应的路径和文件。

gulp匹配语法详见[Glob 详解 · gulp.js 中文文档 (gulpjs.com.cn)](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/)

### vinyl

vinyl 是 gulp 自创的一种用来描述一个虚拟文件的类，其中主要包括文件的内容和文件的路径两大信息。vinyl 模块，只是提供了一个类，实现交由 vinyl-fs 完成。

vinyl-fs ，它主要的工作是接受 glob 模式的参数，然后读取匹配的文件。然后利用 vinyl 制作一个 Transform Stream，称为 Vinyl Stream 对象，并返回。

在 Gulp 中的 API `gulp.src`、`gulp.watch`、`gulp.dest` 都返回一个 Vinyl Stream 实例对象。Vinyl Stream 实例之间可以通过管道（ `vinyl1.pipe(vinyl2)` ）的形式来互相传输数据。

### 任务 task

每个 gulp 任务（task）都是一个异步的 JavaScript 函数，此函数是一个可以接收 callback 作为参数的函数，或者是一个返回 stream、promise、event emitter、child process 或 observable 类型值的函数。

任务（tasks）可以是 **public（公开）** 或 **private（私有）** 类型的。

- **公开任务（Public tasks）** 从 gulpfile 中被导出（export），可以通过 `gulp` 命令直接调用。
- **私有任务（Private tasks）** 被设计为在内部使用，通常作为 `series()` 或 `parallel()` 组合的组成部分。

一个私有（private）类型的任务（task）在外观和行为上和其他任务（task）是一样的，但是不能够被用户直接调用。如需将一个任务（task）注册为公开（public）类型的，只需从 gulpfile 中导出（export）即可。



### 核心api

#### gulp.src

```js
gulp.src( globs [, options] )
```

接收一个 globs 模式的对象，可以是 Array 或者 String，返回一个 Vinyl Stream 实例。
而 options 有下面的值：

- buffer - Boolean, 控制 `file.contents` 是返回 buffer 还是 stream。
- read - Boolean，控制是否读取文件，如果 false，则 `file.contents` 为 `null`
- base - String，控制 glob 的 base，默认值是 glob 所有表达式的前置，例如 `client/js/**/*.js`, base 值就为 `client/js/`。而 glob 在保存输出路径的时候，取的是 base 之后的路径。所以可以通过该值，来进行输出路径的改写。

#### gulp.dest

```js
gulp.dest( path [, options] )
```

接收输出路径，返回一个 Vinyl Stream 实例。
而 options 有以下的值：

- cwd - String， 默认值 `process.pwd()`，输出目录的 cwd 参数，只在所给的输出目录是相对路径时候有效。
- mode - String，八进制权限字符，用以定义所有在输出目录中所创建的目录的权限。

#### gulp.watch

```js
gulp.watch( glob [, opts ], tasks )`
// or
`gulp.watch( glob [, opts, cb ] )
```

用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务。
各参数的描述如下：

- glob - 为要监视的文件 Glob 匹配模式。
- opts - 为一个可选的配置对象。
- tasks - 为文件变化后要执行的任务，为一个数组

#### gulp.task

```
gulp.task( name [, deps ], fn )
```

定义一个使用 Orchestrator 实现的任务（task）。
参数的描述如下：

- name - 任务名称
- deps - 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数
- fn - 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

通过`task`定义的任务，可直接通过`gulp name`命令执行。

注：*在以前的 gulp 版本中，*`task()` *方法用来将函数注册为任务（task）。虽然这个 API 依旧是可以使用的，但是 导出（export）将会是主要的注册机制，除非遇到 export 不起作用的情况。*

#### gulp.series 和 gulp.parallel

`series()` 和 `parallel()`，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。`series()` 和 `parallel()` 可以互相嵌套至任意深度。

* 如果需要让任务（task）按顺序执行，请使用 `series()` 方法。

  ```js
  function clear(cb) {
    function del(srcs, cb) {
      srcs.forEach(src => fs.emptyDirSync(src))
      cb()
    }
    del(['dist/', 'es/'], cb)
  }
  
  function dealCss(cb) {
    src(['./src/component/style/*.css'])
      .pipe(dest('dist/style'))
    src(['./src/component/style/*.css'])
      .pipe(dest('es/style'))
    cb()
  }
  
  exports.build = gulp.series(clear, dealCss)
  ```

  

* 对于希望以最大并发来运行的任务（tasks），可以使用 `parallel()` 方法将它们组合起来。

  ```js
  function genDts(cb) {
    function dts(outDir) {
      cp.execSync(
        `npx tsc -p tsconfig.json --emitDeclarationOnly --outDir ${outDir}`,
        {
          cwd: path.resolve(__dirname, ".")
        }
      )
    }
    dts('es')
    dts('dist')
    cb()
  }
  
  function dealTsByTsc(cb) {
    const tsconfig = ts.createProject('tsconfig.json')
    tsconfig.src()
      .pipe(tsconfig()).js
      .pipe(dest('es'))
    cb()
  }
  
  exports.build = gulp.parallel(genDts, dealTsByTsc)
  ```

## 示例

目录结构如下：

![image-20211124151618013](image-20211124151618013.png)

使用下面`gulpfile`构建

```js
const fs = require("fs-extra")
const { series, parallel, src, dest } = require("gulp")
const path = require("path")
const cp = require("child_process")
const babel = require("gulp-babel")
const ts = require("gulp-typescript")

// 清空目录下文件
function clear(cb) {
  function del(srcs, cb) {
    srcs.forEach(src => fs.emptyDirSync(src))
    cb()
  }
  del(['dist/', 'es/'], cb)
}

// 生成声明文件
function genDTs(cb) {
    // 需要项目根目录下包含tsconfig.json文件
  function dts(outDir) {
    cp.execSync(
      `npx tsc -p tsconfig.json --emitDeclarationOnly --outDir ${outDir}`,
      {
        cwd: path.resolve(__dirname, ".")
      }
    )
  }
  dts('es')
  dts('dist')
  cb()
}

// ts经过tsc编译输出
function dealTsxByTs(cb) {
  // 需要项目根目录下包含tsconfig.json文件
  const tsconfig = ts.createProject('tsconfig.json')
  tsconfig.src()
    .pipe(tsconfig()).js
    .pipe(dest('es'))
  cb()
}

// ts经过babel编译输出
function dealTsxByBabel(cb) {
  src(['./src/component/*.ts', './src/component/*.tsx'])
    .pipe(
      babel({
        presets: [
          "@babel/react",
          "@babel/preset-typescript",
          "@babel/preset-env",
        ]
      })
    )
    .pipe((dest('dist')))
  cb()
}

// copy css 到指定文件夹
function dealCss(cb) {
  src(['./src/component/style/*.css'])
    .pipe(dest('dist/style'))
  src(['./src/component/style/*.css'])
    .pipe(dest('es/style'))
  cb()
}

exports.build = series(
  clear,
  parallel(
    dealTsxByTs,
    dealTsxByBabel,
    dealCss
  ),
  genDTs
)
```

构建结果：

![image-20211124151809791](image-20211124151809791.png)

## 技巧

### 合并多个文件输出为一个文件，可以使用`gulp-concat`插件：

```js
const concat = require('gulp-concat')
exports.jsmin = (cb) => {
  gulp.src('./src/**/*.js')
    .pipe(babel()) // es6转es5
    .pipe(concat（'bundle.js') // 文件合并必须在Babel之后
    .pipe(gulp.dest('dist'))
}
```

### js代码压缩，可以使用`gulp-uglify`插件：

```js
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
export.jsmin = (cb) => {
  gulp.src('./src/**/*.js')
    .pipe(babel()) // es6转es5
    .pipe(concat（'bundle.js') // 文件合并必须在Babel之后
  	.pipe(uglify())
    .pipe(gulp.dest('dist'))
  cb()
}
```

### css代码压缩，可以使用`gulp-clean-css`插件（或`gulp-cssmin`、`gulp-minify-css`）

```js
const css = require('gulp-clean-css');
const concat = require('gulp-concat')
function cssmin() {
  gulp.src('styles/**/*.css')
  	.pipe(concat('style.css'))
    .pipe(css())
    .pipe(gulp.dest('dist/styles'));
}
exports.cssmin = cssmin
```

### 打包编译less，可以使用`gulp-less`插件

```js
const less = require('gulp-less')
const concat = require('gulp-concat')

//less文件打包,编译成css
exports.less = (cb) => {
  gulp.src(['src/**/*.less'])
    .pipe(concat('style.less')) // 此处先将所有less合并为一个less文件，再将其编译为css。
  	// 也可先编译，再合并
    .pipe(less())
    .pipe(gulp.dest('dist/styles'))
  cb()
}
```

### 打包编译sass，可以使用`gulp-sass`插件

```js
const sass = require('gulp-sass')

exports.sass = (cb) => {
  gulp.src('./src/**/*.scss')
    .pipe(sass())//把scss转为css
    .pipe(gulp.dest('dist/styles'))
  cb()
}
```

### 处理（添加）css前缀，可使用`gulp-autoprefixer`插件

```js
const autoprefixer = require('gulp-autoprefixer')

exports.autoprefix = (cb) => {
  gulp.src('./src/**/*.css')
      .pipe(autoprefixer({ 
    		browsers: ['last 2 versions']
  		}))
      .pipe(gulp.dest('dist/styles'))
  cb()
}
```



### 打包压缩图片，可使用`gulp-imagemin`插件

```js
const image = require('gulp-imagemin')

exports.imagemin = (cb) => {
  gulp.src(['src/assets/imgs/*'])
    .pipe(image())
    .pipe(gulp.dest('dist/imgs'))
  cb()
}
```

### 文件重命名，可使用`gulp-rename`插件

```js
const concat = require('gulp-less')
const rename = require('gulp-rename')

exports.lessmin = (cb) => {
  gulp.src(['src/**/*.less'])
    .pipe(concat('style.less'))
    .pipe(less())
  	.pipe(rename('index.min.css')) // 重命名为index.min.css
    .pipe(gulp.dest('dist/styles'))
  cb()
}
```

### 删除任务目录，可用`gulp-clean`插件

```js
const clean = require('gulp-clean');

exports.clean = (cb) => {
  gulp.src(['dist', 'es'])
    .pipe(clean())
  cb()
}
```

### 构建typescript，使用`gulp-typescript`插件

项目目录下需存在*tsconfig.json*文件，示例如下：

```json
{
    "files": [
        "src/**/*.ts"    
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"    }
}
```

示例如下：

```js
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("ts", function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("es"));
});

// or 

exports.ts = function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("es"));
}
```

### 生成`.d.ts`文件

```js
const gulp = require('gulp')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const tsconfig = require('./tsconfig.json')

function clear() {
  return gulp
    .src('dist', { read: false, allowEmpty: true })
    .pipe(clean('es'))
}

function dts() {
  return gulp
    .src(['./src/**/*.ts', './src/**/*.tsx'])
    .pipe(ts({
      ...tsconfig.compilerOptions,
      module: 'ESNext',
      declaration: true,
      emitDeclarationOnly: true
    }))
    .pipe(gulp.dest('es'))
}

exports.dts = gulp.series(
  clear,
  dts
)
```

**注意**，可能会遇到无法解析`import xxx from './'`的情况，原因是`tsconfig`未设置`moduleResolution`或设置错误，设置为`node`即可：

```json
{
  // ...
  "moduleResolution": "node",
  // ...
}
```

**注意**，当遇到构建成功但未生成`.d.ts`文件的情况时，检查tsconfig的`isolateModules`属性是否为true，如果是，则不会构建成成`.d.ts`文件。此时只需将其值删掉或设置为false。

```json
{
	"compilerOptions": {
    // ...
    "isolatedModules": false
    // or delete it
  }
}
```



### 监听文件修改，并自动编译

监听文件修改需要用到gulp中的`watch`方法，传入监听的文件和任务函数。

```js
const watch = () => {
    gulp.watch(['src/**/*.ts', 'src/**/*.tsx'], 'ts');
    gulp.watch(['src/**/*.js'], 'jsmin');
}

exports.watch = watch
```

`gulp.watch`无法监听到新增加的文件，这样一来，我们每次增加文件时都要执行gulp命令来重启服务，可以引入`gulp-watch`插件模块解决这个问题。

```js
const watch = require('gulp-watch')

gulp.task('watch', (cb) => {
  watch('./src/**/*.js', () => {
    gulp.start('jsmin') // 执行jsmin任务
  })
})
```

#### `watch`使用示例：

项目目录如下：

![image-20211125104417172](image-20211125104417172.png)

tsconfig内容如下：

```json
{
  "compilerOptions": {
    "jsx": "react",
    "target": "es5",
    "module": "commonjs",
    "rootDir": "src",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "outDir": "es",
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node"
  },
  "include": ["./src/**/*.ts", "./src/**/*.tsx"]
}
```



gulpfile代码如下：

```js
const gulp = require('gulp')
const clean = require('gulp-clean')
const autoprefixer = require('gulp-autoprefixer')
const ts = require('gulp-typescript')
const tsconfig = require('./tsconfig.json')

function clear() {
  return gulp
    .src('dist', { read: false, allowEmpty: true })
    .pipe(clean('es'))
}

function dts() {
  return gulp
    .src(['./src/**/*.ts', './src/**/*.tsx'])
    .pipe(ts({
      ...tsconfig.compilerOptions,
      module: 'ESNext',
      declaration: true,
      emitDeclarationOnly: true
    }))
    .pipe(gulp.dest('es'))
}

function tsc(cb) {
  const tsconfig = ts.createProject('tsconfig.json')
  tsconfig.src()
    .pipe(tsconfig()).js
    .pipe(gulp.dest('es'))
  cb()
}

function css(cb) {
  gulp.src(['./src/**/*.css'])
    .pipe(autoprefixer())
    .pipe(gulp.dest('es'))
  cb()
}
exports.dts = gulp.series(
  clear,
  dts
)

exports.watch = function(cb) {
  gulp.watch(['./src/**/*.ts', './src/**/*.tsx'], gulp.parallel(dts, tsc))
  gulp.watch(['./src/**/*.css'], css)
  cb()
}

exports.default = gulp.series(
  clear,
  gulp.parallel(
    dts,
    tsc,
    css
  )
)
```

运行`gulp watch`后，修改任意文件，gulp将重新打包输出。结果如下：

![image-20211125104644639](image-20211125104644639.png)

