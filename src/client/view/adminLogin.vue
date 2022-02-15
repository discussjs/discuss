<template>
  <div class="D-login-warp">
    <div class="D-login-waitng" v-show="isSend" v-html="iconLoading"></div>
    <div
      v-show="!isToken"
      class="D-login-container"
      :class="{ 'D-zoom': !isToken }"
    >
      <div class="D-login">
        <div class="D-login-logo" v-html="iconLogo"></div>
        <div class="D-login-main">
          <input
            class="D-input"
            v-for="i in inputs"
            :key="i.ph"
            :type="i.type"
            :placeholder="i.ph"
            v-model="i.model"
            @input="onInput"
            @keyup.enter="onLogin"
          />

          <button
            class="D-btn D-btn-main D-btn-login"
            :class="{ 'D-disabled-click D-disabled': isNull }"
            :disabled="isNull"
            @click="onLogin"
            v-html="loginBtn"
          ></button>
          <button
            class="D-btn D-btn-login"
            @click="onClose"
            v-text="closeBtn"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconLogo from '../../../assets/svg/Logo.svg'
import iconLoading from '../../../assets/svg/Loading.svg'

import dialog from '../lib/dialog'
import { translate } from '../i18n/language'

const adminLoginStr = 'admin.login.'

const TRUE = true
const FALSE = false

export default {
  data() {
    return {
      iconLogo,
      iconLoading,
      isSend: FALSE, // 是否登录
      isNull: TRUE, // 是否为空
      isToken: FALSE, // token是否正确
      token: localStorage.DToken || '',
      inputs: [
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
    }
  },
  computed: {
    loginBtn() {
      return this.isSend ? iconLoading : translate(adminLoginStr + 'login')
    },
    closeBtn() {
      return translate(adminLoginStr + 'close')
    }
  },
  mounted() {
    this.AutoLogin()
  },
  methods: {
    AutoLogin() {
      if (!this.token) return
      this.isToken = TRUE
      this.isSend = TRUE
      this.send()
      dialog(translate(adminLoginStr + 'msg'), 2000)
    },
    onLogin() {
      if (this.isSend) return
      this.send()
    },
    async send() {
      this.isSend = TRUE
      const params = {
        url: this.$D.serverURLs,
        data: { type: 'LOGIN' }
      }
      if (this.token) params.data.token = this.token
      if (!this.isNull) {
        params.data.username = this.inputs[0].model
        params.data.password = this.inputs[1].model
      }
      // 登录验证
      const { data, msg } = await this.$ajax(params)
      this.isSend = FALSE

      // 弹窗提示
      if (!data) dialog(msg)

      // 登录成功，跳转评论管理页面
      if (data?.token) {
        localStorage.DToken = data.token
        this.$emit('isLogin', TRUE)
        return
      }

      // 登录失败，直接结束当前方法，不在往下执行
      this.isToken = FALSE
      localStorage.DToken = ''
      this.token = ''
    },
    onInput() {
      if (this.inputs[0].model && this.inputs[1].model) this.isNull = FALSE
      else this.isNull = TRUE
    },
    onClose() {
      this.$emit('isLogin', FALSE)
    }
  }
}
</script>

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
