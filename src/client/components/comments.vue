<template>
  <div class="D-comments">
    <D-submit @comment="CommentFn" :options="options"></D-submit>
    <D-list
      :comment="comment"
      @admin="$emit('admin')"
      @options="OptionsFn"
    ></D-list>
  </div>
</template>

<script>
import DSubmit from './submit.vue'
import DList from './list.vue'
export default {
  components: {
    DSubmit,
    DList
  },
  data() {
    return {
      comment: [],
      options: {}
    }
  },
  methods: {
    CommentFn(comment) {
      this.comment = comment
    },
    OptionsFn(options) {
      this.options = options
    }
  }
}
</script>
