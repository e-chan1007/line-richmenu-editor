<template>
  <div>
    <div class="container">
      <div class="rmedit">
        <div class="box">
          <e-form-group
            label="メニュー画像"
            type="file"
            file-accept="image/*"
            :file-changed="onImageSelected"
            :required="true"
          >
            <i class="fas fa-image"></i>

            <span>ファイルを選択</span>
          </e-form-group>

          <e-alert
            ref="alertWrongImage"
            :opening="wrongImage.length > 0"
            color="danger"
          >エラー:
            <ul>
              <li
                v-for="(error, index) in wrongImage"
                :key="index"
              >
                {{ error }}
              </li>
            </ul>
          </e-alert>

          <e-form-group
            label="メニュー名"
            :required="true"
          >
            <input
              v-model.trim="richMenu.name"
              type="text"
              required
              maxlength="300"
            />
          </e-form-group>

          <e-form-group
            label="開閉ボタンのテキスト"
            :required="true"
          >
            <input
              v-model.trim="richMenu.chatBarText"
              type="text"
              required
              maxlength="14"
            />
          </e-form-group>

          <e-form-group label="幅">
            <input
              v-model.number="richMenu.size.width"
              disabled
              type="number"
            />
          </e-form-group>

          <e-form-group label="高さ">
            <input
              v-model.number="richMenu.size.height"
              disabled
              type="number"
            />
          </e-form-group>

          <e-form-group type="checkbox">
            <input
              id="check-to-show-default"
              v-model="richMenu.selected"
              type="checkbox"
            />

            <label for="check-to-show-default">デフォルトで表示する</label>
          </e-form-group>

          <e-collapsable-list>
            <template slot="header">タップ領域 ({{ richMenu.areas.length }} / 20)</template>

            <template slot="header-right">
              <button
                :disabled="richMenu.areas.length === 20"
                @click="addArea"
              >
                <i class="fas fa-plus"></i>&nbsp;追加
              </button>
            </template>

            <template
              v-for="(area, index) in richMenu.areas"
              slot="content"
            >
              <e-collapsable-list-item :key="index">
                <template slot="header">
                  <i :class="area.action.type.icon"></i>&nbsp;

                  {{ area.action.type.name }}アクション
                </template>
                <template slot="header-right">
                  <button
                    class="is-danger"
                    @click="deleteArea(index)"
                  >
                    <i class="fas fa-trash"></i>&nbsp;削除
                  </button>
                </template>
                <template slot="content">
                  <e-area-editor
                    :area="area"
                    :image="richMenu.size"
                    @update="onUpdate"
                  />
                </template>
              </e-collapsable-list-item>
            </template>
          </e-collapsable-list>
          <div class="form-row button-group">
            <a
              class="button"
              @click="copyJson"
            >
              <i class="fas fa-clipboard"></i>&nbsp;コピー</a>
            <a
              class="button"
              @click="reset"
            >
              <i class="fas fa-trash"></i>&nbsp;リセット</a>
            <label class="button for-upload"><i class="fas fa-file-import"></i>&nbsp;インポート<input
                type="file"
                accept="application/json"
                @change="loadJson"
              /></label>
            <a
              class="button"
              @click="downloadJson"
            >
              <i class="fas fa-file-export"></i>&nbsp;エクスポート</a>
            <a
              class="button"
              @click="showsApiModal = true"
            >
              <i class="fas fa-terminal"></i>&nbsp;API</a>
          </div>
          <e-alert ref="alertCopied">
            コピーしました
          </e-alert>
          <prism
            lang="json"
            :value="json"
            class="prism-100per"
          ></prism>
        </div>

        <div class="box has-device">
          <div class="center">
            <div class="device device-google-pixel device-black">
              <div class="device-frame">
                <e-line-window
                  ref="lineWindow"
                  class="device-content"
                  :menu-image-file="imageFile"
                  :richmenu="richMenu"
                  @image-clicked="onImageClicked"
                ></e-line-window>
              </div>

              <div class="device-stripe"></div>
              <div class="device-header"></div>
              <div class="device-sensors"></div>
              <div class="device-btns"></div>
              <div class="device-power"></div>
            </div>
          </div>
        </div>

        <e-modal
          :condition="showsApiModal"
          @close="showsApiModal = false"
        >
          <h1><i class="fas fa-terminal"></i>&nbsp;API操作画面</h1>
          <h3><i class="fas fa-user"></i>&nbsp;API情報</h3>
          <e-form-group
            label="チャンネルアクセストークン"
            :required="true"
          >
            <input
              v-model.trim="api.accessToken"
              type="text"
              required
            />
          </e-form-group>
          <e-form-group label="リッチメニューID">
            <input
              v-model.trim="api.richMenuId"
              type="text"
            />
          </e-form-group>

          <e-alert
            ref="alertWrongApiParameter"
            :opening="wrongApiParameter.length > 0"
            color="danger"
          >エラー:
            <ul>
              <li
                v-for="(error, index) in wrongApiParameter"
                :key="index"
              >
                {{ error }}
              </li>
            </ul>
          </e-alert>
          <h3><i class="fas fa-paper-plane"></i>&nbsp;操作</h3>

          <div class="button-group">
            <a
              class="button"
              @click="callApiToCreate"
            >
              <i class="fas fa-cloud-upload-alt"></i>&nbsp;アップロード</a>
            <a
              class="button"
              @click="callApiToGet"
            >
              <i class="fas fa-cloud-download-alt"></i>&nbsp;ダウンロード</a>
            <a
              class="button"
              @click="callApiToSetDefault"
            >
              <i class="fas fa-cog"></i>&nbsp;デフォルトに設定</a>
            <a
              class="button"
              @click="callApiToDelete"
            >
              <i class="fas fa-trash"></i>&nbsp;削除</a>
          </div>
          <div style="margin: 16px 0; max-height: 8em; overflow-y: scroll;">
            <prism
              lang="json"
              :value="api.log"
            ></prism>
          </div>
        </e-modal>
      </div>
    </div>
  </div>
</template>

<script>
import "~/assets/js/prism.min.js";

import * as richmenu from "~/assets/js/richmenu-object.ts";

export default {
  data() {
    return {
      richMenu: null,
      json: "",
      imageFile: null,
      wrongImage: [],
      wrongApiParameter: [],
      showsApiModal: false,
      api: {
        accessToken: "",
        richMenuId: "",
        log: "",
        statusCode: 0
      }
    };
  },

  watch: {
    richMenu: {
      handler() {
        this.onUpdate();
      },
      deep: true
    },
    api: {
      handler() {
        localStorage.setItem("api.accessToken", this.api.accessToken);
      },
      deep: true
    }
  },

  created() {
    this.initialize();
    if (localStorage.getItem("api.accessToken") !== null)
      this.api.accessToken = localStorage.getItem("api.accessToken");
    if (localStorage.getItem("api.richMenuId") !== null)
      this.api.richMenuId = localStorage.getItem("api.richMenuId");
    if (localStorage.getItem("richMenuJson") !== null)
      this.jsonToRichMenu(JSON.parse(localStorage.getItem("richMenuJson")));
    if (localStorage.getItem("richMenuImage") !== null) {
      const base64 = localStorage.getItem("richMenuImage");
      const bin = atob(base64.replace(/^.*,/, ""));
      const mimeType = base64.match(/(:)([a-z/]+)(;)/)[2];
      const buffer = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }

      this.onImageSelected({
        target: { files: [new File([buffer.buffer], name, { type: mimeType })] }
      });
    }
  },
  methods: {
    initialize() {
      this.richMenu = new richmenu.RichMenuObject();
      this.json = "{}";
      this.imageFile = null;
    },
    reset() {
      localStorage.removeItem("richMenuJson");
      localStorage.removeItem("richMenuImage");
      localStorage.removeItem("richMenuId");
      this.initialize();
    },
    updateRichMenu(path, value) {
      const propertyArray = path.split(".");
      for (let i = 0; i <= propertyArray.length - 1; i += 1) {
        if (propertyArray[i] === "") return;
      }
      let result = this.richMenu;
      for (let i = 0; i <= propertyArray.length - 2; i += 1) {
        if (typeof result[propertyArray[i]] !== "object") {
          result[propertyArray[i]] = {};
        }
        result = result[propertyArray[i]];
      }
      result[propertyArray[propertyArray.length - 1]] = value;
    },

    onImageSelected(event) {
      if (event.target.files.length < 1) return;
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        const url = window.URL.createObjectURL(file);
        const image = document.createElement("img");
        image.src = url;
        image.onload = () => {
          const aspectRatio = image.width / image.height;
          this.wrongImage.splice(0, this.wrongImage.length);
          if (aspectRatio >= 1.45) {
            if (image.width >= 800 && image.width <= 2500) {
              if (image.height >= 250) {
                this.$refs.alertWrongImage.open = false;
                this.imageFile = file;
                this.richMenu.size.width = image.width;
                this.richMenu.size.height = image.height;
                const fileReader = new FileReader();
                fileReader.addEventListener("load", () => {
                  localStorage.setItem("richMenuImage", fileReader.result);
                });
                fileReader.readAsDataURL(this.imageFile);
              } else {
                this.wrongImage.push("画像の高さを250px以上にしてください。");
                this.$refs.alertWrongImage.open = true;
              }
            } else {
              this.wrongImage.push(
                "画像の幅を800px以上2500px以下にしてください。"
              );
              if (image.height < 250)
                this.wrongImage.push("画像の高さを250px以上にしてください。");

              this.$refs.alertWrongImage.open = true;
            }
          } else {
            if (image.width < 800 || image.width > 2500)
              this.wrongImage.push(
                "画像の幅を800px以上2500px以下にしてください。"
              );
            if (image.height < 250)
              this.wrongImage.push("画像の高さを250px以上にしてください。");

            this.wrongImage.push(
              `画像のアスペクト比(幅÷高さ)が1.45未満(選択された画像: ${aspectRatio})です`
            );
            this.$refs.alertWrongImage.open = true;
          }
        };
      }
    },
    onUpdate() {
      const object = JSON.parse(JSON.stringify(this.richMenu));
      object.areas.forEach((area) => {
        area.action.type = area.action.type.id;
        switch (area.action.type) {
          case "postback":
            delete area.action.text;
            delete area.action.uri;
            delete area.action.altUri;
            delete area.action.mode;
            delete area.action.initial;
            delete area.action.max;
            delete area.action.min;
            break;
          case "message":
            delete area.action.data;
            delete area.action.displayText;
            delete area.action.uri;
            delete area.action.altUri;
            delete area.action.mode;
            delete area.action.initial;
            delete area.action.max;
            delete area.action.min;
            break;
          case "uri":
            delete area.action.data;
            delete area.action.displayText;
            delete area.action.text;
            delete area.action.mode;
            delete area.action.initial;
            delete area.action.max;
            delete area.action.min;
            if (area.action.altUri.desktop === "") delete area.action.altUri;
            break;
          case "datetimepicker":
            delete area.action.displayText;
            delete area.action.text;
            delete area.action.uri;
            delete area.action.altUri;
            if (area.action.initial === "") delete area.action.initial;
            if (area.action.max === "") delete area.action.max;
            if (area.action.min === "") delete area.action.min;
            break;
        }
      });
      this.json = JSON.stringify(object, null, "  ");
      localStorage.setItem("richMenuJson", this.json);
    },
    addArea() {
      const richMenu = new richmenu.RichMenuArea();
      richMenu.action.type = richmenu.RichMenuActionType.postback;
      this.richMenu.areas.push(richMenu);
    },
    deleteArea(index) {
      this.richMenu.areas.splice(index, 1);
    },
    onImageClicked(realX, realY) {
      this.richMenu.areas.forEach((area) => {
        if (realX >= area.bounds.x && realY >= area.bounds.y) {
          if (
            area.bounds.x + area.bounds.width >= realX &&
            area.bounds.y + area.bounds.height >= realY
          ) {
            switch (area.action.type.id) {
              case "postback":
                this.$refs.lineWindow.messages.push({
                  from: "bot",
                  text: `[ポストバックイベント]\n${area.action.data}`
                });
                break;
              case "message":
                this.$refs.lineWindow.messages.push({
                  from: "user",
                  text: `[メッセージイベント]\n${area.action.text}`
                });
                break;
              case "uri":
                this.$refs.lineWindow.messages.push({
                  from: "bot",
                  text: `[URIイベント]\n${area.action.uri}`
                });
                break;
              case "datetimepicker":
                this.$refs.lineWindow.messages.push({
                  from: "user",
                  text: `[日時選択イベント]\n${area.action.data}`
                });
                break;
            }
          }
        }
      });
    },
    copyJson() {
      navigator.clipboard.writeText(this.json);
      this.$refs.alertCopied.open = true;
    },
    loadJson(event) {
      if (event.target.files.length < 1) return;
      const file = event.target.files[0];
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          this.jsonToRichMenu(JSON.parse(e.target.result));
        };
      }
    },
    downloadJson() {
      const blob = new Blob([this.json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const aToDownload = document.createElement("a");
      aToDownload.href = url;
      aToDownload.download = `${
        this.richMenu.name !== "" ? this.richMenu.name : "richmenu"
      }.json`;
      aToDownload.click();
    },
    jsonToRichMenu(json) {
      const richMenuObject = json;
      this.richMenu = new richmenu.RichMenuObject();
      this.richMenu.size = new richmenu.RichMenuSize(
        richMenuObject.size.width,
        richMenuObject.size.height
      );
      this.richMenu.selected = richMenuObject.selected;
      this.richMenu.name = richMenuObject.name;
      this.richMenu.chatBarText = richMenuObject.chatBarText;
      richMenuObject.areas.forEach((area) => {
        const richMenuAreaBounds = new richmenu.RichMenuAreaBounds(
          area.bounds.x,
          area.bounds.y,
          area.bounds.width,
          area.bounds.height
        );
        const richMenuAction = new richmenu.RichMenuAction(area.action.type);
        Object.keys(area.action).forEach((key) => {
          if (key !== "type") richMenuAction[key] = area.action[key];
        });
        const richMenuArea = new richmenu.RichMenuArea(
          richMenuAreaBounds,
          richMenuAction
        );
        this.richMenu.areas.push(richMenuArea);
      });
      this.onUpdate();
    },
    callApiToCreate() {
      this.wrongApiParameter.splice(0, this.wrongApiParameter.length);
      if (this.api.accessToken.length < 1)
        this.wrongApiParameter.push(
          "チャンネルアクセストークンを指定してください"
        );
      if (this.imageFile === null)
        this.wrongApiParameter.push("メニュー画像を指定してください");
      if (this.wrongApiParameter.length > 0) {
        this.$refs.alertWrongApiParameter.open = true;
        return;
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.api.log = `// APIを呼び出しています...`;
        fetch("/api/richmenu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accessToken: this.api.accessToken,
            json: this.json,
            image: fileReader.result
          })
        })
          .then((response) => {
            this.api.statusCode = response.status;
            return response.json();
          })
          .then((json) => {
            this.api.log = `// HTTP ${this.api.statusCode}: `;
            if (this.api.statusCode === 200) {
              this.api.log += "処理が正常に完了しました。\n";
              this.api.richMenuId = json.create.richMenuId;
              localStorage.setItem("api.richMenuId", this.api.richMenuId);
            } else {
              this.api.log += "処理中にエラーが発生しました。\n";
            }
            this.api.log += `// メニュー登録APIからの応答
${JSON.stringify(json.create, null, "  ")}`;
            if (typeof json.image !== "undefined")
              this.api.log += `
// メニュー画像登録APIからの応答
${JSON.stringify(json.image, null, "  ")}`;
          })
          .catch((reason) => {
            this.api.log = reason;
          });
      });
      fileReader.readAsDataURL(this.imageFile);
    },
    callApiToGet() {
      this.wrongApiParameter.splice(0, this.wrongApiParameter.length);
      if (this.api.accessToken.length < 1)
        this.wrongApiParameter.push(
          "チャンネルアクセストークンを指定してください"
        );
      if (this.api.richMenuId.length < 1)
        this.wrongApiParameter.push("リッチメニューIDを指定してください");
      if (this.wrongApiParameter.length > 0) {
        this.$refs.alertWrongApiParameter.open = true;
        return;
      }
      this.api.log = `// APIを呼び出しています...`;
      fetch(
        `/api/richmenu?access_token=${encodeURIComponent(
          this.api.accessToken
        )}&richmenu_id=${encodeURIComponent(this.api.richMenuId)}`,
        {
          method: "GET"
        }
      )
        .then((response) => {
          this.api.statusCode = response.status;
          return response.json();
        })
        .then((json) => {
          this.api.log = `// HTTP ${this.api.statusCode}: `;
          if (this.api.statusCode === 200) {
            this.api.log += "処理が正常に完了しました。\n";
          } else if (this.api.statusCode === 404) {
            this.api.log += "IDが一致するリッチメニューが存在しません。";
            return;
          } else {
            this.api.log += "処理中にエラーが発生しました。\n";
          }
          this.api.log += `// メニュー取得APIからの応答
${JSON.stringify(json.menu, null, "  ")}`;

          this.jsonToRichMenu(json.menu);

          const base64 = json.image;
          const bin = atob(base64.replace(/^.*,/, ""));
          const mimeType = base64.match(/(:)([a-z/]+)(;)/)[2];
          const buffer = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
          }

          this.onImageSelected({
            target: {
              files: [new File([buffer.buffer], name, { type: mimeType })]
            }
          });
        })
        .catch((reason) => {
          this.api.log = reason;
        });
    },
    callApiToDelete() {
      this.wrongApiParameter.splice(0, this.wrongApiParameter.length);
      if (this.api.accessToken.length < 1)
        this.wrongApiParameter.push(
          "チャンネルアクセストークンを指定してください"
        );
      if (this.api.richMenuId.length < 1)
        this.wrongApiParameter.push("リッチメニューIDを指定してください");
      if (this.wrongApiParameter.length > 0) {
        this.$refs.alertWrongApiParameter.open = true;
        return;
      }
      this.api.log = `// APIを呼び出しています...`;
      fetch(
        `/api/richmenu?access_token=${encodeURIComponent(
          this.api.accessToken
        )}&richmenu_id=${encodeURIComponent(this.api.richMenuId)}`,
        {
          method: "DELETE"
        }
      )
        .then((response) => {
          this.api.statusCode = response.status;
          return response.json();
        })
        .then((json) => {
          this.api.log = `// HTTP ${this.api.statusCode}: `;
          if (this.api.statusCode === 200) {
            this.api.log += "処理が正常に完了しました。\n";
            this.api.richMenuId = "";
          } else if (this.api.statusCode === 404) {
            this.api.log += "IDが一致するリッチメニューが存在しません。";
            return;
          } else {
            this.api.log += "処理中にエラーが発生しました。\n";
          }
          this.api.log += `// メニュー削除APIからの応答
${JSON.stringify(json.delete, null, "  ")}`;
        })
        .catch((reason) => {
          this.api.log = reason;
        });
    },
    callApiToSetDefault() {
      this.wrongApiParameter.splice(0, this.wrongApiParameter.length);
      if (this.api.accessToken.length < 1)
        this.wrongApiParameter.push(
          "チャンネルアクセストークンを指定してください"
        );
      if (this.api.richMenuId.length < 1)
        this.wrongApiParameter.push("リッチメニューIDを指定してください");
      if (this.wrongApiParameter.length > 0) {
        this.$refs.alertWrongApiParameter.open = true;
        return;
      }
      this.api.log = `// APIを呼び出しています...`;
      fetch(
        `/api/richmenu?access_token=${encodeURIComponent(
          this.api.accessToken
        )}&richmenu_id=${encodeURIComponent(
          this.api.richMenuId
        )}&action=set_default`,
        {
          method: "PATCH"
        }
      )
        .then((response) => {
          this.api.statusCode = response.status;
          return response.json();
        })
        .then((json) => {
          this.api.log = `// HTTP ${this.api.statusCode}: `;
          if (this.api.statusCode === 200) {
            this.api.log += "処理が正常に完了しました。\n";
          } else if (this.api.statusCode === 404) {
            this.api.log += "IDが一致するリッチメニューが存在しません。";
            return;
          } else {
            this.api.log += "処理中にエラーが発生しました。\n";
          }
          this.api.log += `// メニュー設定APIからの応答
${JSON.stringify(json.setDefault, null, "  ")}`;
        })
        .catch((reason) => {
          this.api.log = reason;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.rmedit {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  div.box {
    padding: 16px;
    @include mq-max("md") {
      &.has-device {
        position: relative;
        width: 100%;
        .center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
      }
    }

    &:not(.has-device) {
      flex-grow: 1;
    }
  }
}

@include mq-max("md") {
  .prism-100per {
    width: calc(90vw - 16px);
  }
}

@include mq-min("md") {
  .center {
    position: sticky;
    top: 16px;
  }
}
</style>
