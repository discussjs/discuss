<script>
  import { onMount } from 'svelte'
  import { openMenu, showSetting } from '../lib/stores'
  import { translate } from '../i18n'
  import zIndex from '../lib/zIndex'
  import global from './global.svelte'
  import Login from './adminLogin.svelte'
  import Comment from './adminComment.svelte'
  import Config from './adminConfig.svelte'

  import IconLogo from '../../../assets/svg/Logo.svg'
  import IconMenu from '../../../assets/svg/Menu.svg'
  import IconRefresh from '../../../assets/svg/Refresh.svg'
  import IconComment from '../../../assets/svg/Comment.svg'
  import IconConfig from '../../../assets/svg/Config.svg'
  import IconExit from '../../../assets/svg/Exit.svg'
  import IconClose from '../../../assets/svg/Close.svg'

  export let show

  const manageStr = 'admin.'
  const commentManageStr = manageStr + 'manage'

  let isLogin,
    title,
    tab,
    isRefresh = true,
    comment = 'comment',
    adminDOM

  onMount(() => {
    if (!document.querySelector('#Discuss')) {
      const creatEle = document.createElement('div')
      creatEle.id = 'Discuss'
      creatEle.className = 'Discuss'
      adminDOM.parentNode.insertBefore(creatEle, adminDOM)
      creatEle.appendChild(adminDOM)
    }
    onActiveTab()
  })

  function onRefresh() {
    isRefresh = false
    setTimeout(() => {
      isRefresh = true
    }, 1000)
  }
  function onActiveTab(key) {
    tab = key || comment
    title = translate(commentManageStr + '.' + tab + '.text')
  }
  function onExit() {
    isLogin = false
    $showSetting = false
    localStorage.DToken = ''
  }
  // 为什么这样写？
  // 因为打包后评论区无法确定识别该方法(方法名会被缩小为一个字母，导致评论区无法调用)
  const onOpenAndClose = {}
  onOpenAndClose.onOpenAdmin = function (flag) {
    zIndex(flag)
    $showSetting = !$showSetting
  }
</script>

<svelte:component this={global} />
<div class="D-admin-container" bind:this={adminDOM} style={!$showSetting ? 'display:none' : ''}>
  {#if !isLogin}
    <Login on:onClose={onOpenAndClose.onOpenAdmin} on:loginS={() => (isLogin = true)} />
  {/if}
  {#if isLogin}
    <div class="D-admin" style={!$showSetting ? 'display:none' : ''}>
      <header class="D-header D-select-none">
        <div class="logo"><IconLogo /></div>
        <nav>
          <span class="D-menu" style={tab !== 'config' ? 'display:none' : ''} on:click={() => ($openMenu = true)}
            ><IconMenu /></span
          >
          <span class="D-refresh" on:click={onRefresh}><IconRefresh /></span>
          <span class="D-comment" on:click={() => onActiveTab('comment')}><IconComment /></span>
          <span class="D-config" on:click={() => onActiveTab('config')}><IconConfig /></span>
          {#if show}
            <!-- 是否显示关闭以及退出登录，主要区分页面评论区评论管理与以及评论管理独立初始化 -->
            <span class="D-exit" on:click={onExit}><IconExit /></span>
            <span class="D-close" on:click={onOpenAndClose.onOpenAdmin('close')}><IconClose /></span>
          {/if}
        </nav>
      </header>

      <h1 class="D-title">{title}</h1>
      {#if isRefresh}
        <div class="D-main-container">
          {#if tab === 'comment'}
            <Comment />
          {:else if tab === 'config'}
            <Config />
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .D-admin-container {
    top: 0;
    right: 0;
    color: #fff;
    width: 100%;
    height: 100%;
    padding: 0 1.25em;
    font-size: 20px /* 16/16 */;
    z-index: 999999;
    position: fixed;
    background: #13111c;

    :global(*) {
      font-size: 0.95em;
    }

    :global(.D-input) {
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

    .D-admin {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 100%;
      height: inherit;
      margin: auto;
      max-width: 72.5em /* 1160/16 */;
    }

    .D-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 3.75em /* 60/16 */;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    nav {
      margin-right: 1em;
      display: flex;
      color: #878593;
      font-weight: 600;
      font-size: 0.875em /* 14/16 */;
      align-items: center;

      span {
        cursor: pointer;
      }

      span + span {
        margin-left: 1.25em /* 20/16 */;
      }
    }
    .D-menu {
      display: none;
    }

    .D-title {
      margin: 0;
      font-size: 1.2em /* 30/16 */;
      line-height: 1;
      font-weight: 700;
      padding: 0 0 1.2em;
    }

    :global(.D-manage),
    :global(.D-main) {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: inherit;
      background-color: #181622;
      border: solid 1px #33323e;
      border-radius: 0.625em /* 10/16 */;
      overflow-y: hidden;
    }

    .D-main-container {
      position: relative;
      display: flex;
      height: inherit;
      overflow: hidden;
      margin-bottom: 1em;
    }

    :global(.D-manage) {
      margin: 0;
    }

    :global(::-webkit-scrollbar) {
      display: none;
    }

    :global(::-webkit-scrollbar-thumb) {
      background: #33323e;
      border-radius: 5px;
    }

    :global(::-webkit-scrollbar-track) {
      background: #13111c;
    }
  }

  @media (max-width: 768px) {
    .D-admin-container {
      padding: 0 0.4em;

      .D-menu {
        display: block;
      }
    }
  }
</style>
