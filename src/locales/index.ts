import AsyncStorage from '@react-native-community/async-storage';
import { setErrMsg } from '@aomi/common-service/utils/getErrMsg';
import { Lang, Menu } from './types';
import * as zhCN from './zh-cn';

const StorageKey = 'language';

export type Language = 'zh-CN';

export type LanguageText<L extends keyof any, M extends keyof any> = {
  lang: Record<L, string>;
  // menu: Record<M, string>;
  resErrMsg: Record<string, any>;
};

export class I18n<L extends keyof any, M extends keyof any> {
  defaultLanguage: Language;
  language: Language;
  languages: Record<Language, LanguageText<L, M>>;

  constructor({
    defaultLanguage = 'zh-CN',
    language = 'zh-CN',
    languages,
  }: {
    defaultLanguage?: Language;
    language?: Language;
    languages: Record<Language, LanguageText<L, M>>;
  }) {
    this.defaultLanguage = defaultLanguage;
    this.language = language;
    this.languages = languages;
    this.init();
  }

  lang(key: L, defaultValue = '-'): string {
    return ((this.languages[this.language] || this.languages[this.defaultLanguage]).lang || {})[key] || defaultValue;
  }

  // menu(key: M, defaultValue = '-'): string {
  //   return ((this.languages[this.language] || this.languages[this.defaultLanguage]).menu || {})[key] || defaultValue;
  // }

  resErrMsg(): Record<string, any> {
    return (this.languages[this.language] || this.languages[this.defaultLanguage]).resErrMsg;
  }

  getLocale(): Language {
    return this.language || this.defaultLanguage;
  }

  getLanguageText(): LanguageText<L, M> {
    return this.languages[this.language] || this.languages[this.defaultLanguage];
  }

  async init() {
    let language = await AsyncStorage.getItem(StorageKey);
    this.language = (language as any) ?? 'zh-CN';
    setErrMsg(this.resErrMsg());
  }

  /**
   * 更换语言
   * @param language 新语种
   */
  async changeLanguage(language: Language) {
    console.log(`更换语言为: ${language}`);
    const userLanguage = await AsyncStorage.getItem(StorageKey);
    if (language === userLanguage) {
      return;
    }
    AsyncStorage.setItem(StorageKey, language);
  }
}

export function createLangProxy<L extends keyof any>(i18n: I18n<L, any>): (key: L, defaultValue?: string) => string {
  return function (key: L, defaultValue?: string) {
    return i18n.lang(key, defaultValue);
  };
}

export const i18n = new I18n<Lang, Menu>({
  languages: {
    'zh-CN': zhCN,
  },
});

export const lang = createLangProxy<Lang>(i18n);
