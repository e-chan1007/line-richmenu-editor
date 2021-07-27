import axiosBase, { AxiosError } from "axios";
import { EditingRichMenuContextType } from "types/RichMenu";
import { v4 as uuidv4 } from "uuid";

const axios = axiosBase.create({ baseURL: "https://cors.api.e-chan.cf/", headers: { "Content-Type": "application/json" }, responseType: "json" });

const toBlob = (base64: string, type: string) => {
  const bin: string = atob(base64.split(",")[1]);
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type });
};

const authHeader = { headers: { Authorization: "Bearer wlFXns9nxmX9tNJLxwrebULn4mRems8gHh1oUp7va4RE75mLxqAroW18X+xS+/52P1iZa4XappQJ6NDKRyRW6VOML8G70QlQLB0SPJftBGtxtkB2gPQHdib+eZScWxD8fRhUFDXlSLAZcM3q2b5yvwdB04t89/1O/w1cDnyilFU=" } };

export type APIResponse = { label?: string, endpoint?: string, status: number, result: string, imageSrc?: string };
export type ParamsValidateResult = { isSucceeded: boolean, messages: string[] };
export type APISpecification = {
  key: string,
  label: string;
  description: string;
  endpoints: string[];
  validateParams: (params?: unknown) => ParamsValidateResult
  callAPI: (params?: unknown) => Promise<APIResponse[]>
}

class APIList extends Array<APISpecification> {
  constructor(initialValue: Array<APISpecification>) {
    super();
    this.push(...initialValue);
  }
  get(findKey: string): APISpecification {
    return this.find(({ key }: { key: string }) => key === findKey);
  }
}

export const apiList = new APIList([
  {
    key: "createRichMenu",
    label: "作成",
    description: "リッチメニューを作成し、画像をアップロード",
    endpoints: ["POST https://api.line.me/v2/bot/richmenu", "POST https://api-data.line.me/v2/bot/richmenu/{createdRichMenuId}/content"],
    validateParams: ({ menuImage }: EditingRichMenuContextType) => {
      if (!(menuImage && menuImage.image)) return { isSucceeded: false, messages: ["メニュー画像を指定してください"] };
      return { isSucceeded: true, messages: [] };
    },
    callAPI: async ({ menu, menuImage, setters: { changeRichMenuId } }: EditingRichMenuContextType): Promise<APIResponse[]> => {
      const responses: APIResponse[] = [];
      const createRichMenuResponse = await axios.post("api.line.me/v2/bot/richmenu", menu, authHeader).catch(({ response }: AxiosError<unknown>) => response);
      responses.push({ label: "リッチメニュー作成API", endpoint: "https://api.line.me/v2/bot/richmenu", status: createRichMenuResponse.status, result: JSON.stringify(createRichMenuResponse.data) });
      if (createRichMenuResponse.data.richMenuId) {
        changeRichMenuId(createRichMenuResponse.data.richMenuId);
        const contentType = { JPEG: "image/jpeg", PNG: "image/png" }[menuImage.fileType];
        const uploadRichMenuImageResponse = await axios.post(
          `api-data.line.me/v2/bot/richmenu/${createRichMenuResponse.data.richMenuId}/content`,
          toBlob(menuImage.image.src, contentType),
          { headers: { ...authHeader.headers, "Content-Type": contentType } }
        ).catch(({ response }: AxiosError<unknown>) => response);
        responses.push({ label: "画像アップロードAPI", endpoint: `https://api-data.line.me/v2/bot/richmenu/${createRichMenuResponse.data.richMenuId}/content`, status: uploadRichMenuImageResponse.status, result: JSON.stringify(uploadRichMenuImageResponse.data) });
      }
      return responses;
    }
  },
  {
    key: "deleteRichMenu",
    label: "削除",
    description: "リッチメニューを削除する",
    endpoints: ["DELETE https://api.line.me/v2/bot/richmenu/{richMenuId}"],
    validateParams: () => ({ isSucceeded: true, messages: [] }),
    callAPI: async (
      { richMenuId, deleteFromLocal, setters: { changeRichMenuId } }: EditingRichMenuContextType & { deleteFromLocal: boolean }
    ): Promise<APIResponse[]> => {
      const responses: APIResponse[] = [];
      if (richMenuId.startsWith("richmenu-")) {
        const deleteRichMenuResponse = await axios.delete(`api.line.me/v2/bot/richmenu/${richMenuId}`, authHeader).catch(({ response }: AxiosError<unknown>) => response);
        responses.push({ label: "リッチメニュー削除API", endpoint: "https://api.line.me/v2/bot/richmenu", status: deleteRichMenuResponse.status, result: JSON.stringify(deleteRichMenuResponse.data) });
      }
      changeRichMenuId((deleteFromLocal || !richMenuId.startsWith("richmenu-")) ? "DELETED" : uuidv4());
      return responses;
    }
  }
]);
