<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'
  import Submit from './submit.svelte'
  import { options, lazy } from '../lib/stores'
  import { translate } from '../i18n'
  import timeAgo from '../lib/timeAgo'

  export let comments = []
  export let replying = []

  let D = $options
  const dispatch = createEventDispatcher()

  onMount(() => {
    $lazy()
  })
  afterUpdate(() => {
    $lazy()
  })

  // svelte 变量
  let pid = '',
    rid = ''

  // 参数说明，请看html回复按钮部分的注释
  function onReply(id, pID) {
    // 此处主要区分是(父)根评论还是子评论
    pid = pID || id
    rid = id
    // 将id发送给父组件，由父组件统一修改，保证replying的唯一性
    dispatch('onReply', id)
  }
  /**
   * 1. 当前组件的submit子组件发送评论后
   * 2. 接收并发送到comments.vue根组件统一处理，并渲染
   * 3. 再此递归自身将其发送到comments.vue根组件统一处理，并渲染
   */
  function submitComment(event) {
    const { data, pid } = event.detail
    dispatch('submitComment', { comment: data, pid })
  }
</script>

{#each comments as comment}
  <div class="D-comments" id={comment.id}>
    <div class="D-comment">
      <img class="D-avatar" src={D.imgLoading} d-src={comment.avatar} alt={comment.nick} />
      <div class="D-comment-main">
        <div class="D-headers">
          <div class="D-heads">
            <div class="D-head">
              {#if comment.site}
                <a class="D-nick" href={comment.site} target="_blank">{comment.nick}</a>
              {:else}
                <span class="D-nick">{comment.nick}</span>
              {/if}
              {#if comment.master}
                <span class="D-master D-tag">{D.master}</span>
              {/if}
              {#if comment.stick}
                <span class="D-stick D-tag">{D.stick}</span>
              {/if}
            </div>
            <time class="D-time">{timeAgo(comment.time)}</time>
          </div>
        </div>
        <div class="D-content">
          {#if comment.pid}
            <a href="#{comment.pid}"><strong>@{comment.rnick}: </strong></a>
          {/if}<span>{@html comment.content}</span>
        </div>
      </div>
    </div>
    <!-- 由于这里是使用递归调用自身组件，所以可能比较难理解 -->
    <!-- 点击回复按钮时，将当前的评论id和(父评论id)pid传入 -->
    <!-- 如果点击的是(父)根评论的回复按钮，那么就将当前评论id传入，而(父评论id)pid为空 -->
    <!-- 反之如果点击的是子评论的回复按钮，那么就将当前评论id传入，而(父评论id)pid为当前评论的(父评论id)pid -->
    <button class="D-reply" on:click={onReply(comment.id, comment.pid)}>{translate('reply')}</button>
    {#if replying === comment.id}
      <Submit cancel={true} {pid} {rid} on:onCancel={onReply} on:submitComment={submitComment} />
    {/if}
    {#if comment.replys}
      <div class="D-comments-child">
        <!-- on:onReply 为事件转发，将其转发到comments.svelte -->
        <!-- 此处的转发是指：转发子评论的 on:onReply 事件 -->
        <!--
          举例：
            parent: on:onReply -> comments.svelte
            child:  on:onReply -> comment.svelte -> comments.svelte
        -->
        <!-- 简而言之: 此处的 on:onReply 与上方<script>里面的 onReply 方法没有半毛钱关系(仅和回复按钮的 on:click=onReply 有关系) -->
        <svelte:self comments={comment.replys} {replying} on:onReply on:submitComment={submitComment} />
      </div>
    {/if}
  </div>
{/each}

<style lang="scss">
  :global(.D-comments-count) span {
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

  :global(.D-comments-child) {
    .D-comments {
      margin: 0;
      border: 0;
      border-radius: 0;
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

    :global(p) {
      display: inline;
    }
    :global(img) {
      width: 100%;
    }
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
