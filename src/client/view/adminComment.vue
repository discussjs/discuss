<template>
  <div class="D-manage">
    <div class="D-thead D-select-none">
      <div class="D-thead-item">
        <input type="checkbox" v-model="checked" @change="onCheckedAll" />
      </div>
      <div class="D-thead-item">
        <select class="D-select" v-model="operateType" @change="onBatch">
          <option
            v-for="(item, key) in operateSelect"
            :key="key"
            v-text="item"
            :value="key"
          ></option>
        </select>
      </div>
      <div class="D-thead-item">
        <select class="D-select" v-model="status" @change="GetComment">
          <option
            v-for="(item, key) in optionsSelect"
            :key="key"
            v-text="item"
            :value="key"
          ></option>
        </select>
      </div>
      <div class="D-thead-item">
        <span class="D-svg" @click="onOpenSearch" v-html="iconSearch"></span>
        <div
          class="D-search"
          :class="{ 'D-zoom': isShowSearch, 'D-shrink': !isShowSearch }"
        >
          <div class="D-search-title" v-text="SearchTitle"></div>
          <div class="D-search-input-wrap">
            <input
              ref="search"
              v-model="keyword"
              class="D-search-input"
              type="text"
              :placeholder="SearchTitle"
              @keyup.enter="onSearch"
            />
            <select class="D-select" v-model="searchType">
              <option
                v-for="(item, key) in searchSelect"
                :key="key"
                v-text="item"
                :value="key"
              ></option>
            </select>
          </div>
          <div class="D-search-btn">
            <button
              class="D-btn D-btn-main"
              @click="onSearch"
              v-html="SearchBtn"
            ></button>
            <button
              class="D-btn"
              @click="isShowSearch = false"
              v-text="SearchCloseBtn"
            ></button>
          </div>
        </div>
        <div
          class="D-search-mask"
          ref="mask"
          :style="{ display: isShowSearch ? 'block' : '' }"
          @click="isShowSearch = false"
        ></div>
      </div>
    </div>
    <div class="D-tbody">
      <div
        class="D-comment-list"
        v-for="comment in comments"
        :key="comment._id"
      >
        <div class="D-comment-edit-wrap" v-show="comment.isEdit">
          <div class="D-comment-edit-info">
            <input class="D-input" type="text" v-model="comment.editNick" />
            <input class="D-input" type="email" v-model="comment.editMail" />
            <input class="D-input" type="text" v-model="comment.editSite" />
          </div>
          <div class="D-comment-edit-content">
            <textarea
              class="D-input D-textarea"
              v-model="comment.editContent"
            ></textarea>
            <div class="D-edit-action">
              <button
                class="D-btn"
                @click="comment.isEdit = false"
                v-text="translate('cancel')"
              ></button>
              <button
                class="D-btn D-btn-main"
                @click="onEditSend(comment)"
                :disabled="isEdit"
                v-html="EditSendBtn"
              ></button>
            </div>
          </div>
        </div>
        <div class="D-comment-body-wrap" v-show="!comment.isEdit">
          <input type="checkbox" :value="comment._id" v-model="checkedAll" />
          <div class="D-comment-info">
            <div class="D-comment-author">
              <img
                class="D-avatar"
                :src="$D.imgLoading"
                :d-src="comment.avatar"
                :alt="comment.nick"
              />
              <span
                class="D-stick"
                v-if="comment.stick && !comment.pid"
                v-text="stick"
              ></span>
              <a
                class="D-link D-ellipsis"
                :href="comment.site ? comment.site : 'mailto:' + comment.mail"
                target="_blank"
              >
                <strong v-text="comment.nick"></strong>
              </a>
            </div>
            <div class="D-comment-desc">
              <a
                class="D-link D-ellipsis"
                :href="'mailto:' + comment.mail"
                target="_blank"
                v-text="comment.mail"
              ></a>
              <div class="D-IP D-ellipsis" v-text="comment.ip"></div>
            </div>
          </div>
          <div class="D-comment-body D-ellipsis">
            <div class="D-comment-font D-ellipsis">
              <span class="D-comment-time"
                >{{ translateTime }}:
                <span class="D-ellipsis" v-text="timeAgo(comment.time)"></span>
              </span>
              <span class="D-comment-path"
                >{{ translatePath }}:
                <a
                  class="D-link D-ellipsis"
                  :href="comment.path"
                  target="_blank"
                  v-text="comment.path"
                ></a>
              </span>
            </div>
            <div class="D-comment-content" v-html="comment.content"></div>
            <div class="D-comment-operate D-comment-font">
              <template v-for="(item, key) in operate" :key="key">
                <span
                  v-if="!comment.pid || key !== 'stick'"
                  :class="'D-operate-' + key"
                  v-text="item"
                  @click="onOperate(key, comment._id, comment)"
                ></span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="D-pagination D-select-none">
      <div class="D-pagination-state">
        <span class="D-pagination-text"
          >{{ translateTotal
          }}<span class="D-comment-counts" v-text="counts"></span
          >{{ translateBar }}</span
        >
        <input
          ref="inputPageSize"
          type="text"
          class="D-pagination-input"
          v-model="pageSize"
          @input="onInputItem"
          @change="onChange('', pageSize)"
        />
        <span class="D-pagination-text"
          >{{ translateBar }}/{{ translatePage }}</span
        >
      </div>
      <div class="D-pagination-operate">
        <div class="D-pagination-pages">
          <span
            :class="[page.page === pageNo ? 'D-current ' : '', page.class]"
            v-for="page in pages"
            :key="page.page"
            @click="page.class ? onChange(page.page) : ''"
            v-text="page.page"
          ></span>
          <input
            ref="inputPageSize"
            type="text"
            class="D-pagination-input"
            v-model="pageNo"
            @input="onInputPage"
            @change="onChange(pageNo)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconSearch from '../../../assets/svg/Search.svg'
import iconLoading from '../../../assets/svg/Loading.svg'
import timeAgo from '../lib/timeAgo'
import { translate } from '../i18n/language'

const adminStr = 'admin.'
const manageStr = 'manage.'
const commentStr = 'comment.'
const adminManageCommentStr = adminStr + manageStr + commentStr

const searchStr = adminManageCommentStr + 'search.'
const batchStr = adminManageCommentStr + 'batch.'
const operateStr = 'operate'
const defaultOperateType = 'default'

const editStr = 'edit'

export default {
  components: {},
  data() {
    return {
      timeAgo,
      translate,
      // manage
      iconSearch,

      checked: false, // 全选/反选
      checkedAll: [], // 被选中的
      operateType: defaultOperateType, // 操作类型
      searchType: 'all', // 搜索类型

      token: localStorage.DToken,
      url: this.$D.serverURLs,
      keyword: '',
      pageNo: 1,
      pageSize: 0,
      status: 'current',
      comments: [],

      counts: 0,
      pageCount: 1,
      pages: [],

      stick:
        this.$D.stick ||
        translate(adminManageCommentStr + operateStr + '.stick'),

      isEdit: false,
      operate: translate(adminManageCommentStr + operateStr),
      searchSelect: translate(searchStr + 'options'),
      operateSelect: translate(batchStr + operateStr),
      optionsSelect: translate(adminManageCommentStr + 'options'),
      isSearch: false,
      isShowSearch: false
    }
  },
  computed: {
    EditSendBtn() {
      return this.isEdit
        ? iconLoading
        : translate(adminManageCommentStr + 'save')
    },
    SearchTitle() {
      return translate(searchStr + 'title')
    },
    SearchBtn() {
      return this.isSearch ? iconLoading : translate(searchStr + 'text')
    },
    SearchCloseBtn() {
      return translate(searchStr + 'close')
    },
    translateTime() {
      return translate(adminManageCommentStr + 'time')
    },
    translatePath() {
      return translate(adminManageCommentStr + 'path')
    },
    translateTotal() {
      return translate(adminManageCommentStr + 'total')
    },
    translateBar() {
      return translate(adminManageCommentStr + 'bar')
    },
    translatePage() {
      return translate(adminManageCommentStr + 'page')
    }
  },
  mounted() {
    this.$dialog(translate(adminManageCommentStr + 'msg'), 2000)
    this.GetComment()
  },
  updated() {
    this.$lazy()
  },
  methods: {
    GeneratePages() {
      // 生成分页
      const pages = []
      for (let page = 1; page <= this.pageCount; page++) {
        const firstPage =
          Math.abs(this.pageNo - page) < 2 ||
          page === 1 ||
          page === this.pageCount

        const morePage = Math.abs(this.pageNo - page) < 3

        if (firstPage) pages.push({ class: 'D-pagination-page', page })
        else if (morePage) pages.push({ class: '', page: '...' })
      }

      this.pages = pages
    },
    async GetComment() {
      try {
        this.CleanChecked()
        const options = {
          url: this.url,
          data: {
            type: 'GET_COMMENT_ADMIN',
            token: this.token,
            path: this.$D.path,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            keyword: this.keyword,
            searchType: this.searchType,
            status: this.status
          }
        }

        const { data } = await this.$ajax(options)
        this.pageSize = data.pageSize
        this.counts = data.counts
        this.pageCount = data.pageCount
        // 新增属性
        data.comments.forEach((item) => {
          item.isEdit = false
          item.editContent = item.content
          item.editNick = item.nick
          item.editMail = item.mail
          item.editSite = item.site
        })
        this.comments = data.comments

        this.GeneratePages()
      } catch (error) {
        console.error(error)
        this.$dialog(translate('commentsError'))
      }
    },
    CleanChecked() {
      // 清理已选中的评论
      if (this.checked) {
        this.checked = false
        this.checkedAll = []
      }
    },
    onCheckedAll() {
      // 全选/反选/单选/多选
      if (this.checked) {
        this.comments.forEach((item) => this.checkedAll.push(item._id))
      } else {
        this.checkedAll = []
      }
    },
    onBatch() {
      // 选择默认直接结束当前方法
      if (this.operateType === defaultOperateType) return

      // 如果未选择，则提示并且结束当前方法
      const checked = this.checkedAll
      const msg = translate(batchStr + operateStr + 'Msg')
      if (checked.length < 1) return this.$dialog(msg, 2000) // 输出错误提示框

      this.onOperate(this.operateType)
      this.onCheckedAll() // 取消选中
    },
    /**
     * 操作评论信息
     * @param {String} type 操作类型
     * @param {String} id 操作的评论id
     * @param {String} comment 评论对象
     */
    async onOperate(type, id, comment) {
      // 操作评论状态：置顶、取消置顶、通过、审核、垃圾、删除

      // 处理(显示)编辑评论框
      if (type === editStr) return (comment.isEdit = true)
      if (type === 'stick') type = comment.stick ? 'unstick' : type

      let arr = []
      if (id) arr.push(id)
      else arr = this.checkedAll

      const options = {
        url: this.url,
        data: {
          type: 'OPERATE_COMMENT',
          token: this.token,
          exec: type,
          id: arr
        }
      }
      const { msg } = await this.$ajax(options)
      this.$dialog(msg) // 弹出提示信息
      await this.GetComment() // 重新获取评论
    },
    async onEditSend(comment) {
      // 编辑完成后
      this.isEdit = true
      const options = {
        url: this.url,
        data: {
          type: 'OPERATE_COMMENT',
          token: this.token,
          exec: editStr,
          id: [comment._id],
          comment: {
            nick: comment.editNick,
            mail: comment.editMail,
            site: comment.editSite,
            content: comment.editContent
          }
        }
      }

      await this.$ajax(options)
      await this.GetComment()
      this.isEdit = false
    },
    onOpenSearch() {
      this.isShowSearch = true
      const search = this.$refs.search
      search.style.visibility = 'visible'
      search.focus()
    },
    async onSearch() {
      this.isSearch = true
      await this.GetComment()
      this.isSearch = false
      this.isShowSearch = false
    },
    onInputItem() {
      this.pageSize = this.onInputPagination(this.pageSize, 100)
    },
    onInputPage() {
      this.pageNo = this.onInputPagination(this.pageNo, this.pageCount)
    },
    onInputPagination(page, count) {
      const number = page.replace(/[^\d]/g, '')
      page = parseInt(number)
      if (page < 1 || isNaN(page)) page = ''
      if (page > count) page = count
      return page
    },
    onChange(pageNo = true, pageSize = true) {
      // 失去焦点后获取评论
      this.pageNo = pageNo
      if (!pageNo) this.pageNo = 1
      if (!pageSize) this.pageSize = 1
      this.GetComment()
    }
  }
}
</script>

<style lang="scss" scoped>
.D-admin-container .D-main-container .D-manage {
  padding: 1.25em /* 20/16 */;
  align-items: baseline;
}

.D-admin-container {
  .D-manage {
    input[type='checkbox'] {
      margin-right: 1.25em /* 20/16 */;
    }

    .D-thead {
      top: 0.8em;
      display: flex;
      width: inherit;
      position: absolute;

      &-item {
        display: flex;
        align-items: center;
      }

      &-item:nth-of-type(2) ~ .D-thead-item {
        margin-left: 1em;
      }
    }

    .D-search-svg {
      width: 1.6em;
      height: 1.6em;
    }
    .D-search-mask {
      display: none;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      position: fixed;
      backdrop-filter: blur(3px);
    }

    .D-search {
      top: 5rem;
      left: 50%;
      z-index: 2;
      width: 30em;
      min-width: 10em;
      padding: 2em;
      margin-left: -15em;
      position: fixed;
      visibility: hidden;
      text-align: center;
      border-radius: 10px;
      background: #1f1c2c;
    }
    .D-search-title {
      font-size: 1.2rem;
      line-height: 1;
    }
    .D-search-input-wrap {
      display: flex;

      .D-select {
        margin: 1.6em 0 1.6em 0.2em;
      }
    }
    .D-search-input {
      width: 100%;
      height: 1.875em /* 30/16 */;
      color: #fff;
      z-index: 10;
      margin: 1.6em 0;
      padding: 0 0.75em /* 12/16 */;
      background: transparent;
      border-radius: 0.375em;
      z-index: 99;
      border: 1px solid #33323e;

      &:hover {
        border-color: #6c6b7b;
      }

      &:focus {
        border-color: var(--D-main-Color);
      }
    }

    .D-search-btn {
      display: flex;
      flex-direction: column;

      .D-btn {
        width: 100%;
        margin: 0.4em 0;
      }
    }

    .D-select {
      cursor: pointer;
      min-width: 4em /* 60/16 */;
      background: transparent;
      color: #fff;
      border: 1px solid #33323e;
      border-radius: 5px;

      option {
        color: #fff;
        background: #181622;
      }
    }

    .D-tbody,
    .D-comment-author,
    .D-comment-info {
      display: flex;
    }
    .D-tbody {
      flex: 1;
      min-width: 43.75em /* 700/16 */;
      min-width: 30em /* 700/16 */;
      margin: 1.25em /* 20/16 */ 0;
      width: inherit;
      align-items: center;
    }

    .D-tbody {
      flex-direction: column;
      overflow-y: auto;
    }

    .D-comment-list {
      padding: 1.25em /* 20/16 */ 0;
      width: inherit;
      border-bottom: solid 1px #33323e;
    }

    .D-comment-content {
      margin: 1em 0;
      white-space: pre-wrap;
    }

    .D-comment-edit-wrap {
      display: flex;
      flex: 1;

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
      .D-textarea {
        min-height: 5.625em /* 90/16 */;
        padding: 0.2em;
        resize: vertical;
      }

      .D-comment-edit-info {
        flex: 1;
        min-width: 12.5em /* 200/16 */;
        margin-right: 1.25em /* 20/16 */;
      }

      .D-comment-edit-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
      }

      .D-edit-action {
        display: flex;
        margin-top: 0.625em /* 10/16 */;

        .D-btn + .D-btn {
          margin-left: 0.6em;
        }
      }
    }

    .D-comment-body-wrap {
      // align-items: center;
      display: flex;
    }

    .D-comment-info {
      min-width: 12.5em /* 200/16 */;
      max-width: 12.5em;
      flex-grow: 1;
      flex-direction: column;
      align-items: unset;
    }

    .D-avatar {
      width: 1.875em /* 30/16 */;
      height: 1.875em;
      margin-right: 10px;
      border-radius: 50%;
    }

    .D-stick {
      color: var(--D-stick-Color);
      min-width: 2.8em;
      height: 1.8em;
      margin-right: 5px;
      font-size: 0.8em;
      text-align: center;
      font-weight: 400;
      background: 0 0;
      border: 1px solid var(--D-stick-Color);
      border-radius: 3px;
    }

    .D-comment-desc {
      line-height: 1.5;
      display: flex;
      flex-direction: column;
    }

    .D-comment-body {
      flex-grow: 3;
      position: relative;
      word-break: break-all;
    }

    .D-comment-font {
      font-size: 0.75em /* 12/16 */;
    }

    .D-comment-path {
      margin-left: 0.5em /* 8/16 */;
    }

    .D-comment-operate {
      display: flex;

      span {
        cursor: pointer;
        margin-right: 0.5em /* 8/16 */;
      }

      .D-operate-stick {
        color: var(--D-stick-Color);
      }
      .D-operate-accept {
        color: #1fff52;
      }
      .D-operate-audit {
        color: #21e1ff;
      }
      .D-operate-spam {
        color: #ffb342;
      }
      .D-operate-edit {
        color: #2bb7ff;
      }
      .D-operate-delete {
        color: #ff5050;
      }
    }

    .D-pagination {
      left: 0;
      bottom: 0.8em;
      line-height: 1;
      width: inherit;
      position: absolute;
      padding: 0 1.25em;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .D-pagination-input {
      width: 2.5em /* 40/16 */;
      height: 1.125em /* 18/16 */;
      color: #fff;
      font-size: 1em /* 16/16 */;
      z-index: 10;
      text-align: center;
      margin: 0 0.5em /* 8/16 */;
      background: transparent;
      border-radius: 0.375em;
      border: 1px solid #33323e;
    }

    .D-current {
      background: #00c4b6;
    }

    .D-pagination-page {
      padding: 0 0.4em;
      margin: 0 0.2em;
      cursor: pointer;
      text-align: center;
    }

    .D-comment-counts {
      margin: 0 2px;
      font-size: 1.4em;
      font-weight: 600;
    }
  }
}
@media (min-width: 768px) {
  .D-admin-container .D-manage {
    .D-comment-operate {
      visibility: hidden;
    }
    .D-comment-list:hover .D-comment-operate {
      visibility: visible;
    }
  }
}
@media (max-width: 768px) {
  .D-admin-container {
    .D-manage {
      .D-search {
        width: 20em;
        margin-left: -10em;
      }

      .D-pagination {
        position: absolute;
        bottom: 0.8em /* 26/16 */;
        left: 0;
        padding: 0 10px;
      }
    }
  }
}
</style>
