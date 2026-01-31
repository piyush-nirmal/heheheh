import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Droplets, Bug, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getRealWeatherData } from '@/services/weatherService';
import { getWeatherAdvice } from '@/data/mockWeatherData';
import { cn } from '@/lib/utils';

interface AdviceItem {
  id: string;
  type: 'irrigation' | 'pest' | 'planting' | 'general' | 'market';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  icon: React.ReactNode;
}

const priorityColors = {
  high: 'bg-destructive/10 border-destructive/30 text-destructive',
  medium: 'bg-warning/10 border-warning/30 text-warning-foreground',
  low: 'bg-success/10 border-success/30 text-success',
};

const typeIcons = {
  irrigation: <Droplets className="h-5 w-5" />,
  pest: <Bug className="h-5 w-5" />,
  planting: <Calendar className="h-5 w-5" />,
  general: <Lightbulb className="h-5 w-5" />,
  market: <TrendingUp className="h-5 w-5" />,
};

export const ActionableAdvice = () => {
  const { state } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [advice, setAdvice] = useState<AdviceItem[]>([]);

  useEffect(() => {
    const fetchAdvice = async () => {
      // Get real weather data
      const lat = state.currentLocation?.coordinates.lat || 20.5937;
      const lng = state.currentLocation?.coordinates.lng || 78.9629;

      try {
        const weather = await getRealWeatherData(lat, lng);
        const weatherTips = getWeatherAdvice(weather.current);

        const generatedAdvice: AdviceItem[] = [
          {
            id: '1',
            type: 'irrigation',
            priority: weather.current.humidity < 50 ? 'high' : 'low',
            title: weather.current.humidity < 50 ? 'Water Your Crops' : 'Irrigation Check',
            description: weatherTips[0] || 'Monitor soil moisture levels and irrigate as needed.',
            icon: typeIcons.irrigation,
          },
          {
            id: '2',
            type: 'general',
            priority: 'medium',
            title: 'Optimal Planting Window',
            description: 'Based on your location, Rabi crops like wheat and chickpea can be sown now.',
            icon: typeIcons.planting,
          },
          {
            id: '3',
            type: 'pest',
            priority: weather.current.humidity > 70 ? 'high' : 'low',
            title: weather.current.humidity > 70 ? 'Fungal Disease Alert' : 'Pest Monitoring',
            description: weather.current.humidity > 70
              ? 'High humidity increases fungal risk. Apply preventive fungicide.'
              : 'Regular scouting recommended. Check for aphids and leaf miners.',
            icon: typeIcons.pest,
          },
          {
            id: '4',
            type: 'market',
            priority: 'medium',
            title: 'Market Update',
            description: 'Onion prices are rising. Consider storing surplus for better returns.',
            icon: typeIcons.market,
          },
        ];

        // Sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        generatedAdvice.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        setAdvice(generatedAdvice);
      } catch (err) {
        console.error("Failed to fetch advice", err);
      }
    };

    fetchAdvice();
  }, [state.currentLocation, state.currentSoilData]);

  const nextAdvice = () => {
    setCurrentIndex((prev) => (prev + 1) % advice.length);
  };

  const prevAdvice = () => {
    setCurrentIndex((prev) => (prev - 1 + advice.length) % advice.length);
  };

  if (advice.length === 0) return null;

  const current = advice[currentIndex];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span>💡</span>
          <span>Today's Advice</span>
          <span className="text-xs text-muted-foreground font-normal ml-auto">
            {currentIndex + 1} of {advice.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {/* Advice card */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-300',
              priorityColors[current.priority]
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-full',
                current.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                  current.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                    'bg-success text-success-foreground'
              )}>
                {current.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{current.title}</h4>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                    current.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                      current.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                        'bg-success text-success-foreground'
                  )}>
                    {current.priority}
                  </span>
                </div>
                <p className="text-sm opacity-90">{current.description}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevAdvice}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots indicator */}
            <div className="flex gap-1.5">
              {advice.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextAdvice}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
