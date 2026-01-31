import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface GaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  colorClass: string;
}

const Gauge = ({ label, value, unit, min, max, optimalMin, optimalMax, colorClass }: GaugeProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isOptimal = value >= optimalMin && value <= optimalMax;
  const isLow = value < optimalMin;
  const isHigh = value > optimalMax;

  let status = 'Optimal';
  let statusColor = 'text-success';
  if (isLow) {
    status = 'Low';
    statusColor = 'text-warning';
  } else if (isHigh) {
    status = 'High';
    statusColor = 'text-destructive';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className={cn('text-sm font-semibold px-2 py-0.5 rounded-full bg-muted', statusColor)}>
          {status}
        </span>
      </div>
      <div className="relative">
        <div className="gauge-track">
          <div 
            className={cn('gauge-fill', colorClass)}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
        {/* Optimal range indicator */}
        <div 
          className="absolute top-0 h-3 border-l-2 border-r-2 border-success/50 bg-success/10 rounded"
          style={{ 
            left: `${((optimalMin - min) / (max - min)) * 100}%`,
            width: `${((optimalMax - optimalMin) / (max - min)) * 100}%`
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span className="font-semibold text-foreground">{value} {unit}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

const PHMeter = ({ value }: { value: number }) => {
  // pH scale colors
  const getPhColor = (ph: number) => {
    if (ph < 5.5) return 'bg-ph-acidic';
    if (ph > 7.5) return 'bg-ph-alkaline';
    return 'bg-ph-neutral';
  };

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return { text: 'Acidic', color: 'text-ph-acidic' };
    if (ph > 7.5) return { text: 'Alkaline', color: 'text-ph-alkaline' };
    if (ph >= 6.0 && ph <= 7.0) return { text: 'Optimal', color: 'text-success' };
    return { text: 'Acceptable', color: 'text-warning' };
  };

  const position = ((value - 4) / (10 - 4)) * 100;
  const status = getPhStatus(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">pH Level</span>
        <span className={cn('text-sm font-semibold px-2 py-0.5 rounded-full bg-muted', status.color)}>
          {status.text}
        </span>
      </div>
      
      {/* pH gradient bar */}
      <div className="relative h-4 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-cyan-500 to-blue-600" />
        {/* Pointer */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow-lg"
          style={{ left: `${Math.min(100, Math.max(0, position))}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>4 (Acidic)</span>
        <span className="font-semibold text-foreground">pH {value}</span>
        <span>10 (Alkaline)</span>
      </div>
    </div>
  );
};

export const SoilHealthGauges = () => {
  const { state } = useApp();
  const soilData = state.currentSoilData;

  // Default demo values if no soil data
  const nitrogen = soilData?.nitrogen ?? 85;
  const phosphorus = soilData?.phosphorus ?? 45;
  const potassium = soilData?.potassium ?? 55;
  const ph = soilData?.ph ?? 6.5;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span>🧪</span>
          <span>Soil Health</span>
          {!soilData && (
            <span className="text-xs text-muted-foreground font-normal ml-auto">
              Demo data
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <Gauge
          label="Nitrogen (N)"
          value={nitrogen}
          unit="kg/ha"
          min={0}
          max={200}
          optimalMin={80}
          optimalMax={120}
          colorClass="bg-nitrogen"
        />

        <Gauge
          label="Phosphorus (P)"
          value={phosphorus}
          unit="kg/ha"
          min={0}
          max={100}
          optimalMin={30}
          optimalMax={60}
          colorClass="bg-phosphorus"
        />

        <Gauge
          label="Potassium (K)"
          value={potassium}
          unit="kg/ha"
          min={0}
          max={150}
          optimalMin={40}
          optimalMax={80}
          colorClass="bg-potassium"
        />

        <PHMeter value={ph} />

        {/* Last updated */}
        {state.soilReadings.length > 0 && (
          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last updated: {new Date(state.soilReadings[state.soilReadings.length - 1].createdAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
