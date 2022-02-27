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

export default {
  data() {
    return {
      version: pkg.version
    }
  },
  mounted() {
    if (this.$D.visitStat) this.VisitStat()
  },
  methods: {
    async VisitStat() {
      const counterEle = document.getElementById('Discuss-Visitors')
      if (!counterEle) return

      const options = {
        url: this.$D.serverURLs,
        data: { type: 'COUNTER', path: this.$D.path }
      }

      const { data } = await this.$ajax(options)

      if (data) counterEle.innerText = data
    }
  }
}
</script>

<style lang="scss" scoped>
.D-footer {
  text-align: right;
  font-size: 0.75em;
  margin-top: 1em;
}
</style>
