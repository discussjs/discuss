<h1 align="center"><a href="https://discuss.js.org" target="_blank"><img src="./assets/svg/Logo.svg" width="360" height="90" alt="Logo"></a></h1>
<p align="center">一款简单，安全，免费的评论系统 | A simple, safe, free comment system</p>

<p align="center">
    <a href="https://discuss.js.org" target="_blank"><img src="https://img.shields.io/badge/Docs-文档-1081c1?logo=read-the-docs" alt="Docs"></a>
    <a href="https://github.com/discussjs/Discuss/releases/"><img src="https://img.shields.io/npm/v/discuss?color=critical&logo=npm" alt="Version"></a>
    <a href="https://github.com/discussjs/Discuss/tree/dev"><img src="https://img.shields.io/github/package-json/v/discussjs/Discuss/dev?color=%231ab1ad&label=dev" alt="Dev Version"></a>
    <img src="https://img.shields.io/npm/dm/discuss" alt="Downloads">
    <a href="https://jq.qq.com/?_wv=1027&k=lh7oS7Xt"><img src="https://img.shields.io/badge/QQ群-343890210-00a4ff?logo=tencent-qq" alt="QQ群"></a>
    <a href="https://github.com/discussjs/Discuss/blob/dev/LICENSE"><img src="https://img.shields.io/npm/l/discuss?color=ee5535" alt="MIT License"></a>
</p>

## 简介

这是一款简单，安全，免费的评论系统，仅提供评论功能、访问量统计、获取最新评论、获取评论数(可批量)

它与其它评论系统有什么区别？

- Discuss <===> 手机短信
- Twikoo、Waline <===> QQ/微信

如上比喻，简单明了，如果你只是需要一个能**收发评论**的轻量评论，那么你可能需要**Discuss**

如果你需要体验更多共功能，就可以选择使用 [Twikoo](https://twikoo.js.org/) 或 [Waline](https://waline.js.org/)

由于 [Lete 乐特](https://github.com/Lete114) 没有什么艺术细胞，UI 写的也很烂，Logo 也是随便弄的，如果你对**Discuss**感兴趣，并想提供帮助或贡献，那么欢迎你 🎉🎉🎉

## 个性

- 多数据库支持(7 种)
- 深色模式 (自动适配深色模式)
- 支持自定义`博主` `置顶`表示文字
- 支持自定义评论框`placeholder`(占位符)
- 支持限制评论字数 (避免大量文字信息写入数据库)
- 支持自定义邮件模板
- 支持自定义表情列表 (类型: Text \ image)
- 支持外链自定义表情 (类型: Text \ image)

## 特点

- **真**·安全
- 轻量 (~50kb gzip: ~16kb)
- 自托管 (Nodejs 后端跨平台)
- 免费部署 (Server、ServerLess 均可部署)
- 邮件通知
- 防 XSS 注入
- 嵌入式评论管理
- 批量处理 (通过 \ 审核 \ 垃圾 \ 删除 )
- 在线编辑 (评论信息 \ 配置信息)
- 评论搜索 (模糊搜索: 昵称、邮箱、IP、评论内容、文章地址)
- 自动保存 (评论草稿、用户名、邮箱、网址)
- 身份认证 (博主 Tag \ 自定义)
- 评论头像 (Gravatar \ QQ 头像)
- 反垃圾检测 ([Akismet-API](https://akismet.com/))
- 限制评论频率 (每个 IP 10 分钟内最多评论多少条 \ 10 分钟内所以 IP 只能评论多少条)

## 开发

加入我们一起开发

```bash
git clone https://github.com/discussjs/Discuss.git Discuss
cd Discuss
npm install               # 安装依赖
npm run start:client      # 启动客户端
npm run start:server      # 启动服务端
npm run lint              # 在提交代码之前，您因该对你写的代码进行检查
```

## 特别感谢

- [Pubudu Dodangoda](https://github.com/pupudu) 提供的 NPM 包名
