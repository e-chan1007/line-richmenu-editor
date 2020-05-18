<template>
  <div class="e-line-window">
    <header class="e-line-header">
      <div class="e-line-square-button">
        <i class="fas fa-angle-left"></i>
      </div>
      <div class="e-line-fullwidth">
        <span>プレビュー</span>
      </div>
      <div class="e-line-square-button">
        <i class="fas fa-search"></i>
      </div>
      <div class="e-line-square-button">
        <i class="far fa-file-alt"></i>
      </div>
      <div class="e-line-square-button">
        <i class="fas fa-bars"></i>
      </div>
    </header>
    <div ref="chatWindow" class="e-line-chat">
      <div
        v-for="(message, id) in messages"
        :key="id"
        :class="['balloon', message.from]"
        v-html="message.text"
      ></div>
    </div>
    <img
      :class="{ 'e-line-menu': true, 'is-active': menuActive }"
      :src="menuImageUrl || '/placeholder.jpg'"
      alt="メニュー画像"
      @click.self="onMenuClicked"
    />
    <footer class="e-line-footer">
      <div class="e-line-square-button">
        <i class="fas fa-keyboard"></i>
      </div>
      <div class="e-line-vr"></div>
      <div class="e-line-fullwidth" @click="toggleMenuShown">
        <span
          :class="{
            center: true,
            'e-line-menu-toggle': true,
            'is-active': menuActive
          }"
          >&nbsp;{{ richMenu.chatBarText }}&nbsp;</span
        >
      </div>
    </footer>
  </div>
</template>

<script>
import * as richmenu from "../assets/js/richmenu-object";
export default {
  props: {
    richmenu: {
      type: richmenu.RichMenuObject,
      required: true
    },
    menuImageFile: {
      type: File,
      default: null
    }
  },
  data() {
    return {
      menuActive: true,
      menuImageUrl: null,
      richMenu: richmenu,
      messages: []
    };
  },
  watch: {
    menuImageFile() {
      if (this.menuImageFile != null) {
        if (this.menuImageFile.type.startsWith("image/")) {
          this.menuImageUrl = window.URL.createObjectURL(this.menuImageFile);
        }
      } else {
        this.menuImageUrl = null;
      }
    },
    richmenu: {
      handler() {
        this.richMenu = this.richmenu;
      },
      deep: true
    },
    messages() {
      this.$nextTick(() => {
        this.$refs.chatWindow.scrollTop = this.$refs.chatWindow.scrollHeight;
      });
    }
  },
  methods: {
    toggleMenuShown() {
      this.menuActive = !this.menuActive;
    },
    onMenuClicked(event) {
      const realX =
        event.offsetX * (event.target.naturalWidth / event.target.width);
      const realY =
        event.offsetY * (event.target.naturalHeight / event.target.height);
      this.$emit("image-clicked", realX, realY);
    }
  }
};
</script>

<style lang="scss" scoped>
.e-line-window {
  width: 100%;
  height: 100%;
  background-color: $color-line-bg;
  display: flex;
  justify-content: space-between;
  flex-flow: column;

  .e-line-header {
    display: flex;
    flex-flow: row wrap;

    background-color: $color-line-bg;
    width: 100%;
    height: 48px;
    .e-line-square-button,
    .e-line-fullwidth {
      color: $color-line-main;
    }
  }

  .e-line-menu {
    align-self: flex-end;
  }

  .e-line-footer {
    display: flex;
    align-self: flex-end;
    flex-flow: row wrap;
    align-self: end;
    background-color: $color-line-main;
    width: 100%;
    height: 48px;
    .e-line-square-button,
    .e-line-fullwidth {
      color: $color-white;
    }
  }

  .e-line-chat {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    .balloon {
      position: relative;
      width: auto;
      white-space: pre-wrap;
      margin: 8px 8px 8px 16px;
      padding: 4px 8px;
      background-color: $color-white;
      border-radius: 6px;
      &.bot {
        text-align: left;
        &::after {
          content: " ";
          position: absolute;
          top: 0;
          left: -8px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 12px 12px 0;
          border-color: transparent $color-white transparent transparent;
        }
      }

      &.user {
        text-align: left;
        margin-left: 22%;
        background-color: $color-line-balloon;
        &::after {
          content: " ";
          position: absolute;
          top: 0;
          right: -8px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 12px 12px 0 0;
          border-color: $color-line-balloon transparent transparent transparent;
        }
      }
    }
  }

  .e-line-menu {
    width: 100%;
    &:not(.is-active) {
      display: none;
    }
  }

  .e-line-square-button {
    width: 48px;
    height: 48px;
    text-align: center;
    position: relative;
    * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      text-align: center;
    }
  }

  .e-line-fullwidth {
    flex-grow: 1;
    height: 48px;
    position: relative;
    * {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9em;
      &.center {
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
      }
      &.e-line-menu-toggle.is-active::before {
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translateY(-12px) translateX(-50%);
        content: "\f0d7";
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
      }
    }
  }

  .e-line-vr {
    width: 1px;
    height: 48px;
    margin-right: 1px;
    border-right: 1px solid $color-line-border;
  }
}
</style>
