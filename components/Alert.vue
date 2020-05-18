<template>
  <div
    v-if="open"
    :class="['e-alert', 'color-' + color]"
  >
    <slot />
    <a
      class="e-close-button"
      @click="close"
    >
      <i class="fas fa-times"></i>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "success"
    },
    opening: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: this.opening
    };
  },
  watch: {
    opening() {
      this.open = this.opening;
    }
  },
  methods: {
    close() {
      this.open = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.e-alert {
  position: relative;
  width: 100%;
  padding: 8px 32px 8px 16px;
  margin: 16px 0;
  background-color: $color-accent-bg;
  border: 2px solid $color-accent;
  color: $color-accent;
  border-radius: 4px;

  &.color-danger {
    background-color: $color-danger-bg;
    border: 2px solid $color-danger;
    color: $color-danger;
  }

  &.color-success {
    background-color: $color-success-bg;
    border: 2px solid $color-success;
    color: $color-success;
  }

  &.color-warning {
    background-color: $color-warning-bg;
    border: 2px solid $color-warning;
    color: $color-warning;
  }

  ol,
  ul {
    margin-left: 16px;
  }

  .e-close-button {
    position: absolute;
    top: calc(50% - 0.7em);
    right: 20px;
    cursor: pointer;
  }
}
</style>
