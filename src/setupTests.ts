import { configure } from '@testing-library/react'
import '@testing-library/jest-dom'

configure({ testIdAttribute: 'data-testid' })

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      return key
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en'
    }
  })
}))
