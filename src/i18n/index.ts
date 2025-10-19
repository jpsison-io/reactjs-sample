import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'

const resources = {
  en: {
    translation: en,
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false
    },
  })

export default i18n
