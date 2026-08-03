/** 內建可用介面語言。 */
export type Locale = "en" | "zh-TW";

/** 翻譯字串使用的簡單插值參數。 */
export type TranslationParams = Record<string, string | number>;

/** 可註冊的語言包定義。 */
export interface LocalePlugin {
  /** 語言包唯一識別碼。 */
  id: string;
  /** 用於語言選擇選單的顯示名稱。 */
  label: string;
  /** 以穩定 key 索引的翻譯訊息。 */
  messages: Record<string, string>;
}
