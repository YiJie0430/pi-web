import { enLocale } from "./messages/en";
import { zhTWLocale } from "./messages/zh-CN";
import type { Locale, LocalePlugin } from "./types";

const localePlugins = new Map<string, LocalePlugin>();

/** 註冊一個語言包；重複註冊會拋出異常，避免靜默覆蓋翻譯。 */
export function registerLocale(plugin: LocalePlugin): void {
  if (!plugin.id.trim()) throw new Error("Locale id must not be empty");
  if (localePlugins.has(plugin.id)) throw new Error(`Locale already registered: ${plugin.id}`);
  localePlugins.set(plugin.id, plugin);
}

/**
 * 根據識別碼獲取已註冊的語言包。
 * @param id 要查詢的語言識別碼
 * @returns 已註冊的語言包，不存在時返回 undefined
 */
export function getLocalePlugin(id: string): LocalePlugin | undefined {
  return localePlugins.get(id);
}

/** 獲取當前已註冊語言的穩定順序列表。 */
export function getSupportedLocales(): string[] {
  return [...localePlugins.keys()];
}

/**
 * 將瀏覽器語言列表解析為 Pi Web 內建語言。
 * @param languages 瀏覽器按優先順序排列的語言列表
 * @returns 匹配的內建語言，無法匹配時返回英語
 */
export function resolveBrowserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const normalized = language.toLowerCase();
    if (normalized === "en" || normalized.startsWith("en-")) return "en";
    if (normalized === "zh" || normalized.startsWith("zh-")) return "zh-TW";
  }
  return "en";
}

registerLocale(enLocale);
registerLocale(zhTWLocale);
