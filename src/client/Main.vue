<template>
  <div id="Discuss" class="Discuss">
    <div class="D-dialog-wrap"></div>
    <D-admin @isAdmin="onIsAdmin" v-if="isAdmin" ref="admin" />
    <D-submit
      @submitComment="submitComment"
      @onSetting="onIsAdmin"
      @onRefresh="onRefresh"
      :wordNumber="wordNumber"
    />
    <D-comments
      ref="comment"
      v-if="isRefreshComments"
      :submitComment="comment"
      @onComments="onComments"
    />
    <div
      class="D-loading-comments"
      v-show="isLoading"
      ref="loading"
      v-html="iconLoading"
    ></div>
    <D-footer />
  </div>
</template>

<script>
import DSubmit from './view/submit.vue'
import DComments from './view/comments.vue'
import DFooter from './view/footer.vue'
import iconLoading from '../../assets/svg/Loading.svg'
import { defineAsyncComponent } from 'vue'

const width = 'width'
const height = 'height'

export default {
  name: 'Main',
  components: {
    DAdmin: defineAsyncComponent(() =>
      import(/* webpackChunkName: "admin" */ './view/admin.vue')
    ),
    DSubmit,
    DComments,
    DFooter
  },
  data() {
    return {
      iconLoading,
      comment: [],
      wordNumber: {},
      isAdmin: false,
      isLoading: true,
      isRefreshComments: true
    }
  },
  mounted() {},

  methods: {
    onIsAdmin(is) {
      this.isAdmin = is
      // 调用admin组件的onCloseAdmin方法用来隐藏
      this.$refs.admin?.onCloseAdmin()
    },

    submitComment(data) {
      this.comment = data
    },
    onComments(wordNumber) {
      this.wordNumber = wordNumber || {}
      const loadingStyle = this.$refs.loading.style
      loadingStyle.removeProperty(width)
      loadingStyle.removeProperty(height)
      this.isLoading = false
    },
    onIsLoading() {
      const loadingStyle = this.$refs.loading.style
      loadingStyle.removeProperty(width)
      loadingStyle.removeProperty(height)
      this.isLoading = false
    },
    getElementStyle(dom, property) {
      return getComputedStyle(dom, null).getPropertyValue(property)
    },
    onRefresh() {
      const refs = this.$refs
      const comment = refs.comment.$el
      const loadingStyle = refs.loading.style
      loadingStyle.setProperty(width, this.getElementStyle(comment, width))
      loadingStyle.setProperty(height, this.getElementStyle(comment, height))

      this.isLoading = !this.isLoading
      this.isRefreshComments = false
      this.$nextTick(() => (this.isRefreshComments = true))
    }
  }
}
</script>

<style lang="scss">
:root {
  --D-main-Color: #f4645f;
  --D-stick-Color: #ff81aa;
  --D-Height-Color: rgba(128, 128, 128, 0.8);
  --D-Centre-Color: rgba(128, 128, 128, 0.5);
  --D-Low-Color: rgba(128, 128, 128, 0.2);
}

#Discuss * {
  box-sizing: border-box;
}

.D-svg {
  display: flex;
  width: inherit;
  height: inherit;
}

.D-loading-comments {
  display: flex;
  margin: 60px 0;
  justify-content: center;

  svg {
    width: auto;
    height: 50px;
  }
}

.D-link {
  color: #00c4b6;
  text-decoration: none;
}

.D-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.D-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  outline: none;
  line-height: 1;
  width: auto;
  height: 28px;
  cursor: pointer;
  text-align: center;
  font-weight: 600;
  padding: 6px;
  font-size: 14px;
  color: #606266;
  border: 1px solid #dcdfe6;
  background: #fff;
  transition: 0.1s;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  user-select: none;
}

.D-select-none {
  user-select: none;
}

.D-btn:hover {
  opacity: 1;
}

.D-btn-main {
  color: #fff;
  border-color: var(--D-main-Color);
  background-color: var(--D-main-Color);
}
#Discuss .D-disabled-click {
  cursor: not-allowed;
  cursor: no-drop;
}
.D-disabled,
.D-disabled:hover {
  opacity: 0.5;
}

#Discuss .D-comment-emot {
  width: 32px;
  height: auto;
  vertical-align: middle;
}

.D-dialog-wrap {
  width: 400px;
  position: fixed;
  left: 50%;
  top: 32px;
  font-size: 14px;
  transform: translate(-50%);
  border-radius: 10px;
  letter-spacing: 1px;
  text-align: center;
  z-index: 9999999;
}
.D-dialog {
  width: 100%;
  position: fixed;
  opacity: 0;
  padding: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 10px;
  background: var(--D-main-Color);
  transition: all 0.5s;
  box-sizing: border-box;
  transform: translate(0, -100px);
}

.D-dialog-appear {
  opacity: 1;
  position: unset;
  transform: none;
}

@media (max-width: 500px) {
  .D-dialog-wrap {
    width: 100vw;
  }
}

.D-zoom {
  animation: D-zoom-animation 0.3s forwards;
}

.D-shrink {
  animation: D-shrink-animation 0.5s forwards;
}

@keyframes D-zoom-animation {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }

  100% {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}

@keyframes D-shrink-animation {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.7);
  }
}
</style>
