<template>
  <div class="D-admin-comment">
    <div class="D-admin-comment-search">
      <input
        v-model="keyword"
        autocomplete="off"
        placeholder="搜索昵称、邮箱、网址、IP、评论内容、文章地址"
        class="D-admin-comment-search-keyword"
        @change="GetComment"
      />
      <button
        class="D-admin-comment-search-button D-button D-button-primary"
        @click="onSearch"
      >
        搜索
      </button>
    </div>
    <div class="D-option-table">
      <ul class="D-option-table-show-left">
        <li>
          <div class="D-batch D-button D-button-info" @click="onBatch">
            批量处理
          </div>
        </li>
        <div
          class="D-mask"
          ref="mask-batch"
          v-show="isBatch"
          @click="onCloseMask('mask-batch', 'batchWaiting')"
        ></div>
        <div class="D-batch-waiting" ref="batchWaiting" v-show="isBatch">
          <button
            v-for="(item, key, index) in batchs"
            :key="index"
            class="D-operate-btn"
            :class="'D-waiting-' + key"
            :disabled="isDisabled"
            @click="onOperate(key)"
            v-text="item"
          ></button>
        </div>
      </ul>
      <ul class="D-option-table-show-right">
        <li
          v-for="(item, key) in status"
          :key="item"
          class="D-button D-button-default D-status"
          :class="{ 'D-button-info': activeTableName === key }"
          @click="onStatus(key)"
          v-text="item"
        ></li>
        <div
          class="D-more-operate D-button D-button-default D-button-info"
          @click="onMore"
        >
          更多
        </div>
        <div
          class="D-mask"
          ref="mask-more"
          v-show="isMore"
          @click="onCloseMask('mask-more', 'moreWaiting')"
        ></div>
        <div class="D-more-waiting" ref="moreWaiting" v-show="isMore">
          <button
            v-for="(item, key) in status"
            :key="key"
            class="D-operate-btn"
            :class="'D-waiting-' + key"
            :disabled="isDisabled"
            @click="onStatus(key)"
            v-text="item"
          ></button>
        </div>
      </ul>
    </div>

    <div class="D-admin-comment-list">
      <div class="D-table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="checked"
                  @change="onCheckedAll"
                />
                <input type="hidden" :value="checkedAll" />
              </th>
              <th>基本信息</th>
              <th></th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in comments" :key="item._id">
              <div class="D-comment-edit-wrap" v-show="item.isEdit">
                <td class="D-comment-edit">
                  <div class="D-comment-edit-info">
                    <p>
                      <label>用户名</label>
                      <input type="text" v-model="item.nick" />
                    </p>
                    <p>
                      <label>邮箱</label>
                      <input type="email" v-model="item.mail" />
                    </p>
                    <p>
                      <label>网址</label>
                      <input type="text" v-model="item.site" />
                    </p>
                  </div>
                </td>
                <td class="D-comment-edit">
                  <div class="D-comment-edit-content">
                    <p>
                      <label>内容</label>
                      <textarea v-model="item.OriginalContent"></textarea>
                    </p>
                    <p>
                      <button
                        class="D-button D-button-primary D-edit-btn"
                        @click="onEditSend(item)"
                        :disabled="isEdit"
                        v-html="isEdit ? iconLoading : '提交'"
                      ></button>
                      <button
                        class="D-button D-button-default"
                        @click="item.isEdit = false"
                      >
                        取消
                      </button>
                    </p>
                  </div>
                </td>
              </div>
              <div class="D-comment-info" v-show="!item.isEdit">
                <td>
                  <input
                    type="checkbox"
                    :value="item._id"
                    v-model="checkedAll"
                  />
                </td>
                <td>
                  <img
                    class="D-avatar"
                    :src="item.avatar"
                    @error="onError($event)"
                  />
                </td>
                <td>
                  <div class="D-comment-author">
                    <div
                      class="D-stick"
                      v-if="item.stick && !item.pid"
                      v-text="'置顶'"
                    ></div>
                    <strong>
                      <a
                        :href="item.site"
                        target="_blank"
                        v-text="item.nick"
                      ></a></strong
                    ><br />
                    <span>
                      <a
                        :href="'mailto:' + item.mail"
                        target="_blank"
                        v-text="item.mail"
                      ></a> </span
                    ><br />
                    <span v-text="item.ip"></span>
                  </div>
                </td>
                <td>
                  <div class="D-comment-body">
                    <span class="D-comment-time"
                      >时间:
                      <span v-text="item.time"></span>
                    </span>
                    <span class="D-comment-path"
                      >&nbsp;&nbsp;路径:
                      <a
                        :href="item.path"
                        target="_blank"
                        v-text="item.path"
                      ></a>
                    </span>
                    <div class="D-comment-content" v-html="item.content"></div>
                    <div class="D-comment-operate">
                      <span
                        v-if="!item.pid"
                        v-text="item.stick ? '取消置顶' : '置顶'"
                        :class="'D-operate-stick'"
                        @click="
                          onOperate(item.stick ? 'unstick' : 'stick', item._id)
                        "
                      ></span>
                      <span
                        v-for="(operate, key) in operates"
                        :key="key"
                        :class="'D-operate-' + key"
                        @click="
                          key == 'edit'
                            ? (item.isEdit = true)
                            : onOperate(key, item._id)
                        "
                        v-text="operate"
                      ></span>
                    </div>
                  </div>
                </td>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="D-pagination">
      <div class="D-pagination-active">
        <div class="D-pagination-state">
          <span class="D-pagination-text"
            >共<span class="D-comment-counts" v-text="counts"></span>条</span
          >
          <input
            ref="inputPageSize"
            type="text"
            class="D-pagination-page-num"
            v-model="pageSize"
            @input="onInputLoaf"
            @change="onChangeLoaf"
          />
          <span class="D-pagination-text">条/页</span>
        </div>
        <div class="D-pagination-operate">
          <div class="D-pagination-pages">
            <span
              :class="[page.page === pageNo ? 'D-current ' : '', page.class]"
              v-for="page in pages"
              :key="page.page"
              @click="page.class ? onOperatePage(page.page) : ''"
              v-text="page.page"
            ></span>
            <span>条</span>
            <input
              ref="inputPageSize"
              type="text"
              class="D-pagination-page-num"
              v-model="pageNo"
              @input="onInputPage"
              @change="onChangePage"
            />
            <span>条</span>
            <span
              class="D-pagination-text"
              v-text="'/ ' + pageCount + ' 页'"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconLoading from '../assets/svg/loading.svg'
import iconPrev from '@fortawesome/fontawesome-free/svgs/solid/caret-left.svg'
import iconNext from '@fortawesome/fontawesome-free/svgs/solid/caret-right.svg'
import incoFirstPage from '@fortawesome/fontawesome-free/svgs/solid/step-backward.svg'
import iconLastPage from '@fortawesome/fontawesome-free/svgs/solid/step-forward.svg'

import onError from '../lib/errorImage'
import debounce from '../lib/debounce'
import request from '../lib/request'
export default {
  components: {},
  data() {
    return {
      onError,
      token: localStorage.DiscussToken,
      url: this.$D.serverURLs,
      status: {
        current: '当前页',
        accept: '已通过',
        audit: '待审核',
        spam: '垃圾',
        master: '我的'
      },
      isBatch: false,
      isMore: false,
      isEdit: false,
      current: true,
      activeTableName: 'current',
      keyword: '',
      checked: false,
      checkedAll: [],
      isDisabled: false,
      comments: [],
      counts: 0,
      pageNo: 1,
      pageSize: 0,
      pageCount: 1,
      pages: [],

      operates: {
        accept: '通过',
        audit: '审核',
        edit: '编辑',
        spam: '垃圾',
        delete: '删除'
      },
      batchs: {
        accept: '通过',
        audit: '审核',
        spam: '垃圾',
        delete: '删除'
      },
      iconLoading,
      iconPrev,
      iconNext,
      incoFirstPage,
      iconLastPage
    }
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
      // 清理已选中的评论
      if (this.checked) {
        this.checked = false
        this.checkedAll = []
      }

      const options = {
        url: this.url,
        data: {
          type: 'GET_COMMENT_ADMIN',
          token: this.token,
          path: this.$D.path,
          current: this.current,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyword: this.keyword,
          status: this.activeTableName
        }
      }
      const { data } = await request(options)
      this.pageSize = data.pageSize
      this.counts = data.counts
      this.pageCount = data.pageCount
      // 新增属性
      data.comments.forEach((item) => (item.isEdit = false))
      this.comments = data.comments

      this.GeneratePages()
    },
    onSearch: debounce(300, async function () {
      await this.GetComment()
    }),
    onStatus: debounce(200, async function (key) {
      this.onCloseMask('mask-more', 'moreWaiting')
      this.pageNo = 1
      // 查询非当前页的评论
      if (key != 'current') this.current = false
      this.activeTableName = key
      await this.GetComment()
    }),
    onBatch() {
      // 打开批量操作
      this.isBatch = true
      const mask = this.$refs['mask-batch']
      const batchWaiting = this.$refs.batchWaiting
      mask.classList.add('popIn')
      batchWaiting.classList.add('popIn')

      setTimeout(() => {
        mask.classList.remove('popIn')
        batchWaiting.classList.remove('popIn')
      }, 450)
    },
    onMore() {
      // 打开更多操作(仅移动端设备)
      this.isMore = true
      const mask = this.$refs['mask-more']
      const moreWaiting = this.$refs.moreWaiting
      mask.classList.add('popIn')
      moreWaiting.classList.add('popIn')

      setTimeout(() => {
        mask.classList.remove('popIn')
        moreWaiting.classList.remove('popIn')
      }, 450)
    },
    onCloseMask(maskEle, waitingEle) {
      // 关闭遮罩层
      if (!maskEle && !waitingEle) return

      const mask = this.$refs[maskEle]
      const waiting = this.$refs[waitingEle]
      mask.classList.add('popOut')
      waiting.classList.add('popOut')

      setTimeout(() => {
        this.isBatch = false
        this.isMore = false
        mask.classList.remove('popOut')
        waiting.classList.remove('popOut')
      }, 450)
    },
    onCheckedAll() {
      if (this.checked) {
        this.comments.forEach((item) => this.checkedAll.push(item._id))
      } else {
        this.checkedAll = []
      }
    },
    async onOperate(type, id) {
      // 操作评论状态：置顶、取消置顶、通过、审核、垃圾、删除
      this.isDisabled = true

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
      await request(options)
      this.onCheckedAll() // 取消选中
      this.onCloseMask('mask-batch', 'batchWaiting') // 关闭批量处理弹窗
      await this.GetComment() // 重新获取评论
      this.isDisabled = false
    },
    async onEditSend(data) {
      // 编辑完成后
      this.isEdit = true
      const options = {
        url: this.url,
        data: {
          type: 'OPERATE_COMMENT',
          token: this.token,
          exec: 'edit',
          id: [data._id],
          comment: {
            nick: data.nick,
            mail: data.mail,
            site: data.site,
            content: data.OriginalContent
          }
        }
      }

      await request(options)
      await this.GetComment()
      this.isEdit = false
    },
    onInputLoaf() {
      // 每页显示多少条评论

      // 输入的内容只能为数字
      const number = this.pageSize.replace(/[^\d]/g, '')
      this.pageSize = parseInt(number)
      // 最小1条，最大100条
      if (this.pageSize < 1 || isNaN(this.pageSize)) this.pageSize = ''
      if (this.pageSize > 100) this.pageSize = 100
    },
    async onChangeLoaf() {
      // 失去焦点后获取评论
      if (!this.pageSize) this.pageSize = 1
      await this.GetComment()
    },
    onInputPage() {
      // 输入第几页评论

      // 输入的内容只能为数字
      const number = this.pageNo.replace(/[^\d]/g, '')
      this.pageNo = parseInt(number)

      // 最小第一页，最大为后台计算的页数
      if (this.pageNo < 1 || isNaN(this.pageNo)) this.pageNo = ''
      if (this.pageNo > this.pageCount) this.pageNo = this.pageCount
    },
    async onChangePage() {
      // 失去焦点后获取评论
      if (!this.pageNo) this.pageNo = 1
      await this.GetComment()
    },
    onOperatePage: debounce(300, async function (pageNo) {
      // 操作页码，由GeneratePages()方法生成
      this.pageNo = pageNo
      await this.GetComment()
    })
  },
  mounted() {
    this.GetComment()
  }
}
</script>

<style scoped>
.D-stick {
  color: #ff81aa;
  min-width: 30px;
  height: 18px;
  margin-right: 5px;
  display: inline-block;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-weight: normal;
  border: 1px solid #ff81aa;
  border-radius: 3px;
}

.D-admin-comment {
  width: 100%;
}

.D-admin-comment-search {
  display: flex;
  height: 30px;
}
.D-admin-comment-search input:hover {
  border-color: rgba(144, 147, 153, 0.5);
}
.D-admin-comment-search input {
  width: 100%;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  color: #fff;
  display: block;
  font-size: inherit;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--D-Centre-Color);
  background: transparent;
  -webkit-appearance: none;
}

.D-admin-comment-search-button {
  color: #fff;
  height: auto;
  margin-left: 2px;
  border: #409eff;
  background-color: #409eff;
}

.D-option-table {
  display: flex;
  justify-content: space-between;
}

.D-option-table-show-left,
.D-option-table-show-right {
  margin: 10px 0;
}

.D-option-table-show-left {
  padding: 0;
  display: flex;
}

.D-mask {
  animation-duration: 0.5s;
  -webkit-animation-duration: 0.5s;
}

.D-batch-waiting,
.D-more-waiting {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: grid;
  z-index: 9999;
  width: 20rem;
  /* width: 340px; */
  height: 50%;
  padding: 0.5rem;
  position: fixed;
  text-align: center;
  border-radius: 10px;
  background: #fff;
  animation-duration: 0.5s;
  -webkit-animation-duration: 0.5s;
}

.D-operate-btn {
  color: #fff;
  margin-top: 4px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.D-operate-btn:nth-child(1) {
  margin-top: 0;
}

.D-waiting-master {
  border-color: #ff81aa;
  background-color: #ff81aa;
}

.D-waiting-stick {
  border-color: #ff81aa;
  background-color: #ff81aa;
}

.D-waiting-current {
  border-color: #f4645f;
  background-color: #f4645f;
}

.D-waiting-accept {
  border-color: #28a745;
  background-color: #28a745;
}

.D-waiting-audit {
  border-color: #17a2b8;
  background-color: #17a2b8;
}

.D-waiting-spam {
  border-color: #e6a23c;
  background-color: #e6a23c;
}

.D-waiting-delete {
  border-color: #f56c6c;
  background-color: #f56c6c;
}

.D-option-table-show-right {
  padding: 0;
  display: flex;
}

.D-status {
  margin-right: 10px;
  padding: 8px;
}

.D-status:nth-last-of-type(1) {
  margin-right: 0;
}

.D-option-table ul li {
  list-style-type: none;
}

.D-admin-comment-list {
  color: #fff;
  font-size: 14px;
}

.D-table-wrap table {
  color: #fff;
  width: 100%;
}

.D-table-wrap thead tr {
  display: table;
  width: 300px;
  table-layout: fixed;
}
.D-table-wrap thead tr th:nth-child(1) {
  width: 0;
}

.D-table-wrap tbody {
  width: auto;
  font-size: 12px;
  display: block;
  overflow-x: auto;
  height: calc(100vh - 260px);
}

.D-table-wrap .D-comment-info {
  display: flex;
  align-items: center;
}

.D-table-wrap tbody tr {
  display: flex;
  margin-bottom: 10px;
}
.D-table-wrap tbody tr .D-comment-operate {
  visibility: hidden;
}
.D-table-wrap tbody tr:hover .D-comment-operate {
  visibility: visible;
}

.D-operate-stick {
  color: #ff81aa;
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

.D-edit-btn {
  width: 50px;
}
.D-edit-btn :deep(svg) {
  width: 10px;
}

.D-comment-edit-wrap {
  width: 100%;
}

.D-comment-edit:nth-child(1) {
  min-width: 200px;
}
.D-comment-edit:nth-child(2) {
  width: 100%;
}

.D-comment-edit-info label,
.D-comment-edit-content label {
  display: block;
}

.D-comment-edit-info input,
.D-comment-edit-content textarea {
  color: #fff;
  width: 100%;
  padding: 5px;
  font-size: 50%;
  outline: none;
  background: transparent;
  border-radius: 2px;
  border: 1px solid rgba(144, 147, 153, 1);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.D-comment-edit-content textarea {
  resize: vertical;
  width: 100%;
  min-height: 90px;
}

.D-comment-edit-content button {
  font-size: 10px;
  float: right;
  margin-left: 6px;
}

.D-avatar {
  width: 46px;
  border-radius: 4px;
}

.D-comment-author {
  padding-right: 10px;
  max-width: 160px;
  min-width: 100px;
  word-break: break-word;
}
.D-comment-author span {
  color: #00c4b6;
}

.D-admin-comment-list a {
  color: #00c4b6;
  text-decoration: none;
}

.D-comment-content {
  word-break: break-word;
}
.D-comment-content :deep(p) {
  margin: 6px 0;
}

.D-comment-operate span {
  cursor: pointer;
  margin-right: 8px;
}
.D-comment-operate span:hover {
  text-decoration: underline;
}
.D-comment-operate span:nth-last-child(1) {
  margin: 0;
}

.D-pagination {
  width: inherit;
  position: relative;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.D-pagination-active {
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.D-pagination-page-num {
  color: #fff;
  height: 18px;
  width: 40px;
  outline: none;
  text-align: center;
  border-radius: 4px;
  border: 1px solid rgba(144, 147, 153, 1);
  background: transparent;
  vertical-align: middle;
}
.D-comment-counts {
  margin: 0 2px;
  font-size: 20px;
  font-weight: 600;
}

.D-first-last {
  padding: 4px 8px;
}
.D-prev {
  padding: 4px 6px 4px 4px;
}
.D-next {
  padding: 4px 4px 4px 6px;
}
.D-pagination-operate .D-prev-next,
.D-pagination-operate .D-first-last {
  margin: 0 2px;
}

.D-current {
  background: #00c4b6;
}

.D-pagination-page {
  padding: 0 0.3rem;
  margin: 0 0.2rem;
  cursor: pointer;
  text-align: center;
}

.D-first-last :deep(svg) {
  vertical-align: middle;
  width: 14px;
  height: 14px;
}
.D-prev-next :deep(svg) {
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.D-not-allowed {
  cursor: not-allowed;
}
</style>

<style scoped>
@media screen and (min-width: 800px) {
  .D-more-operate {
    display: none;
  }
}
@media screen and (max-width: 800px) {
  .D-batch-waiting {
    width: 300px;
  }

  .D-more-waiting {
    width: 300px;
    height: 40%;
  }

  .D-status {
    display: none;
  }

  .D-comment-edit p {
    margin: 6px 0;
  }
  .D-comment-edit textarea {
    min-height: 74px;
  }
  .D-comment-edit:nth-child(1) {
    min-width: 100px;
  }
  .D-table-wrap tbody tr .D-comment-operate {
    visibility: visible;
  }
  .D-comment-author {
    min-width: 80px;
  }
  .D-admin-comment-list {
    font-size: 12px;
  }
  .D-comment-counts {
    font-size: 18px;
  }
  .D-pagination {
    font-size: 12px;
  }
  .D-pagination-page-num {
    height: 12px;
    width: 26px;
  }
}
</style>
