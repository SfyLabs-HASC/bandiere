// Flag data with country codes and SVG flag representations
// In a real app, you would use actual flag images or SVG files

export interface Country {
  code: string;
  name: string;
  capital: string;
  continent: string;
  flagEmoji: string; // Using emoji flags as placeholder
}

export const countries: Country[] = [
  // North America
  { code: 'US', name: 'United States', capital: 'Washington D.C.', continent: 'North America', flagEmoji: '🇺🇸' },
  { code: 'CA', name: 'Canada', capital: 'Ottawa', continent: 'North America', flagEmoji: '🇨🇦' },
  { code: 'MX', name: 'Mexico', capital: 'Mexico City', continent: 'North America', flagEmoji: '🇲🇽' },
  
  // South America
  { code: 'BR', name: 'Brazil', capital: 'Brasília', continent: 'South America', flagEmoji: '🇧🇷' },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', continent: 'South America', flagEmoji: '🇦🇷' },
  { code: 'CL', name: 'Chile', capital: 'Santiago', continent: 'South America', flagEmoji: '🇨🇱' },
  { code: 'CO', name: 'Colombia', capital: 'Bogotá', continent: 'South America', flagEmoji: '🇨🇴' },
  { code: 'PE', name: 'Peru', capital: 'Lima', continent: 'South America', flagEmoji: '🇵🇪' },
  { code: 'VE', name: 'Venezuela', capital: 'Caracas', continent: 'South America', flagEmoji: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', capital: 'Quito', continent: 'South America', flagEmoji: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', capital: 'La Paz', continent: 'South America', flagEmoji: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', capital: 'Asunción', continent: 'South America', flagEmoji: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', capital: 'Montevideo', continent: 'South America', flagEmoji: '🇺🇾' },
  { code: 'GY', name: 'Guyana', capital: 'Georgetown', continent: 'South America', flagEmoji: '🇬🇾' },
  { code: 'SR', name: 'Suriname', capital: 'Paramaribo', continent: 'South America', flagEmoji: '🇸🇷' },
  
  // Europe
  { code: 'GB', name: 'United Kingdom', capital: 'London', continent: 'Europe', flagEmoji: '🇬🇧' },
  { code: 'FR', name: 'France', capital: 'Paris', continent: 'Europe', flagEmoji: '🇫🇷' },
  { code: 'DE', name: 'Germany', capital: 'Berlin', continent: 'Europe', flagEmoji: '🇩🇪' },
  { code: 'IT', name: 'Italy', capital: 'Rome', continent: 'Europe', flagEmoji: '🇮🇹' },
  { code: 'ES', name: 'Spain', capital: 'Madrid', continent: 'Europe', flagEmoji: '🇪🇸' },
  { code: 'PT', name: 'Portugal', capital: 'Lisbon', continent: 'Europe', flagEmoji: '🇵🇹' },
  { code: 'NL', name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe', flagEmoji: '🇳🇱' },
  { code: 'BE', name: 'Belgium', capital: 'Brussels', continent: 'Europe', flagEmoji: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', capital: 'Bern', continent: 'Europe', flagEmoji: '🇨🇭' },
  { code: 'AT', name: 'Austria', capital: 'Vienna', continent: 'Europe', flagEmoji: '🇦🇹' },
  { code: 'SE', name: 'Sweden', capital: 'Stockholm', continent: 'Europe', flagEmoji: '🇸🇪' },
  { code: 'NO', name: 'Norway', capital: 'Oslo', continent: 'Europe', flagEmoji: '🇳🇴' },
  { code: 'DK', name: 'Denmark', capital: 'Copenhagen', continent: 'Europe', flagEmoji: '🇩🇰' },
  { code: 'FI', name: 'Finland', capital: 'Helsinki', continent: 'Europe', flagEmoji: '🇫🇮' },
  { code: 'IS', name: 'Iceland', capital: 'Reykjavik', continent: 'Europe', flagEmoji: '🇮🇸' },
  { code: 'IE', name: 'Ireland', capital: 'Dublin', continent: 'Europe', flagEmoji: '🇮🇪' },
  { code: 'PL', name: 'Poland', capital: 'Warsaw', continent: 'Europe', flagEmoji: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', capital: 'Prague', continent: 'Europe', flagEmoji: '🇨🇿' },
  { code: 'SK', name: 'Slovakia', capital: 'Bratislava', continent: 'Europe', flagEmoji: '🇸🇰' },
  { code: 'HU', name: 'Hungary', capital: 'Budapest', continent: 'Europe', flagEmoji: '🇭🇺' },
  { code: 'RO', name: 'Romania', capital: 'Bucharest', continent: 'Europe', flagEmoji: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', capital: 'Sofia', continent: 'Europe', flagEmoji: '🇧🇬' },
  { code: 'GR', name: 'Greece', capital: 'Athens', continent: 'Europe', flagEmoji: '🇬🇷' },
  { code: 'HR', name: 'Croatia', capital: 'Zagreb', continent: 'Europe', flagEmoji: '🇭🇷' },
  { code: 'SI', name: 'Slovenia', capital: 'Ljubljana', continent: 'Europe', flagEmoji: '🇸🇮' },
  { code: 'RS', name: 'Serbia', capital: 'Belgrade', continent: 'Europe', flagEmoji: '🇷🇸' },
  { code: 'BA', name: 'Bosnia and Herzegovina', capital: 'Sarajevo', continent: 'Europe', flagEmoji: '🇧🇦' },
  { code: 'MK', name: 'North Macedonia', capital: 'Skopje', continent: 'Europe', flagEmoji: '🇲🇰' },
  { code: 'AL', name: 'Albania', capital: 'Tirana', continent: 'Europe', flagEmoji: '🇦🇱' },
  { code: 'ME', name: 'Montenegro', capital: 'Podgorica', continent: 'Europe', flagEmoji: '🇲🇪' },
  { code: 'LT', name: 'Lithuania', capital: 'Vilnius', continent: 'Europe', flagEmoji: '🇱🇹' },
  { code: 'LV', name: 'Latvia', capital: 'Riga', continent: 'Europe', flagEmoji: '🇱🇻' },
  { code: 'EE', name: 'Estonia', capital: 'Tallinn', continent: 'Europe', flagEmoji: '🇪🇪' },
  { code: 'RU', name: 'Russia', capital: 'Moscow', continent: 'Europe/Asia', flagEmoji: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', capital: 'Kyiv', continent: 'Europe', flagEmoji: '🇺🇦' },
  { code: 'BY', name: 'Belarus', capital: 'Minsk', continent: 'Europe', flagEmoji: '🇧🇾' },
  { code: 'MD', name: 'Moldova', capital: 'Chișinău', continent: 'Europe', flagEmoji: '🇲🇩' },
  
  // Asia
  { code: 'CN', name: 'China', capital: 'Beijing', continent: 'Asia', flagEmoji: '🇨🇳' },
  { code: 'JP', name: 'Japan', capital: 'Tokyo', continent: 'Asia', flagEmoji: '🇯🇵' },
  { code: 'KR', name: 'South Korea', capital: 'Seoul', continent: 'Asia', flagEmoji: '🇰🇷' },
  { code: 'IN', name: 'India', capital: 'New Delhi', continent: 'Asia', flagEmoji: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', capital: 'Jakarta', continent: 'Asia', flagEmoji: '🇮🇩' },
  { code: 'TH', name: 'Thailand', capital: 'Bangkok', continent: 'Asia', flagEmoji: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', capital: 'Hanoi', continent: 'Asia', flagEmoji: '🇻🇳' },
  { code: 'PH', name: 'Philippines', capital: 'Manila', continent: 'Asia', flagEmoji: '🇵🇭' },
  { code: 'MY', name: 'Malaysia', capital: 'Kuala Lumpur', continent: 'Asia', flagEmoji: '🇲🇾' },
  { code: 'SG', name: 'Singapore', capital: 'Singapore', continent: 'Asia', flagEmoji: '🇸🇬' },
  { code: 'BD', name: 'Bangladesh', capital: 'Dhaka', continent: 'Asia', flagEmoji: '🇧🇩' },
  { code: 'PK', name: 'Pakistan', capital: 'Islamabad', continent: 'Asia', flagEmoji: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka', capital: 'Colombo', continent: 'Asia', flagEmoji: '🇱🇰' },
  { code: 'MM', name: 'Myanmar', capital: 'Naypyidaw', continent: 'Asia', flagEmoji: '🇲🇲' },
  { code: 'KH', name: 'Cambodia', capital: 'Phnom Penh', continent: 'Asia', flagEmoji: '🇰🇭' },
  { code: 'LA', name: 'Laos', capital: 'Vientiane', continent: 'Asia', flagEmoji: '🇱🇦' },
  { code: 'MN', name: 'Mongolia', capital: 'Ulaanbaatar', continent: 'Asia', flagEmoji: '🇲🇳' },
  { code: 'KZ', name: 'Kazakhstan', capital: 'Nur-Sultan', continent: 'Asia', flagEmoji: '🇰🇿' },
  { code: 'UZ', name: 'Uzbekistan', capital: 'Tashkent', continent: 'Asia', flagEmoji: '🇺🇿' },
  { code: 'KG', name: 'Kyrgyzstan', capital: 'Bishkek', continent: 'Asia', flagEmoji: '🇰🇬' },
  { code: 'TJ', name: 'Tajikistan', capital: 'Dushanbe', continent: 'Asia', flagEmoji: '🇹🇯' },
  { code: 'TM', name: 'Turkmenistan', capital: 'Ashgabat', continent: 'Asia', flagEmoji: '🇹🇲' },
  { code: 'AF', name: 'Afghanistan', capital: 'Kabul', continent: 'Asia', flagEmoji: '🇦🇫' },
  { code: 'IR', name: 'Iran', capital: 'Tehran', continent: 'Asia', flagEmoji: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', capital: 'Baghdad', continent: 'Asia', flagEmoji: '🇮🇶' },
  { code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia', flagEmoji: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', continent: 'Asia', flagEmoji: '🇦🇪' },
  { code: 'IL', name: 'Israel', capital: 'Jerusalem', continent: 'Asia', flagEmoji: '🇮🇱' },
  { code: 'TR', name: 'Turkey', capital: 'Ankara', continent: 'Asia/Europe', flagEmoji: '🇹🇷' },
  { code: 'SY', name: 'Syria', capital: 'Damascus', continent: 'Asia', flagEmoji: '🇸🇾' },
  { code: 'JO', name: 'Jordan', capital: 'Amman', continent: 'Asia', flagEmoji: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', capital: 'Beirut', continent: 'Asia', flagEmoji: '🇱🇧' },
  { code: 'YE', name: 'Yemen', capital: 'Sana\'a', continent: 'Asia', flagEmoji: '🇾🇪' },
  { code: 'OM', name: 'Oman', capital: 'Muscat', continent: 'Asia', flagEmoji: '🇴🇲' },
  { code: 'KW', name: 'Kuwait', capital: 'Kuwait City', continent: 'Asia', flagEmoji: '🇰🇼' },
  { code: 'QA', name: 'Qatar', capital: 'Doha', continent: 'Asia', flagEmoji: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', capital: 'Manama', continent: 'Asia', flagEmoji: '🇧🇭' },
  
  // Africa
  { code: 'EG', name: 'Egypt', capital: 'Cairo', continent: 'Africa', flagEmoji: '🇪🇬' },
  { code: 'ZA', name: 'South Africa', capital: 'Cape Town', continent: 'Africa', flagEmoji: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', capital: 'Abuja', continent: 'Africa', flagEmoji: '🇳🇬' },
  { code: 'KE', name: 'Kenya', capital: 'Nairobi', continent: 'Africa', flagEmoji: '🇰🇪' },
  { code: 'MA', name: 'Morocco', capital: 'Rabat', continent: 'Africa', flagEmoji: '🇲🇦' },
  { code: 'ET', name: 'Ethiopia', capital: 'Addis Ababa', continent: 'Africa', flagEmoji: '🇪🇹' },
  { code: 'GH', name: 'Ghana', capital: 'Accra', continent: 'Africa', flagEmoji: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', capital: 'Dodoma', continent: 'Africa', flagEmoji: '🇹🇿' },
  { code: 'UG', name: 'Uganda', capital: 'Kampala', continent: 'Africa', flagEmoji: '🇺🇬' },
  { code: 'DZ', name: 'Algeria', capital: 'Algiers', continent: 'Africa', flagEmoji: '🇩🇿' },
  { code: 'AO', name: 'Angola', capital: 'Luanda', continent: 'Africa', flagEmoji: '🇦🇴' },
  { code: 'CM', name: 'Cameroon', capital: 'Yaoundé', continent: 'Africa', flagEmoji: '🇨🇲' },
  { code: 'CD', name: 'Democratic Republic of Congo', capital: 'Kinshasa', continent: 'Africa', flagEmoji: '🇨🇩' },
  { code: 'MG', name: 'Madagascar', capital: 'Antananarivo', continent: 'Africa', flagEmoji: '🇲🇬' },
  { code: 'MW', name: 'Malawi', capital: 'Lilongwe', continent: 'Africa', flagEmoji: '🇲🇼' },
  { code: 'ML', name: 'Mali', capital: 'Bamako', continent: 'Africa', flagEmoji: '🇲🇱' },
  { code: 'MZ', name: 'Mozambique', capital: 'Maputo', continent: 'Africa', flagEmoji: '🇲🇿' },
  { code: 'NA', name: 'Namibia', capital: 'Windhoek', continent: 'Africa', flagEmoji: '🇳🇦' },
  { code: 'NE', name: 'Niger', capital: 'Niamey', continent: 'Africa', flagEmoji: '🇳🇪' },
  { code: 'RW', name: 'Rwanda', capital: 'Kigali', continent: 'Africa', flagEmoji: '🇷🇼' },
  { code: 'SN', name: 'Senegal', capital: 'Dakar', continent: 'Africa', flagEmoji: '🇸🇳' },
  { code: 'ZM', name: 'Zambia', capital: 'Lusaka', continent: 'Africa', flagEmoji: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', capital: 'Harare', continent: 'Africa', flagEmoji: '🇿🇼' },
  { code: 'BW', name: 'Botswana', capital: 'Gaborone', continent: 'Africa', flagEmoji: '🇧🇼' },
  { code: 'LS', name: 'Lesotho', capital: 'Maseru', continent: 'Africa', flagEmoji: '🇱🇸' },
  { code: 'SZ', name: 'Eswatini', capital: 'Mbabane', continent: 'Africa', flagEmoji: '🇸🇿' },
  { code: 'LY', name: 'Libya', capital: 'Tripoli', continent: 'Africa', flagEmoji: '🇱🇾' },
  { code: 'TN', name: 'Tunisia', capital: 'Tunis', continent: 'Africa', flagEmoji: '🇹🇳' },
  { code: 'SD', name: 'Sudan', capital: 'Khartoum', continent: 'Africa', flagEmoji: '🇸🇩' },
  { code: 'SS', name: 'South Sudan', capital: 'Juba', continent: 'Africa', flagEmoji: '🇸🇸' },
  { code: 'CF', name: 'Central African Republic', capital: 'Bangui', continent: 'Africa', flagEmoji: '🇨🇫' },
  { code: 'TD', name: 'Chad', capital: 'N\'Djamena', continent: 'Africa', flagEmoji: '🇹🇩' },
  { code: 'CG', name: 'Congo', capital: 'Brazzaville', continent: 'Africa', flagEmoji: '🇨🇬' },
  { code: 'GA', name: 'Gabon', capital: 'Libreville', continent: 'Africa', flagEmoji: '🇬🇦' },
  { code: 'GQ', name: 'Equatorial Guinea', capital: 'Malabo', continent: 'Africa', flagEmoji: '🇬🇶' },
  { code: 'ST', name: 'São Tomé and Príncipe', capital: 'São Tomé', continent: 'Africa', flagEmoji: '🇸🇹' },
  { code: 'BF', name: 'Burkina Faso', capital: 'Ouagadougou', continent: 'Africa', flagEmoji: '🇧🇫' },
  { code: 'BJ', name: 'Benin', capital: 'Porto-Novo', continent: 'Africa', flagEmoji: '🇧🇯' },
  { code: 'TG', name: 'Togo', capital: 'Lomé', continent: 'Africa', flagEmoji: '🇹🇬' },
  { code: 'CI', name: 'Ivory Coast', capital: 'Yamoussoukro', continent: 'Africa', flagEmoji: '🇨🇮' },
  { code: 'LR', name: 'Liberia', capital: 'Monrovia', continent: 'Africa', flagEmoji: '🇱🇷' },
  { code: 'SL', name: 'Sierra Leone', capital: 'Freetown', continent: 'Africa', flagEmoji: '🇸🇱' },
  { code: 'GN', name: 'Guinea', capital: 'Conakry', continent: 'Africa', flagEmoji: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', capital: 'Bissau', continent: 'Africa', flagEmoji: '🇬🇼' },
  { code: 'CV', name: 'Cape Verde', capital: 'Praia', continent: 'Africa', flagEmoji: '🇨🇻' },
  { code: 'GM', name: 'Gambia', capital: 'Banjul', continent: 'Africa', flagEmoji: '🇬🇲' },
  { code: 'MR', name: 'Mauritania', capital: 'Nouakchott', continent: 'Africa', flagEmoji: '🇲🇷' },
  { code: 'DJ', name: 'Djibouti', capital: 'Djibouti City', continent: 'Africa', flagEmoji: '🇩🇯' },
  { code: 'ER', name: 'Eritrea', capital: 'Asmara', continent: 'Africa', flagEmoji: '🇪🇷' },
  { code: 'SO', name: 'Somalia', capital: 'Mogadishu', continent: 'Africa', flagEmoji: '🇸🇴' },
  { code: 'KM', name: 'Comoros', capital: 'Moroni', continent: 'Africa', flagEmoji: '🇰🇲' },
  { code: 'MU', name: 'Mauritius', capital: 'Port Louis', continent: 'Africa', flagEmoji: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', capital: 'Victoria', continent: 'Africa', flagEmoji: '🇸🇨' },
  
  // Oceania
  { code: 'AU', name: 'Australia', capital: 'Canberra', continent: 'Oceania', flagEmoji: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', capital: 'Wellington', continent: 'Oceania', flagEmoji: '🇳🇿' },
  { code: 'FJ', name: 'Fiji', capital: 'Suva', continent: 'Oceania', flagEmoji: '🇫🇯' },
  { code: 'PG', name: 'Papua New Guinea', capital: 'Port Moresby', continent: 'Oceania', flagEmoji: '🇵🇬' },
  { code: 'SB', name: 'Solomon Islands', capital: 'Honiara', continent: 'Oceania', flagEmoji: '🇸🇧' },
  { code: 'VU', name: 'Vanuatu', capital: 'Port Vila', continent: 'Oceania', flagEmoji: '🇻🇺' },
  { code: 'NC', name: 'New Caledonia', capital: 'Nouméa', continent: 'Oceania', flagEmoji: '🇳🇨' },
  { code: 'PF', name: 'French Polynesia', capital: 'Papeete', continent: 'Oceania', flagEmoji: '🇵🇫' },
  { code: 'WS', name: 'Samoa', capital: 'Apia', continent: 'Oceania', flagEmoji: '🇼🇸' },
  { code: 'TO', name: 'Tonga', capital: 'Nuku\'alofa', continent: 'Oceania', flagEmoji: '🇹🇴' },
  { code: 'KI', name: 'Kiribati', capital: 'Tarawa', continent: 'Oceania', flagEmoji: '🇰🇮' },
  { code: 'TV', name: 'Tuvalu', capital: 'Funafuti', continent: 'Oceania', flagEmoji: '🇹🇻' },
  { code: 'NR', name: 'Nauru', capital: 'Yaren', continent: 'Oceania', flagEmoji: '🇳🇷' },
  { code: 'PW', name: 'Palau', capital: 'Ngerulmud', continent: 'Oceania', flagEmoji: '🇵🇼' },
  { code: 'FM', name: 'Micronesia', capital: 'Palikir', continent: 'Oceania', flagEmoji: '🇫🇲' },
  { code: 'MH', name: 'Marshall Islands', capital: 'Majuro', continent: 'Oceania', flagEmoji: '🇲🇭' },
  
  // Caribbean and Central America
  { code: 'GT', name: 'Guatemala', capital: 'Guatemala City', continent: 'Central America', flagEmoji: '🇬🇹' },
  { code: 'BZ', name: 'Belize', capital: 'Belmopan', continent: 'Central America', flagEmoji: '🇧🇿' },
  { code: 'SV', name: 'El Salvador', capital: 'San Salvador', continent: 'Central America', flagEmoji: '🇸🇻' },
  { code: 'HN', name: 'Honduras', capital: 'Tegucigalpa', continent: 'Central America', flagEmoji: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua', capital: 'Managua', continent: 'Central America', flagEmoji: '🇳🇮' },
  { code: 'CR', name: 'Costa Rica', capital: 'San José', continent: 'Central America', flagEmoji: '🇨🇷' },
  { code: 'PA', name: 'Panama', capital: 'Panama City', continent: 'Central America', flagEmoji: '🇵🇦' },
  { code: 'CU', name: 'Cuba', capital: 'Havana', continent: 'Caribbean', flagEmoji: '🇨🇺' },
  { code: 'JM', name: 'Jamaica', capital: 'Kingston', continent: 'Caribbean', flagEmoji: '🇯🇲' },
  { code: 'HT', name: 'Haiti', capital: 'Port-au-Prince', continent: 'Caribbean', flagEmoji: '🇭🇹' },
  { code: 'DO', name: 'Dominican Republic', capital: 'Santo Domingo', continent: 'Caribbean', flagEmoji: '🇩🇴' },
  { code: 'PR', name: 'Puerto Rico', capital: 'San Juan', continent: 'Caribbean', flagEmoji: '🇵🇷' },
  { code: 'TT', name: 'Trinidad and Tobago', capital: 'Port of Spain', continent: 'Caribbean', flagEmoji: '🇹🇹' },
  { code: 'BB', name: 'Barbados', capital: 'Bridgetown', continent: 'Caribbean', flagEmoji: '🇧🇧' },
  { code: 'LC', name: 'Saint Lucia', capital: 'Castries', continent: 'Caribbean', flagEmoji: '🇱🇨' },
  { code: 'GD', name: 'Grenada', capital: 'St. George\'s', continent: 'Caribbean', flagEmoji: '🇬🇩' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', continent: 'Caribbean', flagEmoji: '🇻🇨' },
  { code: 'AG', name: 'Antigua and Barbuda', capital: 'St. John\'s', continent: 'Caribbean', flagEmoji: '🇦🇬' },
  { code: 'KN', name: 'Saint Kitts and Nevis', capital: 'Basseterre', continent: 'Caribbean', flagEmoji: '🇰🇳' },
  { code: 'DM', name: 'Dominica', capital: 'Roseau', continent: 'Caribbean', flagEmoji: '🇩🇲' },
  { code: 'BS', name: 'Bahamas', capital: 'Nassau', continent: 'Caribbean', flagEmoji: '🇧🇸' },
];

export const getRandomCountries = (count: number, exclude?: string[]): Country[] => {
  const availableCountries = exclude 
    ? countries.filter(country => !exclude.includes(country.code))
    : countries;
  
  const shuffled = [...availableCountries].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};