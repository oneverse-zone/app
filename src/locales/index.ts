import { setErrMsg } from '@aomi/common-service/utils/getErrMsg';
import { Lang } from './types';
import * as zhCN from './zh-cn';
import { repository } from '../services/Repository';

export type Language = 'zh-CN';

export type LanguageText<L extends keyof any> = {
  lang: Record<L, string>;
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

export function createLangProxy<L extends keyof any>(i18n: I18n<L>): (key: L, defaultValue?: string) => string {
  return function (key: L, defaultValue?: string) {
    return i18n.lang(key, defaultValue);
  };
}

export const i18n = new I18n<Lang>({
  languages: {
    'zh-CN': zhCN,
  },
});

export const lang = createLangProxy<Lang>(i18n);
