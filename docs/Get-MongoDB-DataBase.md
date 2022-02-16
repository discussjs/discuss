# 获取 MongoDB 数据库

1. 注册[MongoDB](https://www.mongodb.com/cloud/atlas/register)账号
2. 选择地区(选择离你服务端近的即可)
3. 创建数据库用户，输入用户名和密码
   随后就是添加 IP 地址

   ::: warning 注意
   服务器部署，则填服务器公网 IP

   `无服务器(ServerLess)`ServerLess 一般都是动态 IP，你无法得到一个固定 IP，我们建议填写`0.0.0.0`
   :::
   ![](/img/Get-MongoDB-DataBase/Add-IP.png)

4. 点击`Connect`，点击`Connect you application`，选择 Nodejs 版本，然后复制连接数据库字符串
   > 需要将字符串中的`<password>`替换为您在第三步创建的数据库用户密码，修改`myFirstDatabase`为你想要的数据库名称例如:`Discuss` > ![](/img/Get-MongoDB-DataBase/Connect.png) > ![](/img/Get-MongoDB-DataBase/Get-Connect.png)
