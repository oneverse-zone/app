import { setErrMsg } from '@aomi/common-service/utils/getErrMsg';
import * as zhCN from './zh-cn';
import { repository } from '../services/Repository';
import { LangKey } from './types';

export type Language = 'zh-CN';

export type LangValue = string | ((...args: any[]) => string);

export type LanguageText<L extends keyof any> = {
  lang: Record<L, LangValue>;
  // menu: Record<M, string>;
  resErrMsg: Record<string, any>;
};

export class I18n<L extends keyof any> {
  defaultLanguage: Language;
  language: Language;
  languages: Record<Language, LanguageText<L>>;

  constructor({
    defaultLanguage = 'zh-CN',
    language = 'zh-CN',
    languages,
  }: {
    defaultLanguage?: Language;
    language?: Language;
    languages: Record<Language, LanguageText<L>>;
  }) {
    this.defaultLanguage = defaultLanguage;
    this.language = language;
    this.languages = languages;
    this.init();
  }

  lang(key: L, defaultValue = '-'): LangValue {
    const languageText = (this.languages[this.language] || this.languages[this.defaultLanguage]).lang || {};
    const result = languageText[key];
    if (typeof result === 'function') {
      return result;
    }
    return result || defaultValue;
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

  getLanguageText(): LanguageText<L> {
    return this.languages[this.language] || this.languages[this.defaultLanguage];
  }

  async init() {
    let language = await repository.findLanguage();
    this.language = (language as any) ?? 'zh-CN';
    setErrMsg(this.resErrMsg());
  }

  /**
   * 更换语言
   * @param language 新语种
   */
  async changeLanguage(language: Language) {
    console.log(`更换语言为: ${language}`);
    const userLanguage = await repository.findLanguage();
    if (language === userLanguage) {
      return;
    }
    repository.saveLanguage(language);
  }
}

export function createLangProxy<L extends keyof any>(i18n: I18n<L>): (key: L, defaultValue?: string) => LangValue {
  return function (key: L, defaultValue?: string): LangValue {
    return i18n.lang(key, defaultValue);
  };
}

export const i18n = new I18n<LangKey>({
  languages: {
    'zh-CN': zhCN,
  },
});

export const lang = createLangProxy<LangKey>(i18n);
