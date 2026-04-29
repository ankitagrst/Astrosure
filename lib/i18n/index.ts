import { enLocale } from './locales/en'
import { hiLocale } from './locales/hi'

export type Language = 'en' | 'hi'

export { LanguageProvider, useLanguage, useLocale } from './language-context'

export const locales: Record<Language, typeof enLocale> = {
  en: enLocale,
  hi: hiLocale,
}

export function getLocale(language: Language): typeof enLocale {
  return locales[language] || locales.en
}

export function formatDate(date: Date, language: Language = 'en'): string {
  const locale = getLocale(language)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  // For Hindi, we'll use the locale data
  if (language === 'hi') {
    const day = date.getDate()
    const month = locale.months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export function getWeekday(dayIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.weekdays[dayIndex % 7] || ''
}

export function getTithi(tithiIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.tithis[tithiIndex % locale.tithis.length] || ''
}

export function getNakshatra(nakshatraIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.nakshatras[nakshatraIndex % locale.nakshatras.length] || ''
}

export function getYoga(yogaIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.yogas[yogaIndex % locale.yogas.length] || ''
}

export function getKarana(karanaIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.karanas[karanaIndex % locale.karanas.length] || ''
}

export function getSign(signIndex: number, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.signs[signIndex % 12] || ''
}

export function getPlanetName(planetKey: keyof typeof enLocale.planets, language: Language = 'en'): string {
  const locale = getLocale(language)
  return locale.planets[planetKey] || ''
}

export function getDivisionalChartLabel(key: string, language: Language = 'en'): string {
  const locale = getLocale(language)
  const chart = locale.divisionalCharts[key as keyof typeof locale.divisionalCharts]
  return chart?.label || key
}

export function getDivisionalChartDescription(key: string, language: Language = 'en'): string {
  const locale = getLocale(language)
  const chart = locale.divisionalCharts[key as keyof typeof locale.divisionalCharts]
  return chart?.description || ''
}

export function getDayMuhurat(index: number, language: Language = 'en') {
  const locale = getLocale(language)
  return locale.dayMuhurats[index] || null
}

export function getNightMuhurat(index: number, language: Language = 'en') {
  const locale = getLocale(language)
  return locale.nightMuhurats[index] || null
}

export function getMuhuratRecommendation(key: string, language: Language = 'en') {
  const locale = getLocale(language)
  const rec = locale.muhuratRecommendations[key as keyof typeof locale.muhuratRecommendations]
  return rec || null
}

export const i18n = {
  getLocale,
  formatDate,
  getWeekday,
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSign,
  getPlanetName,
  getDivisionalChartLabel,
  getDivisionalChartDescription,
  getDayMuhurat,
  getNightMuhurat,
  getMuhuratRecommendation,
}
