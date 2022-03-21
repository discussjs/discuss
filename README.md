<h1 align="center"><a href="https://discuss.js.org" target="_blank"><img src="https://discuss.js.org/svg/Logo.svg" width="360" height="90" alt="Logo"></a></h1>
<p align="center">一款简单，安全，免费的评论系统 | A simple, safe, free comment system</p>

<p align="center">
    <a href="https://discuss.js.org" target="_blank"><img src="https://img.shields.io/badge/-Docs-1081c1?logo=read-the-docs" alt="Docs"></a>
    <a href="https://github.com/lete114/Discuss/releases/"><img src="https://img.shields.io/npm/v/discuss?color=critical&logo=npm" alt="Version"></a>
    <a href="https://github.com/lete114/Discuss/tree/dev"><img src="https://img.shields.io/github/package-json/v/lete114/Discuss/dev?color=%231ab1ad&label=dev" alt="Dev Version"></a>
    <img src="https://img.shields.io/npm/dm/discuss" alt="Downloads">
    <a href="https://jq.qq.com/?_wv=1027&k=lh7oS7Xt"><img src="https://img.shields.io/badge/QQ-343890210-00a4ff?logo=tencent-qq" alt="QQ"></a>
    <a href="https://github.com/lete114/Discuss/blob/master/LICENSE"><img src="https://img.shields.io/github/license/lete114/Discuss?color=FF5531" alt="MIT License"></a>
</p>

## Install

```bash
npm install hexo-discuss --save
```

## Configure

将配置文件写入 Hexo 的配置文件`_config.yml`

```yml
# Discuss 评论系统
## https://discuss.js.org/
discuss:
  enable: true # 是否启动评论系统
  siblingEl: ".pagination-post" # 如果你没有适合‘el’挂载的 DOM 元素，你可以在这里创建一个
  el: "#Discuss-Comments" # 评论挂载的 DOM 元素
  serverURLs: # 评论服务端地址
  location: # 注入的位置
  page: # 注入哪些页面
  ## 加载的js版本,建议把@latest替换成指定版本如：@0.2.5
  source: https://cdn.jsdelivr.net/npm/discuss@latest/dist/Discuss.js
  ## 更多配置: https://discuss.js.org/Quick-Start.html#%E5%AE%A2%E6%88%B7%E7%AB%AF-client
  options:
  # 举例
  # options:
  #   path: location.pathname
  #   lang: en_US
```

### siblingEl

假设你的 hexo 博客 html 基本结构是如下

```html
<html>
  <head>
    <!-- ... -->
    <title>xxx</title>
    <!-- ... -->
  </head>
  <body>
    <nav>
      <!-- ... -->
    </nav>
    <main>
      <article>
        <div class="post-title"></div>
        <div class="post-meta"></div>
        <div class="post-content"></div>
        <div class="post-copyright"></div>
        <!-- 该标签可能不存在 <div class="post-comment"></div> -->
        <!-- ... -->
      </article>
    </main>
    <footer>
      <!-- ... -->
    </footer>
  <body>
</html>
```

如上 html 结构，你的网站没有`<div class="post-comment"></div>`可以存放评论的 DOM 元素怎么办？

我们提供了一个配置选项`siblingEl`，可以帮你自动生成一个用于存放评论的 DOM 元素

> 如果你的 hexo 主题已有预留给评论系统挂载的 DOM 元素，那么可以忽略该配置，留空即可

```yml
# _config.yml
# Discuss 评论系统
## https://discuss.js.org/
discuss:
  enable: true
  siblingEl: ".post-copyright" # 使用css的class选择器写法，选择某个 DOM 元素
  el: "#Discuss-Comments" # 评论需要挂载的 DOM 元素 (可以是id选择器，也可以是class选择器)
  # 为了易于理解，已将其它配置省略
```

最后执行`hexo g`的到的 html 结构如下

> 会自动帮你创建一个 DOM 元素

```html
<html>
  <head>
    <!-- ... -->
    <title>xxx</title>
    <!-- ... -->
  </head>
  <body>
    <nav>
      <!-- ... -->
    </nav>
    <main>
      <article>
        <div class="post-title"></div>
        <div class="post-meta"></div>
        <div class="post-content"></div>
        <div class="post-copyright"></div>
        <div id="Discuss-Comments"></div>
        <!-- 该标签可能不存在 <div class="post-comment"></div> -->
        <!-- ... -->
      </article>
    </main>
    <footer>
      <!-- ... -->
    </footer>
  <body>
</html>
```

### location

`location`选项可以让评论插入到网站的哪个位置

| 值         | 默认值 | 描述                  |
| ---------- | ------ | --------------------- |
| head_begin |        | 注入在 `<head>` 之后  |
| head_end   |        | 注入在 `</head>` 之前 |
| body_begin |        | 注入在 `<body>` 之后  |
| body_end   | ✅     | 注入在`</body>` 之前  |

### page

`page`选项可以让评论插入到网站的哪哪些页面

| 值                     | 默认值 | 描述                                                                                   |
| ---------------------- | ------ | -------------------------------------------------------------------------------------- |
| default                | ✅     | 注入到每个页面                                                                         |
| home                   |        | 只注入到主页（`is_home()` 为 `true` 的页面）                                           |
| post                   |        | 只注入到文章页面（`is_post()` 为 `true` 的页面）                                       |
| page                   |        | 只注入到独立页面（`is_page()` 为 `true` 的页面）                                       |
| archive                |        | 只注入到归档页面（`is_archive()` 为 `true` 的页面）                                    |
| category               |        | 只注入到分类页面（`is_category()` 为 `true` 的页面）                                   |
| tag                    |        | 只注入到标签页面（`is_tag()` 为 `true` 的页面）                                        |
| 自定义的 `layout` 名称 |        | 如果你知道是什么的话，你可以填写该选项，如果你不知道，那么很可能该插件无法注入评论系统 |
