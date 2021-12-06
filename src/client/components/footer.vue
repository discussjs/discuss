<template>
  <div class="D-footer">
    Powered by <a href="https://Discuss.js.org" target="_blank">Discuss</a> v{{
      version
    }}
  </div>
</template>

<script>
import packages from '../../../package.json'
const { version } = packages
export default {
  data() {
    return {
      version
    }
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
