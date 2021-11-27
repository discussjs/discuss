---
title: 部署 Vercel 无服务器平台 | Vercel ServerLess Deploy
abbrlink: Vercel-ServerLess-Deploy
date: 2021-11-27 15:22:22
cover: /img/4.jpg
---

1. 注册 [Vercel](https://vercel.com/signup)账号
2. 点击下面按钮将 `Discuss` 一键部署到 Vercel
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/lete114/discuss/tree/vercel)
3. 随后会提醒你创建一个 Git 仓库，方便后期部署，选择 GitHub，你需要输入一个仓库名，例如：`Discuss-Vercel`，最后等待构建完成点击`Go to Dashboard`
4. 点击`Settings`进入设置选择`Environment Variables`，添加环境变量

| 属性名          | 属性值           | 描述     |
| --------------- | ---------------- | -------- |
| DISCUSS_MONGODB | 数据库连接字符串 | 如果没有的话，你得去注册一个[MongoDB](https://www.mongodb.com/cloud/atlas/register)账号 |
| DISCUSS_SECRET | Discuss | 你可以自定义 |

5. 由于您是先部署，后配置环境变量，所以环境变量没有生效，你需要点击顶部的`Deployments`，重新部署即可
![](/img/Vercel-ServerLess-Deploy/Redeploy.png)

