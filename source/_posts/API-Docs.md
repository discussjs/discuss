---
title: API Docs
cover: /img/5.jpg
abbrlink: API-Docs
date: 2021-11-27 15:11:11
---

Discuss API 与 Discuss 本身并没有直接的关系，你可以随时调用，并不需要初始化 Discuss 即可使用 API

## Visit Stat

访问量统计

例子:

```html
<script src="https://cdn.jsdelivr.net/npm/discuss@latest/dist/Discuss.js"></script>

<script>
  /**
   * 访问量统计
   * @param {String} url 请求地址
   * @param {String} path 请求路径
   * @returns {Number}
   */
  Discuss.VisitStat({
    url: "https://discuss-doc.imlete.cn", // Discuss后台请求地址
    path: location.pathname, // 页面的唯一标识符
  }).then((data) => {
    console.log(data); // 直接返回数量
  });
</script>
```

## Recent Comment

获取最新评论

例子:

```html
<script src="https://cdn.jsdelivr.net/npm/discuss@latest/dist/Discuss.js"></script>

<script>
  /**
   * 获取最新评论
   * @param {String} url 请求地址
   * @param {Boolean} reply 是否请求回复评论 默认: true
   * @returns {Array}
   */
  Discuss.RecentComment({
    url: "https://discuss-doc.imlete.cn", // Discuss后台请求地址
    reply: false, // 如果没有需求，第二个参数是不需要写的
  }).then((data) => {
    console.log(data);
    // 返回的 Array
    // [
    //   {
    //     _id: "61a45c3d521411b101113b96",
    //     nick: "Test",
    //     site: "",
    //     content: "<p>Test API</p>",
    //     pid: "",
    //     rid: "",
    //     stick: false,
    //     master: false,
    //     avatar: "https://thirdqq.qlogo.cn/g?b=sdk&k=k26Ec8NWH58mHCww4XBVyQ&s=140&t=0",
    //     time: "2021-11-11",
    //   }
    // ]
  });
</script>
```

## Comment Count

获取评论数量

例子:

```html
<script src="https://cdn.jsdelivr.net/npm/discuss@latest/dist/Discuss.js"></script>

<script>
  /**
   * 请求评论数量
   * @param {String} url 请求地址
   * @param {Array} paths 请求的标识符(网站path)
   * @param {Boolean} reply 是否请求回复评论 默认: true
   * @returns {Array}
   */
  Discuss.CommentCount({
    url: "https://discuss-doc.imlete.cn", // Discuss后台请求地址
    paths: location.pathname, // 页面的唯一标识符
    reply: false, // 如果没有需求，第三个参数是不需要写的
  }).then((data) => {
    console.log(data);
    // 返回的 Array
    // [
    //   { url: "/About.html", count: 10 },
    //   { url: "/Quick-Start.html", count: 11 },
    //   { url: "/Get-MongoDB-DataBase.html", count: 20 },
    // ];
  });
</script>
```

## 总结

> 对应的请求类型如下
> 访问量统计: COUNTER
> 获取最新评论: RECENT_COMMENT
> 获取评论数量: COMMENT_COUNT

你也可以自定义请求，并非需要 Discuss 的请求方法去请求
例如使用`axios`

```js
const url = "https://discuss-doc.imlete.cn";
const options = {
  type: "COUNTER",
  path: location.pathname,
};
// 请求访问量统计
axios.post(url, options).then((data) => {
  console.log(data); // 直接返回数量
});
```
