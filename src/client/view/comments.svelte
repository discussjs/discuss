<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'
  import { options, msg, lazy } from '../lib/stores'
  import Comment from './comment.svelte'
  import request from '../lib/request'
  import { translate } from '../i18n'

  import Loading from '../../../assets/svg/Loading.svg'

  let D = $options
  const dispatch = createEventDispatcher()

  export let comment = []

  // svelte 变量
  let moerDisabled = false,
    comments = [],
    counts = 0,
    pageNo = 1,
    pageCount = 1,
    showMore = false,
    loading = false,
    replying = ''

  // 相当于vue中的watch
  $: {
    comments = [...comment, ...comments]
  }

  onMount(() => {
    GetComment()
  })
  afterUpdate(() => {
    $lazy()
  })

  async function GetComment() {
    try {
      const { data } = await request({
        url: D.serverURLs,
        data: { type: 'GET_COMMENT', path: D.path, pageNo }
      })

      counts = data.counts
      pageCount = data.pageCount
      comments = [...comments, ...data.comments]

      D.wordNumber = data.wordNumber
      D.MetasChange()
      dispatch('onComments')
    } catch (error) {
      // eslint-disable-next-line
      console.error('Request failed', error)
      $msg({ type: 'error', time: 1500, text: translate('commentsError') })
    }

    // 页码大于当前页显示‘更多评论’按钮
    showMore = pageCount > pageNo ? true : false
  }

  async function onMoreComment() {
    moerDisabled = true
    loading = true

    if (pageNo < pageCount) {
      pageNo++
      await GetComment()
      moerDisabled = false
      loading = false
    }
  }

  function submitComment(event) {
    for (const item of comments) {
      if (item.id === event.detail.pid) {
        item.replys = [...event.detail.comment, ...(item.replys || [])]
        break
      }
    }
    // 由于这是Svelte的特性，引用类型需要重新给自身赋值才会触发双向绑定
    comments = comments
  }
</script>

<div class="D-comments-wrap">
  <div class="D-comments-headers">
    {#if counts}
      <div class="D-comments-count">{counts} {translate('comment')}</div>
    {/if}
  </div>
  <div class="D-comments-list">
    <Comment {comments} {replying} on:onReply={({ detail }) => (replying = detail)} on:submitComment={submitComment} />
  </div>
  {#if showMore}
    <div class="D-more">
      <button class="D-more-button" disabled={moerDisabled} on:click={onMoreComment}
        >{#if loading}
          <Loading />
        {:else}
          {translate('more')}
        {/if}
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .D-comments-headers {
    display: flex;
    justify-content: space-between;
  }
  .D-more {
    display: flex;
    justify-content: center;
    margin: 16px 0 10px;

    &-button {
      opacity: 0.8;
      width: auto;
      min-width: 80px;
      height: 36px;
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      line-height: 20px;
      font-weight: 600;
      font-size: 12px;
      border-radius: 12px;
      background-color: var(--D-main-Color);
    }
  }
</style>
