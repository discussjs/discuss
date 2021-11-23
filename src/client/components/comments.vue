<template>
  <div class="D-comments">
    <D-submit
      @GetComment="GetComment"
      :options="options"
    ></D-submit>
    <D-list
      ref="list"
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
      options: {}
    }
  },
  methods: {
    GetComment() {
      this.$refs.list.GetComment()
    },
    OptionsFn(options) {
      this.options = options
    },
  }
}
</script>
