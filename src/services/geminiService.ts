import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseAreaAndCity } from './areaKnowledge';

// Initialize the Gemini API client
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const extractCityName = (description: string): string => {
  return parseAreaAndCity(description).city;
};

const getFallbackAnalysis = (description: string) => {
  const desc = description.toLowerCase();
  const areaInfo = parseAreaAndCity(description);
  const city = areaInfo.city;
  const province = areaInfo.province;
  const address = areaInfo.address.split(',')[0]; // e.g., 'Korangi' or 'Gulberg'
  
  let category: 'Medical' | 'Fire' | 'Flood' | 'Security' | 'Other' = 'Other';
  let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  let actionPlan = '';
  let userInstructionEnglish = '';
  let userInstructionUrdu = '';
  let userInstructionRomanUrdu = '';

  if (desc.includes('flood') || desc.includes('water') || desc.includes('paani') || desc.includes('sailab') || desc.includes('baarnish') || desc.includes('rain')) {
    category = 'Flood';
    severity = 'High';
    actionPlan = `1. Dispatched localized emergency rescue boats and life jackets to flooded sectors in ${address}, ${city}.\n2. Notified NDMA (National Disaster Management Authority) and ${province} local administration.\n3. Initiated emergency evacuation warning protocols in ${address}.`;
    userInstructionEnglish = `Move to the highest level of your building in ${address}, ${city} immediately. Avoid contact with floodwater and stay tuned for evacuation instructions.`;
    userInstructionUrdu = `فوری طور پر کسی اونچی جگہ یا عمارت کی اوپر والی منزل پر منتقل ہو جائیں۔ گندے پانی سے دور رہیں اور ${address}، ${city} میں امدادی ہدایات کا انتظار کریں۔`;
    userInstructionRomanUrdu = `Fauri tor par kisi oonchi jagah ya building ki oopar wali manzil par muntaqil ho jayein. ${address}, ${city} me paani se door rahein aur rescue teams ka intezar karein.`;
  } else if (desc.includes('fire') || desc.includes('aag') || desc.includes('smoke') || desc.includes('dhuwan') || desc.includes('blast') || desc.includes('explosion')) {
    category = 'Fire';
    severity = 'Critical';
    actionPlan = `1. Alerted municipal Fire Brigade units closest to ${address} in ${city}.\n2. Dispatched search & rescue teams with specialized fire retardants.\n3. Setting up water supply and perimeter controls around the sector.`;
    userInstructionEnglish = `Evacuate the building in ${address}, ${city} immediately using stairs, not elevators. Cover your nose with a damp cloth if there is smoke.`;
    userInstructionUrdu = `فوری طور پر سیڑھیوں کے ذریعے عمارت سے باہر نکلیں۔ دھوئیں کی صورت میں ${address}، ${city} میں ناک کو گیلے کپڑے سے ڈھانپیں۔`;
    userInstructionRomanUrdu = `Fauri tor par seedhiyon ke zarye building se bahar niklein. ${address}, ${city} me dhuwan hone ki surat me naak ko geele kapray se dhank lein.`;
  } else if (desc.includes('medical') || desc.includes('accident') || desc.includes('hadiqa') || desc.includes('chot') || desc.includes('blood') || desc.includes('heart') || desc.includes('pain') || desc.includes('sick') || desc.includes('doctor') || desc.includes('ambulance')) {
    category = 'Medical';
    severity = 'High';
    actionPlan = `1. Dispatched nearest 1122 emergency ambulance rescue unit to ${address}, ${city}.\n2. Pre-notified the emergency trauma center at the nearest hospital in ${city}.\n3. Opened standard remote first-aid guidelines.`;
    userInstructionEnglish = `Stay calm. Keep the patient comfortable in ${address}, ${city} and do not move them. Rescue ambulance is on the way.`;
    userInstructionUrdu = `پرسکون رہیں۔ مریض کو ${address}، ${city} میں آرام دہ حالت میں رکھیں اور حرکت نہ دیں۔ ایمبولینس روانہ کر دی گئی ہے۔`;
    userInstructionRomanUrdu = `Pur-sukoon rahein. Mareez ko ${address}, ${city} me aaram de halat me rakhein aur bila-waja harkat na dein. Ambulance aa rahi hai.`;
  } else if (desc.includes('security') || desc.includes('chor') || desc.includes('daku') || desc.includes('firing') || desc.includes('gun') || desc.includes('fight') || desc.includes('robbery') || desc.includes('weapon')) {
    category = 'Security';
    severity = 'High';
    actionPlan = `1. Dispatched local police patrol units to ${address}, ${city}.\n2. Triggered neighborhood watch alerts in the ${address} sector.\n3. Tracking reporter location coordinates for direct squad navigation.`;
    userInstructionEnglish = `Find a safe, locked room in ${address}, ${city}. Stay silent, turn off lights, and keep your phone on silent mode.`;
    userInstructionUrdu = `کسی محفوظ، لاک شدہ کمرے میں چلے جائیں۔ خاموش رہیں، لائٹس بند کر دیں، اور ${address}، ${city} میں فون سائلنٹ پر کر لیں۔`;
    userInstructionRomanUrdu = `Kisi mahfooz, locked kamray me chale jayein. Khamosh rahein, lights band krdein aur ${address}, ${city} me mobile silent par krlein.`;
  } else {
    category = 'Other';
    severity = 'Medium';
    actionPlan = `1. Logged crisis report in centralized control panel for ${address}, ${city}.\n2. Assigned dispatcher for manual description verification.\n3. Initiated emergency contact check-ins.`;
    userInstructionEnglish = `We have logged your alert in ${address}, ${city}. Please stay safe and keep your phone active for a callback from our team.`;
    userInstructionUrdu = `ہم نے آپ کی رپورٹ درج کر لی ہے۔ براہ کرم ${address}، ${city} میں محفوظ رہیں اور اپنے فون کو ایکٹو رکھیں تاکہ ہماری ٹیم رابطہ کر سکے۔`;
    userInstructionRomanUrdu = `Humne aapki report darj kar li hai. ${address}, ${city} me baraye meharbani mahfooz rahein aur apne phone ko active rakhein taake hum rabta kr sakein.`;
  }

  return {
    category,
    severity,
    actionPlan,
    userInstructionEnglish,
    userInstructionUrdu,
    userInstructionRomanUrdu
  };
};

export const analyzeCrisis = async (description: string) => {
  if (!apiKey) {
    console.warn('Gemini API key is not configured. Utilizing local fallback simulation.');
    return getFallbackAnalysis(description);
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const areaInfo = parseAreaAndCity(description);
  const city = areaInfo.city;
  const province = areaInfo.province;
  const address = areaInfo.address;
  
  const prompt = `
    You are an Agentic Crisis Management AI for Pakistan (PakBridge AI).
    A user has reported the following emergency: "${description}"
    Our geo-intelligence has parsed the reporter's context:
    - City: ${city}
    - Province: ${province}
    - Specific Area/Sector: ${address}
    
    Please analyze this emergency and provide a JSON response with the following strictly formatted information. Do NOT wrap the JSON in markdown blocks (e.g. \`\`\`json). Just return the raw JSON object.
    
    {
      "category": "Medical" | "Fire" | "Flood" | "Security" | "Other",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "actionPlan": "A brief 2-3 step operational plan for first responders in ${city} (refer to specific areas like ${address} if relevant).",
      "userInstructionEnglish": "A concise instruction for the user to stay safe in English in ${city}.",
      "userInstructionUrdu": "A concise instruction for the user to stay safe in Urdu referencing ${city}.",
      "userInstructionRomanUrdu": "A concise instruction for the user to stay safe in Roman Urdu referencing ${city}."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    const errorMsg = error?.message || '';
    if (errorMsg.includes('blocked') || errorMsg.includes('403') || errorMsg.includes('API_KEY_SERVICE_BLOCKED')) {
      console.warn('⚠️ Gemini API access is restricted/blocked for this API Key. Seamlessly using local geo-intelligence fallback.');
    } else {
      console.warn('⚠️ Gemini API unavailable, using local fallback:', errorMsg || error);
    }
    return getFallbackAnalysis(description);
  }
};


