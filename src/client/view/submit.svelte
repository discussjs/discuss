<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'
  import { options, msg, lazy } from '../lib/stores'
  import request from '../lib/request'
  import loadScript from '../lib/import'
  import Emotion from '../../../assets/svg/Emotion.svg'
  import Loading from '../../../assets/svg/Loading.svg'
  import Setting from '../../../assets/svg/Setting.svg'
  import Refresh from '../../../assets/svg/Refresh.svg'
  import { translate } from '../i18n'

  let D = $options
  const dispatch = createEventDispatcher()

  export let cancel = false,
    pid = '',
    rid = ''

  // 普通变量
  const textStr = 'text'
  const nickStr = 'nick'
  const mailStr = 'mail'
  const siteStr = 'site'
  const contentStr = 'content'
  // source: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]{1,30}\.)+[A-Za-z\d]{2,5}$/
  const redo = '[A-Za-z\\d]'
  const domain = `(${redo}{1,30}\\.)+${redo}{2,5}$`
  const mailReg = /^\w+([-.]\w+)*@\w+([-.]\w+)*(\.[a-z]{2,5})+$/
  const siteReg = new RegExp('^https?://' + domain)

  // svelte变量
  let storage = localStorage.Discuss
  let isEmot = false
  let emotIndex = 0
  let emotMaps = {}
  let emotAll = {}
  let isSend = false
  let isLegal = false
  const inputs = [
    {
      key: nickStr,
      locale: translate(nickStr),
      type: textStr
    },
    {
      key: mailStr,
      locale: translate(mailStr),
      type: 'e' + mailStr
    },
    {
      key: siteStr,
      locale: translate(siteStr),
      type: textStr
    }
  ]
  let metas = {
    nick: { value: '', is: false },
    mail: { value: '', is: false },
    site: { value: '', is: true },
    content: { value: '', is: false }
  }
  $: contentHTML = ''

  onMount(async () => {
    initInfo()
    await getEmot()
    D.MetasChange()
  })

  afterUpdate(() => {
    $lazy()
  })

  function initInfo() {
    try {
      storage = JSON.parse(storage) || {}
      metas.nick.value = storage.nick || ''
      metas.mail.value = storage.mail || ''
      metas.site.value = storage.site || ''
      metas.content.value = storage.content || ''
    } catch (error) {
      storage = {}
    }
  }

  async function getEmot() {
    const emot = D.emotMaps
    if (/\.json$/.test(emot)) {
      emotMaps = await request({ url: emot, method: 'GET' })
    } else if (!emot) {
      loadScript('emot', () => {
        emotMaps = window.DiscussEmot()
      })
    } else {
      emotMaps = emot
    }
  }
  function getEmotAll() {
    try {
      for (const e in emotMaps) {
        const type = emotMaps[e].type
        if (type === textStr) continue
        const items = emotMaps[e].items
        emotAll = { ...emotAll, ...items }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }
  function ParseEmot() {
    getEmotAll()
    let content = metas.content.value
    const reg = /\[(?<emot>.*?)\]/g
    const emots = []
    const arr = content.matchAll(reg)
    for (const item of arr) {
      emots.push(item.groups.emot)
    }

    for (const emot of emots) {
      const link = emotAll[emot]
      if (!link) continue
      const img = `<img class='D-comment-emot' src='${link}' alt='${emot}'/>`
      content = content.replace(`[${emot}]`, img)
    }
    contentHTML = content
  }

  function SaveInfo() {
    storage.nick = metas.nick.value.trim()
    storage.mail = metas.mail.value.trim()
    storage.site = metas.site.value.trim()
    storage.content = metas.content.value.trim()
    localStorage.Discuss = JSON.stringify(storage)
  }

  $: isOnPreview = metas.content.value.length
  let isPreview = false
  function Preview() {
    if (!isPreview) return
    ParseEmot()
  }
  function onPreview() {
    isPreview = !isPreview
    Preview()
  }

  function onInput() {
    SaveInfo()
    Preview()
    D.MetasChange()
  }
  /**
   * @param {String} key 表情名(描述)
   * @param {String} value 表情值(内容或地址)
   * @param {String} type 表情类型(text or image)
   */
  let textareaDOM
  function onClickEmot(key, value, type) {
    const cObj = metas.content
    let content = cObj.value

    // 获取输入框光标位置
    let cursorStart = textareaDOM.selectionStart
    let cursorEnd = textareaDOM.selectionEnd
    const Start = content.substring(0, cursorStart)
    const Ent = content.substring(cursorEnd)

    if (type === textStr) cObj.value = `${Start}${value}${Ent}`
    else cObj.value = `${Start}[${key}]${Ent}`

    textareaDOM.focus()
    const contentLen = content.length
    cursorStart = contentLen
    cursorEnd = contentLen
    // 重新解析表情
    ParseEmot()
    // 重新保存
    SaveInfo()
    // 由于这是Svelte的特性，引用类型需要重新给自身赋值才会触发双向绑定
    metas = metas
  }

  D.MetasChange = function () {
    try {
      const inputsDOM = document.querySelectorAll('.D-submit>.D-input>*')
      let { nick, mail, site, content } = metas
      inputsDOM.forEach((el) => {
        el.classList.remove('error')
        const len = el.value.length
        const name = el.name
        const word = D.wordNumber[el.name]

        let condition = true
        if (name === nickStr) condition = len > 1
        if (name === mailStr) condition = mailReg.test(el.value)
        if (name === siteStr) condition = len === 0 ? true : siteReg.test(el.value)
        if (name === contentStr) condition = len > 1

        // 如果word的参数不为0，这判断输入框内容长度是否符合规定
        if (word) condition = condition && len <= word

        if (condition) metas[el.name].is = true
        else {
          el.classList.add('error')
          metas[el.name].is = false
        }
      })
      isLegal = nick.is && mail.is && site.is && content.is
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  // eslint-disable-next-line max-statements
  async function onSend() {
    try {
      if (!isSend && !isLegal) return
      ParseEmot()
      const comment = {
        type: 'COMMIT_COMMENT',
        nick: metas.nick.value,
        mail: metas.mail.value,
        site: metas.site.value,
        content: contentHTML,
        path: D.path,
        pid,
        rid
      }
      isSend = true

      const token = localStorage.DToken
      if (token) comment.token = token
      const result = await request({
        url: D.serverURLs,
        data: comment
      })

      if (!result.data && result.msg.includes('login')) {
        $msg({ type: 'error', text: translate('pleaseLogin') })
      }

      if (result.data instanceof Array) {
        dispatch('submitComment', { data: result.data, pid })
        metas.content.value = ''
        SaveInfo()
        isPreview = false
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Comment failure:', error)
      $msg({ type: 'error', text: translate('sendError') })
    } finally {
      isSend = false
    }
  }
</script>

<div class="D-submit">
  <div class="D-input">
    {#each inputs as i}
      <input
        bind:value={metas[i.key].value}
        name={i.key}
        placeholder={i.locale}
        on:input={(e) => (e.target.type = i.type)}
        on:input={onInput}
      />
    {/each}
    <textarea
      name={contentStr}
      class="D-input-content"
      bind:value={metas.content.value}
      placeholder={D.ph}
      on:input={onInput}
      bind:this={textareaDOM}
    />
  </div>
  <div class="D-actions D-select-none">
    <div class="D-actions-left">
      <div class="D-emot-btn" on:click={() => (isEmot = !isEmot)}>
        <Emotion />
      </div>
      {#if !cancel}
        <div class="D-setting-btn" on:click={() => dispatch('onSetting')}><Setting /></div>
        <div class="D-refresh-btn" on:click={() => dispatch('onRefresh')}><Refresh /></div>
      {/if}
    </div>

    <div class="D-actions-right">
      <!-- 取消回复 -->
      {#if cancel}
        <button class="D-cancel D-btn D-btn-main" on:click={() => dispatch('onCancel', true)}
          >{translate('cancel')}</button
        >
      {/if}

      <button on:click={onPreview} class="D-cancel D-btn D-btn-main {!isOnPreview && 'D-disabled'}"
        >{translate('preview')}</button
      ><button class="D-send D-btn D-btn-main" on:click={onSend} disabled={!isSend && !isLegal}>
        {#if isSend && isLegal}
          <Loading />
        {:else}
          {translate('send')}
        {/if}
      </button>
    </div>
  </div>
  {#if isPreview}
    <div class="D-preview">{@html contentHTML}</div>
  {/if}
  {#if isEmot}
    <div class="D-emot">
      {#each Object.entries(emotMaps) as [emotKey, emotValue], index}
        <ul class="D-emot-items {index === emotIndex ? 'D-emot-items-active' : ''}">
          {#each Object.entries(emotValue.items) as [iKey, iValue]}
            <li class="D-emot-item" on:click={onClickEmot(iKey, iValue, emotValue.type)}>
              {#if emotValue.type === 'text'}
                <span title={iKey}>{iValue}</span>
              {:else}
                <img src={D.imgLoading} d-src={iValue} alt={iKey} title={iKey} />
              {/if}
            </li>
          {/each}
        </ul>
      {/each}

      <div class="D-emot-packages">
        {#each Object.entries(emotMaps) as [emotKey, emotValue], index}
          <span on:click={() => (emotIndex = index)} class={index === emotIndex ? 'D-emot-package-active' : ''}
            >{@html emotKey}</span
          >
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  /* submit */
  .D-submit {
    margin: 10px 0;
    padding: 10px;
    border-radius: 8px;
    border: solid 1px var(--D-Centre-Color);

    &:hover {
      border-color: var(--D-Height-Color);
    }
    .D-input :global(.error) {
      border-radius: 6px;
      border-color: var(--D-main-Color);
      background: rgba(244, 100, 95, 0.1);
    }
  }
  .D-input {
    :global(.error) {
      border-radius: 6px;
      border-color: var(--D-main-Color);
      background: rgba(244, 100, 95, 0.1);
    }
    input {
      padding: 6px;
      width: calc((100% - 1rem) / 3);
      outline: none;
      border-bottom: dashed 1px var(--D-Centre-Color);

      + input {
        margin-left: 0.5rem;
      }
    }
    * {
      color: currentColor;
      border: none;
      background: transparent;
      box-sizing: border-box;

      &:focus {
        border-radius: 8px;
        background: rgba(153, 153, 153, 0.08);
      }
    }
    *:hover {
      border-color: var(--D-Height-Color);
      transition: all 0.5s;
    }

    .D-input-content {
      margin: 10px 0 0;
      resize: vertical;
      width: 100%;
      min-height: 100px;
      outline: none;
      font-family: inherit;
    }
  }

  .D-actions {
    margin: 10px 0 0;

    .D-actions-left {
      display: flex;
    }

    .D-actions-right {
      display: flex;
      align-items: center;

      .D-btn {
        margin-left: 4px;
      }

      .D-text-number {
        font-size: 12px;
        color: #999;
      }

      .D-text-number-illegal {
        color: red;
      }
    }
  }

  .D-actions,
  .D-emot-btn,
  .D-setting-btn,
  .D-refresh-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .D-setting-btn,
  .D-refresh-btn {
    width: 18px;
    cursor: pointer;
    margin-left: 6px;
  }

  .D-send {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* emot */
  .D-emot {
    top: 30px;
    width: 100%;
    margin-top: 10px;
    border: 1px solid var(--D-Low-Color);
    border-radius: 4px;
  }

  .D-emot-items {
    display: none;
    height: 180px;
    min-height: 100px;
    max-height: 200px;
    resize: vertical;
    padding: 10px;
    margin: 0;
    font-size: 0;
    overflow-x: hidden;
    user-select: none;
  }

  .D-emot-items-active {
    display: block;
  }

  .D-emot-item {
    list-style-type: none;
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
    font-size: 12px;
    line-height: 14px;
    margin: 0 10px 12px 0;
    cursor: pointer;
    transition: 0.3s;

    img {
      width: 32px;
      height: auto;
    }

    &:hover {
      background: var(--D-Low-Color);
      box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
  }

  .D-emot-packages {
    padding: 0;
    font-size: 0;
    border-top: solid 1px var(--D-Low-Color);

    span {
      display: inline-block;
      line-height: 30px;
      font-size: 14px;
      padding: 0 10px;
      cursor: pointer;

      :global(img) {
        width: 20px;
        position: relative;
        top: 5px;
      }

      &:nth-child(1) {
        border-radius: 0 0 0 3px;
      }
    }
  }

  .D-emot-package-active {
    background: var(--D-Low-Color);
  }

  /* preview */

  .D-preview {
    padding: 10px;
    overflow-x: auto;
    min-height: 1.375rem /* 22/16 */;
    margin: 10px 0;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  @media screen and (max-width: 500px) {
    .D-input {
      display: flex;
      flex-direction: column;
    }
    .D-input input {
      width: 100%;
    }
    .D-input input + input {
      margin-top: 4px;
      margin-left: 0;
    }
  }
</style>
