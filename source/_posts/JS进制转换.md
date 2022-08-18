---
title: JS进制转换
tags: 
  - js
date: 2021-06-30
---



# 进制转换

## 任意进制=>十进制(使用parseInt）

parseInt(str,x）
作用：将str以x进制转化为十进制输出
输入：一般来说第一个参数是字符串
输出：number类型

```js
parseInt('110',2)//110作为2进制转化为十进制，此时输出为number类型
6
parseInt('FF',16)//也可以对字符串进行转换
255


```

## 十进制=>任意进制(使用toString)
num.toString(x)
作用：将num（十进制）转化为x进制
输入：必须是num,不可以是str，str不转换
输出：字符串
注意：得到结果是字符串

```js
var x=20;//不能写成'20',这样不会转换
undefined
x.toString(2);
"10100"//字符串
```

## 把m进制转换为n进制

m=>10=>n
例如，把"10111010"（2进制）转化为16进制

```javascript
parseInt("10111010",2).toString(16)
"ba"
```

