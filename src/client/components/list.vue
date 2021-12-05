<template>
  <div class="D-comments-container">
    <div class="D-comments-headers">
      <div class="D-comments-counts"><span v-text="counts"></span>条评论</div>
      <div
        class="D-comments-settings"
        v-html="iconSetting"
        @click="openAdmin"
      ></div>
    </div>
    <div class="D-comments-list">
      <template v-for="item in comments">
        <div
          class="D-comments"
          :id="item._id"
          :key="item._id"
          v-if="item.pid === ''"
        >
          <div class="D-headers">
            <div class="D-info">
              <div class="D-avatar">
                <img :D-src="item.avatar" @error="onError($event)" />
              </div>
              <div class="D-nick">
                <a
                  v-if="item.site"
                  :href="item.site"
                  target="_blank"
                  v-text="item.nick"
                ></a>
                <span v-else v-text="item.nick"></span>
                <span
                  class="D-master D-tag"
                  v-if="item.master"
                  v-text="master"
                ></span>
                <span class="D-stick D-tag" v-if="item.stick">置顶</span>
                <time class="D-comments-date" v-text="item.time"></time>
              </div>
            </div>
          </div>
          <div class="D-comments-content" v-html="item.content"></div>
          <div class="D-comments-reply" @click="onReply(item._id)">回复</div>
          <D-submit
            v-if="replying === item._id"
            :ReplyID="{ pid: item._id, rid: '' }"
            @GetComment="GetComment"
          ></D-submit>
          <template v-for="citem in comments">
            <div
              class="D-comments-child"
              :key="citem._id"
              v-if="item._id === citem.pid"
            >
              <div class="D-comments" :id="citem._id">
                <div class="D-headers">
                  <div class="D-info">
                    <div class="D-avatar">
                      <img :D-src="citem.avatar" @error="onError($event)" />
                    </div>
                    <div class="D-nick">
                      <a
                        v-if="item.site"
                        :href="citem.site"
                        target="_blank"
                        v-text="citem.nick"
                      ></a>
                      <span v-else v-text="citem.nick"></span>
                      <span
                        class="D-master D-tag"
                        v-if="citem.master"
                        v-text="master"
                      ></span>
                      <time class="D-comments-date" v-text="citem.time"></time>
                    </div>
                  </div>
                </div>
                <div class="D-comments-content" v-html="citem.content"></div>
                <div class="D-comments-reply" @click="onReply(citem._id)">
                  回复
                </div>
                <D-submit
                  v-if="replying === citem._id"
                  :ReplyID="{ pid: item._id, rid: citem._id }"
                  @GetComment="GetComment"
                ></D-submit>
              </div>
            </div>
          </template>
        </div>
      </template>
      <div class="D-more" v-show="showMore">
        <button
          class="D-more-button"
          @click="onMoreComment"
          :disabled="moerDisabled"
          v-html="loading ? iconLoading : '更多评论'"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import DSubmit from './submit.vue'
import ajax from '../lib/request'
import lazyload from '../lib/lazyload'
import onError from '../lib/errorImage'

import iconLoading from '../assets/svg/loading.svg'
import iconSetting from '@fortawesome/fontawesome-free/svgs/solid/cog.svg'

export default {
  props: { comment: Object },
  components: { DSubmit },
  data() {
    return {
      onError,
      url: this.$D.serverURLs,
      path: this.$D.path,
      comments: [],
      counts: 0,
      pageNo: 1,
      pageCount: 1,
      moerDisabled: false,
      showMore: false,
      replying: null,
      isReply: false,
      loading: false,
      master: this.$D.master,
      iconLoading,
      iconSetting
    }
  },
  async mounted() {
    await this.GetComment()
  },
  updated() {
    lazyload('.D-comments-list img[d-src]', 'd-src')
  },
  methods: {
    onReply(id) {
      this.replying = id
    },
    openAdmin() {
      this.$emit('admin')
    },
    async GetComment() {
      const options = {
        url: this.url,
        data: {
          type: 'GET_COMMENT',
          path: this.path,
          pageNo: this.pageNo
        }
      }
      const { data } = await ajax(options)
      if (!data) {
        console.error('Discuss [INFO]: 请求失败')
        return
      }

      this.$emit('options', {
        wordNumber: data.wordNumber,
        marked: data.marked,
        highlight: data.highlight
      })

      this.counts = data.counts
      this.pageCount = data.pageCount
      this.comments = this.comments.concat(data.comments)

      // 页码大于当前页显示‘更多评论’按钮
      const isShowMore = this.pageCount > this.pageNo
      if (isShowMore) this.showMore = true
      else this.showMore = false
    },
    async onMoreComment() {
      if (this.moerDisabled == true) return // 拦截多次点击

      this.moerDisabled = true
      this.loading = true
      if (this.pageNo < this.pageCount) {
        this.pageNo++
        await this.GetComment()
        this.moerDisabled = false
        this.loading = false
      }
    }
  },
  watch: {
    comment(newV, oldV) {
      this.comments.unshift(newV)
    }
  }
}
</script>

<style scoped>
.D-comments a {
  text-decoration: none;
  color: #00c4b6;
}

.D-comments-headers {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}

.D-comments-counts {
  font-weight: 600;
}
.D-comments-counts span {
  margin-right: 4px;
  font-size: 20px;
}

.D-comments-settings :deep(svg) {
  width: 1.125em;
  display: flex;
  cursor: pointer;
  fill: currentColor;
}

.D-comments {
  margin-top: 20px;
  position: relative;
  padding: 15px 15px 0;
  border-radius: 10px;
  border: solid 1px var(--D-Low-Color);
}
.D-comments:hover {
  border-color: rgba(144, 147, 153, 0.7);
  transition: all 0.8s;
}

.D-info {
  display: flex;
  align-items: flex-start;
}

.D-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.D-nick {
  position: relative;
  display: flex;
  color: #00c4b6;
  padding-left: 15px;
  font-weight: 600;
}

.D-tag {
  color: #fff;
  min-width: 30px;
  height: 18px;
  margin-left: 5px;
  display: inline-block;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-weight: normal;
  border-radius: 3px;
}

.D-master {
  background: #ffa51e;
}

.D-stick {
  background: #ff81aa;
}
.D-comments-date {
  top: 20px;
  position: absolute;
  color: #8f949e;
  font-size: 10px;
}

.D-comments-content {
  max-height: 400px;
  font-size: 14px;
  overflow: auto;
  word-wrap: break-word;
  word-break: break-all;
}

.D-comments-content p {
  margin: 8px 0;
  line-height: 1.8;
}

.D-comments-reply {
  position: absolute;
  opacity: 0;
  right: 15px;
  top: 15px;
  padding: 6px 10px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  background-color: #f4645f;
  border: none;
  border-radius: 8px;
  -webkit-transition: all 0.3s ease-out;
  -moz-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

.D-comments:hover > .D-comments-reply {
  opacity: 1;
}

.D-comments-child {
  margin-left: 20px;
}

.D-comments-child .D-comments {
  padding: 0;
  border: none;
}

.D-comments-child .D-comments-content p {
  margin: 4px 0;
}

.D-comments-child .D-comments-reply {
  right: 0px;
}

.D-comments-child .D-avatar img {
  width: 32px;
  height: 32px;
}

.D-more {
  display: flex;
  justify-content: center;
  margin: 16px 0 10px;
}
.D-more-button {
  width: 80px;
  border: none;
  color: #fff;
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
</style>
