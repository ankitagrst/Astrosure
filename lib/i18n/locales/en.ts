export const enLocale = {
  common: {
    language: 'English',
    date: 'Date',
    time: 'Time',
    location: 'Location',
  },
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  
  // Zodiac Signs
  signs: [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ],

  // Nakshatras (Lunar Mansions)
  nakshatras: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ],

  // Tithis (Lunar Days)
  tithis: [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
  ],

  // Yogas (Auspicious Combinations)
  yogas: [
    'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti',
  ],

  // Karanas (Sub-divisions of Tithi)
  karanas: [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna',
  ],

  // Planets
  planets: {
    sun: 'Sun',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    rahu: 'Rahu',
    ketu: 'Ketu',
  },

  // Divisional Charts
  divisionalCharts: {
    D1: { label: 'Rashi', description: 'Physical body, general life' },
    D2: { label: 'Hora', description: 'Wealth, prosperity' },
    D3: { label: 'Drekkana', description: 'Siblings, courage' },
    D7: { label: 'Saptamsa', description: 'Children, progeny' },
    D9: { label: 'Navamsa', description: 'Spouse, dharma' },
    D10: { label: 'Dasamsa', description: 'Career, profession' },
    D12: { label: 'Dwadasamsa', description: 'Parents, lineage' },
    D16: { label: 'Shodasamsa', description: 'Vehicles, comforts' },
    D60: { label: 'Shashtyamsa', description: 'General karmic results' },
  },

  // Day Muhurats
  dayMuhurats: [
    { name: 'Rudra', deity: 'Shiva (Destruction)', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Ahi', deity: 'Snake (Rahu)', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Mitra', deity: 'Friend/Sun', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Pitra', deity: 'Ancestors', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Vasu', deity: 'Elemental Gods', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Varaha', deity: 'Vishnu (Boar)', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Vishwadeva', deity: 'Universal Deities', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Vidhi (Abhijit)', deity: 'Brahma/Vishnu', nature: 'Extremely Auspicious', specialLabel: 'Abhijit' },
    { name: 'Sutamukhi', deity: 'Charioteer', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Puruhuta', deity: 'Indra', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Vahini', deity: 'Agni', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Naktanakar', deity: 'Night-maker', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Varun', deity: 'Water/Ocean', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Aryaman', deity: 'Noble/Chief', nature: 'Auspicious (Except Sun)', specialLabel: undefined },
    { name: 'Bhaga', deity: 'Fortune', nature: 'Inauspicious', specialLabel: undefined },
  ],

  // Night Muhurats
  nightMuhurats: [
    { name: 'Girish', deity: 'Lord of Mountains', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Ajapad', deity: 'Unborn (Eka-pada)', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Ahirbudhnya', deity: 'Depths', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Pushya', deity: 'Nourishment', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Ashwini', deity: 'Horsemen (Healers)', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Yama', deity: 'God of Death', nature: 'Inauspicious', specialLabel: undefined },
    { name: 'Agni', deity: 'Fire', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Vidharta', deity: 'Creator', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Kanda', deity: 'Ornament', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Aditi', deity: 'Infinite Mother', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Jiva/Amrit', deity: 'Immortal Life', nature: 'Very Auspicious', specialLabel: undefined },
    { name: 'Vishnu', deity: 'Preserver', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Dyumadgadyuti', deity: 'Brightness', nature: 'Auspicious', specialLabel: undefined },
    { name: 'Brahma', deity: 'Creator', nature: 'Extremely Auspicious', specialLabel: 'Brahma Muhurat' },
    { name: 'Samudram', deity: 'Ocean', nature: 'Auspicious', specialLabel: undefined },
  ],

  // Muhurat Recommendations
  muhuratRecommendations: {
    ghar: {
      title: 'Ghar Pravesh',
      summary: 'Strong for house entry, moving in, and settling a new home.',
    },
    vivah: {
      title: 'Vivah',
      summary: 'Marriage-focused selection with a bias toward harmony and auspiciousness.',
    },
    business: {
      title: 'Business / Work',
      summary: 'Best for launches, contracts, sales, and professional starts.',
    },
    travel: {
      title: 'Travel',
      summary: 'Useful for journeys, departures, and movement-related starts.',
    },
    puja: {
      title: 'Puja / Spiritual',
      summary: 'Best for prayer, mantra, meditation, and sankalpa work.',
    },
    study: {
      title: 'Study / Learning',
      summary: 'Good for reading, learning, exams, and knowledge-based work.',
    },
  },

  // Panchang Terms
  panchang: {
    title: 'Panchang',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    muhurat: 'Muhurat',
    muhurats: 'Muhurats',
    daytime: 'Daytime',
    nighttime: 'Nighttime',
    specialMuhurats: 'Special Muhurats',
    abhijit: 'Abhijit Muhurat',
    brahma: 'Brahma Muhurat',
    recommendations: 'Recommendations',
  },

  // Daily Blocks
  dailyBlocks: {
    'Rahu Kaal': 'Rahu Kaal',
    'Yamaganda': 'Yamaganda',
    'Gulika': 'Gulika',
  },

  // Nature descriptions
  nature: {
    inauspicious: 'Inauspicious',
    auspicious: 'Auspicious',
    veryAuspicious: 'Very Auspicious',
    extremelyAuspicious: 'Extremely Auspicious',
  },
};
