<template>
  <div>
    <div class="form-row has-label between">
      <e-form-group
        label="起点X座標"
        :short="true"
      >
        <input
          v-model.number="area.bounds.x"
          type="number"
          min="0"
          :max="image.width"
          required
        />
      </e-form-group>
      <e-form-group
        label="起点Y座標"
        :short="true"
      >
        <input
          v-model.number="area.bounds.y"
          type="number"
          min="0"
          :max="image.height"
          required
        />
      </e-form-group>
      <e-form-group
        label="幅"
        :short="true"
      >
        <input
          v-model.number="area.bounds.width"
          type="number"
          min="1"
          :max="image.width - area.bounds.x"
          required
        />
      </e-form-group>
      <e-form-group
        label="高さ"
        :short="true"
      >
        <input
          v-model.number="area.bounds.height"
          type="number"
          min="1"
          :max="image.height - area.bounds.y"
          required
        />
      </e-form-group>
    </div>
    <e-form-group
      label="アクションの種類"
      type="select"
      :select-icon="area.action.type.icon"
    >
      <select @change="setActionType">
        <option
          v-for="(actionType, id) in RichMenuActionType"
          :key="id"
          :value="id"
          :selected="actionType === area.action.type"
        >
          {{ actionType.name }}
        </option>
      </select>
    </e-form-group>

    <e-form-group label="ラベル">
      <input
        v-model.trim="area.action.label"
        type="text"
        maxlength="20"
      />
    </e-form-group>

    <e-form-group
      v-if="
        area.action.type === RichMenuActionType.postback ||
          area.action.type === RichMenuActionType.datetimepicker
      "
      label="Webhookに返す文字列"
      :required="true"
    >
      <input
        v-model.trim="area.action.data"
        type="text"
        required
        maxlength="300"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.postback"
      label="トーク画面に表示するテキスト"
    >
      <input
        v-model.trim="area.action.displayText"
        type="text"
        maxlength="300"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.message"
      label="実行時に送信するテキスト"
      :required="true"
    >
      <input
        v-model.trim="area.action.text"
        type="text"
        required
        maxlength="300"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.uri"
      label="URI"
      :required="true"
    >
      <input
        v-model.trim="area.action.uri"
        type="text"
        placeholder="http(s)://, line://, tel:"
        pattern="(https?://|line://|tel:).+"
        title="使用できるスキームは http(s), line, tel です。"
        required
        maxlength="1000"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.uri"
      label="maxOS・Windowsで開くURI"
      pattern="(https?://|line://|tel:).+"
      title="使用できるスキームは http(s), line, tel です。"
    >
      <input
        v-model.trim="area.action.altUri.desktop"
        type="text"
        placeholder="http(s)://, line://, tel:"
        maxlength="1000"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.datetimepicker"
      label="モード"
      type="select"
    >
      <select
        v-model="area.action.mode"
        @change="onUpdate"
      >
        <option value="date">
          日付のみ
        </option>
        <option value="time">
          時刻のみ
        </option>
        <option value="datetime">
          日付と日時
        </option>
      </select>
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.datetimepicker"
      label="初期値"
    >
      <input
        :value="area.action.initial"
        :type="
          area.action.mode === 'datetime' ? 'datetime-local' : area.action.mode
        "
        @input="setDateTime('initial', $event)"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.datetimepicker"
      label="日時の最大値"
    >
      <input
        :value="area.action.max"
        :type="
          area.action.mode === 'datetime' ? 'datetime-local' : area.action.mode
        "
        @input="setDateTime('max', $event)"
      />
    </e-form-group>

    <e-form-group
      v-if="area.action.type === RichMenuActionType.datetimepicker"
      label="日時の最小値"
    >
      <input
        :value="area.action.min"
        :type="
          area.action.mode === 'datetime' ? 'datetime-local' : area.action.mode
        "
        @input="setDateTime('min', $event)"
      />
    </e-form-group>
  </div>
</template>

<script>
import {
  RichMenuSize,
  RichMenuArea,
  RichMenuActionType
} from "~/assets/js/richmenu-object";

export default {
  props: {
    area: {
      type: RichMenuArea,
      required: true
    },
    image: {
      type: RichMenuSize,
      required: true
    }
  },
  data() {
    return {
      RichMenuActionType,
      actionMode: ""
    };
  },
  watch: {
    area: {
      handler() {
        this.onUpdate();
      },
      deep: true
    }
  },
  methods: {
    setActionType(event) {
      this.area.action.type =
        RichMenuActionType[
          event.target.options[event.target.selectedIndex].value
        ];
    },
    setDateTime(key, event) {
      this.$set(this.area.action, key, event.target.value);
      this.onUpdate();
      this.$emit("update");
    },
    onUpdate() {
      if (this.area.action.mode !== this.actionMode) {
        this.area.action.initial = "";
        this.area.action.max = "";
        this.area.action.min = "";
        this.actionMode = this.area.action.mode;
      }
    }
  }
};
</script>
