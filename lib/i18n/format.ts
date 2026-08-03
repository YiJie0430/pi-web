import type { Locale, TranslationParams } from "./types";

type MessagesByLocale = Record<string, Record<string, string>>;

/**
 * 替換翻譯訊息中的簡單插值佔位符。
 * @param message 原始翻譯訊息
 * @param params 插值參數
 * @returns 完成參數替換後的訊息
 */
export function interpolateMessage(message: string, params: TranslationParams = {}): string {
  return message.replace(/\{([\w.-]+)\}/g, (token, name: string) => {
    const value = params[name];
    return value === undefined ? token : String(value);
  });
}

/**
 * 從當前語言和英語語言包中解析訊息。
 * @param locale 當前語言
 * @param key 翻譯 key
 * @param messages 各語言的訊息字典
 * @param params 可選的插值參數
 * @returns 翻譯結果，缺失時返回 key
 */
export function translateMessage(
  locale: Locale,
  key: string,
  messages: MessagesByLocale,
  params: TranslationParams = {},
): string {
  const message = messages[locale]?.[key] ?? messages.en?.[key];
  if (message === undefined) {
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] Missing translation: ${key}`);
    return key;
  }
  return interpolateMessage(message, params);
}

/**
 * 按當前語言格式化相對時間。
 * @param date 要格式化的時間
 * @param locale 當前語言
 * @param now 用於測試或特殊場景的當前時間
 * @returns locale-aware 的相對時間文本
 */
export function formatRelativeTime(date: Date | string, locale: Locale, now = new Date()): string {
  const target = date instanceof Date ? date : new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);
  const [unit, divisor] = absMs < 60_000
    ? ["second", 1_000]
    : absMs < 3_600_000
      ? ["minute", 60_000]
      : absMs < 86_400_000
        ? ["hour", 3_600_000]
        : ["day", 86_400_000];
  const value = Math.round(diffMs / divisor);
  return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(value, unit as Intl.RelativeTimeFormatUnit);
}
