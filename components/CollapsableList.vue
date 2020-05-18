<template>
  <div class="e-collapsable-list">
    <header>
      <div class="left"><slot name="header" /></div>
      <div class="right"><slot name="header-right" /></div>
    </header>
    <slot name="content" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.e-collapsable-list {
  border: 2px solid $color-gray;
  border-radius: 4px;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2em;
    padding: 8px;

    .button,
    button,
    a {
      font-size: 0.9em;
      padding: 4px 8px;
    }
  }

  .e-collapsable-list-item {
    border-top: 1px solid $color-gray;
  }
}
</style>
