<template>
  <ParentLayout>
    <template #page-bottom>
      <div class="page-edit">
        <div id="Discuss-wrap"></div>
        <script src="https://cdn.jsdelivr.net/npm/discuss/dist/Discuss.js" ref="DiscussJS"></script>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";

export default {
  name: "Layout",
  components: {
    ParentLayout,
  },
  mounted() {
    this.initDiscuss();
    this.initJs();
  },
  methods: {
    initDiscuss() {
      try {
        Discuss.init({
          el: "#Discuss-wrap",
          master: "管理员",
          stick: "TOP",
          ph: "快来评论呀",
          serverURLs: "https://discuss-doc.imlete.cn/",
          path: location.pathname,
        });
      } catch (error) {}
    },
    initJs() {
      const discuss = this.$refs.DiscussJS;
      if (discuss) {
        discuss.onload = this.initDiscuss;
        this.$router.afterEach(this.onRoute);
      }
    },
    onRoute(to, from) {
      if (to.path !== from.path) this.initDiscuss();
    },
  },
};
</script>
