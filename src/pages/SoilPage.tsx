import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Save, RotateCcw, Info, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const getStatus = (val: number, min: number, max: number, optMin: number, optMax: number) => {
  if (val < optMin) return { key: 'low', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  if (val > optMax) return { key: 'high', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { key: 'optimal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
};

const SoilPage = () => {
  const navigate = useNavigate();
  const { saveSoilReading } = useApp();
  const { toast } = useToast();
  const { t } = useTranslation();

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
      title: t('soil.analysisSummary'),
      description: t('soil.analysisInfo'),
    });
    navigate('/crops');
  };

  const statusLabel = (key: string) => {
    if (key === 'low') return t('soil.low');
    if (key === 'high') return t('soil.high');
    return t('soil.optimalLabel');
  };

  const nutrients = [
    { key: 'nitrogen', label: t('soil.nitrogen'), unit: 'kg/ha', max: 200, optMin: 80, optMax: 120, desc: 'Essential for leaf growth and green color.' },
    { key: 'phosphorus', label: t('soil.phosphorus'), unit: 'kg/ha', max: 100, optMin: 30, optMax: 60, desc: 'Crucial for root storage and energy transfer.' },
    { key: 'potassium', label: t('soil.potassium'), unit: 'kg/ha', max: 150, optMin: 40, optMax: 80, desc: 'Vital for water regulation and enzyme activation.' },
    { key: 'ph', label: t('soil.ph'), unit: '', max: 14, optMin: 6.0, optMax: 7.5, desc: 'Determines nutrient availability in the soil.' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-[#1b325f] text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-2 shadow-lg">
                <img src="/soil-health-logo.png" alt="Soil Health Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  {t('soil.pageTitle')}
                </h1>
                <p className="opacity-80 mt-1">{t('soil.pageSubtitle')}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-2 text-white border-white/20 bg-white/10 hover:bg-white/20"
              onClick={() => setValues({ nitrogen: 100, phosphorus: 45, potassium: 60, ph: 6.5 })}
            >
              <RotateCcw className="h-4 w-4" /> {t('soil.resetDefaults')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

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
                        <CardTitle className="text-gray-700 text-lg">{n.label}</CardTitle>
                        <CardDescription className="text-xs mt-1">{n.desc}</CardDescription>
                      </div>
                      <Badge variant="outline" className={cn(status.bg, status.color, "border-0 font-bold")}>
                        {statusLabel(status.key)}
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
                        status.key === 'low' ? '[&>.relative>.bg-primary]:bg-red-500' :
                          status.key === 'high' ? '[&>.relative>.bg-primary]:bg-orange-500' :
                            '[&>.relative>.bg-primary]:bg-green-500'
                      )}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>0</span>
                      <span className="font-medium text-gray-500">{t('soil.optimal')} {n.optMin}-{n.optMax}</span>
                      <span>{n.max}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 bg-orange-50/30">
            <h3 className="flex items-center gap-2 font-semibold text-orange-800 mb-2">
              <Info className="h-5 w-5" /> {t('soil.whyImportant')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{t('soil.whyImportantDesc')}</p>
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-t-4 border-green-600 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {t('soil.analysisSummary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 border-4 border-green-100 mb-2">
                  <span className="block text-2xl font-bold text-green-700">{t('soil.ready')}</span>
                </div>
                <p className="text-sm text-gray-500">{t('soil.profileComplete')}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t('soil.nitrogenStatus')}</span>
                  <span className="font-medium">{statusLabel(getStatus(values.nitrogen, 0, 200, 80, 120).key)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t('soil.phosphorusStatus')}</span>
                  <span className="font-medium">{statusLabel(getStatus(values.phosphorus, 0, 100, 30, 60).key)}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">{t('soil.potassiumStatus')}</span>
                  <span className="font-medium">{statusLabel(getStatus(values.potassium, 0, 150, 40, 80).key)}</span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-md" onClick={handleSave}>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {t('soil.generateAdvisory')}
              </Button>
              <p className="text-xs text-center text-gray-400">{t('soil.analysisInfo')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SoilPage;
