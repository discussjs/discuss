<template>
  <div class="D-footer">
    Powered by <a href="https://Discuss.js.org" target="_blank">Discuss</a> v{{
      version
    }}
  </div>
</template>

<script>
import request from '../lib/request'

import packages from '../../../package.json'
const { version } = packages

export default {
  data() {
    return {
      version
    }
  },
  methods: {
    async getCounter() {
      const counterEle = document.getElementById('Discuss-Visitors')
      if (!counterEle) return

      const options = {
        url: this.$D.serverURLs,
        data: {
          type: 'COUNTER',
          path: this.$D.path
        }
      }

      const { data } = await request(options)

      if (data) counterEle.innerText = data
    }
  },
  mounted() {
    this.getCounter()
  }
}
</script>

<style scoped>
.D-footer {
  width: 100%;
  text-align: end;
  font-size: 0.75em;
  color: #999;
  margin-top: 1em;
}

.D-footer a {
  font-weight: bold;
  text-decoration: none;
  color: #00c4b6;
}
</style>
