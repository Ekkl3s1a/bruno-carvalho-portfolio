import { createI18n } from 'vue-i18n'
import en from './locales/en'
import pt from './locales/pt'

export type MessageSchema = typeof en

export const i18n = createI18n<[MessageSchema], 'en' | 'pt'>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pt: pt as unknown as MessageSchema,
  },
})