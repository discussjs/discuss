"use strict";

function isJSON(json) {
  try {
    JSON.parse(JSON.stringify(json));
    return true;
  } catch (error) {
    return false;
  }
}

hexo.extend.filter.register("after_generate", function () {
  const log = this.log;
  const config = this.config.discuss;

  if (!config.enable) return;

  const str = "Not detected Discuss$ configuration";
  if (!isJSON(config)) return log.w(str.replace("$", ""));
  if (!config.el) return log.w(str.replace("$", ".el"));
  if (!config.serverURLs) return log.w(str.replace("$", ".serverURLs"));

  const { siblingEl, el, serverURLs, options, location, source, page } = config;

  const latest = "https://cdn.jsdelivr.net/npm/discuss@latest/dist/Discuss.js";

  const initData = Object.assign(
    { el, serverURLs },
    isJSON(options) ? options : {}
  );

  const createElStr = `
  (function(){
    var createNextElementSibling = document.querySelector("${siblingEl}")
    if (!createNextElementSibling) return
    var div = document.createElement('div')
    var str = "${el}".slice(1)
    "${el}".slice(0,1) === '.' ? div.className = str : div.id = str
    createNextElementSibling.parentNode.insertBefore(div,createNextElementSibling.nextElementSibling)
  })()`;

  const script = `<script>
  (function () {${createElStr || ""}
    if (!document.querySelector("${el}")) return
    var script = document.createElement("script")
    var initData = ${JSON.stringify(initData)}
    script.src = "${source || latest}"
    script.type = "text/javascript"
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null
          Discuss.init(initData)
        }
      };
    } else {
      script.onload = function () {
        Discuss.init(initData)
      };
    }
    document.body.appendChild(script)
  })();
  </script>`;

  hexo.extend.injector.register(
    location || "body_end",
    script,
    page || "default"
  );
});
