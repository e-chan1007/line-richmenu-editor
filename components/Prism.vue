<template>
  <div class="line-numbers" tabindex="-1" @keydown="$emit('keydown', $event)">
    <pre><code ref="code" :class="['lang-' + lang]" >{{value}}</code></pre>
  </div>
</template>

<script>
import * as richmenu from "~/assets/js/richmenu-object.ts";

export default {
  props: {
    lang: {
      default: "json",
      type: String
    },
    value: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      html: ""
    };
  },
  watch: {
    value() {
      this.redraw();
    }
  },
  mounted() {
    this.redraw();
  },
  methods: {
    redraw() {
      this.$refs.code.textContent = this.value;
      this.html = Prism.highlightElement(this.$refs.code);
    }
  }
};
</script>

<style lang="scss" scoped>
.line-numbers {
  max-width: 100%;
  pre {
    @include mq-max("sm") {
      max-height: 15em;
    }
  }
}
</style>
