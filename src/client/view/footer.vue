<template>
  <div class="D-footer">
    Powered by
    <strong
      ><a href="https://Discuss.js.org" target="_blank">Discuss</a></strong
    >
    v{{ version }}
  </div>
</template>

<script>
import pkg from '../../../package.json'
import VisitStat from '../api/VisitStat'

export default {
  components: {},
  data() {
    return {
      version: pkg.version
    }
  },
  mounted() {
    if (this.$D.visitStat) VisitStat(this.$D.serverURLs, this.$D.path)
  }
}
</script>

<style lang="scss">
.D-footer {
  text-align: right;
  font-size: 0.75em;
  margin-top: 1em;
}
</style>
