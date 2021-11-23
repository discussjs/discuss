<template>
  <div class="D-admin-config-container">
    <div class="D-admin-config">
      <div
        class="admin-config-group"
        v-for="setting in settings"
        :key="setting.name"
      >
        <details>
          <summary v-text="setting.name"></summary>
          <div
            class="admin-config-item"
            v-for="item in setting.items"
            :key="item.desc"
          >
            <div class="admin-config-input">
              <div class="admin-config-desc" v-text="item.desc"></div>
              <input
                v-model="item.value"
                type="text"
                :placeholder="item.placeholder"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
    <div class="D-admin-config-actions">
      <button
        class="D-admin-config-save D-button D-button-primary"
        @click="SaveConfig"
        :disabled="isSave"
        v-html="isSave ? iconLoading : saveMsg"
      ></button>
    </div>
  </div>
</template>

<script>
import incoSpinner from '@fortawesome/fontawesome-free/svgs/solid/spinner.svg'
import iconLoading from '../assets/svg/loading.svg'

import debounce from '../lib/debounce'
import ajax from '../lib/request'
export default {
  components: {},
  data() {
    return {
      iconLoading,
      incoSpinner,
      isSave: false,
      saveMsg: '保存',
      url: this.$D.serverURLs,
      config: {},
      settings: [
        {
          name: '基本配置',
          items: [
            {
              key: 'username',
              desc: '用户名',
              placeholder: '登录用户名',
              value: ''
            },
            {
              key: 'mail',
              desc: '博主邮箱',
              placeholder: '用于确认身份',
              value: ''
            },
            {
              key: 'site_name',
              desc: '网站名称',
              placeholder: "例如：「Lete乐特 ' s Blog」",
              value: ''
            },
            {
              key: 'site_url',
              desc: '网站地址',
              placeholder: '例如：https://blog.imlete.cn',
              value: ''
            },
            {
              key: 'domain',
              desc: '网站域名(安全域名)',
              placeholder: '可写多个,以英文逗号“,”做分割',
              value: ''
            }
          ]
        },
        {
          name: '评论处理',
          items: [
            {
              key: 'word_number',
              desc: '字数限制：评论内容,昵称,邮箱,网址 (以英文逗号分割，只输入一个0代表所有不限制)',
              placeholder: '默认: 0(无限制)',
              value: ''
            },
            {
              key: 'limit',
              desc: '10分钟内，每个IP能评论多少条',
              placeholder: '默认: 0(无限制)',
              value: ''
            },
            {
              key: 'limitAll',
              desc: '10分钟内，所有IP能评论多少条',
              placeholder: '默认: 0(无限制)',
              value: ''
            },
            {
              key: 'avatar_cdn',
              desc: '头像CDN',
              placeholder: 'https://cn.gravatar.com/avatar/',
              value: ''
            },
            {
              key: 'akismet',
              desc: 'Akismet-垃圾处理',
              placeholder: 'Akismet key',
              value: ''
            },
            {
              key: 'marked',
              desc: '是否开启markdown',
              placeholder: '默认: false',
              value: ''
            },
            {
              key: 'highlight',
              desc: '是否开启代码高亮',
              placeholder: '默认: false(开启的前提是开启marked)',
              value: ''
            }
          ]
        },
        {
          name: '邮件提醒',
          items: [
            {
              key: 'mail_host',
              desc: '邮件主机',
              placeholder: '例如: 腾讯企业邮箱主机 smtp.exmail.qq.com',
              value: ''
            },
            {
              key: 'mail_port',
              desc: '邮件主机端口',
              placeholder: '例如: 腾讯企业邮箱主机端口 465',
              value: ''
            },
            {
              key: 'mail_from',
              desc: '发件人',
              placeholder: '例如: admin@lete114.top',
              value: ''
            },
            {
              key: 'mail_accept',
              desc: '授权码 or 密码',
              placeholder: '服务商各有不同，自行到邮箱设置里查看',
              value: ''
            },
            {
              key: 'master_subject',
              desc: '邮件标题(博主)',
              placeholder: "例如:「Lete乐特 ' s Blog」上有新的评论啦！」",
              value: ''
            },
            {
              key: 'reply_subject',
              desc: '邮件标题(评论者)',
              placeholder:
                "例如: 您在「Lete乐特 ' s Blog」上有新的评论回复啦！」",
              value: ''
            },
            {
              key: 'mail_template',
              desc: '邮件模板',
              placeholder: '收到邮件通知的模板',
              value: ''
            }
          ]
        },
        {
          name: '修改密码',
          items: [
            {
              desc: '新密码',
              placeholder: '新密码',
              value: ''
            },
            {
              desc: '确认密码',
              placeholder: '确认密码',
              value: ''
            }
          ]
        }
      ]
    }
  },
  methods: {
    async GetConfig() {
      const options = {
        url: this.url,
        data: { type: 'GET_CONFIG', token: localStorage.DiscussToken }
      }
      const { data } = await ajax(options)
      if (data) {
        this.config = data
        this.InitConfig()
      }
    },
    SaveConfig: debounce(300, async function () {
      this.isSave = true
      this.ForConfig((item) => {
        this.config[item.key] = item.value
      })
      const options = {
        url: this.url,
        data: {
          type: 'SAVE_CONFIG',
          token: localStorage.DiscussToken,
          data: this.config
        }
      }
      const { data } = await ajax(options)
      if (data) {
        this.saveMsg = '已保存'
        this.isSave = false
        setTimeout(() => (this.saveMsg = '保存'), 5000)
      }
    }),
    InitConfig() {
      this.ForConfig((item) => {
        item.value = this.config[item.key]
      })
    },
    ForConfig(fn) {
      for (const setting of this.settings) {
        for (const item of setting.items) {
          fn(item)
        }
      }
    }
  },
  mounted() {
    this.GetConfig()
  }
}
</script>

<style scoped>
.D-admin-config-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
}
.D-admin-config {
  overflow-x: hidden;
  height: calc(100vh - 160px);
  margin-bottom: 10px;
}

.admin-config-group {
  margin-bottom: 10px;
}

details {
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}

.admin-config-desc {
  margin: 4px 0;
  font-size: 12px;
}

.admin-config-input input,
textarea {
  width: 100%;
  outline: 0;
  padding: 0 12px;
  min-height: 34px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid var(--D-Centre-Color);
  background: transparent;
  -webkit-box-sizing: border-box;
}
.admin-config-input textarea {
  line-height: 30px;
  min-height: 80px;
  resize: vertical;
}
.D-admin-config-actions {
  display: flex;
  margin: 0 auto;
  bottom: 10px;
}
.D-admin-config-save {
  display: flex;
  align-items: center;
}
</style>
