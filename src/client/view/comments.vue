<template>
  <div class="D-comments-wrap">
    <div class="D-comments-headers">
      <div class="D-comments-count" v-if="counts">
        <span v-text="counts"></span>{{ translate('comment') }}
      </div>
    </div>
    <div class="D-comments-list">
      <D-Comment
        :comments="comments"
        :replying="replying"
        :wordNumber="wordNumber"
        @reply="onReply"
        @submitComment="submitCommentFn"
      />
    </div>
    <div class="D-more" v-show="showMore">
      <button
        class="D-more-button"
        :class="{ 'D-disabled D-disabled-click': moerDisabled }"
        :disabled="moerDisabled"
        @click="onMoreComment"
        v-html="more"
      ></button>
    </div>
  </div>
</template>

<script>
import iconLoading from '../../../assets/svg/Loading.svg'
import { translate } from '../i18n/language'

import DSubmit from './submit.vue'
import DComment from './comment.vue'
export default {
  props: { submitComment: Array },
  components: { DSubmit, DComment },
  emits: ['onComments'],
  data() {
    return {
      iconLoading,
      translate,
      replying: '',
      comments: [],

      counts: 0,
      pageNo: 1,
      pageCount: 1,
      wordNumber: {},

      // 更多评论
      loading: false,
      showMore: false,
      moerDisabled: false
    }
  },
  computed: {
    more() {
      return this.loading ? this.iconLoading : translate('more')
    }
  },
  mounted() {
    this.GetComment()
  },
  updated() {
    this.$lazy()
  },
  methods: {
    async GetComment() {
      try {
        const { data } = await this.$ajax({
          url: this.$D.serverURLs,
          data: { type: 'GET_COMMENT', path: this.$D.path, pageNo: this.pageNo }
        })

        this.counts = data.counts
        this.pageCount = data.pageCount
        this.wordNumber = data.wordNumber
        this.comments = [...this.comments, ...data.comments]

        // 将字数限制发送到顶部评论框,同时传给子组件comment.vue
        // 子组件comment.vue继续传给子组件(自身调用自身)
        // 最后传入子组件的submit.vue
        this.$emit('onComments', this.wordNumber)
      } catch (error) {
        this.$emit('onComments')
        this.$dialog(translate('commentsError'), 1500)
        console.error('Request failed', error)
      }

      // 页码大于当前页显示‘更多评论’按钮
      const isShowMore = this.pageCount > this.pageNo
      if (isShowMore) this.showMore = true
      else this.showMore = false
    },

    onReply(id) {
      this.replying = id
      /*
        关于回复评论框的呈现流程，我想我有必要详细说明(防止以后看代码一脸懵逼)

        参数解释:
          self:   id
          parent: pid
          reply:  rid

        评论结构:
          A: 我是父评论
          B: 我是A的子评论，我回复了A
          C: 我也是A的子评论，我回复了B

        开始:
          1. 定义一个‘replying’变量，默认值为空字符串
          2. 将变量‘replying’传入子组件‘comment’
          3. 子组件使用‘props’接收当前的‘replying’变量
          4. 由于子组件为了实现子评论，而组件调用自身(自身变为了自己的子组件)
             同时也将‘replying’传入自身，现在的依赖关系为如下所示
             comments--->comment--->comment
             (为了防止死循环递归)
             (comment在子评论开始渲染的时候进行了判断)
             (详细看组件comment.vue的class属性为：D-comments-child)
          5. 假设现在点击了子评论的回复按钮
             点击后会执行‘onReply()’传入三个参数(id,pid,rid)
                source: onReply(comment.id, comment.pid, comment.rid)
             评论框有个判断，只有第一个参数id等于‘replying’时才会显示评论框
             目前‘replying’仍处于空字符串的状态
             当点击了回复按钮后执行‘onReply()’传入了当前评论id
             ‘onReply()’内部通过$emit()将id当前评论id发送给父评论
                最底层的comment传给自身的父组件，父组件接收后也会去执行‘onReply()’
                最终会发送到最顶层的comments.vue父组件
                comments<---comment<---comment
          6. 最后到达当前组件的‘onReply()’方法
             然后修改了‘replying’重新传入给子组件即可实现回复评论框的呈现
      */
    },
    async onMoreComment() {
      this.moerDisabled = true
      this.loading = true

      if (this.pageNo < this.pageCount) {
        this.pageNo++
        await this.GetComment()
        this.moerDisabled = false
        this.loading = false
      }
    },
    /**
     * 追加子评论
     * (此方法用于处理评论列表、点击回复评论按钮产生的评论框发送的评论)
     * @param {String} comment 评论数据
     * @param {String} pid 父评论id
     */
    submitCommentFn(comment, pid) {
      for (const item of this.comments) {
        if (item.id === pid) {
          item.replys = [...comment, ...(item.replys || [])]
          break
        }
      }
    }
  },
  watch: {
    // 追加新评论，此方法用于处理顶部评论框发送的评论
    submitComment(newVal) {
      this.comments = [...newVal, ...this.comments]
    }
  }
}
</script>
<style lang="scss" scoped>
.D-comments-settings {
  width: 20px;
  display: flex;
  align-items: center;
}

.D-more {
  display: flex;
  justify-content: center;
  margin: 16px 0 10px;

  &-button {
    width: auto;
    min-width: 80px;
    height: 36px;
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    line-height: 20px;
    font-weight: 600;
    font-size: 12px;
    border-radius: 12px;
    background-color: #e58a8a;
  }
}
</style>
