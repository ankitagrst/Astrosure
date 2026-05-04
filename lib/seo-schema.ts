// SEO Schema.org structured data for rich snippets and search engine optimization

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AstroSure",
  description: "Vedic Astrology Platform for Kundali, Panchang, and Astrologer Consultations",
  url: "https://astrosure.in",
  logo: "https://astrosure.in/logo.png",
  email: "support@astrosure.in",
  sameAs: [
    "https://twitter.com/astrosure",
    "https://facebook.com/astrosure",
    "https://instagram.com/astrosure",
  ],
}

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Vedic Astrology Services",
  provider: {
    "@type": "Organization",
    name: "AstroSure",
    url: "https://astrosure.in",
  },
  areaServed: "IN",
  availableLanguage: "en-IN",
  description: "Comprehensive Vedic astrology services including Kundali generation, matching, panchang calculations, and astrologer consultations.",
}

export const kundaliMatchingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Kundali Matching Service",
  description: "Online Kundali matching (Manglik Dosha analysis) for marriage compatibility based on birth charts",
  provider: {
    "@type": "Organization",
    name: "AstroSure",
  },
  areaServed: "IN",
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a Kundali?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Kundali (birth chart) is a map of the positions of celestial bodies at the exact time and place of your birth. It's used in Vedic astrology to understand personality, life events, and spiritual path.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are online Kundali generators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AstroSure uses Swiss Ephemeris for deterministic astronomical calculations. Accuracy depends on the precision of your birth time - exact birth time ensures accurate planetary positions.",
      },
    },
    {
      "@type": "Question",
      name: "What is Manglik Dosha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Manglik Dosha occurs when Mars is positioned in certain houses in the birth chart. It's believed to create challenges in marriage and relationships.",
      },
    },
    {
      "@type": "Question",
      name: "What is Panchang?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Panchang is a Hindu calendar showing daily Vedic astrology information including Tithi, Nakshatra, Yoga, Karana, and sunrise/sunset times. It helps determine auspicious times for events.",
      },
    },
  ],
}

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const horoscopeSchema = (sign: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `${sign} Daily Horoscope`,
  description: `Daily horoscope for ${sign} zodiac sign with panchang-based predictions`,
  author: {
    "@type": "Organization",
    name: "AstroSure",
  },
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  publisher: {
    "@type": "Organization",
    name: "AstroSure",
    logo: {
      "@type": "ImageObject",
      url: "https://astrosure.in/logo.png",
    },
  },
})

export const zodiacSchema = {
  "@context": "https://schema.org",
  "@type": "Collection",
  name: "Zodiac Signs",
  description: "Complete information about 12 zodiac signs in Vedic astrology",
  mainEntity: [
    { name: "Aries", url: "https://astrosure.in/horoscope?sign=Aries" },
    { name: "Taurus", url: "https://astrosure.in/horoscope?sign=Taurus" },
    { name: "Gemini", url: "https://astrosure.in/horoscope?sign=Gemini" },
    { name: "Cancer", url: "https://astrosure.in/horoscope?sign=Cancer" },
    { name: "Leo", url: "https://astrosure.in/horoscope?sign=Leo" },
    { name: "Virgo", url: "https://astrosure.in/horoscope?sign=Virgo" },
    { name: "Libra", url: "https://astrosure.in/horoscope?sign=Libra" },
    { name: "Scorpio", url: "https://astrosure.in/horoscope?sign=Scorpio" },
    { name: "Sagittarius", url: "https://astrosure.in/horoscope?sign=Sagittarius" },
    { name: "Capricorn", url: "https://astrosure.in/horoscope?sign=Capricorn" },
    { name: "Aquarius", url: "https://astrosure.in/horoscope?sign=Aquarius" },
    { name: "Pisces", url: "https://astrosure.in/horoscope?sign=Pisces" },
  ],
}
