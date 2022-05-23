<script>
  import { onMount, afterUpdate } from 'svelte'
  import timeAgo from '../lib/timeAgo'
  import request from '../lib/request'
  import { options, msg, lazy } from '../lib/stores'
  import { translate } from '../i18n'
  import IconLoading from '../../../assets/svg/Loading.svg'
  import IconSearch from '../../../assets/svg/Search.svg'

  let D = $options

  const adminStr = 'admin.'
  const manageStr = 'manage.'
  const commentStr = 'comment.'
  const adminManageCommentStr = adminStr + manageStr + commentStr

  const searchStr = adminManageCommentStr + 'search.'
  const batchStr = adminManageCommentStr + 'batch.'
  const operateStr = 'operate'
  const defaultOperateType = 'default'

  const editStr = 'edit'

  // manage
  let search,
    checked, // 全选/反选
    checkedAll = [], // 被选中的
    operateType = defaultOperateType, // 操作类型
    searchType = 'all', // 搜索类型
    token = localStorage.DToken,
    url = D.serverURLs,
    keyword = '',
    pageNo = 1,
    pageSize = 0,
    status = 'current',
    comments = [],
    counts = 0,
    pageCount = 1,
    pages = [],
    stick = D.stick,
    isEdit = false,
    operate = translate(adminManageCommentStr + operateStr),
    searchSelect = translate(searchStr + 'options'),
    operateSelect = translate(batchStr + operateStr),
    optionsSelect = translate(adminManageCommentStr + 'options'),
    isSearch = false,
    isShowSearch = false

  onMount(() => {
    GetComment()
  })

  afterUpdate(() => {
    $lazy()
  })

  function CleanChecked() {
    // 清理已选中的评论
    checked = false
    checkedAll = []
  }

  function GeneratePages() {
    // 生成分页
    const tempPages = []
    for (let page = 1; page <= pageCount; page++) {
      const firstPage = Math.abs(pageNo - page) < 2 || page === 1 || page === pageCount

      const morePage = Math.abs(pageNo - page) < 3

      if (firstPage) tempPages.push({ class: 'D-pagination-page', page })
      else if (morePage) tempPages.push({ class: '', page: '...' })
    }

    pages = tempPages
  }

  async function GetComment() {
    try {
      CleanChecked()
      const options = {
        url: url,
        data: {
          type: 'GET_COMMENT_ADMIN',
          token: token,
          path: D.path,
          pageNo: pageNo,
          pageSize: pageSize,
          keyword: keyword,
          searchType: searchType,
          status: status
        }
      }

      const { data } = await request(options)
      pageSize = data.pageSize
      counts = data.counts
      pageCount = data.pageCount
      // 新增属性
      data.comments.forEach((item) => {
        item.isEdit = false
        item.editContent = item.content
        item.editNick = item.nick
        item.editMail = item.mail
        item.editSite = item.site
      })
      comments = data.comments

      GeneratePages()
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      $msg({ type: 'error', text: translate('commentsError') })
    }
  }

  function onCheckedAll() {
    // 全选/反选/单选/多选
    checked = !checked
    checkedAll = []
    if (checked) comments.forEach((item) => checkedAll.push(item.id))
    checkedAll = checkedAll
  }
  function onBatch() {
    // 选择默认直接结束当前方法
    if (operateType === defaultOperateType) return

    if (checkedAll.length < 1) return $msg({ time: 2000, text: translate(batchStr + operateStr + 'Msg') }) // 输出错误提示框

    onOperate(operateType)
  }
  /**
   * 操作评论信息
   * @param {String} type 操作类型
   * @param {String} id 操作的评论id
   * @param {String} comment 评论对象
   */
  async function onOperate(type, id, comment) {
    // 操作评论状态：置顶、取消置顶、通过、审核、垃圾、删除

    // 处理(显示)编辑评论框
    if (type === editStr) {
      comment.isEdit = true
      comments = comments
      return
    }
    if (type === 'stick') type = comment.stick ? 'unstick' : type

    let arr = []
    if (id) arr.push(id)
    else arr = checkedAll

    const options = {
      url: url,
      data: {
        type: 'OPERATE_COMMENT',
        token,
        exec: type,
        id: arr
      }
    }
    const result = await request(options)
    $msg({ text: result.msg, type: 'success' })
    await GetComment() // 重新获取评论
  }
  async function onEditSend(comment) {
    // 编辑完成后
    isEdit = true
    const options = {
      url: url,
      data: {
        type: 'OPERATE_COMMENT',
        token,
        exec: editStr,
        id: [comment.id],
        comment: {
          nick: comment.editNick,
          mail: comment.editMail,
          site: comment.editSite,
          content: comment.editContent
        }
      }
    }

    await request(options)
    await GetComment()
    isEdit = false
  }
  function onOpenSearch() {
    isShowSearch = true
    search.style.visibility = 'visible'
    search.focus()
  }
  async function onSearch() {
    isSearch = true
    await GetComment()
    isSearch = false
    isShowSearch = false
  }
  function onInputItem() {
    pageSize = onInputPagination(pageSize, 100)
  }
  function onInputPage() {
    pageNo = onInputPagination(pageNo, pageCount)
  }
  function onInputPagination(page, count) {
    const number = page.replace(/[^\d]/g, '')
    page = parseInt(number)
    if (page < 1 || isNaN(page)) page = ''
    if (page > count) page = count
    return page
  }
  // pageNo === PN    pageSize === PS
  function onChange(PN = true, PS = true) {
    // 失去焦点后获取评论
    pageNo = PN
    if (!PN) pageNo = 1
    if (!PS) pageSize = pageSize

    GetComment()
  }
</script>

<div class="D-manage">
  <div class="D-thead D-select-none">
    <div class="D-thead-item">
      <input type="checkbox" on:click={onCheckedAll} />
    </div>
    <div class="D-thead-item">
      <select class="D-select" bind:value={operateType} on:change={onBatch}>
        {#each Object.entries(operateSelect) as [key, item]}
          <option value={key}>{item}</option>
        {/each}
      </select>
    </div>
    <div class="D-thead-item">
      <select class="D-select" bind:value={status} on:change={GetComment}>
        {#each Object.entries(optionsSelect) as [key, item]}
          <option value={key}>{item}</option>
        {/each}
      </select>
    </div>
    <div class="D-thead-item">
      <span class="D-svg" on:click={onOpenSearch}><IconSearch /></span>
      <div class="D-search {isShowSearch ? 'D-zoom' : 'D-shrink'}">
        <div class="D-search-title">{translate(searchStr + 'title')}</div>
        <div class="D-search-input-wrap">
          <input
            bind:this={search}
            bind:value={keyword}
            class="D-search-input"
            type="text"
            placeholder={translate(searchStr + 'title')}
            on:keyup={(e) => (e.key || '').toLowerCase() === 'enter' && onSearch()}
          />
          <select class="D-select" bind:value={searchType}>
            {#each Object.entries(searchSelect) as [key, item]}
              <option value={key}>{item}</option>
            {/each}
          </select>
        </div>
        <div class="D-search-btn">
          <button class="D-btn D-btn-main" on:click={onSearch}>
            {#if isSearch}
              <IconLoading />
            {:else}
              {translate(searchStr + 'text')}
            {/if}
          </button>
          <button class="D-btn" on:click={() => (isShowSearch = false)}>{translate(searchStr + 'close')}</button>
        </div>
      </div>
      <div class="D-search-mask" style={isShowSearch && 'display:block'} on:click={() => (isShowSearch = false)} />
    </div>
  </div>
  <div class="D-tbody">
    {#each comments as comment}
      <div class="D-comment-list">
        <div class="D-comment-edit-wrap" style={!comment.isEdit && 'display:none'}>
          <div class="D-comment-edit-info">
            <input class="D-input" type="text" bind:value={comment.editNick} />
            <input class="D-input" type="email" bind:value={comment.editMail} />
            <input class="D-input" type="text" bind:value={comment.editSite} />
          </div>
          <div class="D-comment-edit-content">
            <textarea class="D-input D-textarea" bind:value={comment.editContent} />
            <div class="D-edit-action">
              <button class="D-btn" on:click={() => (comment.isEdit = false)}>{translate('cancel')}</button>
              <button class="D-btn D-btn-main" on:click={onEditSend(comment)} disabled={isEdit}>
                {#if isEdit}
                  <IconLoading />
                {:else}
                  {translate(adminManageCommentStr + 'save')}
                {/if}
              </button>
            </div>
          </div>
        </div>
        <div class="D-comment-body-wrap" style={comment.isEdit && 'display:none'}>
          <input type="checkbox" value={comment.id} bind:group={checkedAll} />
          <div class="D-comment-info">
            <div class="D-comment-author">
              <img class="D-avatar" src={D.imgLoading} d-src={comment.avatar} alt={comment.nick} />
              {#if comment.stick && !comment.pid}
                <span class="D-stick">{stick}</span>
              {/if}
              <a
                class="D-link D-ellipsis"
                href={comment.site ? comment.site : 'mailto:' + comment.mail}
                target="_blank"
              >
                <strong>{comment.nick}</strong>
              </a>
            </div>
            <div class="D-comment-desc">
              <a class="D-link D-ellipsis" href={'mailto:' + comment.mail} target="_blank">{comment.mail}</a>
              <div class="D-IP D-ellipsis">{comment.ip}</div>
            </div>
          </div>
          <div class="D-comment-body D-ellipsis">
            <div class="D-comment-font D-ellipsis">
              <span class="D-comment-time"
                >{translate(adminManageCommentStr + 'time')}:
                <span class="D-ellipsis">{timeAgo(comment.time)}</span>
              </span>
              <span class="D-comment-path"
                >{translate(adminManageCommentStr + 'path')}:
                <a class="D-link D-ellipsis" href={comment.path} target="_blank">{comment.path}</a>
              </span>
            </div>
            <div class="D-comment-content">{@html comment.content}</div>
            <div class="D-comment-operate D-comment-font">
              {#each Object.entries(operate) as [key, value]}
                {#if !comment.pid || key !== 'stick'}
                  <span class={'D-operate-' + key} on:click={onOperate(key, comment.id, comment)}>{value}</span>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="D-pagination D-select-none">
    <div class="D-pagination-state">
      <span class="D-pagination-text"
        >{translate(adminManageCommentStr + 'total')}<span class="D-comment-counts" v-text="counts" />{translate(
          adminManageCommentStr + 'bar'
        )}</span
      >
      <input
        type="text"
        class="D-pagination-input"
        bind:value={pageSize}
        on:input={onInputItem}
        on:change={onChange('', pageSize)}
      />
      <span class="D-pagination-text"
        >{translate(adminManageCommentStr + 'bar')}/{translate(adminManageCommentStr + 'page')}</span
      >
    </div>
    <div class="D-pagination-operate">
      <div class="D-pagination-pages">
        {#each pages as page}
          <span
            class="{page.class} {page.page === pageNo ? 'D-current' : ''}"
            on:click={page.class ? onChange(page.page) : ''}>{page.page}</span
          >
        {/each}
        <input
          type="text"
          class="D-pagination-input"
          bind:value={pageNo}
          on:input={onInputPage}
          on:change={onChange(pageNo)}
        />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  :global(.D-admin-container) :global(.D-main-container) .D-manage {
    padding: 1.25em /* 20/16 */;
    align-items: baseline;
  }

  .D-admin-container {
    .D-manage {
      input[type='checkbox'] {
        margin-right: 1.25em /* 20/16 */;
      }

      .D-thead {
        top: 0.8em;
        display: flex;
        width: inherit;
        position: absolute;

        &-item {
          display: flex;
          align-items: center;
        }

        &-item:nth-of-type(2) ~ .D-thead-item {
          margin-left: 1em;
        }
      }

      .D-search-svg {
        width: 1.6em;
        height: 1.6em;
      }
      .D-search-mask {
        display: none;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        position: fixed;
        backdrop-filter: blur(3px);
      }

      .D-search {
        top: 5rem;
        left: 50%;
        z-index: 2;
        width: 30em;
        min-width: 10em;
        padding: 2em;
        margin-left: -15em;
        position: fixed;
        visibility: hidden;
        text-align: center;
        border-radius: 10px;
        background: #1f1c2c;
      }
      .D-search-title {
        font-size: 1.2rem;
        line-height: 1;
      }
      .D-search-input-wrap {
        display: flex;

        .D-select {
          margin: 1.6em 0 1.6em 0.2em;
        }
      }
      .D-search-input {
        width: 100%;
        height: 1.875em /* 30/16 */;
        color: #fff;
        z-index: 10;
        margin: 1.6em 0;
        padding: 0 0.75em /* 12/16 */;
        background: transparent;
        border-radius: 0.375em;
        z-index: 99;
        border: 1px solid #33323e;

        &:hover {
          border-color: #6c6b7b;
        }

        &:focus {
          border-color: var(--D-main-Color);
        }
      }

      .D-search-btn {
        display: flex;
        flex-direction: column;

        .D-btn {
          width: 100%;
          margin: 0.4em 0;
        }
      }

      .D-select {
        cursor: pointer;
        min-width: 4em /* 60/16 */;
        background: transparent;
        color: #fff;
        border: 1px solid #33323e;
        border-radius: 5px;

        option {
          color: #fff;
          background: #181622;
        }
      }

      .D-tbody,
      .D-comment-author,
      .D-comment-info {
        display: flex;
      }
      .D-tbody {
        flex: 1;
        min-width: 43.75em /* 700/16 */;
        min-width: 30em /* 700/16 */;
        margin: 1.25em /* 20/16 */ 0;
        width: inherit;
        align-items: center;
      }

      .D-tbody {
        flex-direction: column;
        overflow-y: auto;
      }

      .D-comment-list {
        padding: 1.25em /* 20/16 */ 0;
        width: inherit;
        border-bottom: solid 1px #33323e;
      }

      .D-comment-content {
        margin: 1em 0;
        white-space: pre-wrap;
      }

      .D-comment-edit-wrap {
        display: flex;
        flex: 1;

        .D-input {
          width: 100%;
          height: 2.25em /* 36/16 */;
          color: #fff;
          font-size: 1em /* 16/16 */;
          z-index: 10;
          padding: 0 0.75em /* 12/16 */;
          margin-top: 0.5em /* 8/16 */;
          background: transparent;
          border-radius: 0.375em;
          border: 1px solid #33323e;
        }
        .D-textarea {
          min-height: 5.625em /* 90/16 */;
          padding: 0.2em;
          resize: vertical;
        }

        .D-comment-edit-info {
          flex: 1;
          min-width: 12.5em /* 200/16 */;
          margin-right: 1.25em /* 20/16 */;
        }

        .D-comment-edit-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .D-edit-action {
          display: flex;
          margin-top: 0.625em /* 10/16 */;

          .D-btn + .D-btn {
            margin-left: 0.6em;
          }
        }
      }

      .D-comment-body-wrap {
        // align-items: center;
        display: flex;
      }

      .D-comment-info {
        min-width: 12.5em /* 200/16 */;
        max-width: 12.5em;
        flex-grow: 1;
        flex-direction: column;
        align-items: unset;
      }

      .D-avatar {
        width: 1.875em /* 30/16 */;
        height: 1.875em;
        margin-right: 10px;
        border-radius: 50%;
      }

      .D-stick {
        color: var(--D-stick-Color);
        min-width: 2.8em;
        height: 1.8em;
        margin-right: 5px;
        font-size: 0.8em;
        text-align: center;
        font-weight: 400;
        background: 0 0;
        border: 1px solid var(--D-stick-Color);
        border-radius: 3px;
      }

      .D-comment-desc {
        line-height: 1.5;
        display: flex;
        flex-direction: column;
      }

      .D-comment-body {
        flex-grow: 3;
        position: relative;
        word-break: break-all;
      }

      .D-comment-font {
        font-size: 0.75em /* 12/16 */;
      }

      .D-comment-path {
        margin-left: 0.5em /* 8/16 */;
      }

      .D-comment-operate {
        display: flex;

        span {
          cursor: pointer;
          margin-right: 0.5em /* 8/16 */;
        }

        .D-operate-stick {
          color: var(--D-stick-Color);
        }
        .D-operate-accept {
          color: #1fff52;
        }
        .D-operate-audit {
          color: #21e1ff;
        }
        .D-operate-spam {
          color: #ffb342;
        }
        .D-operate-edit {
          color: #2bb7ff;
        }
        .D-operate-delete {
          color: #ff5050;
        }
      }

      .D-pagination {
        left: 0;
        bottom: 0.8em;
        line-height: 1;
        width: inherit;
        position: absolute;
        padding: 0 1.25em;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .D-pagination-input {
        width: 2.5em /* 40/16 */;
        height: 1.125em /* 18/16 */;
        color: #fff;
        font-size: 1em /* 16/16 */;
        z-index: 10;
        text-align: center;
        margin: 0 0.5em /* 8/16 */;
        background: transparent;
        border-radius: 0.375em;
        border: 1px solid #33323e;
      }

      .D-current {
        background: #00c4b6;
      }

      .D-pagination-page {
        padding: 0 0.4em;
        margin: 0 0.2em;
        cursor: pointer;
        text-align: center;
      }

      .D-comment-counts {
        margin: 0 2px;
        font-size: 1.4em;
        font-weight: 600;
      }
    }
  }
  @media (min-width: 768px) {
    .D-admin-container .D-manage {
      .D-comment-operate {
        visibility: hidden;
      }
      .D-comment-list:hover .D-comment-operate {
        visibility: visible;
      }
    }
  }
  @media (max-width: 768px) {
    .D-admin-container {
      .D-manage {
        .D-search {
          width: 20em;
          margin-left: -10em;
        }

        .D-pagination {
          position: absolute;
          bottom: 0.8em /* 26/16 */;
          left: 0;
          padding: 0 10px;
        }
      }
    }
  }
</style>
