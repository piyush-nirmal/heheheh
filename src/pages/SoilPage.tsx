import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Save, RotateCcw, Info, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Helper to determine status
const getStatus = (val: number, min: number, max: number, optMin: number, optMax: number) => {
  if (val < optMin) return { label: 'Low', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  if (val > optMax) return { label: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { label: 'Optimal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
};

const SoilPage = () => {
  const navigate = useNavigate();
  const { saveSoilReading } = useApp();
  const { toast } = useToast();

  const [values, setValues] = useState({
    nitrogen: 100,
    phosphorus: 45,
    potassium: 60,
    ph: 6.5,
  });

  const handleValueChange = (key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    saveSoilReading(values);
    toast({
      title: 'Soil Report Generated',
      description: 'Your data has been analyzed successfully.',
    });
    navigate('/crops');
  };

  const nutrients = [
    { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha', max: 200, optMin: 80, optMax: 120, desc: 'Essential for leaf growth and green color.' },
    { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha', max: 100, optMin: 30, optMax: 60, desc: 'Crucial for root storage and energy transfer.' },
    { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha', max: 150, optMin: 40, optMax: 80, desc: 'Vital for water regulation and enzyme activation.' },
    { key: 'ph', label: 'pH Level', unit: '', max: 14, optMin: 6.0, optMax: 7.5, desc: 'Determines nutrient availability in the soil.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-[#1b325f] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-2 shadow-lg">
                <img src="/soil-health-logo.png" alt="Soil Health Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  Soil Health Analysis
                </h1>
                <p className="opacity-80 mt-1">
                  Enter your latest soil test results below for AI-powered advisory.
                </p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2 text-white border-white/20 bg-white/10 hover:bg-white/20" onClick={() => setValues({ nitrogen: 100, phosphorus: 45, potassium: 60, ph: 6.5 })}>
              <RotateCcw className="h-4 w-4" /> Reset Defaults
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nutrients.map((n) => {
              // @ts-ignore
              const val = values[n.key];
              const status = getStatus(val, 0, n.max, n.optMin, n.optMax);

              return (
                <Card key={n.key} className={cn("transition-all duration-200 hover:shadow-md border-l-4", status.border)}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-gray-700 text-lg flex items-center gap-2">
                          {n.label}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">{n.desc}</CardDescription>
                      </div>
                      <Badge variant="outline" className={cn(status.bg, status.color, "border-0 font-bold")}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 mb-4">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={val}
                          onChange={(e) => handleValueChange(n.key, parseFloat(e.target.value))}
                          className="text-2xl font-bold h-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">{n.unit}</span>
                      </div>
                    </div>
                    <Slider
                      value={[val]}
                      max={n.max}
                      step={n.key === 'ph' ? 0.1 : 1}
                      onValueChange={(v) => handleValueChange(n.key, v[0])}
                      className={cn("py-2",
                        status.label === 'Low' ? '[&>.relative>.bg-primary]:bg-red-500' :
                          status.label === 'High' ? '[&>.relative>.bg-primary]:bg-orange-500' :
                            '[&>.relative>.bg-primary]:bg-green-500'
                      )}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>0</span>
                      <span className="font-medium text-gray-500">Optimal: {n.optMin}-{n.optMax}</span>
                      <span>{n.max}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 bg-orange-50/30">
            <h3 className="flex items-center gap-2 font-semibold text-orange-800 mb-2">
              <Info className="h-5 w-5" /> Why is this important?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Balanced nutrition is key to crop yield. <strong className="text-gray-800">Nitrogen</strong> drives vegetative growth,
              <strong className="text-gray-800"> Phosphorus</strong> aids root development, and
              <strong className="text-gray-800"> Potassium</strong> improves disease resistance.
              Maintaining the correct <strong className="text-gray-800">pH</strong> ensures these nutrients are absorbable by plants.
            </p>
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-t-4 border-green-600 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 mb-2">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-green-700">Ready</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Your soil profile is complete.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Nitrogen Status</span>
                  <span className="font-medium">{getStatus(values.nitrogen, 0, 200, 80, 120).label}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Phosphorus Status</span>
                  <span className="font-medium">{getStatus(values.phosphorus, 0, 100, 30, 60).label}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">Potassium Status</span>
                  <span className="font-medium">{getStatus(values.potassium, 0, 150, 40, 80).label}</span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-md" onClick={handleSave}>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Generate Advisory
              </Button>
              <p className="text-xs text-center text-gray-400">
                AI analysis will begin immediately after saving.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SoilPage;
