---
title: 快速开始 | Quick Start
abbrlink: Quick-Start
date: 2021-11-27 15:44:44
cover: /img/2.jpg
---

## 准备

在开始之前我们需要准备什么？？
1. 服务器 OR 无服务平台(ServerLess)
2. 数据库 (MongoDB)
3. NodeJS、NPM、Git环境
4. 一双手、还有耐心

## 快速开始

感谢您使用 Discuss 评论系统，只需几个步骤，您就可以在您的网站中部署和管理 Discuss 提供评论服务。

### 服务端 (Server)

初始化npm项目

```bash
mkdir Discuss                   # 创建目录
cd Discuss                      # 进入目录
npm init -y                     # 初始化npm
npm install discuss --save      # 安装Discuss
touch index.js .env             # 创建index.js 以及 .env(环> 置文件)
```

编辑`index.js`
```js
const Discuss = require('discuss')

// 选择以什么方式运行
Discuss.server() // 服务器使用 (Server)

Discuss.main() // 无服务器使用 (ServerLess)
```
编辑`.env`
```.env
# Discuss environment Config

# 数据库连接地址
DISCUSS_MONGODB='mongodb://localhost:27017/Discuss'

# 启动的端口号
DISCUSS_PORT='6870'

# 加密的密钥字符串(自定义)
DISCUSS_SECRET='Discuss'
```

### 客户端 (Client)

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
    Discuss({
      el: '#Discuss-Comments',
      serverURL: '', // 服务端部署地址
    });
  </script>
</body>
```

