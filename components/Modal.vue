<template>
  <transition name="modal" appear>
    <div
      v-if="condition"
      class="modal modal-overlay"
      @click.self="$emit('close')"
    >
      <div class="modal-window">
        <div class="modal-content">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="$emit('close')">
              閉じる
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    condition: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    padding: 32px 32px 8px 32px;
  }

  &-window {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    width: 80%;
  }

  &-content {
    padding: 10px 20px;
  }

  &-footer {
    padding: 16px;
    text-align: right;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;

  .modal-window {
    transition: opacity 0.3s, transform 0.3s;
  }
}

.modal-leave-active {
  transition: opacity 0.3s ease 0.3s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
