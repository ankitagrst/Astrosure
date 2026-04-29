export type Language = 'en' | 'hi'

export interface KundaliTranslation {
  pageTitle: string
  pageSubtitle: string
  birthDetails: string
  formDescription: string
  name: string
  gender: string
  male: string
  female: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  generating: string
  generateKundali: string
  kundaliReport: string
  generatedWithMahakaal: string
  english: string
  hindi: string
  language: string
  mahakaalTime: string
  basicDetails: string
  charts: string
  planets: string
  houses: string
  predictions: string
  doshaAnalysis: string
  upayDevta: string
  yearlyHoroscope: string
  dashaPeriods: string
  birthDetailsTitle: string
  birthDate: string
  birthTime: string
  nakshatra: string
  sunSign: string
  moonSign: string
  ascendant: string
  planet: string
  sign: string
  house: string
  status: string
  downloadTitle: string
  downloadSubtitle: string
  generatingPDF: string
  downloadPDF: string
  signInToSave: string
  generateAnother: string
}

const EN: KundaliTranslation = {
  pageTitle: 'Generate Your Free Kundali',
  pageSubtitle: 'Enter your birth details to create your personalized birth chart',
  birthDetails: 'Birth Details',
  formDescription: 'Fill in your information accurately for precise calculations',
  name: 'Full Name',
  gender: 'Gender',
  male: 'Male',
  female: 'Female',
  dateOfBirth: 'Date of Birth',
  timeOfBirth: 'Time of Birth',
  placeOfBirth: 'Place of Birth',
  generating: 'Generating...',
  generateKundali: 'Generate Kundali',
  kundaliReport: 'Kundali Report',
  generatedWithMahakaal: 'Generated using Mahakaal Standard Time for',
  english: 'English',
  hindi: 'Hindi',
  language: 'Language',
  mahakaalTime: 'Mahakaal Time',
  basicDetails: 'Basic Details',
  charts: 'Charts',
  planets: 'Planets',
  houses: 'Houses',
  predictions: 'Predictions',
  doshaAnalysis: 'Dosha Analysis',
  upayDevta: 'Upay & Devta',
  yearlyHoroscope: 'Year Horoscope',
  dashaPeriods: 'Dasha Periods',
  birthDetailsTitle: 'Birth Details',
  birthDate: 'Date',
  birthTime: 'Time',
  nakshatra: 'Nakshatra',
  sunSign: 'Sun Sign',
  moonSign: 'Moon Sign',
  ascendant: 'Ascendant',
  planet: 'Planet',
  sign: 'Sign',
  house: 'House',
  status: 'Status',
  downloadTitle: 'Download & share your kundli report',
  downloadSubtitle: 'Get a detailed PDF report with all predictions and remedies',
  generatingPDF: 'Generating PDF...',
  downloadPDF: 'Download Kundli PDF',
  signInToSave: 'Sign in to Save',
  generateAnother: 'Generate another chart',
}

const HI: KundaliTranslation = {
  pageTitle: 'अपनी फ्री कुंडली बनाएं',
  pageSubtitle: 'अपना जन्म विवरण भरें और व्यक्तिगत जन्म कुंडली प्राप्त करें',
  birthDetails: 'जन्म विवरण',
  formDescription: 'सटीक गणना के लिए सही जानकारी भरें',
  name: 'पूरा नाम',
  gender: 'लिंग',
  male: 'पुरुष',
  female: 'महिला',
  dateOfBirth: 'जन्म तिथि',
  timeOfBirth: 'जन्म समय',
  placeOfBirth: 'जन्म स्थान',
  generating: 'बन रही है...',
  generateKundali: 'कुंडली बनाएं',
  kundaliReport: 'कुंडली रिपोर्ट',
  generatedWithMahakaal: 'महाकाल मानक समय से निर्मित रिपोर्ट:',
  english: 'English',
  hindi: 'हिंदी',
  language: 'भाषा',
  mahakaalTime: 'महाकाल समय',
  basicDetails: 'मूल विवरण',
  charts: 'चार्ट',
  planets: 'ग्रह',
  houses: 'भाव',
  predictions: 'भविष्यवाणी',
  doshaAnalysis: 'दोष विश्लेषण',
  upayDevta: 'उपाय और देवता',
  yearlyHoroscope: 'वार्षिक राशिफल',
  dashaPeriods: 'दशा अवधि',
  birthDetailsTitle: 'जन्म विवरण',
  birthDate: 'तिथि',
  birthTime: 'समय',
  nakshatra: 'नक्षत्र',
  sunSign: 'सूर्य राशि',
  moonSign: 'चंद्र राशि',
  ascendant: 'लग्न',
  planet: 'ग्रह',
  sign: 'राशि',
  house: 'भाव',
  status: 'स्थिति',
  downloadTitle: 'अपनी कुंडली रिपोर्ट डाउनलोड और शेयर करें',
  downloadSubtitle: 'सभी भविष्यवाणियों और उपायों वाली विस्तृत PDF रिपोर्ट पाएं',
  generatingPDF: 'PDF बन रही है...',
  downloadPDF: 'कुंडली PDF डाउनलोड करें',
  signInToSave: 'सेव करने के लिए लॉगिन करें',
  generateAnother: 'नई कुंडली बनाएं',
}

export function getKundaliTranslation(language: Language): KundaliTranslation {
  return language === 'hi' ? HI : EN
}
