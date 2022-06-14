<script>
  import { onMount } from 'svelte'
  import { options, openMenu, msg } from '../lib/stores'
  import request from '../lib/request'
  import IconLoading from '../../../assets/svg/Loading.svg'
  import IconClose from '../../../assets/svg/Close.svg'

  import IconBasic from '../../../assets/svg/Basic.svg'
  import IconComment from '../../../assets/svg/Comment.svg'
  import IconMail from '../../../assets/svg/Mail.svg'
  import IconPassword from '../../../assets/svg/Password.svg'

  import { translate } from '../i18n'

  // 用于翻译(处理translate重复字段，减少打包容量)
  const adminStr = 'admin.'
  const configStr = 'config.'
  const manageStr = 'manage.'
  const adminManageConfigStr = adminStr + manageStr + configStr
  const settingStr = adminManageConfigStr + 'settings.'
  const basicStr = settingStr + 'basic.'
  const commentHandleStr = settingStr + 'commentHandle.'
  const mailStr = settingStr + 'mail.'
  const passwordStr = settingStr + 'password.'

  const title = '.title'
  const desc = '.desc'
  const ph = '.ph'

  let D = $options

  let token = localStorage.DToken,
    url = D.serverURLs,
    group = '',
    config = {},
    isSave = false,
    save = translate(adminManageConfigStr + 'save'),
    settings = [
      {
        name: translate(basicStr + 'name'),
        icon: IconBasic,
        items: [
          {
            key: 'username',
            title: translate(basicStr + 'user' + title),
            desc: translate(basicStr + 'user' + desc),
            ph: translate(basicStr + 'user' + ph)
          },
          {
            key: 'mail',
            title: translate(basicStr + 'mail' + title),
            desc: translate(basicStr + 'mail' + desc),
            ph: translate(basicStr + 'mail' + ph)
          },
          {
            key: 'domain',
            title: translate(basicStr + 'domain' + title),
            desc: translate(basicStr + 'domain' + desc),
            ph: translate(basicStr + 'domain' + ph)
          },
          {
            key: 'requestHeaders',
            title: translate(basicStr + 'headers' + title),
            desc: translate(basicStr + 'headers' + desc),
            ph: translate(basicStr + 'headers' + ph)
          }
        ]
      },
      {
        name: translate(commentHandleStr + 'name'),
        icon: IconComment,
        items: [
          {
            key: 'commentCount',
            title: translate(commentHandleStr + 'count' + title),
            desc: translate(commentHandleStr + 'count' + desc),
            ph: translate(commentHandleStr + 'count' + ph)
          },
          {
            key: 'wordNumber',
            title: translate(commentHandleStr + 'word' + title),
            desc: translate(commentHandleStr + 'word' + desc),
            ph: translate(commentHandleStr + 'word' + ph)
          },
          {
            key: 'limit',
            title: translate(commentHandleStr + 'limit' + title),
            desc: translate(commentHandleStr + 'limit' + desc),
            ph: translate(commentHandleStr + 'limit' + ph)
          },
          {
            key: 'limitAll',
            title: translate(commentHandleStr + 'limitAll' + title),
            desc: translate(commentHandleStr + 'limitAll' + desc),
            ph: translate(commentHandleStr + 'limitAll' + ph)
          },
          {
            key: 'avatarCdn',
            title: translate(commentHandleStr + 'cdn' + title),
            desc: translate(commentHandleStr + 'cdn' + desc),
            ph: translate(commentHandleStr + 'cdn' + ph)
          },
          {
            key: 'akismet',
            title: translate(commentHandleStr + 'akismet' + title),
            desc: translate(commentHandleStr + 'akismet' + desc),
            ph: translate(commentHandleStr + 'akismet' + ph)
          }
        ]
      },
      {
        name: translate(mailStr + 'name'),
        icon: IconMail,
        items: [
          {
            key: 'siteUrl',
            title: translate(mailStr + 'site' + title),
            desc: translate(mailStr + 'site' + desc),
            ph: translate(mailStr + 'site' + ph)
          },
          {
            key: 'serverURLs',
            title: translate(mailStr + 'server' + title),
            desc: translate(mailStr + 'server' + desc),
            ph: translate(mailStr + 'server' + ph)
          },
          {
            key: 'mailHost',
            title: translate(mailStr + 'host' + title),
            desc: translate(mailStr + 'host' + desc),
            ph: translate(mailStr + 'host' + ph)
          },
          {
            key: 'mailPort',
            title: translate(mailStr + 'port' + title),
            desc: translate(mailStr + 'port' + desc),
            ph: translate(mailStr + 'port' + ph)
          },
          {
            key: 'mailFrom',
            title: translate(mailStr + 'from' + title),
            desc: translate(mailStr + 'from' + desc),
            ph: translate(mailStr + 'from' + ph)
          },
          {
            key: 'mailAccept',
            title: translate(mailStr + 'accept' + title),
            desc: translate(mailStr + 'accept' + desc)
          },
          {
            key: 'masterSubject',
            title: translate(mailStr + 'Msubject' + title),
            desc: translate(mailStr + 'Msubject' + desc),
            ph: translate(mailStr + 'Msubject' + ph)
          },
          {
            key: 'replySubject',
            title: translate(mailStr + 'Rsubject' + title),
            desc: translate(mailStr + 'Rsubject' + desc),
            ph: translate(mailStr + 'Rsubject' + ph)
          },
          {
            key: 'masterTemplate',
            title: translate(mailStr + 'Mtemplate' + title),
            desc: translate(mailStr + 'Mtemplate' + desc)
          },
          {
            key: 'replyTemplate',
            title: translate(mailStr + 'Rtemplate' + title),
            desc: translate(mailStr + 'Rtemplate' + desc)
          }
        ]
      },
      {
        name: translate(passwordStr + 'name'),
        icon: IconPassword,
        items: [
          {
            key: 'password',
            title: translate(passwordStr + 'pwd')
          },
          {
            key: 'confirm_password',
            title: translate(passwordStr + 'cfm')
          }
        ]
      }
    ]

  onMount(() => {
    group = settings[0].name
    $msg({ time: 2000, text: translate(adminManageConfigStr + 'msg') })
    GetConfig()
  })
  async function GetConfig() {
    try {
      const options = {
        url,
        data: { type: 'GET_CONFIG', token }
      }
      const result = await request(options)
      if (!result.data) return $msg({ text: result.msg, type: 'error' })
      config = result.data
      InitConfig()
      // 由于这是Svelte的特性，引用类型需要重新给自身赋值才会触发双向绑定
      settings = settings
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      $msg({ text: error, type: 'error' })
    }
  }
  async function SaveConfig() {
    // 防抖
    if (isSave) return

    ForConfig((item) => (config[item.key] = item.value))

    if (config.password !== config.confirm_password) {
      // eslint-disable-next-line
      $msg({ type: 'error', text: translate(adminManageConfigStr + 'passwordError') })
      return
    }

    isSave = true

    const options = {
      url,
      data: {
        type: 'SAVE_CONFIG',
        token,
        data: config
      }
    }

    const result = await request(options)
    isSave = false
    $msg({ type: 'success', text: result.msg })
  }
  function InitConfig() {
    ForConfig((item) => (item.value = config[item.key]))
  }
  function ForConfig(fn) {
    for (const setting of settings) {
      for (const item of setting.items) fn(item)
    }
  }
</script>

<aside class="D-sidebar D-select-none {$openMenu && 'D-sidebar-open'}">
  {#each settings as setting}
    <span class="D-group {group === setting.name ? 'D-selected-group' : ''}" on:click={() => (group = setting.name)}>
      <span class="D-group-item-icon"><svelte:component this={setting.icon} /></span>
      <span class="D-group-item-title">{setting.name}</span>
    </span>
  {/each}
  <span class="D-menu-close" on:click={() => ($openMenu = false)}><IconClose /></span>
</aside>
<main class="D-main">
  <section class="D-section">
    {#each settings as setting}
      {#each setting.items as item}
        <div class="D-config-group" style={group !== setting.name ? 'display:none' : ''}>
          <div class="D-config-group-title">{item.title}</div>
          <div class="D-config-group-desc">{item.desc || ''}</div>
          <input class="D-config-group-input" type="text" placeholder={item.ph} bind:value={item.value} />
        </div>
      {/each}
    {/each}
    <button class="D-save D-btn D-btn-main" on:click={SaveConfig}>
      {#if isSave}
        <IconLoading />
      {:else}
        {save}
      {/if}
    </button>
  </section>
</main>

<style lang="scss">
  :global(.D-main-container) {
    .D-sidebar {
      z-index: 1;
      padding: 32px 0;
      width: 220px;
      height: inherit;
      overflow-y: auto;

      .D-group {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        color: #878593;
        margin-bottom: 0.5rem;

        &:hover :global(svg) {
          animation: D-touchStir 0.3s;
        }
      }

      .D-group:hover {
        color: #fff;
        cursor: pointer;
        background: #211f2d;
      }
      .D-selected-group {
        color: #fff;
        background: #211f2d;
      }

      .D-group-item-icon {
        color: currentcolor;
        width: 18px;
        height: 18px;
        min-width: 18px;
        min-height: 18px;
        display: flex;
        align-items: center;
      }

      .D-group-item-title {
        margin-left: 16px;
        line-height: 1.5;
      }
    }

    .D-main {
      margin-left: 1.875em /* 30/16 */;
    }

    .D-section {
      display: flex;
      flex: 1;
      padding: 20px;
      width: inherit;
      overflow-y: auto;
      flex-direction: column;

      .D-config-group {
        margin-bottom: 16px;
      }

      .D-config-group-title {
        font-weight: bold;
      }

      .D-config-group-desc {
        font-size: 14px;
        line-height: 21px;
        color: #a1a0ab;
        margin-top: 6px;
      }

      .D-config-group-input {
        width: 100%;
        height: 42px;
        color: #fff;
        font-size: 16px;
        z-index: 10;
        padding: 0 12px;
        margin-top: 8px;
        background: transparent;
        border-radius: 0.375rem;
        border: 1px solid #33323e;

        &:hover {
          border-color: #6c6b7b;
        }

        &:focus {
          border-color: var(--D-main-Color);
        }
      }

      .D-save {
        font-size: 1em;
        min-height: 40px;
        margin: 0;
      }
    }
    .D-menu-close {
      display: none;
    }
  }

  @media (max-width: 768px) {
    :global(.D-main-container) {
      .D-sidebar {
        top: 0;
        right: -100%;
        position: fixed;
        width: 100%;
        height: 100%;
        visibility: hidden;
        overflow: hidden auto;
        background: #13111c;
        transition: all 0.5s;
      }

      .D-group {
        display: flex;
        justify-content: center;
      }

      .D-sidebar-open {
        visibility: visible;
        transform: translate3d(-100%, 0, 0);
      }

      .D-menu-close {
        top: 0;
        right: 10px;
        margin: 8px;
        color: #878593;
        display: block;
        position: absolute;
        &:hover {
          cursor: pointer;
        }
      }

      .D-main {
        margin: 0 /* 30/16 */;
      }
    }
  }

  // 动画
  @keyframes D-touchStir {
    0% {
      transform: rotate(10deg);
    }
    25% {
      transform: rotate(20deg);
    }
    50% {
      transform: rotate(30deg);
    }
    75% {
      transform: rotate(20deg);
    }
    100% {
      transform: rotate(10deg);
    }
  }
</style>
