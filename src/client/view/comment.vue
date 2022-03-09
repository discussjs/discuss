<template>
  <div
    class="D-comments"
    v-for="comment in comments"
    :key="comment.id"
    :id="comment.id"
  >
    <div class="D-comment">
      <img
        class="D-avatar"
        :src="$D.imgLoading"
        :d-src="comment.avatar"
        :alt="comment.nick"
      />
      <div class="D-comment-main">
        <div class="D-headers">
          <div class="D-heads">
            <div class="D-head">
              <a
                class="D-nick"
                v-if="comment.site"
                :href="comment.site"
                v-text="comment.nick"
                target="_blank"
              ></a>
              <span class="D-nick" v-else v-text="comment.nick"></span>
              <span
                class="D-master D-tag"
                v-if="comment.master"
                v-text="master"
              ></span>
              <span
                class="D-stick D-tag"
                v-if="comment.stick"
                v-text="stick"
              ></span>
            </div>
            <time class="D-time" v-text="timeAgo(comment.time)"></time>
          </div>
        </div>
        <div class="D-content">
          <a v-if="comment.pid" :href="`#${comment.pid}`"
            ><strong>@{{ comment.rnick }}: </strong></a
          >
          <span v-html="comment.content"></span>
        </div>
      </div>
    </div>
    <div
      class="D-reply"
      @click="onReply(comment.id, comment.pid)"
      v-text="translate('reply')"
    ></div>
    <D-Submit
      v-if="replying === comment.id"
      :cancel="true"
      :pid="pid"
      :rid="rid"
      :wordNumber="wordNumber"
      @onCancel="onReply"
      @submitComment="submitComment"
    />
    <div class="D-comments-child" v-if="comment.replys">
      <D-comments-child
        :comments="comment.replys"
        :replying="replying"
        :wordNumber="wordNumber"
        @reply="onReply"
        @submitComment="submitComment"
      />
    </div>
  </div>
</template>

<script>
import { translate } from '../i18n/language'
import timeAgo from '../lib/timeAgo'

import DSubmit from './submit.vue'
export default {
  name: 'D-comments-child',
  components: { DSubmit },
  props: {
    comments: Array,
    replying: String,
    wordNumber: Object
  },
  emits: ['reply', 'submitComment'],
  data() {
    return {
      translate,
      timeAgo,
      master: this.$D.master,
      stick: this.$D.stick,
      pid: '',
      rid: '',
      showReply: false
    }
  },
  mounted() {
    this.$lazy()
  },
  methods: {
    onReply(id, pid) {
      this.pid = pid || id
      this.rid = id
      // 将id发送给父组件，由父组件同意修改，保证replying的唯一性
      this.$emit('reply', id)
    },
    /**
     * 将子评论框发送的信息发送到comments.vue根组件统一处理，并渲染
     * 与上方的onReply一样
     * @param {String} comment 评论数据
     * @param {String} pid 父评论id
     */
    submitComment(comment, pid) {
      this.$emit('submitComment', comment, pid)
    }
  }
}
</script>

<style lang="scss" scoped>
.D-comments-headers {
  display: flex;
  justify-content: space-between;
}

.D-comments-count span {
  margin-right: 4px;
  font-size: 22px;
  font-weight: bold;
}

.D-comments {
  margin-top: 20px;
  position: relative;
  padding: 15px 15px 6px;
  border-radius: 10px;
  border: solid 1px var(--D-Low-Color);

  &:hover {
    border-color: rgba(144, 147, 153, 0.7);
    transition: all 0.8s;
  }

  &:hover > .D-reply {
    opacity: 1;
  }
}

.D-comment {
  display: flex;
}

.D-comments-child {
  .D-comments {
    margin: 0;
    border: none;
    margin-left: 40px;
    padding: 15px 0 10px;
    border-top: dashed 1px var(--D-Low-Color);
  }

  .D-avatar {
    width: 32px;
    height: 32px;
  }

  .D-reply {
    right: 0;
  }
}

.D-headers {
  display: flex;
  align-items: center;
}

.D-heads {
  display: flex;
  flex-direction: column;
}

.D-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.D-nick {
  color: inherit;
  font-weight: 600;
  text-decoration: none;
}

.D-tag {
  padding: 2px 4px;
  color: #fff;
  margin-left: 5px;
  font-size: 12px;
  border-radius: 3px;
}

.D-master {
  background: #ffa51e;
}
.D-stick {
  background: var(--D-stick-Color);
}

time.D-time {
  color: #bbb;
  font-size: 0.75rem;
}

.D-content {
  margin: 10px 0;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.D-reply {
  position: absolute;
  opacity: 0;
  right: 15px;
  top: 15px;
  padding: 6px 10px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  background-color: var(--D-main-Color);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease-out;
}
</style>
