import { useState, useEffect } from 'react';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  Thermometer,
  AlertTriangle,
  CloudRain,
  CloudSun,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  Snowflake
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeatherAdvice, WeatherData, WeatherCondition } from '@/data/mockWeatherData';
import { getRealWeatherData } from '@/services/weatherService';
import { useApp } from '@/contexts/AppContext';

const getWeatherIcon = (condition: WeatherCondition, className?: string) => {
  const props = { className: className || "h-6 w-6" };

  switch (condition) {
    case 'sunny':
      return <Sun {...props} className={`${props.className} text-yellow-500`} />;
    case 'partly_cloudy':
      return <CloudSun {...props} className={`${props.className} text-yellow-400`} />;
    case 'cloudy':
      return <Cloud {...props} className={`${props.className} text-gray-500`} />;
    case 'rainy':
      return <CloudRain {...props} className={`${props.className} text-blue-500`} />;
    case 'thunderstorm':
      return <CloudLightning {...props} className={`${props.className} text-purple-500`} />;
    case 'foggy':
      return <CloudFog {...props} className={`${props.className} text-gray-400`} />;
    case 'hazy':
      return <Sun {...props} className={`${props.className} text-orange-400 opacity-70`} />;
    case 'windy':
      return <Wind {...props} className={`${props.className} text-blue-300`} />;
    default:
      return <Sun {...props} />;
  }
};

export const WeatherWidget = () => {
  const { state } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const lat = state.currentLocation?.coordinates.lat || 20.5937;
        const lng = state.currentLocation?.coordinates.lng || 78.9629;

        // Fetch real data
        const data = await getRealWeatherData(lat, lng);

        // Update name if we have it in state
        if (state.currentLocation?.name) {
          data.location.name = state.currentLocation.name;
        }

        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [state.currentLocation]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const { current, forecast, alerts, location } = weather;
  const advice = getWeatherAdvice(current);

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Weather alerts */}
      {alerts.length > 0 && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">{alerts[0].title}</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Weather - {location.name}</span>
          <span className="text-xs text-muted-foreground font-normal">
            Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 flex-1">
        {/* Current weather */}
        <div className="flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-full">
            {getWeatherIcon(current.condition, "h-12 w-12")}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{current.temperature}</span>
              <span className="text-xl text-muted-foreground">°C</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground capitalize">{current.description}</p>
            <div className="text-xs text-muted-foreground mt-1">
              Feels like {current.feelsLike}°
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Droplets className="h-5 w-5 text-blue-500 mb-1" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-semibold">{current.humidity}%</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Wind className="h-5 w-5 text-slate-500 mb-1" />
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-semibold">{current.windSpeed} <span className="text-[10px]">km/h</span></p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <Sun className="h-5 w-5 text-orange-500 mb-1" />
            <p className="text-xs text-muted-foreground">UV Index</p>
            <p className="font-semibold">{current.uvIndex}</p>
          </div>
        </div>

        {/* 5-day forecast */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, index) => (
              <div
                key={day.date}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors text-center"
              >
                <span className="text-[10px] font-medium text-muted-foreground uppercase">{day.dayName.slice(0, 3)}</span>
                <div className="my-2">
                  {getWeatherIcon(day.condition, "h-5 w-5")}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{day.high}°</span>
                  <span className="text-[10px] text-muted-foreground text-opacity-70">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farming advice based on weather */}
        <div className="border-t pt-4 mt-2">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-full">
                <Thermometer className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-800">Agro-Advisory</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{advice[0]}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
