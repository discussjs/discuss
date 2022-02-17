---
title: 快速开始
---

## 准备

感谢您使用 Discuss 评论系统，只需几个步骤，您就可以在您的网站中部署和管理 Discuss 提供评论服务。

在开始之前我们需要准备什么？？
::: tip 提示
如果你没有服务器(不想部署在服务器上)的话，你可以选择[免费部署](/Vercel-ServerLess-Deploy.html)
:::

1. 服务器 OR 无服务平台(ServerLess)
2. 数据库 (MongoDB)
3. NodeJS、NPM、Git 环境
4. 一双手、还有耐心

## 服务端 (Server)

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

::: tip 提示
启动成功后，你需要初始化管理员账户，访问服务端地址，进行初始化

假设服务端地址为: https://discuss.example.com 访问后填入基本信息提交即可
:::

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
      el: "#Discuss-Comments",   // [必填]将评论挂载到某个DOM上
      serverURLs: "",            // [必填]服务端部署地址
      path: "",                  // [必填]网站的唯一标识符，评论会根据该标识返回评论，默认: location.pathname
      // master: "",                // 博主标签占位符，默认: 博主
      // placeholder: "",           // 评论框占位符，默认: 评论你的想法~
      // lang: "",                  // 评论语言，默认: zh_CN ，可选: [zh_CN , en_US]
      // visitStat: true ,          // 是否开启访问统计，默认: true
      // imgLoading: ''             // 评论图片懒加载，加载动画，默认为1像素白色base64图
    });
  </script>
</body>
```
