<script>
  import { options, msg } from '../lib/stores'
  import global from './global.svelte'
  import { translate } from '../i18n'
  import Submit from './submit.svelte'
  import Comments from './comments.svelte'
  import Footer from './footer.svelte'
  import IconLoading from '../../../assets/svg/Loading.svg'
  import zIndex from '../lib/zIndex'
  import loadScript from '../lib/import'

  let isLoading = true
  let isRefreshComments = true
  let isNotComments = false
  let comment = []
  let app, wordLimit

  function initAdmin() {
    zIndex('open')
    app = window.discussAdmin.init({ ...$options, el: '.D-admin-wrap', show: true })
  }

  function onSetting() {
    if (window.discussAdmin) {
      initAdmin()
    } else {
      $msg({ text: translate('settingMsg') })
      loadScript('admin', initAdmin)
    }
    // 此处用于再次打开评论管理面板
    if (app) {
      for (const fun of app.$$.ctx) {
        if (Object.prototype.toString.call(fun) === '[object Object]' && typeof fun.onOpenAdmin === 'function') {
          fun.onOpenAdmin('open')
        }
      }
    }
  }

  function onRefresh() {
    $msg({ time: 1500, text: translate('refreshMsg') })
    isLoading = !isLoading
    isRefreshComments = true
    // 当刷新评论时，清空当前组件的评论缓存
    comment = []
    setTimeout(() => {
      isLoading = !isLoading
    }, 1000)
  }

  function onComment({ detail }) {
    if (!detail) isNotComments = true
    isRefreshComments = false
  }

  function onCommentError() {
    onComment({})
  }

  function wordLimitFn({ detail }) {
    wordLimit = detail
  }

  function submitComment(event) {
    comment = event.detail.comment
  }
</script>

<svelte:component this={global} />
<div id="Discuss" class="Discuss">
  <div class="D-admin-wrap" />
  <Submit on:onRefresh={onRefresh} on:onSetting={onSetting} on:submitComment={submitComment} {wordLimit} />
  {#if isLoading}
    <Comments on:onComment={onComment} on:wordLimit={wordLimitFn} on:onCommentError={onCommentError} {comment} />
  {/if}
  <div class="D-loading-comments" style={isRefreshComments || isNotComments ? '' : 'margin:0'}>
    {#if isRefreshComments}
      <IconLoading />
    {:else if isNotComments}
      {translate('notComments')}
    {/if}
  </div>
  <Footer />
</div>
