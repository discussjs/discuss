<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { options, msg } from '../lib/stores'
  import { translate } from '../i18n'
  import request from '../lib/request'
  import Logo from '../../../assets/svg/Logo.svg'
  import Loading from '../../../assets/svg/Loading.svg'

  let D = $options
  const dispatch = createEventDispatcher()

  const adminLoginStr = 'admin.login.'
  let isToken = false,
    isNull = true,
    sending
  let token = localStorage.DToken || ''

  let inputs = [
    {
      type: 'text',
      model: '',
      ph: translate(adminLoginStr + 'username')
    },
    {
      type: 'password',
      model: '',
      ph: translate(adminLoginStr + 'password')
    }
  ]
  onMount(() => {
    AutoLogin()
  })

  function onInput() {
    if (inputs[0].model && inputs[1].model) isNull = false
    else isNull = true
  }
  function onLogin() {
    send()
  }
  function onLoginKeyup(event) {
    const key = event.key || ''
    const isEnter = key.toLowerCase() === 'enter'
    if (isEnter && !isNull) send()
  }
  function AutoLogin() {
    if (!token) return
    isToken = true
    sending = true
    send()
    $msg({ time: 2000, text: translate(adminLoginStr + 'msg') })
  }
  // eslint-disable-next-line max-statements
  async function send() {
    try {
      sending = true
      const params = {
        url: D.serverURLs,
        data: { type: 'LOGIN' }
      }
      params.data.token = token
      if (!isNull) {
        params.data.username = inputs[0].model
        params.data.password = inputs[1].model
      }

      // 登录验证
      const { data, msg } = await request(params)
      if (!data) throw new Error(msg)
      // 登录成功，跳转评论管理页面
      localStorage.DToken = data.token
      dispatch('loginS' /* loginSuccess */)
    } catch (error) {
      token = ''
      localStorage.DToken = ''
      // eslint-disable-next-line
      console.error(error)
      $msg({ type: 'error', text: translate(adminLoginStr + 'loginError') })
    } finally {
      sending = false
      isToken = false
    }
  }
</script>

<div class="D-login-warp">
  <!-- 自动登录时触发 -->
  <div class="D-login-waitng" style={sending ? '' : 'display:none'}><Loading /></div>
  <!-- 手动登录时触发 -->
  <div class="D-login-container {isToken ? 'D-zoom' : ''}" style={isToken ? 'display:none' : ''}>
    <div class="D-login">
      <div class="D-login-logo"><Logo /></div>
      <div class="D-login-main">
        {#each inputs as i}
          <input
            class="D-input"
            placeholder={i.ph}
            bind:value={i.model}
            on:input={(e) => (e.target.type = i.type)}
            on:input={onInput}
            on:keyup={onLoginKeyup}
          />
        {/each}
        <button
          class="D-btn D-btn-main D-btn-login {(isNull || sending) && 'D-disabled-click D-disabled'}"
          disabled={isNull || sending}
          on:click={onLogin}
          >{#if sending}
            <Loading />
          {:else}
            {translate(adminLoginStr + 'login')}
          {/if}
        </button>
        <button class="D-btn D-btn-login" on:click={() => dispatch('onClose')}
          >{translate(adminLoginStr + 'close')}</button
        >
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .D-login-warp {
    position: fixed;
    z-index: 40;
    inset: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;

    .D-login-waitng {
      width: 3em;
    }

    .D-login-container {
      width: 100%;
      max-width: 360px;
      position: fixed;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #1b1828;
      border-radius: 0.75rem;
    }

    .D-login {
      width: 100%;
      padding: 2em;
    }

    .D-login-logo {
      padding: 2.2em 0;
      display: flex;
      justify-content: center;
    }

    .D-btn-login {
      width: 100%;
      height: 2.2em;
      margin-top: 1em;
    }
  }
</style>
