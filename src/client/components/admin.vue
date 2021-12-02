<template>
  <div class="D-admin-container" ref="adminPanel" v-show="showAdmin">
    <div class="D-admin-loading" v-show="isLoading" v-html="iconLoading"></div>
    <div class="D-admin-login" v-show="showLogin">
      <div class="D-admin-dialog">
        <div class="D-admin-dialog-title">Discuss 评论管理</div>
        <div class="D-admin-dialog-input" ref="login">
          <input
            type="text"
            v-model="username"
            placeholder="请输入用户名"
            required
          />
          <input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="D-admin-dialog-action">
          <button
            class="D-cancel D-button D-button-default"
            @click="onCancel"
            v-text="'关闭'"
          ></button>
          <button
            class="D-login D-button D-button-primary"
            @click="onLogin"
            :disabled="disabled"
            v-html="isLogin ? iconLoading : '登录'"
          ></button>
        </div>
      </div>
    </div>

    <div class="D-panel" v-if="loginSuccess">
      <div class="D-admin-header">
        <div class="D-panel-title">Discuss 管理面板</div>
        <div class="D-tabs">
          <div class="D-tab-left">
            <div
              class="D-tab"
              :class="{ 'D-active': activeTabName === 'comment' }"
              @click="activeTabName = 'comment'"
            >
              评论管理
            </div>
            <div
              class="D-tab"
              :class="{ 'D-active': activeTabName === 'config' }"
              @click="activeTabName = 'config'"
            >
              配置管理
            </div>
          </div>
          <div class="D-tab-right">
            <div class="D-tab D-logout" @click="onLogout">退出登录</div>
            <div class="D-tab D-close" @click="onClose">关闭</div>
          </div>
        </div>
      </div>
      <D-comment v-show="activeTabName === 'comment'"></D-comment>
      <D-config v-show="activeTabName === 'config'"></D-config>
    </div>
  </div>
</template>

<script>
import DComment from './adminComment.vue'
import DConfig from './adminConfig.vue'

import iconLoading from '../assets/svg/loading.svg'
import ajax from '../lib/request'
import { ShakeError } from '../lib/utils'

export default {
  components: { DComment, DConfig },
  props: { showAdmin: Boolean },
  data() {
    return {
      username: '',
      password: '',
      confirm: '',
      isLogin: false,
      disabled: false,
      loginMsg: '登录',
      url: this.$D.serverURLs,
      isLoading: false,
      showLogin: true,
      loginSuccess: false,
      activeTabName: 'comment',
      iconLoading
    }
  },
  methods: {
    async VerifyToken() {
      // 验证token是否有效
      const token = localStorage.DiscussToken || ''

      if (token) {
        this.isLoading = true
        this.showLogin = false
        const { data } = await ajax({
          url: this.url,
          data: { type: 'LOGIN', token }
        })
        if (data && data.token) {
          this.isLoading = false
          this.loginSuccess = true
        } else {
          this.isLoading = false
          this.showLogin = true
        }
      }
    },
    async onLogin() {
      this.disabled = true
      this.isLogin = true
      const params = {
        url: this.url,
        data: {
          type: 'LOGIN',
          username: this.username,
          password: this.password
        }
      }
      // 登录验证
      const { data } = await ajax(params)
      if (!data) {
        ShakeError(this.$refs.login)
        this.disabled = false
        this.isLogin = false
        console.error('Discuss [INFO]: 请求失败')
        return
      }
      this.disabled = false
      this.isLogin = false
      this.showLogin = false
      this.loginSuccess = true
      localStorage.DiscussToken = data.token
    },
    onCancel() {
      const adminPanel = this.$refs.adminPanel
      adminPanel.classList.add('popOut')
      setTimeout(() => {
        this.$emit('cancel')
        adminPanel.classList.remove('popOut')
      }, 450)
    },
    onLogout() {
      this.onCancel()
      localStorage.DiscussToken = ''
      setTimeout(() => {
        this.showLogin = true
        this.loginSuccess = false
      }, 450)
    },
    onClose() {
      this.onCancel()
    }
  },
  async mounted() {
    await this.VerifyToken()
  }
}
</script>

<style scoped>
.D-admin-container {
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  position: fixed;
  animation-duration: 0.5s;
  -webkit-animation-duration: 0.5s;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.D-admin-loading {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
}

.D-admin-loading :deep(.D-loading-svg) {
  width: 40px;
}

.D-admin-login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.D-admin-dialog {
  max-width: 300px;
}

.D-admin-dialog-title {
  color: #fff;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}

.D-admin-dialog-input {
  margin-top: 10px;
  margin-bottom: 4px;
}

.D-admin-dialog-input input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  outline: none;
  margin-bottom: 10px;
  padding: 0 15px;
  color: #000;
  display: block;
  font-size: inherit;
  box-sizing: border-box;
  text-align: center;
  border-radius: 4px;
  border: 1px solid #a9aeb6;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-appearance: none;
}

.D-admin-dialog-input input:hover {
  border-color: #6c6f74;
}

.D-admin-dialog-action {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.D-login {
  margin-left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.D-cancel {
  margin-right: 2px;
}

/* info */
.D-panel {
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.D-admin-header {
  width: 100%;
}

.D-panel-title {
  color: #fff;
  font-weight: 600;
  font-size: 30px;
  text-align: center;
}

.D-tabs {
  width: 100%;
  display: flex;
  margin-bottom: 1em;
  border-bottom: 2px solid #c0c4cc;
  justify-content: space-between;
}

.D-tab-left,
.D-tab-right {
  display: flex;
}
.D-tab:nth-last-child(1) {
  margin: 0;
}

.D-tab {
  display: inline;
  color: #c0c4cc;
  cursor: pointer;
  line-height: 1.8em;
  margin: 0 1em -2px 0;
}
.D-tab a {
  color: #c0c4cc;
}

.D-tab.D-active {
  color: #fff;
  border-bottom: 2px solid #fff;
}
</style>
