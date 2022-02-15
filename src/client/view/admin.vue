<template>
  <div class="D-admin-container" :style="display">
    <D-login @isLogin="onLogin" v-if="!isLogin" />
    <div class="D-admin" v-if="isLogin" :style="display">
      <header class="D-header D-select-none">
        <div class="logo" v-html="iconLogo"></div>
        <nav>
          <span
            v-for="(nav, key) in navs"
            :key="key"
            v-text="nav.text"
            @click="onActiveTab(key, nav.text)"
          ></span>
          <span
            class="D-menu"
            v-show="tab == 'config'"
            v-html="iconMenu"
            @click="open = true"
          ></span>
          <span class="D-close" v-html="iconClose" @click="onCloseAdmin"></span>
        </nav>
      </header>

      <h1 class="D-title" v-text="title"></h1>
      <div class="D-main-container">
        <D-comment v-if="tab == 'comment'" />
        <D-config v-if="tab == 'config'" :open="open" @onClose="onClose" />
      </div>
    </div>
  </div>
</template>

<script>
import iconLogo from '../../../assets/svg/Logo.svg'
import iconMenu from '../../../assets/svg/Menu.svg'
import iconClose from '../../../assets/svg/Close.svg'
import iconSearch from '../../../assets/svg/Search.svg'
import { translate } from '../i18n/language'

import DLogin from './adminLogin.vue'
import DComment from './adminComment.vue'
import DConfig from './adminConfig.vue'

const manageStr = 'admin.'
const commentManageStr = manageStr + 'manage'

export default {
  components: { DLogin, DComment, DConfig },
  data() {
    return {
      translate,
      iconLogo,
      iconMenu,
      iconClose,
      iconSearch,

      isShow: true,
      isLogin: false,

      // nav
      navs: translate(commentManageStr),
      open: false,

      // main
      title: '',
      tab: 'comment'
    }
  },
  computed: {
    display() {
      return { display: this.isShow ? '' : 'none' }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const key = 'comment'
      const title = translate(commentManageStr + '.' + key + '.text')
      this.onActiveTab(key, title)
    },
    onActiveTab(key, title) {
      this.tab = key
      this.title = title
    },
    onLogin(is) {
      this.isLogin = is
      if (!is) this.$emit('isAdmin', is)
    },
    onClose(value) {
      this.open = value
    },
    onCloseAdmin() {
      this.isShow = !this.isShow
    }
  }
}
</script>
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

  * {
    font-size: 0.95em;
  }

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
    cursor: pointer;
    display: flex;
    color: #878593;
    font-weight: 600;
    font-size: 0.875em /* 14/16 */;
    align-items: center;

    span + span {
      margin-left: 1.25em /* 20/16 */;
    }
  }
  .D-menu {
    display: none;
  }

  .D-menu,
  .D-close {
    line-height: 0;
  }

  .D-title {
    margin: 0;
    font-size: 1.2em /* 30/16 */;
    line-height: 1;
    font-weight: 700;
    padding: 0 0 1.2em;
  }

  .D-manage,
  .D-main {
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

  .D-manage {
    margin: 0;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background: #33323e;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-track {
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
