---
title: css border画三角形
tags: 
  - css
  - border
date: 2021-07-06 23:00:00
categories: CSS
---

# css border画三角形

昨天在coding时遇到一个问题——怎么用在HTML中画三角形呢？

## 基础方法

我很自然地想到了一个方法，代码如下：

```html
<div class="triangle1"></div>
<style>
	.triangle1 {
      width: 0;
      height: 0;
      border-width: 200px 100px 200px 100px;
      border-color: yellow blue orange red;
      border-style: solid;
    }
</style>
```

效果如下：

<div class="triangle"></div>
<br>
<style>
	.triangle {
      width: 0;
      height: 0;
      border-width: 200px 100px 200px 100px;
      border-color: yellow blue orange red;
      border-style: solid;
    }
</style>

可以看出，这个div被四个三角形填满，因为内容为空，边框占据了整个div空间。需要哪个三角形时，只需要将其他部分的边框颜色设置为`透明 transparent`即可。

比如现在我想要一个三角形，可有：

```html
<div class="triangle2"></div>
<style>
	.triangle2 {
      width: 0;
      height: 0;
      border-width: 200px 100px 200px 100px;
      border-color: transparent transparent orange transparent;
      border-style: solid;
    }
</style>
```

有`triangle2`效果如下：

<div class="triangle2"></div>
<br>
<style>
	.triangle2 {
      width:0;
      height:0;
      border-width: 200px 100px 200px 100px;
      border-color: transparent transparent orange transparent;
      border-style: solid;
    }
</style>

如果我想要一个直角三角形怎么办呢？很简单，两个三角形拼接即可，可用如下代码：

```html
<div class="triangle3"></div>
<style>
	.triangle3 {
      width: 0;
      height: 0;
      border-width: 200px 100px 200px 100px;
      border-color: transparent transparent orange orange;
      border-style: solid;
    }
</style>
```

有`triangle3`果如下：

<div class="triangle3"></div>
<br>
<style>
	.triangle3 {
      width: 0;
      height: 0;
      border-width: 200px 100px 200px 100px;
      border-color: transparent transparent orange orange;
      border-style: solid;
    }
</style>

---

## 进阶的方法——一个小小的转变

但是这样画有一个问题——即使我们画的三角形只有200px高，但是整个图形还是占据了400px的高度（在开发者工具可以看见，元素占据的高度还是400px），那么这个问题怎么解决呢？答案是将上边框宽度设置为0。

```html
<div class="triangle4"></div>
<style>
.triangle4 {
  width: 0;
  height: 0;
  border-width: 0 100px 200px 100px;
  border-color: transparent transparent orange transparent;
  border-style: solid;
}
```

高度只有200px的`triangle4`如下：

<div class="triangle4"></div>
<style>
.triangle4 {
  width: 0;
  height: 0;
  border-width: 0 100px 200px 100px;
  border-color: transparent transparent orange transparent;
  border-style: solid;
}
</style>





这是什么原理呢？其实拿出纸笔，一画便知。

<div class="triangle1"></div>

拿`triangle1`来说，四个三角形的顶点即div块的中心，该点距四边界的距离就是border的宽度，现在我们将border-top设置为0，就意味着上边界距离中心点的距离为0，最后也就得到如上所示效果。（拿出纸笔画画效果更佳哦）

相应的，由此可以得出另一种画直角三角形的方法，代码如下：

```html
<div class="triangle5"></div>
<style>
	.triangle2 {
      width: 200px;
      height: 400px;
      border-width: 0 0 400px 200px;
      border-style: solid;
      border-color: transparent transparent red transparent;
    }
</style>
```

得到直角三角形`triangle5`的效果如下：

<div class="triangle5"></div>
<br>
<style>
	.triangle5 {
      width: 200px;
      height: 400px;
      border-width: 0 0 400px 200px;
      border-style: solid;
      border-color: transparent transparent blue transparent;
    }
</style>

实现方式与`trangle4`类似：

当我们需要一个右直角三角形（直角在右）时，依旧以div中心点为参考点，此时设置上、右边框距离为0，意味着该点距上、右边界距离为0，故而最后的效果如上。

---



这确实是一种很经典、优雅的方法，就是不大好记，我会经常回来看看的😭