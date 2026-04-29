'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Language } from '.'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isHindi: boolean
  isEnglish: boolean
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const value: LanguageContextType = {
    language,
    setLanguage,
    isHindi: language === 'hi',
    isEnglish: language === 'en',
    toggleLanguage: () => setLanguage(language === 'en' ? 'hi' : 'en'),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function useLocale() {
  const { language } = useLanguage()
  return language
}
