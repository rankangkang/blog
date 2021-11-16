---
title: 常用的TS类型总结
tags: TS
date: 2021-11-16 23:11:00
categories: TS
---

# 常用的TS类型总结

## 一、前言

从暑假的训练营开始，使用TS开发前端应用差不多仨月了，从第一个项目的`AnyScript`到现在的慢慢熟悉，我逐渐体会到用TS的爽点所在。

但我是一个记性不好人，之前就被TS的官方文档给吓尿了，看着如此之多的特性，我还是做一个”差不多先生“吧，不求精，但求够用就行

在这里，我就记一记那些在开发中常用的知识总结，以供日后翻阅。

## 二、优缺点

欸，这不用记我也知道。

### 1、优点

* 增加代码可读性与可维护性，让你在没有接口文档的情况下也能看懂数据接口（大概）
* 在编译阶段就能发现错误，减少线上bug
* 增强了编辑器或IDE功能。（有代码提示的VSCode写代码真香）

### 2、缺点

* 学习成本较高。（初期很有可能会经历和我一样的`AnyScript`阶段）
* 增加前期开发成本。
* 一些JS库需要兼容，提供类型声明文件`.d.ts`
* 编译速度缓慢

## 三、正文

### 1、基础类型

常用： boolean, number, string, array, enum, any, void

不常用：tuple（元组）, null, undefined, never, unknown

> 值为undefined的对象不能被JSON.parse解析，需要注意
>
> ![JSON.parse(undefined)](Snipaste_2021-11-16_16-12-23.png)

**`any`与`unknown`**

* `any`代表所有可能的JavaScript值——基本类型，对象，数组，函数，Error，Symbol，以及任何你可能定义的值。

  在ts中，任何类型都可被归为any类型，这使得`any`成为类型系统的<u>**顶级类型**</u>，也称<u>全局超级类型</u>（有超级管理员那味儿了），其本质上是类型系统的一个逃逸仓。

  这就给了我们很大的自由，因为ts允许我们对`any`类型的值执行任何操作。

  但是这样的机制也未免太过宽松。如果无节制地使用`any`类型，我们的`typescript代码`将退化为`anyscript`，无法享受到TS的类型保护机制。

  但如果能有顶级类型也能默认保持安全呢？这就是 `unknown` 到来的原因。

* `unknown`。就像所有的类型都可以被归为 `any`，所有类型也都可以被归为 `unknown`。这使得`unknown`成为TS类型系统的另一种顶级类型。

  **`unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。（只有能保存任意类型值的容器才能保存`unknown`类型的值）**

  lTypeScript 不允许我们对类型为 `unknown` 的值执行任意操作，相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。你可以使用`typeof`、`instanceof`等手段做类型判断以缩小类型范围，或对`unknown`类型做类型断言。

总结：`any`与`unknown`都是TS类型系统的顶级类型。`any`就是类型系统的超级管理员，可以做任何事（可对any类型的值做任何操作）；相反`unknown`处处被限制（TS类型系统不允许我们对`unknown`的值执行任意操作）



### 2、对象类型

interface与type的区别：type更加强大，但interface可以进行声明合并，type不可以。

一般类型声明都用interface。

```typescript
interface Demo {
    // 自定义任意类型key
    [key: string]: any
}
type TabType = 'Hottest' | 'Latest'
type Person = {
    sex: 'male' | 'female',
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

* 联合类型：变量的类型可能是多个类型中的一个，用`|`连接
* 交叉类型：变量的类型是多个类型的并集，用`&`连接

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
  nickname: 'assassin' 
}

const person: IP | IU = {
    name: 'James Bond',
    age: 41
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
    Saturday
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

如果一个函数永远执行不完，可将其返回值定义为never。

```typescript
function say(str: string): void {
    console.log(str)
}

type IAction = 'ADD' | 'DEC'
const [state, dispatch] = useReducer((state: number, action: IAction): number | never => {
    switch(action) {
        case 'ADD': return state + 1
        case 'DEC': return state - 1
        default: return state
    }
}, 1)
```

可以看到，reducer 在 action 穷举之后，default必不会会被执行，故可将reducer的返回值加上never。

### 10、类型检测

* `typeof`可以获取变量或对象的类型

  ```typescript
  interface IT {
    name: string
    age: number
  }
  
  const test: IT = {
    name: 'kk',
    age: 12
  }
  
  const exam: typeof test = {
    name: 'll',
    age: 11
  }
  ```

* `instanceof`可以判断对象是否是某个类型

  ```typ
  console.log({} instanceof Object)
  ```

* `keyof`与`Object.keys`相似，不过`keyof`取的是interface的键

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

* `in`

  在做类型保护时，类似于数组和字符串的`include`方法。

  也有遍历的作用，可拿到TS类型的key

  ```typescript
  if(key in obj) {
      // do something
  }
  ```

  

### 11、类中关键字（较少用到）

- - public
  - private类的外部不可用，继承也不行
  - protected类的外部不可用，继承可以
  - readOnly只读属性
  - static 静态属性，不需要new即可调用
  - abstract 抽象类，所有子类都必须要实现

### 12、工具类型 ultility types

* `Partial<T>`

  将T中的所有属性转化为可选属性。返回的类型可以是T的任意子集

  ```typescript
  // Partial 源码
  type Partial<T> = {[P in keyof T]?: T[P]}
  // eg
  interface IU {
      id: string,
      name: string
  }
  type IP = Partial<IU>
  ```

* `Required<T>`

  与Partial相反，将T的所有属性设置为必选属性来构造新的类型.

* `Readonly<T>`

  将T中所有属性设置为只读

* `Record<K,T>`

  构造一个类型，该类型具有一组属性K，每个属性的类型为T。即K对应key，T对应value。可用于将一个类型的属性映射为另一个类型。

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

* `Pick<T, K>`

  从T中取出K的所有属性组成一个新的类型。

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

* `Omit<T, K>`

  与`Pick`相对，从T中取出除去K的其他所有属性组成一个新的类型。

* `Exclude<T, U>`

  从T中排除可分配给U的属性，剩余的属性构成新的类型

  ```
  type Property = Exclude<'a' | 'b' | 'c', 'a'>
  // equals to
  // type Property = 'b' | 'c'
  ```

* `Extract<T,U>`

  从T中抽出可分配给U的属性构成新的类型。与Exclude相反

* `NonNullable<T>`

  去除T中的 null 和 undefined 类型

* `Parameters<T>`

  返回**函数T**的参数类型所组成的数组

  ```typescript
  type Ta = Parameters<(a: number, b: string) => string> // [number, string]
  type Tb = [number, string]
  const a: Ta = [1, '2']
  const b: Tb = a
  ```

* `ReturnType<T>`

  返回**函数T**的返回值类型

  ```
  type Ta = Parameters<(a: number, b: string) => string> // string
  ```

* `InstanceType<T>`

  返回构造函数T的实例类型

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
      name: 'kk'
  }
  ```

  

