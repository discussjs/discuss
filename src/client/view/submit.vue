<template>
  <div class="D-submit">
    <div class="D-input" ref="input">
      <input
        v-for="input in inputs"
        :key="input.key"
        :type="input.type"
        :name="input.key"
        :placeholder="input.locale"
        @input="onInput($event, input.key)"
        v-model="metas[input.key].value"
      />
      <textarea
        class="D-input-content"
        v-model="metas.content.value"
        @input="onInput($event, 'content')"
        :placeholder="ph"
      ></textarea>
    </div>
    <div class="D-actions D-select-none">
      <div class="D-actions-left">
        <div
          class="D-emot-btn"
          @click="isEmot = !isEmot"
          v-html="iconEmotion"
        ></div>
        <div
          v-if="!isCancel"
          class="D-setting-btn"
          @click="onSetting"
          v-html="iconSetting"
        ></div>
        <div
          v-if="!isCancel"
          class="D-refresh-btn"
          @click="onRefresh"
          v-html="iconRefresh"
        ></div>
      </div>
      <div class="D-actions-right">
        <div class="D-text-number" v-if="wordNumber.content">
          {{ metas.content.value.length }}
          <span
            :class="{
              'D-text-number-illegal':
                metas.content.value.length > wordNumber.content
            }"
            v-if="wordNumber.content"
            v-text="'/' + wordNumber.content"
          ></span>
        </div>
        <button
          v-if="isCancel"
          class="D-cancel D-btn D-btn-main"
          @click="$emit('onCancel')"
          v-text="translate('cancel')"
        ></button>
        <button
          class="D-cancel D-btn D-btn-main"
          @click="onPreview"
          :class="{ 'D-disabled': !isOnPreview }"
          v-text="translate('preview')"
        ></button>
        <button
          class="D-send D-btn D-btn-main"
          @click="onSend"
          :disabled="disabledSend"
          :class="disabledSendClass"
          v-html="sending ? iconLoading : translate('send')"
        ></button>
      </div>
    </div>
    <div class="D-preview" v-if="isPreview" v-html="contentHTML"></div>
    <div class="D-emot" v-show="isEmot">
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
          <span v-if="emots.type == 'text'" :title="key" v-text="items"></span>
          <img
            v-else
            :src="$D.imgLoading"
            :d-src="items"
            :alt="key"
            :title="key"
          />
        </li>
      </ul>

      <div class="D-emot-packages">
        <span
          :class="{ 'D-emot-package-active': index === emotIndex }"
          v-for="(emots, key, index) in emotMaps"
          @click="onClickEmotPackage(index)"
          :key="index"
          v-html="key"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import iconEmotion from '../../../assets/svg/Emotion.svg'
import iconLoading from '../../../assets/svg/Loading.svg'
import iconSetting from '../../../assets/svg/Setting.svg'
import iconRefresh from '../../../assets/svg/Refresh.svg'

import { translate } from '../i18n/language'

// source: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]{1,30}\.)+[A-Za-z\d]{2,5}$/
const redo = '[A-Za-z\\d]'
const domain = `(${redo}{1,30}\\.)+${redo}{2,5}$`
const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*(\.[a-z]{2,5})+$/
const siteReg = new RegExp('^https?://' + domain)

const textStr = 'text'
const nickStr = 'nick'
const mailStr = 'mail'
const siteStr = 'site'
const contentStr = 'content'

export default {
  props: { cancel: Boolean, pid: String, rid: String, wordNumber: Object },
  emits: ['onCancel', 'onSetting', 'onRefresh', 'submitComment'],
  data() {
    return {
      storage: localStorage.Discuss,
      translate,
      iconEmotion,
      iconSetting,
      iconRefresh,
      iconLoading,
      ph: this.$D.ph || translate(contentStr), // textarea 评论框占位符
      metas: {
        nick: { value: '', is: false },
        mail: { value: '', is: false },
        site: { value: '', is: true },
        content: { value: '', is: false }
      },
      contentHTML: '',

      inputs: [
        {
          key: nickStr,
          locale: translate(nickStr),
          type: textStr
        },
        {
          key: mailStr,
          locale: translate(mailStr),
          type: 'e' + mailStr
        },
        {
          key: siteStr,
          locale: translate(siteStr),
          type: textStr
        }
      ],

      isCancel: this.cancel,
      isPreview: false,
      isSend: false,
      sending: false,

      // emot
      isEmot: false,
      emotIndex: 0,
      emotMaps: this.$D.emotMaps,
      emotAll: {},

      // setting
      isSetting: false
    }
  },
  computed: {
    isOnPreview() {
      const length = this.metas.content.value.length
      return length
    },
    disabledSend() {
      return !this.isSend || this.sending
    },
    disabledSendClass() {
      let classStr = ''
      if (!this.isSend) classStr += 'D-disabled'
      if (this.disabledSend) classStr += ' D-disabled-click'
      return classStr
    }
  },
  async mounted() {
    this.$lazy()
    this.InitInfo()
    this.getEmot()
  },
  methods: {
    InitInfo() {
      try {
        const defaultDraft = { nick: '', mail: '', site: '', content: '' }
        const json = JSON.parse(this.storage || '{}')
        this.storage = Object.assign(defaultDraft, json)
        if (Object.keys(this.storage).length === 0) return
        this.metas.nick.value = this.storage.nick
        this.metas.mail.value = this.storage.mail
        this.metas.site.value = this.storage.site
        this.metas.content.value = this.storage.content
        this.isVerify()
      } catch (error) {
        this.storage = {}
      }
    },
    isVerify() {
      const isNull = []
      for (const i in this.storage) {
        if (this.storage[i]) isNull.push(1)
        else isNull.push(0)
      }
      if (isNull.includes(1)) this.Verify()
    },
    Verify() {
      /**
       * 初始化用户信息时，调用MetasChange()
       * 判断信息是否符合要求
       * 符合: 允许发送评论
       * 不符合: 禁用发送评论按钮，并高亮提示不符合要求的信息框
       */
      this.$nextTick(() => {
        const input = this.$refs.input.children
        for (const i of input) this.MetasChange(i, i.name || contentStr)
      })
    },
    SaveInfo() {
      this.storage.nick = this.metas.nick.value
      this.storage.mail = this.metas.mail.value
      this.storage.site = this.metas.site.value
      this.storage.content = this.metas.content.value
      localStorage.Discuss = JSON.stringify(this.storage)
    },
    onInput() {
      this.SaveInfo()
      this.Verify()
      this.Preview()
    },
    MetasChange(dom, key) {
      dom = dom.target || dom
      // 如果没有内容，则直接退出
      if (JSON.stringify(dom) === '{}') return
      dom.classList.remove('error')

      const nick = this.metas.nick
      const mail = this.metas.mail
      const site = this.metas.site
      const content = this.metas.content

      function borderColorFn(result, value) {
        if (result) value.is = true
        else {
          dom.classList.add('error')
          value.is = false
        }
      }

      switch (key) {
        case nickStr:
          const nickLen = nick.value.length
          const wordNumberNick = this.wordNumber.nick
          let nickResult = nickLen > 1
          if (wordNumberNick)
            nickResult = nickResult && nickLen < wordNumberNick
          borderColorFn(nickResult, nick)
          break
        case mailStr:
          const wordNumberMail = this.wordNumber.mail
          const mailLng = mail.value.length
          let mailResult = mailReg.test(mail.value)
          if (wordNumberMail)
            mailResult = mailResult && mailLng < wordNumberMail
          borderColorFn(mailResult, mail)
          break
        case siteStr:
          const wordNumberSite = this.wordNumber.site
          const siteLen = site.value.length
          let siteResult = siteLen > 0 && siteReg.test(site.value)
          if (wordNumberSite)
            siteResult = siteResult && siteLen < wordNumberSite

          if (siteLen === 0) {
            dom.style = ''
            site.is = true
            break
          }

          borderColorFn(siteResult, site)
          break
        case contentStr:
          const wordNumberContent = this.wordNumber.content
          const contentLen = content.value.length
          let contentResult = contentLen > 0
          if (wordNumberContent)
            contentResult = contentResult && contentLen < wordNumberContent
          borderColorFn(contentResult, content)
          break
      }
      this.isSend = nick.is && mail.is && site.is && content.is
    },
    async defaultEmotMaps() {
      if (!this.emotMaps) {
        const { emot } = await import(
          /* webpackChunkName: "emot" */ '../lib/emot'
        )
        this.emotMaps = emot()
      }
    },
    async getEmot() {
      try {
        await this.defaultEmotMaps()
        if (/^https?:\/\//.test(this.emotMaps)) {
          const options = { url: this.emotMaps, method: 'get', headers: {} }
          this.emotMaps = await this.$ajax(options)
        }
      } catch (error) {
        await this.defaultEmotMaps()
        console.log(error)
      } finally {
        this.$nextTick(() => this.$lazy())
      }
    },
    getEmotAll() {
      try {
        for (const item in this.emotMaps) {
          const type = this.emotMaps[item].type
          if (type === textStr) continue
          const items = this.emotMaps[item].items
          this.emotAll = { ...this.emotAll, ...items }
        }
      } catch (error) {
        console.log(error)
      }
    },
    ParseEmot() {
      this.getEmotAll()
      let content = this.metas.content.value
      const reg = /\[(?<emot>.*?)\]/g
      const emots = []
      const arr = content.matchAll(reg)
      for (const item of arr) {
        emots.push(item.groups.emot)
      }

      for (const emot of emots) {
        const link = this.emotAll[emot]
        if (!link) continue
        const img = `<img class='D-comment-emot' src='${link}' alt='${emot}'/>`
        content = content.replace(`[${emot}]`, img)
      }
      this.contentHTML = content
    },
    Preview() {
      if (!this.isPreview) return
      this.ParseEmot()
    },
    onPreview() {
      this.isPreview = !this.isPreview
      this.Preview()
    },
    async onSend() {
      try {
        if (!this.isSend || this.sending) return
        this.ParseEmot()
        const meta = this.metas
        const comment = {
          type: 'COMMIT_COMMENT',
          nick: meta.nick.value,
          mail: meta.mail.value,
          site: meta.site.value,
          content: this.contentHTML,
          path: this.$D.path,
          pid: this.pid,
          rid: this.rid
        }

        this.sending = true

        const token = localStorage.DToken
        if (token) comment.token = token
        const { data, msg } = await this.$ajax({
          url: this.$D.serverURLs,
          data: comment
        })

        if (!data && msg.includes('login')) {
          console.error(translate('pleaseLogin'))
        }

        if (data instanceof Array) {
          this.$emit('submitComment', data, this.pid)
          this.metas.content.value = ''
          this.isPreview = false
        }
      } catch (error) {
        console.error('Comment failure:', error)
      } finally {
        this.sending = false
      }
    },
    /**
     * @param {Number} index 表情包下标
     */
    onClickEmotPackage(index) {
      this.emotIndex = index
    },
    /**
     * @param {String} key 表情名(描述)
     * @param {String} value 表情值(内容或地址)
     * @param {String} type 表情类型(text or image)
     */
    onClickEmot(key, value, type) {
      let iptContent = this.$refs.input.children[3]
      const cObj = this.metas.content
      let content = cObj.value

      // 获取输入框光标位置
      let cursorStart = iptContent.selectionStart
      let cursorEnd = iptContent.selectionEnd
      const Start = content.substring(0, cursorStart)
      const Ent = content.substring(cursorEnd)

      if (type == textStr) {
        cObj.value = `${Start}${value}${Ent}`
      } else {
        cObj.value = `${Start}[${key}]${Ent}`
      }

      iptContent.focus()
      const contentLen = content.length
      cursorStart = contentLen
      cursorEnd = contentLen
    },
    onSetting() {
      this.isSetting = true
      this.$emit('onSetting', true)
    },
    onRefresh() {
      this.$emit('onRefresh')
    }
  },
  watch: {
    'metas.content.value'() {
      this.onInput()
      this.MetasChange({}, contentStr)
    }
  }
}
</script>

<style lang="scss" scoped>
/* submit */
.D-submit {
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  border: solid 1px var(--D-Centre-Color);

  &:hover {
    transition: all 0.5s;
    border-color: var(--D-Height-Color);
  }
}
.D-input {
  :deep(.error) {
    border-radius: 6px;
    border-color: var(--D-main-Color);
    background: rgba(244, 100, 95, 0.1);
  }
  input {
    padding: 6px;
    width: calc((100% - 1rem) / 3);
    outline: none;
    border-bottom: dashed 1px var(--D-Centre-Color);

    + input {
      margin-left: 0.5rem;
    }
  }
  * {
    color: currentColor;
    border: none;
    background: transparent;
    box-sizing: border-box;

    &:focus {
      border-radius: 8px;
      background: rgba(153, 153, 153, 0.08);
    }
  }
  *:hover {
    border-color: var(--D-Height-Color);
    transition: all 0.5s;
  }

  .D-input-content {
    margin: 10px 0 0;
    resize: vertical;
    width: 100%;
    min-height: 100px;
    outline: none;
    font-family: inherit;
  }
}

.D-actions {
  margin: 10px 0 0;

  .D-actions-left {
    display: flex;
  }

  .D-actions-right {
    display: flex;
    align-items: center;

    .D-btn {
      margin-left: 4px;
    }

    .D-text-number {
      font-size: 12px;
      color: #999;
    }

    .D-text-number-illegal {
      color: red;
    }
  }
}

.D-actions,
.D-emot-btn,
.D-setting-btn,
.D-refresh-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.D-setting-btn,
.D-refresh-btn {
  width: 18px;
  cursor: pointer;
  margin-left: 6px;
}

.D-send {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* emot */
.D-emot {
  top: 30px;
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--D-Low-Color);
  border-radius: 4px;
  background: #fff;
}

.night,
.darkmode,
.DarkMode,
[theme='dark'],
[data-theme='dark'] {
  .D-emot {
    background: #333841;
  }
}

.D-emot-items {
  display: none;
  height: 180px;
  min-height: 100px;
  max-height: 200px;
  resize: vertical;
  padding: 10px;
  margin: 0;
  font-size: 0;
  overflow-x: hidden;
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

  img {
    width: 32px;
    height: auto;
  }

  &:hover {
    background: var(--D-Low-Color);
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%),
      0 1px 5px 0 rgb(0 0 0 / 12%);
  }
}

.D-emot-packages {
  padding: 0;
  font-size: 0;
  border-top: solid 1px var(--D-Low-Color);

  span {
    display: inline-block;
    line-height: 30px;
    font-size: 14px;
    padding: 0 10px;
    cursor: pointer;

    :deep(img) {
      width: 20px;
      position: relative;
      top: 5px;
    }

    &:nth-child(1) {
      border-radius: 0 0 0 3px;
    }
  }
}

.D-emot-package-active {
  background: var(--D-Low-Color);
}

/* preview */

.D-preview {
  padding: 10px;
  overflow-x: auto;
  min-height: 1.375rem /* 22/16 */;
  margin: 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
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
