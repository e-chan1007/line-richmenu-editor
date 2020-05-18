<template>
  <div class="e-collapsable-list-item">
    <header @click.self="toggleOpening">
      <div class="left">
        <slot name="header" />
        <i :class="{ fas: true, 'fa-chevron-down': true, opening }"></i>
      </div>
      <div class="right"><slot name="header-right" /></div>
    </header>
    <transition
      name="content"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div v-show="opening">
        <div class="content">
          <slot name="content" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
function nextFrame(fn) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(fn));
}

export default {
  data() {
    return {
      opening: false
    };
  },
  methods: {
    toggleOpening() {
      this.opening = !this.opening;
    },
    enter(el) {
      el.style.overflow = "hidden";
      el.style.height = "0";

      nextFrame(() => {
        el.style.height = `${el.scrollHeight}px`;
      });
    },
    leave(el) {
      el.style.overflow = "hidden";
      el.style.height = `${el.scrollHeight}px`;

      nextFrame(() => {
        el.style.height = "0";
      });
    },
    afterEnter(el) {
      el.style.height = "";
      el.style.overflow = "";
    },
    afterLeave(el) {
      el.style.height = "";
      el.style.overflow = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.e-collapsable-list-item {
  position: relative;
  transition: all ease 0.1s;
  header {
    padding: 8px;
    transition: all ease 0.1s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 48px;
    .button,
    button,
    a {
      font-size: 0.9em;
      padding: 4px 8px;
    }
    i.fa-chevron-down {
      position: absolute;
      top: 16px;
      right: 16px;
      transition: all ease 0.2s;
      &.opening {
        transform: rotate(-180deg);
      }
    }
    &:hover {
      background-color: $color-gray-bg;
    }
  }

  .content {
    padding: 8px;
    border-top: 1px solid $color-gray-bg;
  }
}
.content-enter-active,
.content-leave-active {
  transition: height ease 0.2s;
}
</style>
