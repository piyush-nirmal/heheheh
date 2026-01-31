// Mock weather data service - structured for easy replacement with real API
// Like OpenWeatherMap or WeatherAPI

export interface CurrentWeather {
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // Percentage
  windSpeed: number; // km/h
  windDirection: string;
  condition: WeatherCondition;
  description: string;
  uvIndex: number;
  visibility: number; // km
  pressure: number; // hPa
  sunrise: string;
  sunset: string;
  updatedAt: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  humidity: number;
  rainChance: number; // Percentage
  windSpeed: number;
}

export type WeatherCondition = 
  | 'sunny' 
  | 'partly_cloudy' 
  | 'cloudy' 
  | 'rainy' 
  | 'thunderstorm' 
  | 'foggy' 
  | 'hazy'
  | 'windy';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  current: CurrentWeather;
  forecast: ForecastDay[];
  alerts: WeatherAlert[];
}

export interface WeatherAlert {
  type: 'warning' | 'advisory' | 'watch';
  title: string;
  message: string;
  validUntil: string;
}

// Weather condition icons (using Unicode/emoji for simplicity)
export const weatherIcons: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  thunderstorm: '⛈️',
  foggy: '🌫️',
  hazy: '🌤️',
  windy: '💨',
};

// Generate mock weather based on location and season
export const getMockWeatherData = (
  lat: number = 20.5937, 
  lng: number = 78.9629,
  locationName: string = 'Central India'
): WeatherData => {
  const now = new Date();
  const month = now.getMonth();
  
  // Seasonal variations for India
  const isMonsson = month >= 5 && month <= 8;
  const isWinter = month >= 10 || month <= 1;
  const isSummer = month >= 2 && month <= 4;

  let baseTemp = 28;
  let humidity = 60;
  let condition: WeatherCondition = 'partly_cloudy';
  let rainChance = 20;

  if (isMonsson) {
    baseTemp = 26;
    humidity = 85;
    condition = Math.random() > 0.4 ? 'rainy' : 'cloudy';
    rainChance = 70;
  } else if (isWinter) {
    baseTemp = 18;
    humidity = 50;
    condition = Math.random() > 0.7 ? 'foggy' : 'sunny';
    rainChance = 5;
  } else if (isSummer) {
    baseTemp = 38;
    humidity = 35;
    condition = Math.random() > 0.6 ? 'hazy' : 'sunny';
    rainChance = 10;
  }

  // Add some randomness
  const tempVariation = Math.floor(Math.random() * 6) - 3;
  const currentTemp = baseTemp + tempVariation;

  const forecast: ForecastDay[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 0; i < 5; i++) {
    const forecastDate = new Date(now);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    const dayVariation = Math.floor(Math.random() * 4) - 2;
    const conditions: WeatherCondition[] = ['sunny', 'partly_cloudy', 'cloudy', 'rainy'];
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : days[forecastDate.getDay()],
      high: baseTemp + dayVariation + 3,
      low: baseTemp + dayVariation - 5,
      condition: isMonsson && Math.random() > 0.4 ? 'rainy' : conditions[Math.floor(Math.random() * 3)],
      humidity: humidity + Math.floor(Math.random() * 20) - 10,
      rainChance: rainChance + Math.floor(Math.random() * 30) - 15,
      windSpeed: 8 + Math.floor(Math.random() * 12),
    });
  }

  const alerts: WeatherAlert[] = [];
  
  if (isMonsson && Math.random() > 0.6) {
    alerts.push({
      type: 'advisory',
      title: 'Heavy Rain Expected',
      message: 'Heavy rainfall expected in the next 24 hours. Avoid field activities.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (isSummer && currentTemp > 40) {
    alerts.push({
      type: 'warning',
      title: 'Heat Wave Alert',
      message: 'Extreme heat conditions. Ensure adequate irrigation and avoid fieldwork during peak hours.',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    });
  }

  return {
    location: {
      name: locationName,
      region: 'India',
      country: 'India',
      coordinates: { lat, lng },
    },
    current: {
      temperature: currentTemp,
      feelsLike: currentTemp + (humidity > 70 ? 3 : -1),
      humidity,
      windSpeed: 8 + Math.floor(Math.random() * 15),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      condition,
      description: getWeatherDescription(condition),
      uvIndex: isSummer ? 9 : isWinter ? 4 : 7,
      visibility: condition === 'foggy' ? 2 : 10,
      pressure: 1010 + Math.floor(Math.random() * 20),
      sunrise: '06:15 AM',
      sunset: '06:45 PM',
      updatedAt: new Date().toISOString(),
    },
    forecast,
    alerts,
  };
};

const getWeatherDescription = (condition: WeatherCondition): string => {
  const descriptions: Record<WeatherCondition, string> = {
    sunny: 'Clear and sunny',
    partly_cloudy: 'Partly cloudy',
    cloudy: 'Overcast clouds',
    rainy: 'Light to moderate rain',
    thunderstorm: 'Thunderstorms likely',
    foggy: 'Dense fog in morning',
    hazy: 'Hazy conditions',
    windy: 'Strong winds',
  };
  return descriptions[condition];
};

// Function to get farming-specific weather advice
export const getWeatherAdvice = (weather: CurrentWeather): string[] => {
  const advice: string[] = [];

  if (weather.condition === 'rainy' || weather.condition === 'thunderstorm') {
    advice.push('Avoid spraying pesticides - rain will wash them away');
    advice.push('Check drainage in low-lying areas');
    advice.push('Postpone fertilizer application');
  }

  if (weather.humidity > 80) {
    advice.push('High humidity - watch for fungal diseases');
    advice.push('Ensure proper plant spacing for air circulation');
  }

  if (weather.temperature > 35) {
    advice.push('Water crops early morning or late evening');
    advice.push('Apply mulch to conserve soil moisture');
  }

  if (weather.temperature < 15) {
    advice.push('Protect frost-sensitive crops with covers');
    advice.push('Delay sowing of summer crops');
  }

  if (weather.windSpeed > 20) {
    advice.push('Stake tall plants to prevent lodging');
    advice.push('Avoid spraying - wind will cause drift');
  }

  if (weather.uvIndex > 8) {
    advice.push('High UV - wear protection during fieldwork');
    advice.push('Irrigate to prevent leaf scorch');
  }

  return advice.length > 0 ? advice : ['Good conditions for general farming activities'];
};
