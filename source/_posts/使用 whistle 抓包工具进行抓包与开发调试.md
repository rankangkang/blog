---
title: 使用 whistle 抓包工具进行抓包与开发调试
tags: 
  - 工程化
date: 2022-08-17 
---

whistle 的主要作用就是将 客户端 的网络请求从 一个服务器 代理到 另一个服务器。

whistle 的默认端口是**8899**.

**whistle 作用于设备（物理或虚拟）层面**。

运行 whistle 后浏览器请求本机 8899 端口，即可进行配置。

界面有4个 tab，分别为：

1. network：对代理的请求进行展示，可右键查看条目信息。
2. rules：对代理规则进行配置
3. values：配置、存储值
4. plugins：插件，目前很少用到

## SwitchOmega

SwitchOmega 是一个浏览器代理扩展程序，它能将从浏览器发出的请求代理到用户配置的代理服务器。此外用户可配置多个代理设置，可轻松管理和切换多个代理设置。

**SwitchOmega** 作用于浏览器层面。

## 安装与使用

安装

```bash
npm install -g whistle
```

开启

```bash
w2 start
```

回车执行后会打印如下

```
[i] whistle@2.9.25 started
[i] 1. use your device to visit the following URL list, gets the IP of the URL you can access:
       http://127.0.0.1:8899/
       http://10.227.2.37:8899/
       Note: If all the above URLs are unable to access, check the firewall settings
             For help see https://github.com/avwo/whistle
[i] 2. set the HTTP proxy on your device with the above IP & PORT(8899)
[i] 3. use Chrome to visit http://local.whistlejs.com/ to get started
```

会发现两个IP地址，第一个是电脑端配置访问地址，访问`127.0.0.1:8899`即可；第二个地址是**电脑的IP地址**，可在**手机代理**时使用。

## 规则配置

可在 rules tab 下创建代理规则，最常使用的有**直接代理**、**值 mock** 以及 **HTML 模板代理**。

### 直接代理

如 创建一个 test 分组，并在该分组下创建规则

```yaml
http://127.0.0.1:8080/list        https://192.168.0.1:8895/list
```

该规则指定将对 `http://127.0.0.1:8080/list` 请求代理到 `https://192.168.0.1:8895/list` 

使用该方法可将测试环境接口代理到正式环境。

#### 接口参数匹配

```bash
^http://127.0.0.1:8080/list?count=*&offset=*        https://192.168.0.1:8895/list?count=$1&offset=$2
```

用`^`来表示匹配模式，前面3个参数照常写上，但是在值那个直接写成`*`，它表示通配符算是任意字符

### 值 mock

使用 `resBody` 类型来对单个接口返回值进行 mock 。

```bash
http://127.0.0.1:8080/list        resBody://{list.json}
```

其中 `resBody://{list.json}` 的 `{}` 中的 list.json 指返回的数据，它的内容可在 values tab 中进行配置，对应的名称同 `{}` 中的值，如此处就应该叫 list.json

### HTML 模板代理

使用 `htmlBody` 类型用于 mock 整个 HTML 模板数据 。

```bash
http://127.0.0.1:8080            resHtml://{test.html}
```

其中 `htmlBody://{list.json}` 的 `{}` 中的 test.html 指返回的数据，它的内容可在 values tab 中进行配置，对应的名称同 `{}` 中的值，如此处就应该叫 test.html

### 其他配置

#### 解决跨域

跨域是 Web 开发中经常遇到的问题，常见解决方式是 CORS，通过设置 `Access-Control-Allow-Origin` 响应头来允许指定的域名跨域访问。

通过 whistle 我们可以增加 `Access-Control-Allow-Origin` 响应头，这样就能实现跨域。

```bash
www.baidu.com resCors://*

# or
www.baidu.com resCors://enable
```

或直接使用 `resHeaders://` 直接在头部直接设置 `Access-Control-Allow-Origin` 为 `*` 或需要解决跨域的域名。

```bash
www.baidu.com    redHeaders://{headers.json}
```

```json
{
    "Access-Control-Allow-Origin": "*"
}
```

#### 设置 statusCode

在通过`resBody://`对接口直接进行代理时，需要对 statusCode 进行设置，不然浏览器会报404。

通过 `statusCode://` 进行配置。

```
http://baidu.com/api/list resBody://{list.json} statusCode://200
```

#### 修改 UA

whistle 提供了语法来支持修改请求的 userAgent。

但这个只对请求生效，不会对本地的 userAgent 生效，因为它本质上还是修改了请求头里面的 userAgent。

```bash
https://www.baidu.com/ ua://{ua}
```

#### 自定义样式

whistle 还支持自定义某个域名下的请求展示样式。

```bash
www.baidu.com style://color=@fff&fontStyle=italic&bgColor=red
```

## 移动设备代理

真机调试时，手机和电脑需要在同一局域网下。

需将移动设备对应网络的代理设置为手动，并修改服务器主机名为电脑的IP地址，端口设为 8899

同时可能需要安装证书，扫描 whistle 点击 HTTPS 按钮弹出二维码下载安装即可。

然后就可打开浏览器进行真机调试抓包。