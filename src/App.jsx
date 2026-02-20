import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ─── TRANSLATION DICTIONARY ────────────────────────────────────────────────────
const translations = {
  en: {
    appName: "PraliCash", appTagline: "Stubble Money",
    selectRole: "How will you continue?",
    asFarmer: "Continue as Farmer", asBuyer: "Continue as Company Buyer",
    farmerDesc: "List your paddy/wheat stubble for sale",
    buyerDesc: "Source bulk biomass for your industrial plant",
    login: "Login", signup: "Sign Up", logout: "Logout",
    username: "Username", password: "Password", email: "Email",
    farmerLogin: "Farmer Login", buyerLogin: "Company Buyer Login",
    noAccount: "New company?", haveAccount: "Already have account?", signupLink: "Sign up here", loginLink: "Login here",
    buyerName: "Your Name", companyName: "Company Name", phone: "Phone (optional)",
    sendOtp: "Send OTP", verifyOtp: "Verify OTP", resendOtp: "Resend OTP",
    otpTitle: "Enter OTP", otpSent: "A 6-digit code was sent to", otpExpires: "Expires in",
    dashboard: "Dashboard", myListings: "My Listings", myOffers: "My Offers",
    createListing: "Create New Listing", createDemand: "Post Demand",
    myDemands: "My Demands", matches: "Matches", mapView: "Map View",
    impactDashboard: "Impact", admin: "Admin", calculator: "Calculator",
    marketplace: "Marketplace", availableRequirements: "Available Requirements",
    readAloud: "Read Aloud",
    villageName: "Village Name", acres: "Acres (area)",
    harvestStart: "Harvest Start", harvestEnd: "Harvest End",
    estimatedTonnes: "Estimated Tonnes (auto)", submit: "Submit",
    cancel: "Cancel", status: "Status", tonnes: "Tonnes",
    distance: "Distance", price: "Price per Tonne", pickupDate: "Pickup Date",
    runClustering: "Run Clustering", runMatching: "Run Matching",
    clusterReady: "Cluster Ready", matchProposed: "Match Proposed",
    accept: "Accept", reject: "Reject",
    totalSaved: "Total Tonnes Saved", co2Avoided: "CO₂ Avoided",
    farmersHelped: "Farmers Helped", matchesDone: "Matches Completed",
    burnVsSell: "Burn vs Sell Calculator", yourAcres: "Your Acres",
    ifYouBurn: "If You Burn", ifYouSell: "If You Sell", netBenefit: "Net Benefit",
    requiredTonnes: "Required Tonnes", locationText: "Pickup Location",
    earliestPickup: "Earliest Pickup", latestPickup: "Latest Pickup",
    matchReason: "Why This Match?", viewMap: "View on Map",
    exportPdf: "Export Pickup Note", notifications: "Notifications",
    noNotifications: "No notifications yet", markRead: "Mark all read",
    language: "Language", settings: "Settings",
    open: "Open", clustered: "Clustered", pickedUp: "Picked Up", cancelled: "Cancelled",
    ready: "Ready", matched: "Matched", inTransit: "In Transit", done: "Done",
    proposed: "Proposed", accepted: "Accepted", rejected: "Rejected", completed: "Completed",
    disclaimer: "All environmental figures are estimates based on IPCC/CPCB factors.",
    adminPanel: "Admin Panel", configConstants: "System Constants", auditLog: "Audit Log",
    tonnesPerAcre: "Tonnes per Acre", minClusterTonnes: "Min Cluster Tonnes",
    distanceThreshold: "Distance Threshold (km)", saveConfig: "Save Config",
    noListings: "No listings yet. Create your first listing!",
    noDemands: "No demands posted yet.",
    noMatches: "No matches yet. Run matching engine.",
    loading: "Loading...", error: "Something went wrong",
    welcomeFarmer: "Welcome, Farmer!", welcomeBuyer: "Welcome!",
    invalidCredentials: "Invalid username or password",
    otpExpired: "OTP expired. Request a new one.", otpInvalid: "Invalid OTP.",
    rateLimited: "Too many attempts. Wait 1 hour.",
    fullName: "Full Name", district: "District", state: "State",
    locationRequired: "Geo Location", clusterMembers: "Cluster Members",
    netScore: "Match Score", transportCost: "Est. Transport Cost",
    envImpact: "Environmental Impact", co2: "CO₂ Avoided", pm25: "PM2.5 Avoided",
    coalReplaced: "Coal Replaced", earnings: "Farmer Earnings",
    back: "Back", close: "Close", save: "Save",
    changeRole: "Change Role",
  },
  hi: {
    appName: "प्रालीकैश", appTagline: "पराली से पैसे",
    selectRole: "आप कैसे जारी रखेंगे?",
    asFarmer: "किसान के रूप में जारी रखें", asBuyer: "कंपनी खरीदार के रूप में जारी रखें",
    farmerDesc: "अपनी पराली बेचने के लिए सूचीबद्ध करें",
    buyerDesc: "बायोमास थोक में खरीदें",
    login: "लॉगिन", signup: "साइन अप", logout: "लॉगआउट",
    username: "उपयोगकर्ता नाम", password: "पासवर्ड", email: "ईमेल",
    farmerLogin: "किसान लॉगिन", buyerLogin: "कंपनी खरीदार लॉगिन",
    noAccount: "नई कंपनी?", haveAccount: "पहले से खाता है?", signupLink: "यहाँ साइन अप करें", loginLink: "यहाँ लॉगिन करें",
    buyerName: "आपका नाम", companyName: "कंपनी का नाम", phone: "फोन (वैकल्पिक)",
    sendOtp: "OTP भेजें", verifyOtp: "OTP सत्यापित करें", resendOtp: "OTP पुनः भेजें",
    otpTitle: "OTP दर्ज करें", otpSent: "6-अंकीय कोड भेजा गया", otpExpires: "समाप्त होता है",
    dashboard: "डैशबोर्ड", myListings: "मेरी सूचियाँ", myOffers: "मेरे प्रस्ताव",
    createListing: "नई सूची बनाएं", createDemand: "माँग पोस्ट करें",
    myDemands: "मेरी माँगें", matches: "मेल", mapView: "मानचित्र",
    impactDashboard: "प्रभाव", admin: "एडमिन", calculator: "कैलकुलेटर",
    marketplace: "मार्केटप्लेस", availableRequirements: "उपलब्ध आवश्यकताएं",
    readAloud: "पढ़कर सुनाएं",
    villageName: "गाँव का नाम", acres: "एकड़", harvestStart: "कटाई शुरू", harvestEnd: "कटाई समाप्त",
    estimatedTonnes: "अनुमानित टन (स्वचालित)", submit: "सबमिट", cancel: "रद्द करें",
    status: "स्थिति", tonnes: "टन", distance: "दूरी", price: "प्रति टन मूल्य", pickupDate: "पिकअप तिथि",
    runClustering: "क्लस्टरिंग चलाएं", runMatching: "मिलान चलाएं",
    clusterReady: "क्लस्टर तैयार", matchProposed: "मिलान प्रस्तावित",
    accept: "स्वीकार करें", reject: "अस्वीकार करें",
    totalSaved: "कुल टन बचाया", co2Avoided: "CO₂ बचाया",
    farmersHelped: "किसानों की मदद", matchesDone: "मिलान पूर्ण",
    burnVsSell: "जलाएं vs बेचें कैलकुलेटर", yourAcres: "आपके एकड़",
    ifYouBurn: "अगर जलाएं", ifYouSell: "अगर बेचें", netBenefit: "शुद्ध लाभ",
    requiredTonnes: "आवश्यक टन", locationText: "पिकअप स्थान",
    earliestPickup: "सबसे पहले पिकअप", latestPickup: "अंतिम पिकअप",
    matchReason: "यह मिलान क्यों?", viewMap: "मानचित्र पर देखें",
    exportPdf: "पिकअप नोट निर्यात करें", notifications: "सूचनाएं",
    noNotifications: "अभी कोई सूचना नहीं", markRead: "सभी पढ़े हुए चिह्नित करें",
    language: "भाषा", settings: "सेटिंग्स",
    open: "खुला", clustered: "क्लस्टर्ड", pickedUp: "उठाया गया", cancelled: "रद्द",
    ready: "तैयार", matched: "मिलाया", inTransit: "पारगमन में", done: "हो गया",
    proposed: "प्रस्तावित", accepted: "स्वीकृत", rejected: "अस्वीकृत", completed: "पूर्ण",
    disclaimer: "सभी पर्यावरणीय आंकड़े अनुमानित हैं।",
    adminPanel: "एडमिन पैनल", configConstants: "सिस्टम स्थिरांक", auditLog: "ऑडिट लॉग",
    tonnesPerAcre: "प्रति एकड़ टन", minClusterTonnes: "न्यूनतम क्लस्टर टन",
    distanceThreshold: "दूरी सीमा (किमी)", saveConfig: "कॉन्फ़िग सहेजें",
    noListings: "अभी कोई सूची नहीं। पहली सूची बनाएं!",
    noDemands: "अभी कोई माँग नहीं।", noMatches: "अभी कोई मिलान नहीं।",
    loading: "लोड हो रहा है...", error: "कुछ गलत हुआ",
    welcomeFarmer: "स्वागत है, किसान!", welcomeBuyer: "स्वागत है!",
    invalidCredentials: "गलत उपयोगकर्ता नाम या पासवर्ड",
    otpExpired: "OTP समाप्त। नया अनुरोध करें।", otpInvalid: "गलत OTP।",
    rateLimited: "बहुत अधिक प्रयास। 1 घंटे प्रतीक्षा करें।",
    fullName: "पूरा नाम", district: "जिला", state: "राज्य",
    locationRequired: "जियो स्थान", clusterMembers: "क्लस्टर सदस्य",
    netScore: "मिलान स्कोर", transportCost: "अनुमानित परिवहन लागत",
    envImpact: "पर्यावरणीय प्रभाव", co2: "CO₂ बचाया", pm25: "PM2.5 बचाया",
    coalReplaced: "कोयला प्रतिस्थापित", earnings: "किसान की कमाई",
    back: "वापस", close: "बंद करें", save: "सहेजें", changeRole: "भूमिका बदलें",
  },
  te: {
    appName: "ప్రాలీకాష్", appTagline: "మొక్కజొన్న డబ్బు",
    selectRole: "మీరు ఎలా కొనసాగించాలనుకుంటున్నారు?",
    asFarmer: "رైతుగా కొనసాగించండి", asBuyer: "కంపెనీ కొనుగోలుదారుగా కొనసాగించండి",
    farmerDesc: "మీ గడ్డిని అమ్మకానికి జాబితా చేయండి",
    buyerDesc: "మీ పరిశ్రమకు బల్క్ బయోమాస్ సేకరించండి",
    login: "లాగిన్", signup: "సైన్ అప్", logout: "లాగ్అవుట్",
    dashboard: "డ్యాష్బోర్డ్", myListings: "నా జాబితాలు",
    createListing: "కొత్త జాబితా సృష్టించండి", language: "భాష",
    disclaimer: "అన్ని పర్యావరణ గణాంకాలు అంచనాలు మాత్రమే.",
    back: "వెనుకకు", submit: "సమర్పించు", cancel: "రద్దు",
    tonnes: "టన్నులు", status: "స్థితి", loading: "లోడ్ అవుతోంది...",
    asFarmer: "రైతుగా కొనసాగించండి", asBuyer: "కొనుగోలుదారుగా కొనసాగించండి",
    farmerLogin: "రైతు లాగిన్", buyerLogin: "కొనుగోలుదారు లాగిన్",
    username: "వినియోగదారు పేరు", password: "పాస్వర్డ్", email: "ఇమెయిల్",
    villageName: "గ్రామం పేరు", acres: "ఎకరాలు",
    changeRole: "పాత్ర మార్చు", logout: "లాగ్అవుట్",
    open: "తెరవు", clustered: "క్లస్టర్డ్", matched: "జతచేయబడింది",
    burnVsSell: "కాల్చు vs అమ్ము", calculator: "కాలిక్యులేటర్",
  },
  ta: {
    appName: "பிரலிகேஷ்", appTagline: "தாள் பணம்",
    selectRole: "நீங்கள் எப்படி தொடர விரும்புகிறீர்கள்?",
    asFarmer: "விவசாயியாக தொடரவும்", asBuyer: "நிறுவன వాங்குபவராக தொடரவும்",
    farmerDesc: "உங்கள் தாளை விற்பனைக்கு பட்டியலிடுங்கள்",
    buyerDesc: "தொகுதி உயிர்ப்பொருள் வாங்குங்கள்",
    login: "உள்நுழைவு", signup: "பதிவு", logout: "வெளியேறு",
    dashboard: "டாஷ்போர்டு", myListings: "என் பட்டியல்கள்",
    createListing: "புதிய பட்டியல் உருவாக்கு", language: "மொழி",
    disclaimer: "அனைத்து சுற்றுச்சூழல் புள்ளிவிவரங்களும் மதிப்பீடுகள்.",
    back: "பின்", submit: "சமர்ப்பி", cancel: "ரத்து",
    tonnes: "டன்கள்", status: "நிலை", loading: "ஏற்றுகிறது...",
    changeRole: "பாத்திரம் மாற்று", logout: "வெளியேறு",
    username: "பயனர் பெயர்", password: "கடவுச்சொல்", email: "மின்னஞ்சல்",
    villageName: "கிராம பெயர்", acres: "ஏக்கர்கள்",
    farmerLogin: "விவசாயி உள்நுழைவு", buyerLogin: "வாங்குபவர் உள்நுழைவு",
    open: "திறந்த", clustered: "தொகுக்கப்பட்டது", matched: "பொருந்தியது",
    burnVsSell: "எரி vs విற்று", calculator: "கணிப்பி",
  },
  pa: {
    appName: "ਪ੍ਰਾਲੀਕੈਸ਼", appTagline: "ਪਰਾਲੀ ਤੋਂ ਪੈਸੇ",
    selectRole: "ਤੁਸੀਂ ਕਿਵੇਂ ਜਾਰੀ ਰੱਖੋਗੇ?",
    asFarmer: "ਕਿਸਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ", asBuyer: "ਕੰਪਨੀ ਖਰੀਦਦਾਰ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ",
    farmerDesc: "ਆਪਣੀ ਪਰਾਲੀ ਵੇਚਣ ਲਈ ਸੂਚੀਬੱਧ ਕਰੋ",
    buyerDesc: "ਬਾਇਓਮਾਸ ਥੋਕ ਵਿੱਚ ਖਰੀਦੋ",
    login: "ਲਾਗਿਨ", signup: "ਸਾਈਨ ਅੱਪ", logout: "ਲਾਗ ਆਊਟ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ", myListings: "ਮੇਰੀਆਂ ਸੂਚੀਆਂ",
    createListing: "ਨਵੀਂ ਸੂਚੀ ਬਣਾਓ", language: "ਭਾਸ਼ਾ",
    disclaimer: "ਸਾਰੇ ਵਾਤਾਵਰਣ ਅੰਕੜੇ ਅਨੁਮਾਨਿਤ ਹਨ।",
    back: "ਪਿੱਛੇ", submit: "ਸਬਮਿਟ", cancel: "ਰੱਦ ਕਰੋ",
    tonnes: "ਟਨ", status: "ਸਥਿਤੀ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    changeRole: "ਭੂਮਿਕਾ ਬਦਲੋ",
    username: "ਯੂਜ਼ਰਨੇਮ", password: "ਪਾਸਵਰਡ", email: "ਈਮੇਲ",
    villageName: "ਪਿੰਡ ਦਾ ਨਾਮ", acres: "ਏਕੜ",
    farmerLogin: "ਕਿਸਾਨ ਲਾਗਿਨ", buyerLogin: "ਖਰੀਦਦਾਰ ਲਾਗਿਨ",
    open: "ਖੁੱਲ੍ਹਾ", clustered: "ਕਲੱਸਟਰਡ", matched: "ਮੇਲ ਖਾਂਦਾ",
    burnVsSell: "ਸਾੜੋ vs ਵੇਚੋ", calculator: "ਕੈਲਕੁਲੇਟਰ",
  },
  mr: {
    appName: "प्रालीकॅश", appTagline: "पेंढा पैसे",
    selectRole: "तुम्ही कसे सुरू ठेवाल?",
    asFarmer: "शेतकरी म्हणून सुरू ठेवा", asBuyer: "कंपनी खरेदीदार म्हणून सुरू ठेवा",
    farmerDesc: "आपला पेंढा विक्रीसाठी यादी करा",
    buyerDesc: "बायोमास मोठ्या प्रमाणात खरेदी करा",
    login: "लॉगिन", signup: "साइन अप", logout: "लॉगआउट",
    dashboard: "डॅशबोर्ड", language: "भाषा",
    disclaimer: "सर्व पर्यावरणीय आकडे अंदाजे आहेत.",
    back: "मागे", submit: "सबमिट", cancel: "रद्द करा",
    tonnes: "टन", status: "स्थिती", loading: "लोड होत आहे...",
    changeRole: "भूमिका बदला",
    username: "वापरकर्तानाव", password: "पासवर्ड", email: "ईमेल",
    villageName: "गावाचे नाव", acres: "एकर",
    farmerLogin: "शेतकरी लॉगिन", buyerLogin: "खरेदीदार लॉगिन",
  },
  gu: { appName: "પ્રાલીકૅશ", appTagline: "ઘાસ પૈસા", selectRole: "તમે કેવી રીતે ચાલુ રાખશો?", asFarmer: "ખેડૂત તરીકે ચાલુ રાખો", asBuyer: "કંપની ખરીદનાર તરીકે ચાલુ રાખો", login: "લૉગિન", language: "ભાષા", back: "પાછળ", disclaimer: "બધા પર્યાવરણ આંકડા અંદાજ છે.", changeRole: "ભૂમિકા બદલો", logout: "લૉગઆઉટ" },
  bn: { appName: "প্রালিকাশ", appTagline: "খড়ের টাকা", selectRole: "আপনি কীভাবে চালিয়ে যাবেন?", asFarmer: "কৃষক হিসেবে চালিয়ে যান", asBuyer: "কোম্পানি ক্রেতা হিসেবে চালিয়ে যান", login: "লগইন", language: "भाषा", back: "পিছনে", disclaimer: "সমস্ত পরিবেশগত পরিসংখ্যান অনুমানিত।", changeRole: "ভূমিকা পরিবর্তন করুন", logout: "লগআউট" },
  kn: { appName: "ಪ್ರಾಲಿಕ್ಯಾಶ್", appTagline: "ಹುಲ್ಲಿನ ಹಣ", selectRole: "ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯುತ್ತೀರಿ?", asFarmer: "ರೈತರಾಗಿ ಮುಂದುವರಿಯಿರಿ", asBuyer: "ಕಂಪನಿ ಖರೀದಿದಾರರಾಗಿ ಮುಂದುವರಿಯಿರಿ", login: "ಲಾಗಿನ್", language: "ಭಾಷೆ", back: "ಹಿಂದೆ", disclaimer: "ಎಲ್ಲಾ ಪರಿಸರ ಅಂಕಿಅಂಶಗಳು ಅಂದಾಜು ಮಾತ್ರ.", changeRole: "ಪಾತ್ರ ಬದಲಿಸಿ", logout: "ಲಾಗ್ಔಟ್" },
  ml: { appName: "പ്രാലിക്യാഷ്", appTagline: "ചോള പണം", selectRole: "നിങ്ങൾ എങ്ങനെ തുടരണം?", asFarmer: "കർഷകനായി തുടരുക", asBuyer: "കമ്പനി വാങ്ങുന്നവനായി തുടരുക", login: "ലോഗിൻ", language: "ഭാഷ", back: "തിരിക", disclaimer: "എല്ലാ പരിസ്ഥിതി കണക്കുകളും കണക്കാക്കലുകൾ മാത്രം.", changeRole: "പങ്ക് മാറ്റുക", logout: "ലോഗ്ഔട്ട്" },
};

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "sa", label: "Sanskrit", native: "संस्कृत" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "doi", label: "Dogri", native: "डोगरी" },
  { code: "kok", label: "Konkani", native: "कोंकणी" },
  { code: "mai", label: "Maithili", native: "मैथिली" },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্" },
  { code: "ks", label: "Kashmiri", native: "کٲشُر" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "sd", label: "Sindhi", native: "سنڌي" },
  { code: "bo", label: "Bodo", native: "बड़ो" },
];

// ─── MOCK DATABASE ─────────────────────────────────────────────────────────────
const INITIAL_DB = {
  users: [], farmerProfiles: [], listings: [], buyers: [],
  demands: [], clusters: [], matches: [], otps: [],
  auditLogs: [], notifications: [],
  config: { tonnes_per_acre: 2.5, min_cluster_tonnes: 50, distance_threshold_km: 15, price_weight: 0.6, distance_weight: 0.4, transport_cost_per_km_tonne: 8 },
  nextIds: { listing: 1, demand: 1, buyer: 1, cluster: 1, match: 1, notification: 1, audit: 1 },
};

// ─── CONTEXT ───────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function t(translations, lang, key) {
  const dict = translations[lang] || translations["en"];
  const en = translations["en"];
  return dict[key] || en[key] || key;
}

// ─── UTILS ─────────────────────────────────────────────────────────────────────
function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function maskEmail(email) {
  const [a, b] = email.split("@");
  return a[0] + "****" + a[a.length - 1] + "@" + b;
}

const sendOtpEmail = async (email, otp) => {
  try {
    const res = await fetch("/api/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer re_UrYSgbEu_9fKRXuJBPyfxajFcNGeNqJ83",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "PraliCash Login OTP",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #d97706;">PraliCash</h2>
            <p>Your one-time password (OTP) for PraliCash login is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; background: #f8fafc; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 12px;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });
    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend OTP Error:", resData);
      alert(`OTP delivery failed: ${resData.message || "Unknown error"}`);
    }
    return resData;
  } catch (err) {
    console.error("Network Error:", err);
    return { error: err.message };
  }
};

const sendResetEmail = async (email, username) => {
  try {
    const res = await fetch("/api/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer re_UrYSgbEu_9fKRXuJBPyfxajFcNGeNqJ83",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "PraliCash Password Reset Request",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
            <h2 style="color: #059669;">PraliCash</h2>
            <p>Hello <strong>${username}</strong>,</p>
            <p>We noticed a login attempt with an incorrect password for your account.</p>
            <p>If you've forgotten your password, you can reset it by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/?reset=${username}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 12px;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });
    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend API Error:", resData);
      alert(`Email failed: ${resData.message || "Unknown error"}`);
    }
    return resData;
  } catch (err) {
    console.error("Network Error:", err);
    alert("Network error while sending email. Check if dev server is running.");
    return { error: err.message };
  }
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Badge({ children, color = "green" }) {
  const colors = {
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    red: "bg-red-100 text-red-800 border-red-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color] || colors.green}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const map = {
    OPEN: ["Open", "blue"], CLUSTERED: ["Clustered", "amber"], PICKED_UP: ["Picked Up", "green"], CANCELLED: ["Cancelled", "red"],
    READY: ["Ready", "blue"], MATCHED: ["Matched", "amber"], IN_TRANSIT: ["In Transit", "purple"], DONE: ["Done", "green"],
    PROPOSED: ["Proposed", "blue"], ACCEPTED: ["Accepted", "green"], REJECTED: ["Rejected", "red"], COMPLETED: ["Completed", "green"],
    FULFILLED: ["Fulfilled", "green"],
  };
  const [label, color] = map[status] || [status, "gray"];
  return <Badge color={color}>{label}</Badge>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>{children}</div>;
}

function Btn({ children, onClick, color = "green", size = "md", disabled = false, fullWidth = false, type = "button" }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const colors = {
    green: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-300",
    amber: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 disabled:bg-amber-300",
    red: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300",
    outline: "bg-transparent text-emerald-700 border-2 border-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${colors[color]} ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-gray-50 placeholder-gray-400 transition" {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 transition" {...props}>
        {children}
      </select>
    </div>
  );
}

// ─── LANGUAGE PICKER ──────────────────────────────────────────────────────────
function LanguagePicker() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang);
  const ref = useRef();
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 transition-all">
        🌐 <span className="hidden sm:inline">{current?.native || "English"}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-72 overflow-y-auto">
          <div className="p-2 grid grid-cols-1 gap-0.5">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-xl flex items-center justify-between transition-colors ${lang === l.code ? "bg-emerald-50 text-emerald-800 font-semibold" : "hover:bg-gray-50 text-gray-700"}`}>
                <span>{l.native}</span>
                <span className="text-xs text-gray-400">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATION BELL ─────────────────────────────────────────────────────────
function NotificationBell() {
  const { db, currentUser, tt } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const notifs = db.notifications.filter(n => n.user_id === currentUser?.id);
  const unread = notifs.filter(n => !n.read).length;
  const { markAllRead } = useApp();
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition">
        <span className="text-lg">🔔</span>
        {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800">{tt("notifications")}</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">{tt("markRead")}</button>}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">{tt("noNotifications")}</p>
            ) : notifs.slice().reverse().map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-gray-50 text-sm ${n.read ? "text-gray-500" : "text-gray-800 bg-emerald-50/30"}`}>
                <p>{n.msg}</p>
                <p className="text-xs text-gray-400 mt-1">{n.ts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HEADER ────────────────────────────────────────────────────────────────────
function Header({ setPage }) {
  const { currentUser, setCurrentUser, setRole, tt, speaking, stopSpeak } = useApp();
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <button onClick={() => setPage("dashboard")} className="flex items-center gap-2.5 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-base leading-none block">PraliCash</span>
            <span className="text-xs text-emerald-600 leading-none">Stubble Money</span>
          </div>
        </button>
        <div className="flex items-center gap-2">
          {speaking && (
            <button onClick={stopSpeak} className="animate-pulse bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200 transition" title="Stop Voice">⏹️</button>
          )}
          <LanguagePicker />
          {currentUser && <NotificationBell />}
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-600 font-medium">
                {currentUser.role === "FARMER" ? "👨🌾" : currentUser.role === "ADMIN" ? "⚙️" : "🏭"} {currentUser.farmer_name || currentUser.buyer_name || currentUser.username}
              </span>
              <Btn size="sm" color="ghost" onClick={() => { setCurrentUser(null); setRole(null); setPage("roleSelect"); }}>
                {tt("logout")}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── ROLE SELECT PAGE ─────────────────────────────────────────────────────────
function RoleSelectPage({ setPage, setRole }) {
  const { tt } = useApp();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">PraliCash</h1>
          <p className="text-lg text-emerald-700 font-medium mt-1">Stubble Money — सतत विकास</p>
          <p className="text-gray-500 mt-3 text-sm max-w-sm mx-auto">{tt("selectRole")}</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => { setRole("FARMER"); setPage("farmerLogin"); }}
            className="w-full p-6 bg-white border-2 border-transparent hover:border-emerald-400 rounded-2xl text-left flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-emerald-200 transition">👨🌾</div>
            <div>
              <div className="font-bold text-gray-900 text-lg">{tt("asFarmer")}</div>
              <div className="text-sm text-gray-500 mt-0.5">{tt("farmerDesc")}</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => { setRole("BUYER"); setPage("buyerLogin"); }}
            className="w-full p-6 bg-white border-2 border-transparent hover:border-amber-400 rounded-2xl text-left flex items-center gap-5 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-amber-200 transition">🏭</div>
            <div>
              <div className="font-bold text-gray-900 text-lg">{tt("asBuyer")}</div>
              <div className="text-sm text-gray-500 mt-0.5">{tt("buyerDesc")}</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-amber-500 ml-auto transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">🌿 Reducing stubble burning across India — one match at a time</p>
      </div>
    </div>
  );
}

// ─── FARMER LOGIN ──────────────────────────────────────────────────────────────
function FarmerLoginPage({ setPage }) {
  const { db, setCurrentUser, tt } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = db.users.find(u => u.role === "FARMER" && u.username === username && u.password === password);
    if (user) { setCurrentUser(user); setPage("dashboard"); }
    else setError(tt("invalidCredentials"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <div className="p-8">
          <button onClick={() => setPage("roleSelect")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
            ← {tt("back")}
          </button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">👨🌾</div>
            <h2 className="text-2xl font-bold text-gray-900">{tt("farmerLogin")}</h2>
          </div>
          <div className="space-y-4">
            <Input label={tt("username")} value={username} onChange={e => setUsername(e.target.value)} placeholder="bhavya_13" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <Input label={tt("password")} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
            <Btn onClick={handleLogin} fullWidth color="green" size="lg">{tt("login")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── BUYER LOGIN / SIGNUP ──────────────────────────────────────────────────────
function BuyerLoginPage({ setPage }) {
  const { db, setDb, setCurrentUser, tt } = useApp();
  const [view, setView] = useState("login"); // login | signup | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [sending, setSending] = useState(false);
  const otpRefs = useRef([]);

  const handlePasswordLogin = async () => {
    if (!email.includes("@")) { setError("Enter valid email"); return; }
    const buyer = db.buyers.find(b => b.email === email);
    if (buyer && buyer.password === password) {
      setCurrentUser(buyer);
      setPage("dashboard");
    } else {
      // Inclusive: Trigger reset email for any valid email attempt if not correct password
      setError("Invalid credentials. Reset email sent.");
      await sendResetEmail(email, buyer?.buyer_name || email);
    }
  };

  useEffect(() => {
    if (view !== "otp") return;
    setCountdown(300);
    const timer = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [view]);

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSendOtp = async () => {
    if (!email.includes("@")) { setError("Enter valid email"); return; }
    setSending(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtp = { email, otp_hash: generatedOtp, expires_at: Date.now() + 300000, attempts: 0, is_used: false };

    await sendOtpEmail(email, generatedOtp);

    setDb(prev => ({ ...prev, otps: [...prev.otps.filter(o => o.email !== email), newOtp] }));
    setSending(false);
    setError("");
    setView("otp");
  };

  const handleOtpChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otp.join("");
    const record = db.otps.find(o => o.email === email);
    if (!record) { setError("No OTP found. Request again."); return; }
    if (Date.now() > record.expires_at) { setError(tt("otpExpired")); return; }
    if (entered !== record.otp_hash) { setError(tt("otpInvalid")); return; }

    const user = db.buyers.find(b => b.email === email);
    setDb(prev => {
      let nextDb = { ...prev };
      let currentUserObj = user;

      if (!user) {
        // Inclusive: Create buyer on successful OTP if not exists
        currentUserObj = { id: prev.nextIds.buyer, role: "BUYER", email, buyer_name: email.split("@")[0], company_name: "New Enterprise", is_active: true };
        nextDb.buyers = [...prev.buyers, currentUserObj];
        nextDb.nextIds.buyer = prev.nextIds.buyer + 1;
      }

      nextDb.otps = prev.otps.map(o => o.email === email ? { ...o, is_used: true } : o);
      nextDb.auditLogs = [...prev.auditLogs, { id: prev.nextIds.audit, event: "LOGIN_SUCCESS", detail: `Buyer ${maskEmail(email)} logged in via OTP`, ts: new Date().toLocaleString() }];
      nextDb.nextIds.audit = prev.nextIds.audit + 1;

      setCurrentUser(currentUserObj);
      return nextDb;
    });
    setPage("dashboard");
  };

  if (view === "otp") return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <div className="p-8">
          <button onClick={() => setView("login")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">← {tt("back")}</button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📧</div>
            <h2 className="text-2xl font-bold text-gray-900">{tt("otpTitle")}</h2>
            <p className="text-sm text-gray-500 mt-1">{tt("otpSent")} <b>{email}</b></p>
          </div>
          <div className="flex gap-2 justify-center mb-4">
            {otp.map((d, i) => (
              <input key={i} ref={el => otpRefs.current[i] = el} type="text" inputMode="numeric"
                maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition" />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mb-4">
            {countdown > 0 ? <>{tt("otpExpires")} <span className="font-bold text-emerald-700">{formatTime(countdown)}</span></> : <span className="text-red-500">{tt("otpExpired")}</span>}
          </p>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
          <Btn onClick={handleVerifyOtp} fullWidth size="lg">{tt("verifyOtp")}</Btn>
          <button onClick={handleSendOtp} className="w-full text-center text-sm text-emerald-600 hover:underline mt-3">{tt("resendOtp")}</button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <div className="p-8">
          <button onClick={() => setPage("roleSelect")} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">← {tt("back")}</button>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🏭</div>
            <h2 className="text-2xl font-bold text-gray-900">{view === "login" ? tt("buyerLogin") : tt("signup")}</h2>
          </div>
          <div className="space-y-4">
            {view === "signup" && <>
              <Input label={tt("buyerName")} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Your full name" />
              <Input label={tt("companyName")} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="GreenBio Industries" />
              <Input label={tt("phone")} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </>}
            <Input label={tt("email")} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="haasinireddy2304@gmail.com" />
            {view === "login" && <Input label={tt("password")} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
            {view === "login" ? (
              <Btn onClick={handlePasswordLogin} fullWidth size="lg" color="amber">{tt("login")}</Btn>
            ) : (
              <Btn onClick={handleSendOtp} fullWidth size="lg" color="amber" disabled={sending}>{sending ? "Sending..." : tt("sendOtp")}</Btn>
            )}
            {view === "login" && (
              <div className="flex items-center gap-2 py-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">OR SIGN IN WITH OTP</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            )}
            {view === "login" && <Btn onClick={handleSendOtp} fullWidth variant="outline" size="lg" color="amber" disabled={sending}>{sending ? "Sending..." : tt("sendOtp")}</Btn>}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            {view === "login" ? <>{tt("noAccount")} <button onClick={() => setView("signup")} className="text-amber-600 font-semibold hover:underline">{tt("signupLink")}</button></> : <>{tt("haveAccount")} <button onClick={() => setView("login")} className="text-amber-600 font-semibold hover:underline">{tt("loginLink")}</button></>}
          </p>
          {view === "login" && <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500"><b>Demo:</b> turupubhavya@gmail.com → OTP: 482719</div>}
        </div>
      </Card>
    </div>
  );
}

// ─── RESET PASSWORD PAGE ──────────────────────────────────────────────────────
function ResetPasswordPage({ username, setPage }) {
  const { db, setDb, tt } = useApp();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    setDb(prev => {
      const exists = prev.buyers.find(b => b.email === username);
      const newBuyers = exists
        ? prev.buyers.map(b => b.email === username ? { ...b, password: newPassword } : b)
        : [...prev.buyers, { id: prev.nextIds.buyer, role: "BUYER", email: username, password: newPassword, buyer_name: username.split("@")[0], company_name: "New Enterprise", is_active: true }];

      return {
        ...prev,
        users: prev.users.map(u => u.username === username || u.email === username ? { ...u, password: newPassword } : u),
        buyers: newBuyers,
        nextIds: { ...prev.nextIds, buyer: exists ? prev.nextIds.buyer : prev.nextIds.buyer + 1, audit: prev.nextIds.audit + 1 },
        auditLogs: [...prev.auditLogs, { id: prev.nextIds.audit, event: "PASSWORD_RESET", detail: `Password reset for ${username}`, ts: new Date().toLocaleString() }]
      };
    });
    setSuccess(true);
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full text-center p-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
        <p className="text-gray-500 mb-6">Your password has been updated successfully.</p>
        <Btn onClick={() => { window.location.search = ""; setPage("roleSelect"); }} fullWidth>Back to Login</Btn>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Enter a new password for <b>{username}</b></p>
        <div className="space-y-4">
          <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
          <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          <Btn onClick={handleReset} fullWidth size="lg">Update Password</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── SIDEBAR NAV ───────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, role }) {
  const { tt } = useApp();
  const farmerLinks = [
    { key: "dashboard", icon: "🏠", label: tt("dashboard") },
    { key: "marketplace", icon: "🏪", label: tt("marketplace") },
    { key: "farmerListings", icon: "📋", label: tt("myListings") },
    { key: "offers", icon: "🤝", label: tt("myOffers") },
    { key: "mapView", icon: "🗺️", label: tt("mapView") },
    { key: "impact", icon: "🌿", label: tt("impactDashboard") },
    { key: "calculator", icon: "🧮", label: tt("calculator") },
  ];
  const buyerLinks = [
    { key: "dashboard", icon: "🏠", label: tt("dashboard") },
    { key: "buyerDemands", icon: "📦", label: tt("myDemands") },
    { key: "matches", icon: "🔗", label: tt("matches") },
    { key: "mapView", icon: "🗺️", label: tt("mapView") },
    { key: "impact", icon: "🌿", label: tt("impactDashboard") },
    { key: "calculator", icon: "🧮", label: tt("calculator") },
  ];
  const adminLinks = [
    { key: "dashboard", icon: "🏠", label: tt("dashboard") },
    { key: "admin", icon: "⚙️", label: tt("adminPanel") },
    { key: "mapView", icon: "🗺️", label: tt("mapView") },
    { key: "impact", icon: "🌿", label: tt("impactDashboard") },
  ];
  const links = role === "FARMER" ? farmerLinks : role === "BUYER" ? buyerLinks : adminLinks;
  return (
    <nav className="w-52 flex-shrink-0 hidden lg:block">
      <div className="space-y-1">
        {links.map(l => (
          <button key={l.key} onClick={() => setPage(l.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${page === l.key ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}>
            <span>{l.icon}</span> {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── STATS CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color = "emerald", sub }) {
  const colors = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    purple: "bg-purple-50 border-purple-100 text-purple-700",
  };
  return (
    <div className={`border rounded-2xl p-5 ${colors[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-sm font-medium mt-0.5">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

// ─── FARMER DASHBOARD ─────────────────────────────────────────────────────────
function FarmerDashboard({ setPage }) {
  const { db, currentUser, tt, speak, lang } = useApp();
  const myListings = db.listings.filter(l => l.farmer_user_id === currentUser.id);
  const myListingIds = myListings.map(l => l.id);
  const myClusters = db.clusters.filter(c => c.member_listing_ids.some(id => myListingIds.includes(id)));
  const myMatches = db.matches.filter(m => myClusters.map(c => c.id).includes(m.cluster_id));
  const totalTonnes = myListings.reduce((a, l) => a + l.estimated_tonnes, 0);
  const earnings = myMatches.filter(m => m.status === "ACCEPTED").reduce((a, m) => {
    const cluster = db.clusters.find(c => c.id === m.cluster_id);
    return a + (cluster?.total_tonnes || 0) * m.offered_price;
  }, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tt("welcomeFarmer")}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{currentUser.farmer_name} — {db.farmerProfiles.find(f => f.user_id === currentUser.id)?.district}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => speak(`${tt("welcomeFarmer")}. ${currentUser.farmer_name}. ${tt("tonnes")}: ${totalTonnes}. ${tt("earnings")}: ${earnings}`, lang)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition" title={tt("readAloud")}>🔊</button>
          <Btn onClick={() => setPage("createListing")} size="md">+ {tt("createListing")}</Btn>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📋" label={tt("myListings")} value={myListings.length} color="blue" />
        <StatCard icon="🔗" label={tt("clustered")} value={myClusters.length} color="amber" />
        <StatCard icon="🌾" label={tt("tonnes")} value={`${totalTonnes}t`} color="emerald" />
        <StatCard icon="💰" label={tt("earnings")} value={formatINR(earnings)} color="purple" sub="from accepted matches" />
      </div>
      <Card>
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800">🏪 {tt("availableRequirements")}</h2>
            <button onClick={() => speak(`${tt("availableRequirements")}. ${db.demands.filter(d => d.status === "OPEN").map(d => `${d.company_name}, ${d.required_tonnes} tonnes in ${d.location_text}`).join(". ")}`, lang)}
              className="text-blue-500 hover:scale-110 transition" title={tt("readAloud")}>🔊</button>
          </div>
          <span className="text-xs text-gray-400">Companies looking for stubble</span>
        </div>
        <div className="divide-y divide-gray-50">
          {db.demands.filter(d => d.status === "OPEN").map(d => (
            <div key={d.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div>
                <div className="font-medium text-gray-800">{d.company_name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{d.location_text} · {d.required_tonnes}t needed · <span className="text-emerald-600 font-bold">{formatINR(d.price_per_tonne)}/t</span></div>
              </div>
              <Btn size="sm" color="outline" onClick={() => setPage("createListing")}>I Have Stubble</Btn>
            </div>
          ))}
          {db.demands.filter(d => d.status === "OPEN").length === 0 && <p className="p-6 text-center text-gray-400 text-sm">No open requirements found at the moment.</p>}
        </div>
      </Card>
      <Card>
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">{tt("myListings")}</h2>
          <Btn size="sm" color="ghost" onClick={() => setPage("farmerListings")}>View All</Btn>
        </div>
        {myListings.length === 0 ? <p className="p-6 text-center text-gray-400 text-sm">{tt("noListings")}</p> : (
          <div className="divide-y divide-gray-50">
            {myListings.map(l => (
              <div key={l.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <div className="font-medium text-gray-800">{l.village_name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{l.acres} acres · {l.estimated_tonnes}t · {l.harvest_start}</div>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
      {myMatches.length > 0 && (
        <Card>
          <div className="p-5 border-b border-gray-50"><h2 className="font-semibold text-gray-800">{tt("myOffers")}</h2></div>
          {myMatches.map(m => {
            const demand = db.demands.find(d => d.id === m.demand_id);
            const cluster = db.clusters.find(c => c.id === m.cluster_id);
            return (
              <div key={m.id} className="px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-800">{cluster?.cluster_name}</div>
                  <div className="text-xs text-gray-500">{demand?.company_name} · {formatINR(m.offered_price)}/t · {m.pickup_date}</div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── UI COMPONENTS CONTINUED (CHUNKS) ──────────────────────────────────────────
// ─── BUYER DASHBOARD ──────────────────────────────────────────────────────────
function BuyerDashboard({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const myDemands = db.demands.filter(d => d.buyer_user_id === currentUser.id);
  const myMatches = db.matches.filter(m => myDemands.map(d => d.id).includes(m.demand_id));
  const totalRequired = myDemands.reduce((a, d) => a + d.required_tonnes, 0);

  const runClustering = () => {
    const openListings = db.listings.filter(l => l.status === "OPEN");
    if (openListings.length < 2) return alert("Not enough open listings to cluster.");
    let visited = new Set(), clusters = [...db.clusters];
    let clusterCounter = db.nextIds.cluster;
    let listings = [...db.listings];
    openListings.forEach(seed => {
      if (visited.has(seed.id)) return;
      const group = [seed];
      let groupTonnes = seed.estimated_tonnes;
      visited.add(seed.id);
      openListings.forEach(c => {
        if (visited.has(c.id)) return;
        const dist = haversine(seed.geo_lat, seed.geo_lng, c.geo_lat, c.geo_lng);
        if (dist <= db.config.distance_threshold_km) {
          group.push(c); groupTonnes += c.estimated_tonnes; visited.add(c.id);
        }
      });
      if (groupTonnes >= db.config.min_cluster_tonnes) {
        const centLat = group.reduce((a, l) => a + l.geo_lat, 0) / group.length;
        const centLng = group.reduce((a, l) => a + l.geo_lng, 0) / group.length;
        const cluster = { id: clusterCounter, cluster_name: `CLUSTER-PB-${String(clusterCounter).padStart(3, "0")}`, total_tonnes: groupTonnes, centroid_lat: centLat, centroid_lng: centLng, member_listing_ids: group.map(l => l.id), status: "READY" };
        clusters.push(cluster);
        listings = listings.map(l => group.find(g => g.id === l.id) ? { ...l, status: "CLUSTERED", cluster_id: clusterCounter } : l);
        clusterCounter++;
      }
    });
    setDb(prev => ({ ...prev, clusters, listings, nextIds: { ...prev.nextIds, cluster: clusterCounter } }));
    alert(`Clustering complete! ${clusterCounter - db.nextIds.cluster} new cluster(s) formed.`);
  };

  const runMatching = () => {
    const readyClusters = db.clusters.filter(c => c.status === "READY");
    const openDemands = db.demands.filter(d => d.status === "OPEN");
    if (!readyClusters.length || !openDemands.length) return alert("Need READY clusters and OPEN demands.");
    let matches = [...db.matches], demands = [...db.demands], clusters = [...db.clusters], notifications = [...db.notifications];
    let matchCounter = db.nextIds.match, notifCounter = db.nextIds.notification;
    const prices = openDemands.map(d => d.price_per_tonne);
    const minP = Math.min(...prices), maxP = Math.max(...prices);
    const usedC = new Set(), usedD = new Set();
    const pairs = [];
    readyClusters.forEach(cluster => openDemands.forEach(demand => {
      const dist = haversine(cluster.centroid_lat, cluster.centroid_lng, demand.geo_lat, demand.geo_lng);
      const normP = maxP === minP ? 1 : (demand.price_per_tonne - minP) / (maxP - minP);
      const normD = dist / 200;
      const score = db.config.price_weight * normP - db.config.distance_weight * normD;
      pairs.push({ cluster, demand, dist, score });
    }));
    pairs.sort((a, b) => b.score - a.score);
    pairs.forEach(({ cluster, demand, dist, score }) => {
      if (usedC.has(cluster.id) || usedD.has(demand.id)) return;
      const transportCost = dist * cluster.total_tonnes * db.config.transport_cost_per_km_tonne;
      const match = { id: matchCounter, cluster_id: cluster.id, demand_id: demand.id, distance_km: +dist.toFixed(1), offered_price: demand.price_per_tonne, transport_cost: +transportCost.toFixed(0), net_score: +score.toFixed(3), pickup_date: demand.earliest_pickup, status: "PROPOSED", match_reason: `Best score ${score.toFixed(3)}: price ${formatINR(demand.price_per_tonne)}/t, distance ${dist.toFixed(1)}km, transport ${formatINR(transportCost)}` };
      matches.push(match);
      clusters = clusters.map(c => c.id === cluster.id ? { ...c, status: "MATCHED" } : c);
      demands = demands.map(d => d.id === demand.id ? { ...d, status: "MATCHED" } : d);
      notifications.push({ id: notifCounter++, user_id: demand.buyer_user_id, msg: `Match proposed: ${cluster.cluster_name} → ${demand.company_name}`, read: false, ts: new Date().toLocaleString() });
      usedC.add(cluster.id); usedD.add(demand.id); matchCounter++;
    });
    setDb(prev => ({ ...prev, matches, demands, clusters, notifications, nextIds: { ...prev.nextIds, match: matchCounter, notification: notifCounter } }));
    alert(`Matching complete! ${matchCounter - db.nextIds.match} new match(es) created.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tt("welcomeBuyer")}</h1>
          <p className="text-gray-500 text-sm">{currentUser.company_name}</p>
        </div>
        <Btn onClick={() => setPage("createDemand")}>+ {tt("createDemand")}</Btn>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📦" label={tt("myDemands")} value={myDemands.length} color="blue" />
        <StatCard icon="🔗" label={tt("matches")} value={myMatches.length} color="amber" />
        <StatCard icon="🌾" label={tt("requiredTonnes")} value={`${totalRequired}t`} color="emerald" />
        <StatCard icon="✅" label="Accepted" value={myMatches.filter(m => m.status === "ACCEPTED").length} color="purple" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-3">🔧 Engine Controls</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Group nearby farmer listings into supply clusters</p>
              <Btn onClick={runClustering} fullWidth color="outline">⚡ {tt("runClustering")}</Btn>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Match READY clusters to OPEN buyer demands</p>
              <Btn onClick={runMatching} fullWidth color="amber">🎯 {tt("runMatching")}</Btn>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-gray-800 mb-3">📊 Cluster Overview</h3>
          <div className="space-y-2">
            {db.clusters.map(c => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{c.cluster_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{c.total_tonnes}t</span>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
            {db.clusters.length === 0 && <p className="text-gray-400 text-sm">No clusters yet. Run clustering!</p>}
          </div>
        </Card>
      </div>
      <Card>
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">{tt("myDemands")}</h2>
          <Btn size="sm" color="ghost" onClick={() => setPage("buyerDemands")}>View All</Btn>
        </div>
        {myDemands.length === 0 ? <p className="p-6 text-center text-gray-400 text-sm">{tt("noDemands")}</p> : (
          <div className="divide-y divide-gray-50">
            {myDemands.map(d => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-800">{d.location_text}</div>
                  <div className="text-xs text-gray-500">{d.required_tonnes}t needed · {formatINR(d.price_per_tonne)}/t · pickup {d.earliest_pickup}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── CREATE LISTING ────────────────────────────────────────────────────────────
function CreateListingPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const profile = db.farmerProfiles.find(f => f.user_id === currentUser.id);
  const [form, setForm] = useState({ village_name: profile?.village_name || "", acres: "", harvest_start: "", harvest_end: "" });
  const config = db.config;
  const estimatedTonnes = form.acres ? +(parseFloat(form.acres) * config.tonnes_per_acre).toFixed(1) : 0;

  const handleSubmit = async () => {
    if (!form.village_name || !form.acres || !form.harvest_start || !form.harvest_end) return alert("Please fill all fields");
    const payload = {
      farmer_user_id: currentUser.id, village_name: form.village_name, acres: +form.acres,
      harvest_start: form.harvest_start, harvest_end: form.harvest_end,
      estimated_tonnes: estimatedTonnes, geo_lat: (profile?.geo_lat || 30.8) + (Math.random() - 0.5) * 0.5,
      geo_lng: (profile?.geo_lng || 75.8) + (Math.random() - 0.5) * 0.5
    };
    try {
      const res = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const newListing = await res.json();
      setDb(prev => ({
        ...prev, listings: [...prev.listings, newListing],
        notifications: [...prev.notifications, { id: Date.now(), user_id: currentUser.id, msg: `Listing created: ${form.village_name} (${estimatedTonnes}t)`, read: false, ts: new Date().toLocaleString() }]
      }));
      setPage("farmerListings");
    } catch (err) { alert("Error saving listing"); }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setPage("farmerListings")} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">{tt("createListing")}</h1>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label={tt("villageName")} value={form.village_name} onChange={e => setForm({ ...form, village_name: e.target.value })} placeholder="Enter village name" />
            </div>
            <div className="col-span-2">
              <Input label={tt("acres")} type="number" min="0" step="0.5" value={form.acres} onChange={e => setForm({ ...form, acres: e.target.value })} placeholder="e.g. 8" />
            </div>
            <Input label={tt("harvestStart")} type="date" value={form.harvest_start} onChange={e => setForm({ ...form, harvest_start: e.target.value })} />
            <Input label={tt("harvestEnd")} type="date" value={form.harvest_end} onChange={e => setForm({ ...form, harvest_end: e.target.value })} />
          </div>
          {estimatedTonnes > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="text-sm text-emerald-700 font-medium">{tt("estimatedTonnes")}</div>
              <div className="text-3xl font-black text-emerald-800 mt-1">{estimatedTonnes} <span className="text-lg font-normal">tonnes</span></div>
              <div className="text-xs text-emerald-600 mt-1">{form.acres} acres × {config.tonnes_per_acre} t/acre</div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Btn onClick={handleSubmit} fullWidth size="lg">{tt("submit")}</Btn>
            <Btn onClick={() => setPage("farmerListings")} color="ghost" size="lg">{tt("cancel")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── CREATE DEMAND ─────────────────────────────────────────────────────────────
function CreateDemandPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const [form, setForm] = useState({ required_tonnes: "", location_text: "", price_per_tonne: "", earliest_pickup: "", latest_pickup: "" });
  const cityCoords = { "Chandigarh": [30.7046, 76.7179], "Ludhiana": [30.9010, 75.8573], "Amritsar": [31.6340, 74.8723], "Delhi": [28.6139, 77.2090], "Jalandhar": [31.3260, 75.5762] };

  const handleSubmit = async () => {
    if (!form.required_tonnes || !form.location_text || !form.price_per_tonne) return alert("Fill all required fields");
    const coords = cityCoords[form.location_text] || [30.7 + Math.random(), 75.8 + Math.random()];
    const payload = {
      buyer_user_id: currentUser.id, buyer_name: currentUser.buyer_name,
      company_name: currentUser.company_name, required_tonnes: +form.required_tonnes,
      location_text: form.location_text, price_per_tonne: +form.price_per_tonne,
      earliest_pickup: form.earliest_pickup, latest_pickup: form.latest_pickup,
      geo_lat: coords[0], geo_lng: coords[1], status: "OPEN"
    };
    try {
      const res = await fetch("/api/demands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const newDemand = await res.json();
      setDb(prev => ({ ...prev, demands: [...prev.demands, newDemand] }));
      setPage("buyerDemands");
    } catch (err) { alert("Error saving demand"); }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setPage("buyerDemands")} className="text-gray-400 hover:text-gray-600">←</button>
        <h1 className="text-2xl font-bold text-gray-900">{tt("createDemand")}</h1>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <Input label={tt("requiredTonnes")} type="number" value={form.required_tonnes} onChange={e => setForm({ ...form, required_tonnes: e.target.value })} placeholder="e.g. 80" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{tt("locationText")}</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50" value={form.location_text} onChange={e => setForm({ ...form, location_text: e.target.value })}>
              <option value="">Select city...</option>
              {Object.keys(cityCoords).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label={`${tt("price")} (₹)`} type="number" value={form.price_per_tonne} onChange={e => setForm({ ...form, price_per_tonne: e.target.value })} placeholder="e.g. 2200" />
          <div className="grid grid-cols-2 gap-4">
            <Input label={tt("earliestPickup")} type="date" value={form.earliest_pickup} onChange={e => setForm({ ...form, earliest_pickup: e.target.value })} />
            <Input label={tt("latestPickup")} type="date" value={form.latest_pickup} onChange={e => setForm({ ...form, latest_pickup: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={handleSubmit} fullWidth size="lg">{tt("submit")}</Btn>
            <Btn onClick={() => setPage("buyerDemands")} color="ghost" size="lg">{tt("cancel")}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── FARMER LISTINGS PAGE ──────────────────────────────────────────────────────
function FarmerListingsPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const myListings = db.listings.filter(l => l.farmer_user_id === currentUser.id);

  const cancelListing = (id) => {
    setDb(prev => ({ ...prev, listings: prev.listings.map(l => l.id === id ? { ...l, status: "CANCELLED" } : l) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{tt("myListings")}</h1>
        <Btn onClick={() => setPage("createListing")}>+ {tt("createListing")}</Btn>
      </div>
      {myListings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-3">🌾</div>
          <p className="text-gray-400">{tt("noListings")}</p>
          <Btn onClick={() => setPage("createListing")} className="mt-4">{tt("createListing")}</Btn>
        </Card>
      ) : (
        <div className="space-y-3">
          {myListings.map(l => {
            const cluster = l.cluster_id ? db.clusters.find(c => c.id === l.cluster_id) : null;
            return (
              <Card key={l.id}>
                <div className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{l.village_name}</span>
                      <StatusBadge status={l.status} />
                      <button onClick={() => speak(`${l.village_name}. ${l.acres} acres. ${l.estimated_tonnes} tonnes. ${l.status}`, lang)} className="text-blue-500 text-xs">🔊</button>
                    </div>
                    <div className="text-sm text-gray-500">{l.acres} acres · <b>{l.estimated_tonnes}t</b> estimated · {l.harvest_start} → {l.harvest_end}</div>
                    {cluster && <div className="text-xs text-amber-600 font-medium">📦 Part of {cluster.cluster_name} ({cluster.total_tonnes}t total)</div>}
                  </div>
                  {l.status === "OPEN" && (
                    <Btn size="sm" color="ghost" onClick={() => cancelListing(l.id)}>{tt("cancel")}</Btn>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── OFFERS PAGE ───────────────────────────────────────────────────────────────
function OffersPage() {
  const { db, currentUser, tt } = useApp();
  const myListingIds = db.listings.filter(l => l.farmer_user_id === currentUser.id).map(l => l.id);
  const myClusters = db.clusters.filter(c => c.member_listing_ids.some(id => myListingIds.includes(id)));
  const myMatches = db.matches.filter(m => myClusters.map(c => c.id).includes(m.cluster_id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{tt("myOffers")}</h1>
      {myMatches.length === 0 ? (
        <Card className="p-12 text-center"><div className="text-5xl mb-3">🤝</div><p className="text-gray-400">{tt("noMatches")}</p></Card>
      ) : myMatches.map(m => {
        const demand = db.demands.find(d => d.id === m.demand_id);
        const cluster = db.clusters.find(c => c.id === m.cluster_id);
        const impact = { co2: (cluster?.total_tonnes * 1.53).toFixed(1), pm25: (cluster?.total_tonnes * 3.2).toFixed(1), earnings: cluster?.total_tonnes * m.offered_price };
        return (
          <Card key={m.id}>
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-gray-900">{cluster?.cluster_name}</div>
                    <button onClick={() => speak(`${cluster?.cluster_name}. Offer from ${demand?.company_name}. Price ${formatINR(m.offered_price)} per tonne. Pickup date ${m.pickup_date}`, lang)} className="text-blue-500 text-xs">🔊</button>
                  </div>
                  <div className="text-sm text-gray-500">{demand?.company_name} · {demand?.location_text}</div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 rounded-xl p-3">
                  <div className="font-bold text-emerald-700">{formatINR(m.offered_price)}</div>
                  <div className="text-xs text-gray-500">per tonne</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <div className="font-bold text-blue-700">{m.distance_km}km</div>
                  <div className="text-xs text-gray-500">distance</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <div className="font-bold text-purple-700">{m.pickup_date}</div>
                  <div className="text-xs text-gray-500">pickup date</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-semibold text-gray-600 mb-1">🌿 {tt("envImpact")} (estimated)</div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>CO₂ avoided: <b>{impact.co2}t</b></span>
                  <span>PM2.5: <b>{impact.pm25}kg</b></span>
                  <span>Earnings: <b>{formatINR(impact.earnings)}</b></span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
                <span className="font-semibold">💡 {tt("matchReason")}</span> {m.match_reason}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── BUYER DEMANDS PAGE ────────────────────────────────────────────────────────
function BuyerDemandsPage({ setPage }) {
  const { db, setDb, currentUser, tt } = useApp();
  const myDemands = db.demands.filter(d => d.buyer_user_id === currentUser.id);

  const cancelDemand = (id) => {
    setDb(prev => ({ ...prev, demands: prev.demands.map(d => d.id === id ? { ...d, status: "CANCELLED" } : d) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{tt("myDemands")}</h1>
        <Btn onClick={() => setPage("createDemand")}>+ {tt("createDemand")}</Btn>
      </div>
      {myDemands.length === 0 ? (
        <Card className="p-12 text-center"><p className="text-gray-400">{tt("noDemands")}</p></Card>
      ) : (
        <div className="space-y-3">
          {myDemands.map(d => (
            <Card key={d.id}>
              <div className="p-5 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{d.location_text}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="text-sm text-gray-500">{d.required_tonnes}t needed · {formatINR(d.price_per_tonne)}/t</div>
                  <div className="text-xs text-gray-400">Pickup: {d.earliest_pickup} → {d.latest_pickup}</div>
                </div>
                {d.status === "OPEN" && <Btn size="sm" color="ghost" onClick={() => cancelDemand(d.id)}>{tt("cancel")}</Btn>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MATCHES PAGE ──────────────────────────────────────────────────────────────
function MatchesPage() {
  const { db, setDb, currentUser, tt } = useApp();
  const myDemandIds = db.demands.filter(d => d.buyer_user_id === currentUser.id).map(d => d.id);
  const myMatches = db.matches.filter(m => myDemandIds.includes(m.demand_id));

  const handleAction = (matchId, action) => {
    setDb(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, status: action === "accept" ? "ACCEPTED" : "REJECTED" } : m),
      clusters: prev.clusters.map(c => {
        const match = prev.matches.find(m => m.id === matchId);
        if (match && c.id === match.cluster_id) return { ...c, status: action === "accept" ? "IN_TRANSIT" : "READY" };
        return c;
      })
    }));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{tt("matches")}</h1>
      {myMatches.length === 0 ? (
        <Card className="p-12 text-center"><div className="text-5xl mb-3">🔗</div><p className="text-gray-400">{tt("noMatches")}</p></Card>
      ) : myMatches.map(m => {
        const cluster = db.clusters.find(c => c.id === m.cluster_id);
        const demand = db.demands.find(d => d.id === m.demand_id);
        const members = cluster?.member_listing_ids.map(id => db.listings.find(l => l.id === id)).filter(Boolean) || [];
        return (
          <Card key={m.id}>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{cluster?.cluster_name} → {demand?.location_text}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Score: {m.net_score} · {m.pickup_date}</div>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-emerald-50 rounded-lg p-2"><div className="font-bold text-emerald-700">{cluster?.total_tonnes}t</div><div className="text-xs text-gray-500">Total</div></div>
                <div className="bg-blue-50 rounded-lg p-2"><div className="font-bold text-blue-700">{m.distance_km}km</div><div className="text-xs text-gray-500">Distance</div></div>
                <div className="bg-purple-50 rounded-lg p-2"><div className="font-bold text-purple-700">{formatINR(m.offered_price)}</div><div className="text-xs text-gray-500">Per Tonne</div></div>
                <div className="bg-amber-50 rounded-lg p-2"><div className="font-bold text-amber-700">{formatINR(m.transport_cost)}</div><div className="text-xs text-gray-500">Transport</div></div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2">Cluster Members:</div>
                <div className="flex flex-wrap gap-2">
                  {members.map(l => <span key={l.id} className="text-xs bg-gray-100 px-2 py-1 rounded-lg">{l.village_name} ({l.estimated_tonnes}t)</span>)}
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800">{m.match_reason}</div>
              {m.status === "PROPOSED" && (
                <div className="flex gap-3">
                  <Btn onClick={() => handleAction(m.id, "accept")} fullWidth color="green">{tt("accept")}</Btn>
                  <Btn onClick={() => handleAction(m.id, "reject")} fullWidth color="red">{tt("reject")}</Btn>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── MAP VIEW (SVG-based mock) ─────────────────────────────────────────────────
function MapViewPage() {
  const { db, tt } = useApp();
  const [tooltip, setTooltip] = useState(null);

  // Simple lat/lng to SVG coord mapping (Punjab region)
  const toXY = (lat, lng) => {
    const x = ((lng - 74.0) / 4.0) * 700 + 50;
    const y = ((32.5 - lat) / 3.0) * 400 + 50;
    return [Math.max(20, Math.min(730, x)), Math.max(20, Math.min(430, y))];
  };

  const openListings = db.listings.filter(l => l.status === "OPEN");
  const clusteredListings = db.listings.filter(l => l.status === "CLUSTERED");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">🗺️ {tt("mapView")}</h1>
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Open Farmer Listings</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Clusters</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Buyer Locations</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-amber-400 rounded-full inline-block"></span> Cluster Radius</span>
      </div>
      <Card>
        <div className="relative w-full" style={{ height: 500 }}>
          <svg width="100%" height="100%" viewBox="0 0 780 500" className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
            {/* Grid lines */}
            {[0.5, 1, 1.5, 2, 2.5, 3].map(i => <line key={i} x1={0} y1={50 + i * 130} x2={780} y2={50 + i * 130} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />)}
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(i => <line key={i} x1={50 + i * 170} y1={0} x2={50 + i * 170} y2={500} stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />)}
            {/* India state outline rough */}
            <text x="20" y="20" fontSize="12" fill="#9ca3af">Punjab Region (Mock Map)</text>

            {/* Cluster radii */}
            {db.clusters.map(c => {
              const [x, y] = toXY(c.centroid_lat, c.centroid_lng);
              return <circle key={`r${c.id}`} cx={x} cy={y} r={60} fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6" />;
            })}

            {/* Match lines */}
            {db.matches.filter(m => m.status === "ACCEPTED" || m.status === "PROPOSED").map(m => {
              const cluster = db.clusters.find(c => c.id === m.cluster_id);
              const demand = db.demands.find(d => d.id === m.demand_id);
              if (!cluster || !demand) return null;
              const [x1, y1] = toXY(cluster.centroid_lat, cluster.centroid_lng);
              const [x2, y2] = toXY(demand.geo_lat, demand.geo_lng);
              return <line key={`ml${m.id}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" strokeDasharray="8" opacity="0.6" />;
            })}

            {/* Open listings */}
            {openListings.map(l => {
              const [x, y] = toXY(l.geo_lat, l.geo_lng);
              return (
                <g key={`l${l.id}`} onMouseEnter={() => setTooltip({ type: "listing", data: l, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={10} fill="#10b981" opacity="0.9" />
                  <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="white">🌾</text>
                </g>
              );
            })}

            {/* Clusters */}
            {db.clusters.filter(c => c.status !== "DONE").map(c => {
              const [x, y] = toXY(c.centroid_lat, c.centroid_lng);
              return (
                <g key={`c${c.id}`} onMouseEnter={() => setTooltip({ type: "cluster", data: c, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={20} fill="#f59e0b" opacity="0.95" stroke="white" strokeWidth="2" />
                  <text x={x} y={y - 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{c.total_tonnes}t</text>
                  <text x={x} y={y + 7} textAnchor="middle" fontSize="8" fill="white">🔗</text>
                </g>
              );
            })}

            {/* Buyers */}
            {db.demands.filter(d => d.status !== "CANCELLED").map(d => {
              const [x, y] = toXY(d.geo_lat, d.geo_lng);
              return (
                <g key={`d${d.id}`} onMouseEnter={() => setTooltip({ type: "demand", data: d, x, y })} onMouseLeave={() => setTooltip(null)} className="cursor-pointer">
                  <rect x={x - 14} y={y - 14} width={28} height={28} rx={6} fill="#3b82f6" opacity="0.9" stroke="white" strokeWidth="2" />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="13">🏭</text>
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip && (() => {
              const { type, data, x, y } = tooltip;
              const tx = Math.min(x + 10, 600), ty = Math.max(y - 80, 10);
              return (
                <g>
                  <rect x={tx} y={ty} width={180} height={type === "cluster" ? 80 : 65} rx={8} fill="white" stroke="#e5e7eb" strokeWidth="1" filter="url(#shadow)" />
                  {type === "listing" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.village_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">{data.acres} acres · {data.estimated_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Status: {data.status}</text>
                  </>}
                  {type === "cluster" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.cluster_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">Total: {data.total_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Members: {data.member_listing_ids.length} farmers</text>
                    <text x={tx + 10} y={ty + 66} fontSize="10" fill="#666">Status: {data.status}</text>
                  </>}
                  {type === "demand" && <>
                    <text x={tx + 10} y={ty + 18} fontSize="11" fontWeight="bold" fill="#111">{data.company_name}</text>
                    <text x={tx + 10} y={ty + 34} fontSize="10" fill="#666">Needs: {data.required_tonnes}t</text>
                    <text x={tx + 10} y={ty + 50} fontSize="10" fill="#666">Price: ₹{data.price_per_tonne}/t</text>
                  </>}
                </g>
              );
            })()}
          </svg>
        </div>
      </Card>
    </div>
  );
}

// ─── IMPACT DASHBOARD ──────────────────────────────────────────────────────────
function ImpactDashboard() {
  const { db, tt } = useApp();
  const completedMatches = db.matches.filter(m => m.status === "ACCEPTED" || m.status === "COMPLETED");
  const totalTonnes = completedMatches.reduce((a, m) => { const c = db.clusters.find(cl => cl.id === m.cluster_id); return a + (c?.total_tonnes || 0); }, 0);
  const totalCO2 = (totalTonnes * 1.53).toFixed(1);
  const totalPM25 = (totalTonnes * 3.2).toFixed(1);
  const totalCoal = (totalTonnes * 0.45).toFixed(1);
  const totalEarnings = completedMatches.reduce((a, m) => { const c = db.clusters.find(cl => cl.id === m.cluster_id); return a + (c?.total_tonnes || 0) * m.offered_price; }, 0);
  const farmersHelped = new Set(db.listings.filter(l => l.status === "CLUSTERED" || l.status === "PICKED_UP").map(l => l.farmer_user_id)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🌿 {tt("impactDashboard")}</h1>
        <p className="text-sm text-gray-500 mt-1">{tt("disclaimer")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon="🌾" label={tt("totalSaved")} value={`${totalTonnes}t`} color="emerald" sub="stubble diverted from burning" />
        <StatCard icon="🌫️" label={`${tt("co2Avoided")} (est.)`} value={`${totalCO2}t`} color="blue" sub="CO₂ equivalent" />
        <StatCard icon="💨" label="PM2.5 Avoided (est.)" value={`${totalPM25}kg`} color="purple" sub="fine particulate matter" />
        <StatCard icon="⛏️" label="Coal Replaced (est.)" value={`${totalCoal}t`} color="amber" sub="energy equivalent" />
        <StatCard icon="👨🌾" label={tt("farmersHelped")} value={farmersHelped} color="emerald" sub="farmers in active clusters" />
        <StatCard icon="💰" label={tt("earnings")} value={formatINR(totalEarnings)} color="amber" sub="total farmer earnings" />
      </div>
      <Card>
        <div className="p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Match Impact Breakdown</h2>
          <div className="space-y-3">
            {completedMatches.map(m => {
              const cluster = db.clusters.find(c => c.id === m.cluster_id);
              const demand = db.demands.find(d => d.id === m.demand_id);
              const tonnes = cluster?.total_tonnes || 0;
              return (
                <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-800">{cluster?.cluster_name} → {demand?.company_name}</div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-emerald-50 rounded-lg p-2"><div className="font-bold text-emerald-700">{tonnes}t</div><div className="text-gray-500">Saved</div></div>
                    <div className="bg-blue-50 rounded-lg p-2"><div className="font-bold text-blue-700">{(tonnes * 1.53).toFixed(1)}t</div><div className="text-gray-500">CO₂</div></div>
                    <div className="bg-purple-50 rounded-lg p-2"><div className="font-bold text-purple-700">{(tonnes * 3.2).toFixed(0)}kg</div><div className="text-gray-500">PM2.5</div></div>
                    <div className="bg-amber-50 rounded-lg p-2"><div className="font-bold text-amber-700">{formatINR(tonnes * m.offered_price)}</div><div className="text-gray-500">Earned</div></div>
                  </div>
                </div>
              );
            })}
            {completedMatches.length === 0 && <p className="text-center text-gray-400 py-6">Accept matches to see impact here.</p>}
          </div>
        </div>
      </Card>
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <h3 className="font-semibold text-emerald-800 mb-2">📊 Estimation Methodology</h3>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-emerald-700">
          <p>• CO₂e: 1.53 tCO₂ per tonne burned (IPCC)</p>
          <p>• PM2.5: 3.2 kg per tonne burned (CPCB)</p>
          <p>• Coal equiv: 0.45 tonne coal per tonne stubble</p>
          <p>• Yield: 2.5 tonnes stubble per acre (ICAR)</p>
        </div>
        <p className="text-xs text-emerald-600 mt-3 italic">All figures are estimates for informational purposes only.</p>
      </div>
    </div>
  );
}

// ─── BURN VS SELL CALCULATOR ──────────────────────────────────────────────────
function CalculatorPage() {
  const { db, tt } = useApp();
  const [acres, setAcres] = useState("");
  const [pricePerTonne, setPricePerTonne] = useState(2000);
  const tpa = db.config.tonnes_per_acre;
  const totalTonnes = parseFloat(acres || 0) * tpa;
  const sellEarnings = totalTonnes * pricePerTonne;
  const burnCost = parseFloat(acres || 0) * 300;
  const soilLoss = totalTonnes * 150;
  const totalBurnLoss = burnCost + soilLoss;
  const netBenefit = sellEarnings + totalBurnLoss;
  const co2 = (totalTonnes * 1.53).toFixed(1);
  const pm25 = (totalTonnes * 3.2).toFixed(1);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🧮 {tt("burnVsSell")}</h1>
        <button onClick={() => speak(`${tt("burnVsSell")}. ${tt("netBenefit")}: ${formatINR(netBenefit)}`, lang)}
          className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition">🔊</button>
      </div>
      <Card>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{tt("yourAcres")}</label>
              <input type="number" min="0" step="0.5" value={acres} onChange={e => setAcres(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                placeholder="e.g. 10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Market Price (₹/t)</label>
              <input type="number" min="0" step="100" value={pricePerTonne} onChange={e => setPricePerTonne(+e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50" />
            </div>
          </div>

          {totalTonnes > 0 && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                {acres} acres × {tpa} t/acre = <b className="text-gray-900">{totalTonnes.toFixed(1)} tonnes</b> of stubble
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <div className="text-sm font-semibold text-red-700 mb-3">🔥 {tt("ifYouBurn")}</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Fine risk</span><span className="text-red-600 font-medium">-{formatINR(burnCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Soil loss</span><span className="text-red-600 font-medium">-{formatINR(soilLoss)}</span></div>
                    <div className="border-t border-red-200 pt-2 flex justify-between font-bold"><span>Total loss</span><span className="text-red-700">-{formatINR(totalBurnLoss)}</span></div>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <div className="text-sm font-semibold text-emerald-700 mb-3">💰 {tt("ifYouSell")}</div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">{totalTonnes.toFixed(1)}t × ₹{pricePerTonne}</span><span className="text-emerald-600 font-medium">+{formatINR(sellEarnings)}</span></div>
                    <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold"><span>Earnings</span><span className="text-emerald-700">+{formatINR(sellEarnings)}</span></div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-400 rounded-2xl p-5 text-center">
                <div className="text-sm font-medium text-amber-900 mb-1">{tt("netBenefit")} of Selling over Burning</div>
                <div className="text-4xl font-black text-white">{formatINR(netBenefit)}</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-sm font-semibold text-blue-700 mb-2">🌿 Environmental Benefit (estimated)</div>
                <div className="flex justify-between text-sm">
                  <span>CO₂ avoided: <b>{co2}t</b></span>
                  <span>PM2.5 avoided: <b>{pm25}kg</b></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage() {
  const { db, setDb, tt } = useApp();
  const [config, setConfig] = useState({ ...db.config });
  const [activeTab, setActiveTab] = useState("config");

  const saveConfig = () => {
    setDb(prev => ({ ...prev, config: { ...config } }));
    alert("Configuration saved!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">⚙️ {tt("adminPanel")}</h1>
      <div className="flex gap-2">
        {["config", "listings", "clusters", "audit"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "config" && (
        <Card>
          <div className="p-6">
            <h2 className="font-semibold text-gray-800 mb-5">{tt("configConstants")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "tonnes_per_acre", label: tt("tonnesPerAcre"), step: "0.1" },
                { key: "min_cluster_tonnes", label: tt("minClusterTonnes"), step: "5" },
                { key: "distance_threshold_km", label: tt("distanceThreshold"), step: "1" },
                { key: "price_weight", label: "Price Weight (0-1)", step: "0.1" },
                { key: "distance_weight", label: "Distance Weight (0-1)", step: "0.1" },
                { key: "transport_cost_per_km_tonne", label: "Transport Cost ₹/km/t", step: "0.5" },
              ].map(({ key, label, step }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="number" step={step} value={config[key]}
                    onChange={e => setConfig({ ...config, [key]: +e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50" />
                </div>
              ))}
            </div>
            <div className="mt-5"><Btn onClick={saveConfig}>{tt("saveConfig")}</Btn></div>
          </div>
        </Card>
      )}

      {activeTab === "listings" && (
        <Card>
          <div className="p-5 border-b border-gray-50 font-semibold text-gray-800">All Listings ({db.listings.length})</div>
          <div className="divide-y divide-gray-50">
            {db.listings.map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-gray-50">
                <div>
                  <span className="font-medium">{l.village_name}</span>
                  <span className="text-gray-400 ml-2">· Farmer #{l.farmer_user_id} · {l.acres} acres · {l.estimated_tonnes}t</span>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "clusters" && (
        <Card>
          <div className="p-5 border-b border-gray-50 font-semibold text-gray-800">All Clusters ({db.clusters.length})</div>
          <div className="divide-y divide-gray-50">
            {db.clusters.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between text-sm hover:bg-gray-50">
                <div>
                  <span className="font-medium">{c.cluster_name}</span>
                  <span className="text-gray-400 ml-2">· {c.total_tonnes}t · {c.member_listing_ids.length} members</span>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "audit" && (
        <Card>
          <div className="p-5 border-b border-gray-50 font-semibold text-gray-800">{tt("auditLog")} ({db.auditLogs.length})</div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {db.auditLogs.slice().reverse().map(log => (
              <div key={log.id} className="px-5 py-3 text-sm hover:bg-gray-50 flex items-start gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${log.event === "LOGIN_SUCCESS" ? "bg-emerald-100 text-emerald-700" : log.event === "OTP_SENT" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{log.event}</span>
                <span className="text-gray-600">{log.detail}</span>
                <span className="text-gray-400 ml-auto text-xs flex-shrink-0">{log.ts}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── MOBILE NAV ────────────────────────────────────────────────────────────────
function MobileNav({ page, setPage, role }) {
  const { tt } = useApp();
  const farmerLinks = [
    { key: "dashboard", icon: "🏠", label: tt("dashboard") },
    { key: "marketplace", icon: "🏪", label: tt("marketplace") },
    { key: "farmerListings", icon: "📋", label: "Listings" },
    { key: "offers", icon: "🤝", label: "Offers" },
    { key: "mapView", icon: "🗺️", label: "Map" },
    { key: "impact", icon: "🌿", label: "Impact" },
  ];
  const buyerLinks = [
    { key: "dashboard", icon: "🏠", label: tt("dashboard") },
    { key: "buyerDemands", icon: "📦", label: "Demands" },
    { key: "matches", icon: "🔗", label: "Matches" },
    { key: "mapView", icon: "🗺️", label: "Map" },
    { key: "impact", icon: "🌿", label: "Impact" },
  ];
  const links = role === "FARMER" ? farmerLinks : buyerLinks;
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 flex">
      {links.map(l => (
        <button key={l.key} onClick={() => setPage(l.key)}
          className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-all ${page === l.key ? "text-emerald-600" : "text-gray-400"}`}>
          <span className="text-lg">{l.icon}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("pralicash-lang") || "en");
  const [db, setDb] = useState(INITIAL_DB);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("roleSelect");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => { localStorage.setItem("pralicash-lang", lang); }, [lang]);

  useEffect(() => {
    fetch("/api/db")
      .then(res => res.json())
      .then(data => setDb(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Failed to load DB:", err));
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { hi: "hi-IN", pa: "pa-IN", te: "te-IN", ta: "ta-IN", mr: "mr-IN", gu: "gu-IN", bn: "bn-IN", kn: "kn-IN", ml: "ml-IN" };
    utterance.lang = langMap[lang] || lang;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const tt = useCallback((key) => t(translations, lang, key), [lang]);

  const markAllRead = useCallback(() => {
    if (!currentUser) return;
    setDb(prev => ({ ...prev, notifications: prev.notifications.map(n => n.user_id === currentUser.id ? { ...n, read: true } : n) }));
  }, [currentUser]);

  const ctx = { lang, setLang, db, setDb, currentUser, setCurrentUser, role, setRole, tt, markAllRead, speaking, speak, stopSpeak };

  const renderPage = () => {
    const params = new URLSearchParams(window.location.search);
    const resetUser = params.get("reset");

    if (resetUser) return <ResetPasswordPage username={resetUser} setPage={setPage} />;

    if (!currentUser) {
      if (page === "roleSelect") return <RoleSelectPage setPage={setPage} setRole={setRole} />;
      if (page === "farmerLogin") return <FarmerLoginPage setPage={setPage} />;
      if (page === "buyerLogin") return <BuyerLoginPage setPage={setPage} />;
      return <RoleSelectPage setPage={setPage} setRole={setRole} />;
    }

    const userRole = currentUser.role;

    const dashMap = {
      FARMER: <FarmerDashboard setPage={setPage} />,
      BUYER: <BuyerDashboard setPage={setPage} />,
      ADMIN: <AdminPage />,
    };

    const pageMap = {
      dashboard: dashMap[userRole] || dashMap["FARMER"],
      marketplace: <FarmerDashboard setPage={setPage} />,
      farmerListings: <FarmerListingsPage setPage={setPage} />,
      createListing: <CreateListingPage setPage={setPage} />,
      offers: <OffersPage />,
      buyerDemands: <BuyerDemandsPage setPage={setPage} />,
      createDemand: <CreateDemandPage setPage={setPage} />,
      matches: <MatchesPage />,
      mapView: <MapViewPage />,
      impact: <ImpactDashboard />,
      calculator: <CalculatorPage />,
      admin: <AdminPage />,
    };

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-8">
        <Sidebar page={page} setPage={setPage} role={userRole} />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {pageMap[page] || dashMap[userRole]}
        </main>
      </div>
    );
  };

  const showHeader = page !== "roleSelect" && page !== "farmerLogin" && page !== "buyerLogin";

  return (
    <AppCtx.Provider value={ctx}>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
          * { box-sizing: border-box; }
          body { margin: 0; }
          ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          input:focus, select:focus { outline: none; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeIn 0.2s ease-out; }
        `}</style>
        {showHeader && <Header setPage={setPage} />}
        <div className="fade-in">{renderPage()}</div>
        {currentUser && currentUser.role !== "ADMIN" && <MobileNav page={page} setPage={setPage} role={currentUser.role} />}
      </div>
    </AppCtx.Provider>
  );
}

