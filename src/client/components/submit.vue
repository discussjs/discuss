<template>
  <div class="D-submit">
    <div class="D-input">
      <input
        :key="index"
        v-for="(item, index) in inputs"
        type="text"
        @input="onInputMeta"
        :class="item.class"
        v-model="meta[item.model]"
        :placeholder="item.ph"
      />
      <textarea
        class="D-input-content"
        ref="input-content"
        v-model="content"
        @input="onInputContent"
        placeholder="说点什么吗？"
      ></textarea>
    </div>
    <div class="D-toolbar">
      <div class="D-toolbar-left">
        <div
          class="D-emot-btn"
          v-if="isEmotMaps"
          @click="emot($event)"
          v-html="iconEmot"
        ></div>
        <div class="D-markdown" v-if="markedConfig.enable">
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            alt="Markdown is supported"
            title="Markdown Guide"
            target="_blank"
            v-html="iconMarkdown"
          ></a>
        </div>
      </div>
      <div class="D-toolbar-right">
        <div class="D-text-number" v-if="wordNumber.contentWordNumber">
          {{ content.length }}
          <span
            :class="{
              'D-text-number-illegal':
                content.length > wordNumber.contentWordNumber
            }"
            v-if="wordNumber.contentWordNumber"
            v-text="'/' + wordNumber.contentWordNumber"
          ></span>
        </div>
        <button class="D-preview" @click="onPreview">预览</button>
        <button
          class="D-send"
          @click="onSend"
          :disabled="isConform"
          v-html="sendText ? iconLoading : '评论'"
        ></button>
      </div>
      <div class="D-emot" v-if="openEmot" ref="emot">
        <ul
          class="D-emot-items"
          :class="{ 'D-emot-items-active': index === emotIndex }"
          v-for="(emots, keys, index) in emotMaps"
          :key="index"
        >
          <li
            class="D-emot-item"
            v-for="(items, key, index) in emots.items"
            @click="onClickEmot(key, items, emots.type)"
            :key="index"
          >
            <span
              v-if="emots.type == 'text'"
              :title="key"
              v-text="items"
            ></span>
            <img v-else :src="items" :alt="key" :title="key" />
          </li>
        </ul>
        <div class="D-emot-bar">
          <ul class="D-emot-packages">
            <li
              :class="{ 'D-emot-package-active': index === emotIndex }"
              v-for="(emots, key, index) in emotMaps"
              @click="onClickEmotPackage(index)"
              :key="index"
              v-html="key"
            ></li>
          </ul>
        </div>
      </div>
    </div>
    <div
      class="D-preview-container"
      ref="D-preview-container"
      v-show="openPreview"
      v-html="contentPreview"
    ></div>
  </div>
</template>

<script>
import request from '../lib/request'
import Clickoutside from '../lib/clickoutside'
import marked from '../lib/marked'

import iconLoading from '../assets/svg/loading.svg'
import iconEmot from '@fortawesome/fontawesome-free/svgs/regular/laugh.svg'
import iconMarkdown from '@fortawesome/fontawesome-free/svgs/brands/markdown.svg'

export default {
  props: { ReplyID: Object, options: Object },
  components: {},
  computed: {
    WordNumber() {
      // 字数超出
      // 内容
      const contentWordNumber = this.wordNumber.contentWordNumber || 0
      const isContentExceed =
        this.content.length > contentWordNumber && contentWordNumber != 0
      // 昵称
      const nickWordNumber = this.wordNumber.nickWordNumber || 0
      const isNickExceed =
        this.meta.nick.length > nickWordNumber && nickWordNumber != 0
      // 邮箱
      const mailWordNumber = this.wordNumber.mailWordNumber || 0
      const isMailExceed =
        this.meta.mail.length > mailWordNumber && mailWordNumber != 0
      // 网址
      const siteWordNumber = this.wordNumber.siteWordNumber || 0
      const isSiteExceed =
        this.meta.site.length > siteWordNumber && siteWordNumber != 0

      return {
        isContentExceed,
        isNickExceed,
        isMailExceed,
        isSiteExceed
      }
    }
  },
  data() {
    return {
      url: this.$D.serverURLs,
      meta: { nick: '', mail: '', site: '' },
      content: '',
      pid: '',
      rid: '',
      contentHtml: '',
      contentPreview: '',
      openEmot: false,
      openPreview: false,
      markedConfig: this.$D.marked,
      wordNumber: {},
      sendText: false,
      isConform: true,
      iconLoading,
      iconEmot,
      iconMarkdown,
      inputs: [
        { class: 'D-input-nick', model: 'nick', ph: '昵称' },
        { class: 'D-input-mail', model: 'mail', ph: '邮箱' },
        { class: 'D-input-site', model: 'site', ph: '网址' }
      ],
      emotIndex: 0,
      EmotAll: {},
      isEmotMaps: false,
      emotMaps: this.$D.emotMaps
    }
  },
  mounted() {
    this.initMate()
    this.initDraft()
    this.getEmotAll()
    this.onInputContent()
  },
  methods: {
    IsConform() {
      const nick = this.meta.nick.length > 1
      const reg = /^(\w-*\.*)+@([a-z0-9-]?)+(\.[a-z0-9]{2,5})+$/
      const mail = reg.test(this.meta.mail)
      const isContentExceed = this.WordNumber.isContentExceed
      const isNickExceed = this.WordNumber.isNickExceed
      const isMailExceed = this.WordNumber.isMailExceed
      const isSiteExceed = this.WordNumber.isSiteExceed
      const condition =
        nick &&
        mail &&
        !isContentExceed &&
        !isNickExceed &&
        !isMailExceed &&
        !isSiteExceed
      if (condition) this.isConform = false
      else this.isConform = true
    },
    onInputMeta() {
      localStorage.Discuss = JSON.stringify({
        nick: this.meta.nick,
        mail: this.meta.mail,
        site: this.meta.site
      })
      this.IsConform()
    },
    onInputContent() {
      this.saveDraft()
      this.parseEmot()
      this.parseMarked()
      this.IsConform()
    },
    initMate() {
      if (!localStorage.Discuss) this.onInputMeta()
      const Discuss = JSON.parse(localStorage.Discuss)
      this.meta.nick = Discuss.nick
      this.meta.mail = Discuss.mail
      this.meta.site = Discuss.site
    },
    initDraft() {
      const draft = localStorage.DiscussDraft
      if (draft) this.content = draft
    },
    saveDraft() {
      localStorage.DiscussDraft = this.content
    },
    getEmotAll() {
      // 判断是否设置了表情包(未设置则退出，不执行for)
      const isEmotMaps = Object.keys(this.emotMaps).length
      this.isEmotMaps = isEmotMaps == 0 ? false : true
      if (!this.isEmotMaps) return

      for (const keys in this.emotMaps) {
        if (this.emotMaps[keys].type == 'image') {
          this.EmotAll = Object.assign(this.EmotAll, this.emotMaps[keys].items)
        }
      }
    },
    parseEmot() {
      this.contentHtml = this.content
      for (const key in this.EmotAll) {
        const EmotPlaceholder = '[' + key + ']'
        while (this.contentHtml.indexOf(EmotPlaceholder) != -1) {
          const img = `<img class='D-emot-comment' src='${this.EmotAll[key]}' alt='${key}'/>`
          this.contentHtml = this.contentHtml.replace(EmotPlaceholder, img)
        }
      }
    },
    emot(event) {
      this.openEmot = !this.openEmot
      /*
        由于使用了v-if，导致无法通过 $refs 获取dom
        即使在获取dom之前就已经将判断调整为true，也无法获取
        (因为vue必须完成完成当前操作后才会渲染dom，
        而不是调整了v-if的条件为true时就立即渲染)
       */
      this.$nextTick(() => {
        Clickoutside(
          this.$refs.emot,
          () => (this.openEmot = false),
          event.target
        )
      })
    },
    /**
     * @param {String} key 表情名(描述)
     * @param {String} value 表情值(内容或地址)
     * @param {String} type 表情类型(text or image)
     */
    onClickEmot(key, value, type) {
      let iptContent = this.$refs['input-content']

      // 获取输入框光标位置
      let cursorStart = iptContent.selectionStart
      let cursorEnd = iptContent.selectionEnd
      const Start = this.content.substring(0, cursorStart)
      const Ent = this.content.substring(cursorEnd)

      if (type == 'text') {
        this.content = `${Start}${value}${Ent}`
      } else {
        this.content = `${Start}[${key}]${Ent}`
      }

      iptContent.focus()
      cursorStart = this.content.length
      cursorEnd = this.content.length
      this.onInputContent()
    },
    onClickEmotPackage(index) {
      this.emotIndex = index
    },
    onPreview() {
      this.openPreview = !this.openPreview
      if (!this.markedConfig.enable) return
      this.parseMarked()
    },
    async parseMarked() {
      this.contentPreview = await marked(this.markedConfig, this.contentHtml)
    },
    async onSend() {
      const condition = this.WordNumber.isContentExceed
      if (condition) {
        // 发送中，禁止点击
        this.isConform = true
        this.ContentError('字数超出规定范围')
        return
      }

      // 发送中，禁止点击
      this.sendText = true
      this.isConform = true

      if (this.ReplyID) {
        this.pid = this.ReplyID.pid
        this.rid = this.ReplyID.rid
      }

      const comment = {
        type: 'COMMIT_COMMENT',
        nick: this.meta.nick,
        mail: this.meta.mail,
        site: this.meta.site,
        content: this.contentHtml,
        path: this.$D.path,
        pid: this.pid,
        rid: this.rid
      }

      const token = localStorage.DiscussToken
      if (token) comment.token = token

      const { data } = await request({
        url: this.url,
        data: comment
      })

      // 发送完成，解除禁止点击
      this.sendText = false
      this.isConform = false

      if (data) {
        // 提交评论后，将数据进行处理并返回
        this.$emit('comment', data)
        this.content = ''
        return
      }

      // 验证是否使用博主身份评论
      if (typeof data == 'string') this.ContentError(data)
    },
    ContentError(data) {
      let iptContent = this.$refs['input-content']
      iptContent.style = 'color:red'
      const content = this.content
      this.content = data
      setTimeout(() => {
        this.content = content
        iptContent.style = ''
        this.isConform = false
      }, 3000)
    }
  },
  watch: {
    options(newV, oldV) {
      this.wordNumber = newV.wordNumber
      this.markedConfig.highlightjs = newV.highlight
      this.markedConfig = Object.assign(this.markedConfig, newV.marked)
      this.IsConform()
      this.parseMarked()
    }
  }
}
</script>

<style scoped>
.D-submit {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}

.D-input input + input {
  margin-left: 0.5rem;
}

.D-input input {
  flex: 1;
  padding: 0.375rem /* 6/16 */;
  width: auto;
  width: calc((100% - 1rem) / 3);
  outline: none;
  color: currentColor;
  box-sizing: border-box;
  background: transparent;
  border-radius: 0.3125rem /* 5/16 */;
  border: solid 1px var(--D-Low-Color);
}
.D-input textarea {
  margin: 10px 0 10px;
  resize: vertical;
  width: 100%;
  height: 200px;
  min-width: 240px;
  min-height: 100px;
  padding: 5px 10px;
  outline: none;
  font-family: inherit;
  color: currentColor;
  background: transparent;
  border-radius: 5px;
  border: solid 1px var(--D-Low-Color);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.D-input input:hover,
textarea:hover {
  border-color: rgba(144, 147, 153, 0.7);
  transition: all 0.6s;
}

.D-input input:focus,
textarea:focus {
  border-color: #f4645f;
}

.D-toolbar-left {
  display: flex;
  align-items: center;
  fill: currentColor;
}

.D-emot-btn,
.D-markdown {
  margin-right: 10px;
}

.D-markdown > a {
  fill: currentColor;
  color: currentColor;
}

.D-toolbar {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.D-emot {
  width: 100%;
  position: absolute;
  background: #fff;
  border: 1px solid var(--D-Low-Color);
  margin-top: 1em;
  z-index: 1;
  top: 12px;
  border-radius: 4px;
}

.night .D-emot,
.darkmode .D-emot,
.DarkMode .D-emot,
[theme='dark'] .D-emot,
[data-theme='dark'] .D-emot {
  background: #333841;
}

.D-emot-items {
  display: none;
  min-height: 100px;
  height: 100px;
  resize: vertical;
  padding: 10px;
  margin: 0;
  font-size: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.D-emot-items-active {
  display: block;
}

.D-emot-item {
  list-style-type: none;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  margin: 0 10px 12px 0;
  cursor: pointer;
  transition: 0.3s;
  -webkit-transition: 0.3s;
}

.D-emot-item:hover {
  background: var(--D-Low-Color);
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}
.D-emot-item img {
  width: 3em;
  height: auto;
}

.D-emot-bar {
  width: 100%;
  border-top: 1px solid var(--D-Low-Color);
}
.D-emot-packages {
  margin: -1px 0 -1px 0;
  padding: 0;
  font-size: 0;
}

.D-emot-packages li {
  list-style-type: none;
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
}

.D-emot-packages li :deep(img) {
  width: 20px;
  position: relative;
  top: 5px;
}

.D-emot-packages li:nth-child(1) {
  border-radius: 0 0 0 3px;
}

.D-emot-package-active {
  background: var(--D-Low-Color);
}

.D-toolbar-left :deep(svg) {
  width: 1.125em;
  display: flex;
}

.D-toolbar-right {
  display: flex;
  align-items: center;
}

.D-text-number {
  font-size: 12px;
  color: #999;
}

.D-text-number-illegal {
  color: red;
}

.D-send {
  display: flex;
  align-items: center;
  justify-content: center;
}
.D-send,
.D-preview {
  width: 40px;
  height: 28px;
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 0.375rem /* 6/16 */;
  padding: 0.375rem /* 6/16 */;
  border-color: #f4645f;
  font-weight: 700;
  line-height: 1em;
  border-radius: 0.25rem /* 4/16 */;
  background-color: #f4645f;
}

.D-preview-container {
  overflow-x: auto;
  min-height: 1.375rem /* 22/16 */;
  margin: 10px 0;
  padding: 5px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.D-preview-container > :deep(p) {
  margin: 0;
}

@media screen and (max-width: 500px) {
  .D-input {
    display: flex;
    flex-direction: column;
  }
  .D-input input {
    width: 100%;
  }
  .D-input input + input {
    margin-top: 4px;
    margin-left: 0;
  }
}
</style>
