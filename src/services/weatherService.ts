import {
    WeatherData,
    CurrentWeather,
    ForecastDay,
    WeatherCondition,
    WeatherAlert
} from '@/data/mockWeatherData';

// WMO Weather interpretation codes (WW)
const getWeatherCondition = (code: number): WeatherCondition => {
    if (code === 0) return 'sunny';
    if (code === 1 || code === 2) return 'partly_cloudy';
    if (code === 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'foggy';
    if (code >= 51 && code <= 67) return 'rainy'; // Drizzle & Rain
    if (code >= 71 && code <= 77) return 'rainy'; // Snow (mapped to rainy as fallback)
    if (code >= 80 && code <= 82) return 'rainy'; // Showers
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'sunny'; // Default
};

const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Clear sky';
};

export const getRealWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
        );

        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        const current = data.current;

        // Transform Current Weather
        const conditions = getWeatherCondition(current.weather_code);
        const currentWeather: CurrentWeather = {
            temperature: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.apparent_temperature),
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            windDirection: getWindDirection(current.wind_direction_10m),
            condition: conditions,
            description: getWeatherDescription(current.weather_code),
            uvIndex: data.daily.uv_index_max[0] || 5, // Fallback to daily max
            visibility: conditions === 'foggy' ? 2 : 10, // Approximate
            pressure: Math.round(current.surface_pressure),
            sunrise: convertTime(data.daily.sunrise[0]),
            sunset: convertTime(data.daily.sunset[0]),
            updatedAt: new Date().toISOString(),
        };

        // Transform Forecast
        const forecast: ForecastDay[] = data.daily.time.slice(0, 5).map((dateStr: string, index: number) => {
            const date = new Date(dateStr);
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            return {
                date: dateStr,
                dayName: index === 0 ? 'Today' : days[date.getDay()],
                high: Math.round(data.daily.temperature_2m_max[index]),
                low: Math.round(data.daily.temperature_2m_min[index]),
                condition: getWeatherCondition(data.daily.weather_code[index]),
                humidity: 60, // Daily humidity avg not directly available in free tier mostly
                rainChance: data.daily.precipitation_probability_max?.[index] || 0,
                windSpeed: Math.round(data.daily.wind_speed_10m_max[index]),
            };
        });

        // Generate Alerts (Simple Logic based on values)
        const alerts: WeatherAlert[] = [];
        if (current.weather_code >= 95) {
            alerts.push({
                type: 'warning',
                title: 'Thunderstorm Alert',
                message: 'Thunderstorms expected in the area. Take necessary precautions.',
                validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            });
        }
        if (data.daily.temperature_2m_max[0] > 40) {
            alerts.push({
                type: 'warning',
                title: 'Heat Wave',
                message: 'Extreme high temperatures expected today.',
                validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            });
        }

        // Geocoding (Reverse lookup placeholder or pass location name)
        // For now we return generic location structure, consumer often knows the name

        return {
            location: {
                name: 'Current Location', // This should be updated by the caller if known
                region: '',
                country: 'India',
                coordinates: { lat, lng },
            },
            current: currentWeather,
            forecast,
            alerts,
        };

    } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback to mock data if API fails
        const { getMockWeatherData } = await import('@/data/mockWeatherData');
        return getMockWeatherData(lat, lng);
    }
};

const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
};

const convertTime = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
