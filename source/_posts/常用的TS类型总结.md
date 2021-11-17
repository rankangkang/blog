---
title: 常用的TS类型总结
tags: TS
date: 2021-11-16 23:11:00
categories: TS
---

## 一、前言

从暑假的训练营开始，使用 TS 开发前端应用差不多仨月了，从第一个项目的`AnyScript`到现在的慢慢熟悉，我逐渐体会到用 TS 的爽点所在。

但我是一个记性不好人，之前就被 TS 的官方文档给吓尿了，看着如此之多的特性，我还是做一个”差不多先生“吧，不求精，但求够用就行

在这里，我就记一记那些在开发中常用的知识总结，以供日后翻阅。

## 二、优缺点

欸，这不用记我也知道。

### 1、优点

- 增加代码可读性与可维护性，让你在没有接口文档的情况下也能看懂数据接口（大概）
- 在编译阶段就能发现错误，减少线上 bug
- 增强了编辑器或 IDE 功能。（有代码提示的 VSCode 写代码真香）

### 2、缺点

- 学习成本较高。（初期很有可能会经历和我一样的`AnyScript`阶段）
- 增加前期开发成本。
- 一些 JS 库需要兼容，提供类型声明文件`.d.ts`
- 编译速度缓慢

## 三、正文

本文示例均是在[TypeScript: TS Playground](https://www.typescriptlang.org/play)编写运行的，如果想要跑跑 demo 而又不想在本地新起一个项目，可以在这里试试。

### 1、基础类型

常用： boolean, number, string, array, enum, any, void

不常用：tuple（元组）, null, undefined, never, unknown

> 值为 undefined 的对象不能被 JSON.parse 解析，需要注意
>
> ![JSON.parse(undefined)](Snipaste_2021-11-16_16-12-23.png)

**`any`与`unknown`**

- `any`代表所有可能的 JavaScript 值——基本类型，对象，数组，函数，Error，Symbol，以及任何你可能定义的值。

  在 ts 中，任何类型都可被归为 any 类型，这使得`any`成为类型系统的<u>**顶级类型**</u>，也称<u>全局超级类型</u>（有超级管理员那味儿了），其本质上是类型系统的一个逃逸仓。

  这就给了我们很大的自由，因为 ts 允许我们对`any`类型的值执行任何操作。

  但是这样的机制也未免太过宽松。如果无节制地使用`any`类型，我们的`typescript代码`将退化为`anyscript`，无法享受到 TS 的类型保护机制。

  但如果能有顶级类型也能默认保持安全呢？这就是 `unknown` 到来的原因。

- `unknown`。就像所有的类型都可以被归为 `any`，所有类型也都可以被归为 `unknown`。这使得`unknown`成为 TS 类型系统的另一种顶级类型。

  **`unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。（只有能保存任意类型值的容器才能保存`unknown`类型的值）**

  lTypeScript 不允许我们对类型为 `unknown` 的值执行任意操作，相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。你可以使用`typeof`、`instanceof`等手段做类型判断以缩小类型范围，或对`unknown`类型做类型断言。

总结：`any`与`unknown`都是 TS 类型系统的顶级类型。`any`就是类型系统的超级管理员，可以做任何事（可对 any 类型的值做任何操作）；相反`unknown`处处被限制（TS 类型系统不允许我们对`unknown`的值执行任意操作）

### 2、对象类型

interface 与 type 的区别：type 更加强大，但 interface 可以进行声明合并，type 不可以。

一般类型声明都用 interface。

```typescript
interface Demo {
  // 自定义任意类型key
  [key: string]: any
}
type TabType = 'Hottest' | 'Latest'
type Person = {
  sex: 'male' | 'female'
  age: number
}
```

### 3、数组类型

项目中的常写，需要声明列表数据类型。

```typescript
let arr1: Array<string>
let arr2: string[]
```

### 4、元组（tuple）

元组与数组类似，但类型注解时不一样：赋值的类型、位置、个数需要一一对应。

```typescript
const tuple: [number, string, boolean] = [1, '2', false]
// or
const useState = <T>(initialValue: T): [T, (T | () => T) => void] => {
  // code here
}

const [state, setState] = useState<number>(1)
```

是不是感觉`useState`和`useReducer`的返回值类型很像元组？

### 5、联合(|)、交叉(&)类型

- 联合类型：变量的类型可能是多个类型中的一个，用`|`连接
- 交叉类型：变量的类型是多个类型的并集，用`&`连接

```typescript
interface IP {
  name: string
  age: number
}

interface IU {
  id: string
  nickname: string
}

type UP = IU & IP

const people: UP = {
  id: '007',
  name: 'James Bond',
  age: 41,
  nickname: 'assassin',
}

const person: IP | IU = {
  name: 'James Bond',
  age: 41,
}

console.log(people, person)
```

### 6、枚举类型

统一维护枚举值，可以提高代码的可维护性。

```typescript
enum Week {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
```

### 7、泛型

可以将泛型理解为占位符。

```typescript
interface BaseRes<T = any> {
  stat: string
  data: T
}
```

### 8、断言

用于手动指定一个值的类型。

格式：`值 as 类型` 或 `<类型>值`

```typescript
// interface Person {}
const p1 = {}
const p2 = p1 as Person
```

### 9、void 和 never

两者均为函数返回值类型，也是基本类型。

没有返回值的函数的返回值为 void。

如果一个函数永远执行不完，可将其返回值定义为 never。

```typescript
function say(str: string): void {
  console.log(str)
}

type IAction = 'ADD' | 'DEC'
const [state, dispatch] = useReducer(
  (state: number, action: IAction): number | never => {
    switch (action) {
      case 'ADD':
        return state + 1
      case 'DEC':
        return state - 1
      default:
        return state
    }
  },
  1
)
```

可以看到，reducer 在 action 穷举之后，default 必不会会被执行，故可将 reducer 的返回值加上 never。

### 10、类型检测

- `typeof`可以获取变量或对象的类型

  ```typescript
  interface IT {
    name: string
    age: number
  }

  const test: IT = {
    name: 'kk',
    age: 12,
  }

  const exam: typeof test = {
    name: 'll',
    age: 11,
  }
  ```

- `instanceof`可以判断对象是否是某个类型

  ```typ
  console.log({} instanceof Object)
  ```

- `keyof`与`Object.keys`相似，不过`keyof`取的是 interface 的键

  ```typescript
  interface Point {
    x: number
    y: number
  }
  // type keys = "x" | "y"
  type keys = keyof Point

  // 获取对象的指定键值
  function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]
  }
  ```

- `in`

  在做类型保护时，类似于数组和字符串的`include`方法。

  也有遍历的作用，可拿到 TS 类型的 key

  ```typescript
  if (key in obj) {
    // do something
  }
  ```

### 11、类中关键字（较少用到）

- - public
  - private 类的外部不可用，继承也不行
  - protected 类的外部不可用，继承可以
  - readOnly 只读属性
  - static 静态属性，不需要 new 即可调用
  - abstract 抽象类，所有子类都必须要实现

### 12、工具类型 ultility types

- `Partial<T>`

  将 T 中的所有属性转化为可选属性。返回的类型可以是 T 的任意子集

  ```typescript
  // Partial 源码
  type Partial<T> = { [P in keyof T]?: T[P] }
  // eg
  interface IU {
    id: string
    name: string
  }
  type IP = Partial<IU>
  ```

- `Required<T>`

  与 Partial 相反，将 T 的所有属性设置为必选属性来构造新的类型.

- `Readonly<T>`

  将 T 中所有属性设置为只读

- `Record<K,T>`

  构造一个类型，该类型具有一组属性 K，每个属性的类型为 T。即 K 对应 key，T 对应 value。可用于将一个类型的属性映射为另一个类型。

  ```typescript
  type PropertyType = 'name' | 'age' | 'sex'
  type Person = Record<PropertyType, string>
  // equal to
  // type Person = {
  //		name: string
  //		age: string
  //		sex: string
  //}
  ```

- `Pick<T, K>`

  从 T 中取出 K 的所有属性组成一个新的类型。

  ```typescript
  type Person = {
    name: string
    age: string
    sex: string
  }
  type PPerson = Pick<Person, 'name' | 'sex'>
  // equals to
  // type PPerson = { name: string, sex: string }
  ```

- `Omit<T, K>`

  与`Pick`相对，从 T 中取出除去 K 的其他所有属性组成一个新的类型。

- `Exclude<T, U>`

  从 T 中排除可分配给 U 的属性，剩余的属性构成新的类型

  ```
  type Property = Exclude<'a' | 'b' | 'c', 'a'>
  // equals to
  // type Property = 'b' | 'c'
  ```

- `Extract<T,U>`

  从 T 中抽出可分配给 U 的属性构成新的类型。与 Exclude 相反

- `NonNullable<T>`

  去除 T 中的 null 和 undefined 类型

- `Parameters<T>`

  返回**函数 T**的参数类型所组成的数组

  ```typescript
  type Ta = Parameters<(a: number, b: string) => string> // [number, string]
  type Tb = [number, string]
  const a: Ta = [1, '2']
  const b: Tb = a
  ```

- `ReturnType<T>`

  返回**函数 T**的返回值类型

  ```
  type Ta = Parameters<(a: number, b: string) => string> // string
  ```

- `InstanceType<T>`

  返回构造函数 T 的实例类型

  > 实例类型：类实际上有两个类型，分为`静态部分类型`和`实例部分类型`

  ```typescript
  class TT {
    static id = ''
    name = ''
    constructor(name = 'kk') {
      this.name = name
    }
  }

  type T = InstanceType<typeof TT>

  const tt: T = {
    name: 'kk',
  }
  ```

以上是简单归纳，具体源码参考：

- [源码解读 utility-types](https://juejin.cn/post/6865910915011706887)

## 四、tsconfig.json 相关

使用 ts 开发就免不了要接触 tsconfig 配置，如果你在 github 上面 clone 一个 ts 项目到本地或是自己创建一个，安装之后点击打开 tsconfig.json 大概率会看到首行飘红。（别问，问就是 experience）。

### 1、tsconfig.json 作用

- 标识 TS 项目的根目录
- 配置 TS 编译器
- 指定编译文件

### 2、tsconfig.json 重要字段

- files - 设置要编译的文件名称。只能指定文件，不能指定文件夹

- include - 设置需要进行编译的文件或目录，支持路径匹配模式。如果指定了`files`选项值，则`includes`的默认值为`[]`，否则默认包含当前项目中所有文件`["**/*"]`

- exclude - 设置无需进行编译的文件，支持路径模式匹配

  以上，详情见：[TSConfig 之 include、exclude 和 files 选项 - 掘金 (juejin.cn)](https://juejin.cn/post/6924264635218542605)

- extends - 引入其他配置文件，继承其配置

  ```json
  {
    // ...
    "extends": "./tsconfig.base.json"
  }
  ```

- compilerOptions - 设置与编译流程相关的选项

  compilerOptions 选项详细说明如下：

  ```json
  {
    "compilerOptions": {
      /* 基本选项 */
      "target": "es5", // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
      "module": "commonjs", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
      "lib": [], // 指定要包含在编译中的库文件
      "allowJs": true, // 允许编译 javascript 文件
      "checkJs": true, // 报告 javascript 文件中的错误
      "jsx": "preserve", // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
      "declaration": true, // 生成相应的 '.d.ts' 文件
      "sourceMap": true, // 生成相应的 '.map' 文件
      "outFile": "./", // 将输出文件合并为一个文件
      "outDir": "./", // 指定输出目录
      "rootDir": "./", // 用来控制输出目录结构 --outDir.
      "removeComments": true, // 删除编译后的所有的注释
      "noEmit": true, // 不生成输出文件
      "importHelpers": true, // 从 tslib 导入辅助工具函数
      "isolatedModules": true, // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

      /* 严格的类型检查选项 */
      "strict": true, // 启用所有严格类型检查选项
      "noImplicitAny": true, // 在表达式和声明上有隐含的 any类型时报错
      "strictNullChecks": true, // 启用严格的 null 检查
      "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候，生成一个错误
      "alwaysStrict": true, // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

      /* 额外的检查 */
      "noUnusedLocals": true, // 有未使用的变量时，抛出错误
      "noUnusedParameters": true, // 有未使用的参数时，抛出错误
      "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
      "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

      /* 模块解析选项 */
      "moduleResolution": "node", // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
      "baseUrl": "./", // 用于解析非相对模块名称的基目录
      "paths": {}, // 模块名到基于 baseUrl 的路径映射的列表，可基于该特性实现类似路径alias的功能
      "rootDirs": [], // 根文件夹列表，其组合内容表示项目运行时的结构内容
      "typeRoots": [], // 包含类型声明的文件列表
      "types": [], // 需要包含的类型声明文件名列表
      "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。

      /* Source Map Options */
      "sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
      "mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
      "inlineSourceMap": true, // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
      "inlineSources": true, // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

      /* 其他选项 */
      "experimentalDecorators": true, // 启用装饰器
      "emitDecoratorMetadata": true // 为装饰器提供元数据的支持
    }
  }
  ```

### 2、注意事项

- `tsc --init` 命令生成 tsconfig.json 文件。在项目目录下直接 tsc，编译的时候就会走配置文件

- 有时你会遇到定义了`global.d.ts`但其中的类型就是无法使用的情况（如无法引入 _。module.scss ），很大概率就是你的`include`字段未包含`_.d.ts`，导致ts未能编译到`.d.ts`文件，引发类型无法使用的情况

  ```json
  {
    // ...
    "include": [
      "src",
      "*.d.ts" // 使得TS能够匹配.d.ts文件
    ],
    "exclude": ["node_modules"]
  }
  ```

- 使用`compilerOptions`中的`paths`字段可实现类似 webpack 路径 alias 功能

  ```json
  {
    // ...
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@*": ["src/*"]
      }
    }
  }
  ```

  类似于 webpack 配置的`alias`选项：

  ```js
  reslove: {
      alias: {
          '@*': path.resolve(__dirname, 'src/*')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
  // 但是配置webpack alias 在开发ts项目时还是会遇到问题，如 typescript-eslint 报错，我们还是需要给 tsconfig.json 配置 paths 映射路径

  ```
