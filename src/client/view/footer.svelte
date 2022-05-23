<script>
  import { onMount } from 'svelte'
  import { version } from '../../../package.json'
  import { options } from '../lib/stores'
  import request from '../lib/request'

  let D = $options

  onMount(() => {
    VisitStat()
  })

  async function VisitStat() {
    const counterEle = document.getElementById('Discuss-Visitors')
    if (!counterEle) return

    const options = {
      url: D.serverURLs,
      data: { type: 'COUNTER', path: D.path }
    }

    const { data } = await request(options)

    if (data) counterEle.innerText = data
  }
</script>

<div class="D-footer">
  Powered by <strong><a href="https://Discuss.js.org" target="_blank">Discuss</a></strong> v{version}
</div>

<style>
  .D-footer {
    text-align: right;
    font-size: 0.75em;
    margin-top: 1em;
  }
</style>
