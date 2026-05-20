export interface AreaInfo {
  city: string;
  province: string;
  lat: number;
  lng: number;
  address: string;
}

export const AREA_MAP: { keywords: string[]; info: AreaInfo }[] = [
  // --- KARACHI NEIGHBORHOODS (Specific coordinates for precise mapping) ---
  {
    keywords: ['malir'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8990,
      lng: 67.1981,
      address: 'Malir, Karachi, Sindh'
    }
  },
  {
    keywords: ['clifton'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8138,
      lng: 67.0336,
      address: 'Clifton, Karachi, Sindh'
    }
  },
  {
    keywords: ['korangi'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8387,
      lng: 67.1208,
      address: 'Korangi, Karachi, Sindh'
    }
  },
  {
    keywords: ['gulshan', 'gulshan-e-iqbal'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.9180,
      lng: 67.0970,
      address: 'Gulshan-e-Iqbal, Karachi, Sindh'
    }
  },
  {
    keywords: ['gulistan-e-jauhar', 'jauhar'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.9150,
      lng: 67.1250,
      address: 'Gulistan-e-Jauhar, Karachi, Sindh'
    }
  },
  {
    keywords: ['dha karachi', 'dha phase'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8200,
      lng: 67.0600,
      address: 'DHA, Karachi, Sindh'
    }
  },
  {
    keywords: ['nazimabad', 'north nazimabad'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.9128,
      lng: 67.0309,
      address: 'Nazimabad, Karachi, Sindh'
    }
  },
  {
    keywords: ['lyari'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8700,
      lng: 66.9900,
      address: 'Lyari, Karachi, Sindh'
    }
  },
  {
    keywords: ['kharadar', 'saddar'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8607,
      lng: 67.0011,
      address: 'Kharadar, Karachi, Sindh'
    }
  },
  // --- LAHORE NEIGHBORHOODS (Specific coordinates) ---
  {
    keywords: ['gulberg'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.5204,
      lng: 74.3587,
      address: 'Gulberg, Lahore, Punjab'
    }
  },
  {
    keywords: ['johar town'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.4697,
      lng: 74.2728,
      address: 'Johar Town, Lahore, Punjab'
    }
  },
  {
    keywords: ['dha lahore'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.4790,
      lng: 74.4690,
      address: 'DHA, Lahore, Punjab'
    }
  },
  {
    keywords: ['model town'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.4806,
      lng: 74.3213,
      address: 'Model Town, Lahore, Punjab'
    }
  },
  {
    keywords: ['walled city', 'anarkali'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.5794,
      lng: 74.3125,
      address: 'Walled City, Lahore, Punjab'
    }
  },
  // --- GENERAL CITIES & CATCH-ALLS (Fallback if no specific neighborhood matches) ---
  {
    keywords: ['landhi', 'liaquatabad', 'orangi', 'kemari', 'scheme 33', 'fb area', 'federal b', 'north karachi', 'karachi'],
    info: {
      city: 'Karachi',
      province: 'Sindh',
      lat: 24.8607,
      lng: 67.0011,
      address: 'Karachi, Sindh'
    }
  },
  {
    keywords: ['samanabad', 'iqbal town', 'shadman', 'sabzazar', 'mughalpura', 'garhi shahu', 'faisal town', 'garden town', 'township', 'green town', 'valencia', 'lahore'],
    info: {
      city: 'Lahore',
      province: 'Punjab',
      lat: 31.5204,
      lng: 74.3587,
      address: 'Lahore, Punjab'
    }
  },
  {
    keywords: ['blue area', 'sector g', 'sector f', 'sector i', 'g-6', 'g-7', 'g-8', 'g-9', 'g-10', 'g-11', 'f-6', 'f-7', 'f-8', 'f-10', 'f-11', 'e-7', 'e-11', 'i-8', 'i-9', 'i-10', 'bahria town islamabad', 'gulberg green', 'islamabad'],
    info: {
      city: 'Islamabad',
      province: 'Capital Territory',
      lat: 33.6844,
      lng: 73.0479,
      address: 'Islamabad, Capital Territory'
    }
  },
  {
    keywords: ['hayatabad', 'university road', 'karkhano', 'board bazaar', 'warsak road', 'ring road', 'peshawar cantt', 'dalazak road', 'peshawar'],
    info: {
      city: 'Peshawar',
      province: 'Khyber Pakhtunkhwa',
      lat: 33.9971,
      lng: 71.5543,
      address: 'Peshawar, Khyber Pakhtunkhwa'
    }
  },
  {
    keywords: ['satellite town', 'commercial market', 'raja bazaar', 'bahria town rawalpindi', 'adyala road', 'tench bhata', 'lalazar', 'double road', 'rawalpindi'],
    info: {
      city: 'Rawalpindi',
      province: 'Punjab',
      lat: 33.5984,
      lng: 73.0441,
      address: 'Rawalpindi, Punjab'
    }
  },
  {
    keywords: ['quetta cantt', 'jinnah road', 'sariab road', 'hazara town', 'quetta'],
    info: {
      city: 'Quetta',
      province: 'Balochistan',
      lat: 30.1798,
      lng: 66.9750,
      address: 'Quetta, Balochistan'
    }
  },
  {
    keywords: ['mingora', 'kalam', 'bahrain', 'fizagat', 'saidu sharif', 'swat'],
    info: {
      city: 'Swat',
      province: 'Khyber Pakhtunkhwa',
      lat: 35.2227,
      lng: 72.4258,
      address: 'Swat Valley, Khyber Pakhtunkhwa'
    }
  },
  {
    keywords: ['bosan road', 'shah rukn-e-alam', 'multan cantt', 'gulgasht', 'mumtazabad', 'multan'],
    info: {
      city: 'Multan',
      province: 'Punjab',
      lat: 30.1575,
      lng: 71.5249,
      address: 'Multan, Punjab'
    }
  },
  {
    keywords: ['clock tower', 'kohinoor', 'madina town', 'peoples colony', 'd-ground', 'ghulam muhammad abad', 'sargodha road', 'faisalabad'],
    info: {
      city: 'Faisalabad',
      province: 'Punjab',
      lat: 31.4504,
      lng: 73.1350,
      address: 'Faisalabad, Punjab'
    }
  },
  {
    keywords: ['sialkot cantt', 'paris road', 'shahabpura', 'sambrial', 'sialkot'],
    info: {
      city: 'Sialkot',
      province: 'Punjab',
      lat: 32.4972,
      lng: 74.5361,
      address: 'Sialkot, Punjab'
    }
  },
  {
    keywords: ['mall road', 'gpo', 'pindi point', 'kashmir point', 'bhurban', 'murree'],
    info: {
      city: 'Murree',
      province: 'Punjab',
      lat: 33.9070,
      lng: 73.3943,
      address: 'Murree, Punjab'
    }
  },
  {
    keywords: ['jutial', 'nli bazar', 'konodass', 'gilgit'],
    info: {
      city: 'Gilgit',
      province: 'Gilgit-Baltistan',
      lat: 35.9208,
      lng: 74.3089,
      address: 'Gilgit, Gilgit-Baltistan'
    }
  }
];

export const parseAreaAndCity = (description: string): AreaInfo => {
  const desc = description.toLowerCase();
  
  for (const item of AREA_MAP) {
    for (const keyword of item.keywords) {
      if (desc.includes(keyword)) {
        let specificAddress = item.info.address;
        const words = keyword.split(' ');
        const capitalizedKeyword = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        if (keyword !== item.info.city.toLowerCase()) {
          specificAddress = `${capitalizedKeyword}, ${item.info.city}, ${item.info.province}`;
        }
        
        // Random offset to avoid stacking pins at identical coordinates
        const offsetLat = (Math.random() - 0.5) * 0.015;
        const offsetLng = (Math.random() - 0.5) * 0.015;
        
        return {
          ...item.info,
          lat: item.info.lat + offsetLat,
          lng: item.info.lng + offsetLng,
          address: specificAddress
        };
      }
    }
  }
  
  // Default fallback Lahore
  const offsetLat = (Math.random() - 0.5) * 0.03;
  const offsetLng = (Math.random() - 0.5) * 0.03;
  return {
    city: 'Lahore',
    province: 'Punjab',
    lat: 31.5204 + offsetLat,
    lng: 74.3587 + offsetLng,
    address: 'Lahore, Punjab'
  };
};
