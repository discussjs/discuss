<template>
  <aside class="D-sidebar D-select-none" :class="{ 'D-sidebar-open': open }">
    <span
      class="D-group"
      :class="{ 'D-selected-group': group === setting.name }"
      v-for="setting in settings"
      :key="setting.name"
      @click=";(group = setting.name), onClose()"
    >
      <span class="D-group-item-icon" v-html="setting.icon"></span>
      <span class="D-group-item-title" v-text="setting.name"></span>
    </span>
    <span
      class="D-menu-close"
      v-show="open"
      v-html="iconClose"
      @click="onClose"
    ></span>
  </aside>
  <main class="D-main">
    <section class="D-section">
      <template v-for="setting in settings" :key="setting.name">
        <template v-for="item in setting.items" :key="item.key">
          <div class="D-config-group" v-show="group === setting.name">
            <div class="D-config-group-title" v-text="item.title"></div>
            <div class="D-config-group-desc" v-text="item.desc"></div>
            <input
              class="D-config-group-input"
              type="text"
              :placeholder="item.ph"
              v-model="item.value"
            />
          </div>
        </template>
      </template>
      <button
        class="D-save D-btn D-btn-main"
        @click="SaveConfig"
        v-html="isSave ? iconLoading : save"
      ></button>
    </section>
  </main>
</template>

<script>
import iconLoading from '../../../assets/svg/Loading.svg'
import iconClose from '../../../assets/svg/Close.svg'

import iconBasic from '../../../assets/svg/Basic.svg'
import iconComment from '../../../assets/svg/Comment.svg'
import iconMail from '../../../assets/svg/Mail.svg'
import iconPassword from '../../../assets/svg/Password.svg'

import { translate } from '../i18n/language'

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

export default {
  components: {},
  props: { open: Boolean },
  emits: ['onClose'],
  data() {
    return {
      iconClose,
      iconLoading,
      // config
      token: localStorage.DToken,
      url: this.$D.serverURLs,
      group: '',
      config: {},

      isSave: false,

      save: translate(adminManageConfigStr + 'save'),
      settings: [
        {
          name: translate(basicStr + 'name'),
          icon: iconBasic,
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
          icon: iconComment,
          items: [
            {
              key: 'comment',
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
          icon: iconMail,
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
          icon: iconPassword,
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
    }
  },
  mounted() {
    this.group = this.settings[0].name
    this.$dialog(translate(adminManageConfigStr + 'msg'), 2000)
    this.GetConfig()
  },
  methods: {
    onClose() {
      this.$emit('onClose', false)
    },
    async GetConfig() {
      try {
        const options = {
          url: this.url,
          data: { type: 'GET_CONFIG', token: this.token }
        }
        const { data, msg } = await this.$ajax(options)
        if (!data) this.$dialog(msg)
        if (data) {
          this.config = data
          this.InitConfig()
        }
      } catch (error) {
        console.error(error)
        this.$dialog(translate(adminManageConfigStr + 'error'), 2000)
      }
    },
    async SaveConfig() {
      // 防抖
      if (this.isSave) return

      this.ForConfig((item) => (this.config[item.key] = item.value))

      if (this.config.password !== this.config.confirm_password) {
        this.$dialog(translate(adminManageConfigStr + 'passwordError'))
        return
      }

      this.isSave = true

      const options = {
        url: this.url,
        data: {
          type: 'SAVE_CONFIG',
          token: this.token,
          data: this.config
        }
      }

      const { msg } = await this.$ajax(options)
      this.isSave = false
      this.$dialog(msg)
    },
    InitConfig() {
      this.ForConfig((item) => {
        item.value = this.config[item.key]
      })
    },
    ForConfig(fn) {
      for (const setting of this.settings) {
        for (const item of setting.items) fn(item)
      }
    }
  }
}
</script>

<style lang="scss">
.D-main-container {
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

      &:hover svg {
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
}

@media (max-width: 768px) {
  .D-main-container {
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
      position: absolute;
      top: 0;
      right: 10px;
      margin: 8px;
      color: #878593;
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
