<script>
  import { options, msg } from '../lib/stores'
  import global from './global.svelte'
  import { translate } from '../i18n'
  import Submit from './submit.svelte'
  import Comments from './comments.svelte'
  import Footer from './footer.svelte'
  import IconLoading from '../../../assets/svg/Loading.svg'

  import loadScript from '../lib/import'

  let isLoading = true
  let isRefreshComments = true
  let app

  function initAdmin() {
    app = window.DiscussAdmin.init({ ...$options, el: '.D-admin-wrap', show: true })
  }

  function onSetting() {
    if (window.DiscussAdmin) {
      initAdmin()
    } else {
      $msg({ text: translate('settingMsg') })
      loadScript('admin', initAdmin)
    }
    if (app) {
      for (const fun of app.$$.ctx) {
        if (typeof fun === 'function' && fun.name === 'onOpenAndClose') fun()
      }
    }
  }

  function onRefresh() {
    $msg({ time: 1500, text: translate('refreshMsg') })
    isLoading = !isLoading
    isRefreshComments = true
    setTimeout(() => {
      isLoading = !isLoading
    }, 1000)
  }

  function onComments() {
    isRefreshComments = false
  }
</script>

<svelte:component this={global} />
<div id="Discuss" class="Discuss">
  <div class="D-admin-wrap" />
  <Submit on:onRefresh={onRefresh} on:onSetting={onSetting} />
  {#if isLoading}
    <Comments on:onComments={onComments} />
  {/if}
  <div class="D-loading-comments" style={isRefreshComments ? '' : 'display:none'}>
    <IconLoading />
  </div>
  <Footer />
</div>
