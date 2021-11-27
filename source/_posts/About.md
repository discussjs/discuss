---
title: 简介 | About
abbrlink: About
date: 2021-11-27 15:55:55
cover: /img/1.jpg
---



## 简介

一个简单，安全，免费的评论系统 | A simple, safe, free comment system

由于这是我在学习 vue 的过程中边学边做的，可能部分功能不是很完善

如果你有什么好的建议或者新功能，欢迎提出或参与贡献

> 后台样式是借鉴于[Twikoo](https://twikoo.js.org/)，以后会有自己的想法、风格、布局做出更改

## 特点

- 轻量 (40~kb gzip)
- 自托管 (Nodejs 后端跨平台)
- 深色模式 (自动适配深色模式)
- 免费部署 (服务器、无服务器匀可部署)

### 评论

- 邮件通知
- 防 XSS 注入
- 嵌入式评论管理
- 支持 Markdown 语法 (启用 \ 禁用)
- 评论审核
- 批量处理 (通过 \ 审核 \ 垃圾 \ 删除 )
- 在线编辑 (评论信息 \ 配置信息)
- 评论搜索 (模糊搜索: 昵称、邮箱、IP、评论内容、文章地址)
- 自动保存 (评论草稿、用户名、邮箱、网址)
- 身份认证 (博主 Tag \ 自定义)
- 评论头像 (Gravatar \ QQ 头像)
- 反垃圾检测 ([Akismet-API](https://akismet.com/))
- 限制评论频率 (每个 IP 10 分钟内最多评论多少条 \ 10 分钟内所以 IP 只能评论多少条)

### 个性

- 支持限制评论字数 (以免被几万几万的写入数据库中)
- 支持自定义邮件模板
- 支持自定义`博主`表示文字
- 支持多种代码高亮[主题](https://github.com/highlightjs/cdn-release)
- 支持自定义评论框`placeholder`(占位符)
- 支持自定义表情列表 (类型: Text \ image)

## 快速开始

关于`客户端配置`就不多写了，直接借鉴本项目路径下的`/public/index.html`进行配置就好了

服务端部署

> 注意: 目前仅支持 MongoDB

### 克隆仓库部署

<details>
<summary>点击展开</summary>

```bash
git clone https://github.com/lete114/Discuss.git Discuss
cd Discuss
cp .env.example .env
vim .env
```

.env 修改环境配置文件
修改好后执行`npm run start:server`即可

```env
# Discuss environment Config

# 数据库连接地址
DISCUSS_MONGODB='mongodb://localhost:27017/Discuss'

# 启动的端口号
DISCUSS_PORT='6870'

# 加密的密钥字符串(自定义)
DISCUSS_SECRET='Discuss'
```

</details>

### NPM 安装部署

<details>
<summary>点击展开</summary>

```bash
mkdir Discuss                   # 创建目录
cd Discuss                      # 进入目录
npm init -y                     # 初始化npm
npm install discuss --save      # 安装Discuss
touch index.js .env             # 创建index.js 以及 .env(环> 置文件)
```

index.js 引入 Discuss 并调用

```js
const Discuss = require("discuss");
Discuss.server();
```

.env 修改环境配置文件
修改好后执行`node index.js`即可，或者修改`package.json`用`npm run xxx`来启动都可以

```env 修改环境配置文件
# Discuss environment Config

# 数据库连接地址
DISCUSS_MONGODB='mongodb://localhost:27017/Discuss'

# 启动的端口号
DISCUSS_PORT='6870'

# 加密的密钥字符串(自定义)
DISCUSS_SECRET='Discuss'

```

</details>

以上两种方式任选一种方式部署，部署完成后通过访问部署服务器地址(`http://localhost:6870`)，进行初始化管理员账户

## 开发

加入我们一起开发

```bash
git clone https://github.com/lete114/Discuss.git Discuss
cd Discuss
npm install               # 安装依赖
npm run start:client      # 启动客户端
npm run start:server      # 启动服务端
```