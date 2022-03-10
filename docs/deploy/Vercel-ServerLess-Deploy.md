---
title: 部署 Vercel 无服务器平台
sidebar: false
---

1. 注册 [Vercel](https://vercel.com/signup)账号，推荐使用 GitHub 账户注册

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lete114/Discuss-Deploy/tree/Vercel)

2. 点击上方 `Deploy` 按钮，将 `Discuss` 评论服务一键部署到 Vercel 平台
3. 随后会提醒你创建一个 Git 仓库，方便后期管理以及部署，你需要输入一个仓库名，例如：`Discuss-Vercel`，点击 `Create`
   ![Start-Deploy](/img/Vercel-ServerLess-Deploy/Start-Deploy.png)
   等待构建完成后点击`Go to Dashboard`(前往控制面板)
   ![Create](/img/Vercel-ServerLess-Deploy/Create.png)
4. 点击`Settings`进入设置选择`Environment Variables`，添加环境变量
   ![Settings](/img/Vercel-ServerLess-Deploy/Settings.png)
   ![Add-Env](/img/Vercel-ServerLess-Deploy/Add-Env.png)

| 属性名          | 属性值           | 描述                                                                        |
| --------------- | ---------------- | --------------------------------------------------------------------------- |
| D_MONG_URL | 数据库连接字符串 | 如果没有的话，您得去注册一个[MongoDB](/guide/Get-MongoDB-DataBase.html)账号 |
| DISCUSS_SECRET  | Discuss          | [可选] token 生成盐加密(默认为:Discuss)                                     |

5. 由于您是先部署，后配置环境变量，所以环境变量没有生效，你需要点击顶部的`Deployments`，重新部署后环境变量才能生效，最后访问服务端地址，初始化管理员账户，填写完成后，点击提交成功后，页面会自动刷新，并返回`{"msg":"Not Found"}`表示成功
   ![Redeploy](/img/Vercel-ServerLess-Deploy/Redeploy.png)
   ![Init](/img/Vercel-ServerLess-Deploy/Init.png)
