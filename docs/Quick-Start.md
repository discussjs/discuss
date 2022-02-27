---
title: 快速开始
sidebar: auto
---

## 准备

感谢您使用 Discuss 评论系统，只需几个步骤，您就可以在您的网站中部署和管理 Discuss 提供评论服务。

在开始之前我们需要准备什么？？
::: tip 提示
如果你没有服务器(不想部署在服务器上)的话，你可以选择[免费部署](/deploy/Vercel-ServerLess-Deploy.html)
:::

1. 服务器
2. 数据库 (MongoDB)
3. NodeJS、NPM 环境
4. 一双手、还有耐心

## 服务端 (Server)

::: tip 提示
目前还未提供 docker 部署方式，后续会陆续补上，敬请期待~
:::

本文主要描述如何在服务器上部署`Disucss`评论系统，并且默认您已拥有上边提起的准备环境(包括 MongoDB 数据库)

初始化 npm 项目

```bash
mkdir Discuss                   # 创建目录
cd Discuss                      # 进入目录
npm init -y                     # 初始化npm
npm install discuss --save      # 安装Discuss
touch index.js .env             # 创建index.js 以及 .env(环境配置文件)
```

编辑`index.js`

```js
const Discuss = require("discuss");

// 选择以什么方式运行
Discuss.server(); // 服务器使用 (Server)

Discuss.main(); // 无服务器使用 (ServerLess)
```

编辑`.env`

```.env
# Discuss environment Config

# 数据库连接地址
DISCUSS_MONGODB='mongodb://localhost:27017/Discuss'

# 启动的端口号
DISCUSS_PORT='6870'

# 加密的密钥字符串(自定义，未填写则默认为:Disucss)
DISCUSS_SECRET='Discuss'
```

最后使用`nodejs`执行执行`index.js`文件，即：`node index.js`

启动成功后，你需要初始化管理员账户，访问服务端地址，进行初始化

假设服务端地址为: https://discuss.example.com 访问后填入基本信息提交即可

::: tip 提示
初始化管理员账户后，页面会自动刷新，这时会返回`{"msg":"Not Found"}`，因为 get 请求并未返回任何信息则默认返回此参数

当然这个返回结果是可以自定义的，你可以在`index.js `和`.env`同级目录下新建一个`index.html`文件，这时如果访问服务端地址就会返回该 html 文件，`favicon.ico`同 index.html 一样设置(如果已在 html 中使用了外链图标，则无需设置 icon ，否则会默认返回`Discuss`logo)
:::

### 配置管理

关于服务端的配置管理，本文仅提取部分配置项进行详细说明，其余配置仅看配置管理内的描述即可轻松理解含义

### 安全域名

- 默认: `null` 允许所有域名的 POST 请求

顾名思义，仅在白名单上的域名发送的请求，服务才会做出响应，反之任何请求都将返回`403`状态码，GET 请求除外

如需设置多个，请使用**英文逗号进行分割**，如`example.com,www.example.com,discuss.example.com`

::: warning 注意
不支持通配符`*`之类的语法

一旦设置了安全域名，本地的`localhost`和`127.0.0.1`也将被服务端拦截，如果您需要在本地计算机使用，你需要添加上`localhost`或`127.0.0.1`(包括端口号)
:::

### 请求头优先级

- 默认: [Get-User-IP](https://github.com/Lete114/Get-User-IP#%E5%AE%83%E6%98%AF%E5%A6%82%E4%BD%95%E5%B7%A5%E4%BD%9C%E7%9A%84)

用于获取用户 IP 地址，如果你使用了类似于[Cloud Flare](https://www.cloudflare.com/)的 CDN 加速，那么你可能需要注意 CDN 服务商是否将 IP 地址指定到了一个新的`headers.xxxx`中

以 Cloud Flare 举例，如果使用了 Cloud Flare CDN 那么这时的 IP 会被放到`headers.cf-connecting-ip`，你需要将他填入**请求优先级的输入框中**，多个使用**英文逗号分割**

::: danger 注意
如果你未设置，那么服务端保存的可能全都是 Cloud Flare(CDN)的 IP，这可能会被服务端的**10 分钟**评论所限制
:::

### 头像 CDN

- 默认: `https://cravatar.cn/avatar/`

[Cravatar](https://cravatar.cn/) 是 [Gravatar](https://gravatar.com/) 在中国的完美替代方案，当访客请求自己的头像时，我们会按此顺序分三级匹配头像：Cravatar->Gravatar->QQ 头像，对于博客站，这平均可以为 70% 的访客提供准确的头像

如果你需要设置头像参数，可以使用`${avatar}`来指定头像的`hash`，如：`https://cravatar.cn/avatar/${avatar}?s=400`

### 邮件模板(管理员)

- 默认: [master.html](https://github.com/Lete114/Discuss/blob/dev/public/master.html)

模板允许的变量: `${subject}`、`${nick}`、`${avatar}`、`${content}`、`${ip}`、`${mail}`、`${url}`

### 邮件模板(评论者)

- 默认: [reply.html](https://github.com/Lete114/Discuss/blob/dev/public/reply.html)

模板允许的变量: `${subject}`、`${Ravatar}`、`${Rcontent}`、`${nick}`、`${avatar}`、`${content}`、`${url}`

## 客户端 (Client)

按照如下代码对您的网站进行调整，保存并部署
此时评论服务就会在你的网站上成功运行 [欢呼]🎉🎉🎉

```html
<head>
  ...
  <script src="https://cdn.jsdelivr.net/npm/discuss/dist/Discuss.js"></script>
  ...
</head>
<body>
  ...
  <div id="Discuss-Comments"></div>
  <script>
    // 初始化
    Discuss.init({
      el: "#Discuss-Comments",
      serverURLs: "",
    });
  </script>
</body>
```

以下未标有`必填`项，则为可选项

### el [必填]

- 类型: `String`
- 默认: `null|undefined`

将评论挂载到某个 DOM 上
用于绑定`DOM`元素，渲染评论区

### serverURLs [必填]

- 类型: `String`
- 默认: `null|undefined`

用于发送请求，获取评论信息的服务端地址

### path

- 类型: `String`
- 默认: `location.pathname`

当前网页唯一标识符，用于区分不同网页，以保证能正确读取不同网页下的评论列表

::: tip 提示
如需要两个网页显示同一个评论列表，则可以通过传入相同的`path`网页唯一标识符来实现
:::

### lang

- 类型: `String`
- 默认: `zh_CN`

指定显示的语言

### ph

- 类型: `String`
- 默认: `评论你的想法~`

原名`placeholder`，评论框占位符，可自定义，默认值与`lang`有关系

### master

- 类型: `String`
- 默认: `博主`

与如上`placeholder`选项相似

### stick

- 类型: `String`
- 默认: `置顶`

与如上`placeholder`选项相似

### visitStat

- 类型: `Boolean`
- 默认: `true`

访问量统计，默认为`true`，并且自动寻找 id 为`Discuss-Visitors`的元素，如未找到，则取消获取访问量统计

如果需要自定义获取`DOM`元素，你需要调用[API VisitStat](/guide/API-Docs.html#visit-stat)

### imgLoading

- 类型: `String`
- 默认: `1像素白色base64图`

评论图片懒加载，加载动画

### emotMaps

- 类型: `Object|String`
- 默认: `内置表情`

如未指定值，则使用内置表情

如指定 url 则会发送请求获取表情 json 数据

如指定为`Object`对象，则直接使用该对象

格式如下:

::: tip 提示
type 属性仅支持`text`和`image`

其中表情`type`为`image`可以将 key 设置为`html`的`img`标签
:::

```json
{
  "OwO": {
    "type": "text",
    "items": {
      "喵星人": "( =•ω•= )m",
      "hi": "Hi~ o(*￣▽￣*)ブ"
    }
  },
  "<img src='https://cdn.jsdelivr.net/gh/zhheo/Sticker-Heo@main/Sticker-100/鼓掌.png'>": {
    "type": "image",
    "items": {
      "heo-再见": "https://cdn.jsdelivr.net/gh/zhheo/Sticker-Heo@main/Sticker-100/再见.png",
      "heo-呲牙笑": "https://cdn.jsdelivr.net/gh/zhheo/Sticker-Heo@main/Sticker-100/呲牙笑.png"
    }
  }
}
```