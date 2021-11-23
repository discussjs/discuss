<template>
  <div id="Discuss" class="Discuss">
    <D-admin
      v-if="showAdmin"
      :showAdmin="showAdmin"
      @cancel="onCancel"
      ref="admin"
    ></D-admin>
    <D-comments @admin="admin"></D-comments>
    <D-footer></D-footer>
  </div>
</template>

<script>
import './assets/css/var.css'
import './assets/css/main.css'
import './assets/css/animation.css'

import DAdmin from './components/admin.vue'
import DComments from './components/comments.vue'
import DFooter from './components/footer.vue'

export default {
  name: 'Main',
  components: {
    DAdmin,
    DComments,
    DFooter
  },
  data() {
    return {
      showAdmin: false
    }
  },
  methods: {
    open() {
      const admin = this.$refs.admin.$refs.adminPanel
      admin.classList.add('popIn')
      setTimeout(() => {
        admin.classList.remove('popIn')
      }, 500)
    },
    admin() {
      this.showAdmin = true
      this.$nextTick(() => this.open())
    },
    onCancel() {
      this.showAdmin = false
    }
  },
  watch: {
    /**
     * 监听是否打开了控制台
     *  打开: 禁止页面滚动
     *  关闭: 解除页面滚动
     */
    showAdmin: {
      handler(newValue) {
        const html = document.querySelector('html')
        if (newValue) html.classList.add('D-showAdmin')
        else html.classList.remove('D-showAdmin')
      }
    }
  }
}
</script>
