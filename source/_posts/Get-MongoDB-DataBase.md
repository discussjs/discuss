---
title: 获取 MongoDB 数据库 | Get MongoDB DataBase
abbrlink: Get-MongoDB-DataBase
date: 2021-11-27 15:33:33
cover: /img/3.jpg
---

1. 注册[MongoDB](https://www.mongodb.com/cloud/atlas/register)账号
2. 选择地区(选择离你服务端近的即可)
3. 创建数据库用户，输入用户名和密码
随后就是添加IP地址，如果您使用的是服务器部署，你直接填写你服务器的 公网IP即可
如果你使用的是`无服务器(ServerLess)`，ServerLess一般都是动态IP，你无法得到一个固定IP
所以得允许所有IP
![](/img/Get-MongoDB-DataBase/Add-IP.png)
4. 点击`Connect`，点击`Connect you application`，现在nodejs版本，然后复制连接数据库字符串
> 需要将字符串中的`<password>`替换为您在第三步创建的数据库用户密码，修改`myFirstDatabase`为你想要的数据库名称`Discuss`
![](/img/Get-MongoDB-DataBase/Connect.png)
![](/img/Get-MongoDB-DataBase/Get-Connect.png)

