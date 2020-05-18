<template>
  <div
    :class="{ 'e-form-group': true, 'is-short': short }"
    :data-type="type"
  >
    <template v-if="type === 'file'">
      <label>
        <span
          v-if="required"
          class="label-required"
        >必須</span>
        {{ label }}
      </label>
      <div class="form">
        <label class="is-input-file">
          <slot /><input
            type="file"
            :accept="fileAccept"
            @change="fileChanged"
          /></label>
      </div>
    </template>
    <template v-else-if="type === 'checkbox'">
      <slot />
    </template>
    <template v-else-if="type === 'select'">
      <label>
        <span
          v-if="required"
          class="label-required"
        >必須</span>
        {{ label }}</label>
      <div class="form">
        <div :class="{ 'select-wrap': true, 'has-icon': selectIcon != null }">
          <i
            v-if="selectIcon != null"
            :class="selectIcon"
          ></i>
          <slot />
        </div>
      </div>
    </template>
    <template v-else>
      <label><span
          v-if="required"
          class="label-required"
        >必須</span>
        {{ label }}</label>
      <div class="form">
        <slot />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    short: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    fileChanged: {
      type: Function,
      default() {}
    },
    fileAccept: {
      type: String,
      default: "*/*"
    },
    selectIcon: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/button";
.e-form-group {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  height: 3.2em;

  @include mq-max("sm") {
    flex-flow: column;
    align-items: flex-start;
    height: auto;
    &:not([data-type="checkbox"]):not([data-type="file"]) {
      label {
        width: 100%;
        margin: 12px 0 auto 0;
      }
    }

    .form {
      width: 100%;
      margin: 8px 0 4px 0;
    }
  }

  &:not([data-type="checkbox"]) {
    label {
      display: block;
      width: 275px;
      // margin-right: 16px;
    }
  }

  label.is-input-file {
    @extend .button;
    display: block;
    width: 100%;

    input {
      display: block;
      display: none;
      width: 100%;
    }
  }

  .form {
    display: block;
    flex: 1;

    input,
    button,
    a {
      display: block;
      width: 100%;
    }
  }

  .label-required {
    margin: 4px 4px 4px 0;
    padding: 4px;
    border: 2px solid $color-danger;
    border-radius: 4px;
    color: $color-danger;
    font-weight: bold;
  }

  &.is-short {
    display: block;
    width: calc(25% - 8px);
    &:not([data-type="checkbox"]) {
      label {
        display: block;
        flex-grow: 0;
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }

    .form {
      display: inline;
      input,
      button,
      a {
        display: block;
      }
    }
  }
}
</style>
