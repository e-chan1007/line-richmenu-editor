<template>
  <nav class="e-navbar">
    <h1>リッチメニューエディタ</h1>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.e-navbar {
  @include box-shadow;
  display: flex;
  background-color: $color-main;
  width: 100%;
  padding: 4px 8vw;
  height: 48px;

  h1 {
    color: $color-white;
  }
}
</style>
