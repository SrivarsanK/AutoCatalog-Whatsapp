export const strings = {
  en: {
    welcome: "Welcome to our product catalog! Please type a product name to search, or send *all* to view available products.",
    noResults: "No products found for '%s'.",
    multipleResultsHeader: "Found %s products",
    fullCatalogHeader: "Full Catalog",
    langChanged: "Language changed to English."
  },
  hi: {
    welcome: "हमारे उत्पाद कैटलॉग में आपका स्वागत है! कृपया खोजने के लिए कोई उत्पाद नाम टाइप करें, या सभी उपलब्ध उत्पाद देखने के लिए *all* भेजें।",
    noResults: "'%s' के लिए कोई उत्पाद नहीं मिला।",
    multipleResultsHeader: "%s उत्पाद मिले",
    fullCatalogHeader: "पूरा कैटलॉग",
    langChanged: "भाषा बदलकर हिंदी कर दी गई है।"
  },
  ta: {
    welcome: "எங்கள் தயாரிப்பு பட்டியலுக்கு வருக! தேட ஒரு தயாரிப்பு பெயரை தட்டச்சு செய்யவும், அல்லது அனைத்து தயாரிப்புகளையும் காண *all* என அனுப்பவும்.",
    noResults: "'%s' க்காக எந்த தயாரிப்பும் கிடைக்கவில்லை.",
    multipleResultsHeader: "%s தயாரிப்புகள் கிடைத்தன",
    fullCatalogHeader: "முழு தயாரிப்பு பட்டியல்",
    langChanged: "மொழி தமிழுக்கு மாற்றப்பட்டது."
  }
};

const userLanguages = new Map();

export function getUserLanguage(sender) {
  return userLanguages.get(sender) || 'en';
}

export function setUserLanguage(sender, langCode) {
  if (['en', 'hi', 'ta'].includes(langCode)) {
    userLanguages.set(sender, langCode);
  }
}

export function getString(sender, key, ...args) {
  const langCode = getUserLanguage(sender);
  let str = strings[langCode][key];

  if (!str) {
    str = strings['en'][key]; // Fallback to English
  }

  if (args.length > 0) {
    args.forEach(arg => {
      str = str.replace('%s', arg);
    });
  }

  return str;
}
