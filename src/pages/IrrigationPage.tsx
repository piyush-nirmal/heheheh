import { useState } from 'react';
import { Droplets, CloudRain, Sun, Zap, CalendarDays, ArrowRight, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';

const IrrigationPage = () => {
  const { t } = useTranslation();
  const { state } = useApp();
  const [selectedCrop, setSelectedCrop] = useState<string>('rice');
  const [farmSize, setFarmSize] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);

  const crops: Record<string, { name: string; waterPerDay: number; emoji: string }> = {
    wheat: { name: 'Wheat', waterPerDay: 4500, emoji: '🌾' },
    rice: { name: 'Rice', waterPerDay: 15000, emoji: '🍚' },
    maize: { name: 'Maize', waterPerDay: 5500, emoji: '🌽' },
    sugarcane: { name: 'Sugarcane', waterPerDay: 22000, emoji: '🌿' },
  };

  const calculateWater = () => {
    const size = parseFloat(farmSize);
    if (isNaN(size) || size <= 0) return;
    setResult(crops[selectedCrop].waterPerDay * size);
  };

  // Dynamic advisory based on online status and time of day
  const hour = new Date().getHours();
  const needLevel: 'low' | 'medium' | 'high' = !state.isOnline
    ? 'medium'
    : hour >= 6 && hour <= 9
      ? 'low'
      : hour >= 10 && hour <= 14
        ? 'high'
        : 'medium';
  const needColor = needLevel === 'low' ? 'text-green-300' : needLevel === 'high' ? 'text-red-300' : 'text-amber-300';
  const needLabel = needLevel === 'low' ? t('irrigation.low') : needLevel === 'high' ? t('irrigation.high') : t('irrigation.medium');
  const advisoryText = needLevel === 'low'
    ? t('irrigation.rainfallDetected')
    : needLevel === 'high'
      ? 'Peak heat hours — irrigate at dawn or dusk for best results.'
      : 'Moderate soil moisture. Monitor and irrigate as needed.';

  return (
    <div className="bg-blue-50/30 min-h-screen pb-12">
      <div className="bg-[#0077b6] text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Droplets className="h-8 w-8 text-blue-200" /> {t('irrigation.title')}
          </h1>
          <p className="opacity-90 mt-2 text-blue-100">{t('irrigation.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 py-8 space-y-8">

        {/* Top: Weather & Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="h-full border-blue-100 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-50 py-3">
                <CardTitle className="flex items-center gap-2 text-[#0077b6] text-lg">
                  <Sun className="h-5 w-5" /> {t('irrigation.weatherTitle')}
                </CardTitle>
              </CardHeader>
              <div className="p-4"><WeatherWidget /></div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full bg-blue-600 text-white shadow-lg border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Droplets className="h-40 w-40" />
              </div>
              <CardContent className="flex flex-col justify-center h-full p-6 relative z-10">
                <h3 className="font-medium text-blue-100 flex items-center gap-2 mb-4">
                  <Zap className="h-4 w-4" /> {t('irrigation.currentAdvisory')}
                </h3>
                <div className="mb-6">
                  <span className={`text-5xl font-bold block mb-1 ${needColor}`}>{needLabel}</span>
                  <span className="text-lg opacity-90">{t('irrigation.irrigationNeed')}</span>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <p className="font-medium">{advisoryText}</p>
                  {needLevel === 'low' && <p className="text-sm opacity-80 mt-1">{t('irrigation.skipIrrigation')}</p>}
                </div>
                <Button className="mt-6 bg-white text-blue-600 hover:bg-blue-50 w-full font-bold">
                  {t('irrigation.viewSchedule')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calculator + Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md border-gray-200">
            <CardHeader className="bg-gray-50/50 pb-4">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#0077b6]" /> {t('irrigation.calculatorTitle')}
              </CardTitle>
              <CardDescription>{t('irrigation.calculatorDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <Label className="mb-3 block text-gray-700">{t('irrigation.selectCrop')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(crops).map(([key, data]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedCrop(key)}
                      className={`p-3 border rounded-xl cursor-pointer flex flex-col items-center text-center gap-1 transition-all duration-200 ${selectedCrop === key
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-2xl">{data.emoji}</span>
                      <span className={`font-semibold text-sm ${selectedCrop === key ? 'text-blue-700' : 'text-gray-600'}`}>
                        {data.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">{t('irrigation.farmSize')}</Label>
                <div className="flex gap-4">
                  <Input
                    type="number"
                    value={farmSize}
                    onChange={e => setFarmSize(e.target.value)}
                    className="text-lg font-bold"
                  />
                  <Button onClick={calculateWater} className="bg-[#0077b6] hover:bg-[#005f9e] px-8">
                    {t('irrigation.calculate')}
                  </Button>
                </div>
              </div>

              {result !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Droplets className="h-4 w-4" /> {t('irrigation.estimatedReq')}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#0077b6]">{result.toLocaleString()}</span>
                    <span className="text-gray-600 font-medium">{t('irrigation.litersPerDay')}</span>
                  </div>
                  <p className="text-xs text-blue-600/80 mt-2">{t('irrigation.adjustNote')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-green-50/80 border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-green-600 mt-1">
                  <CloudRain className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{t('irrigation.rainwaterTitle')}</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{t('irrigation.rainwaterDesc')}</p>
                  <Button variant="link" className="text-green-700 p-0 h-auto mt-3 font-bold group">
                    {t('irrigation.readGuide')} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/80 border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-amber-600 mt-1">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{t('irrigation.criticalStageTitle')}</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{t('irrigation.criticalStageDesc')}</p>
                  <Button variant="link" className="text-amber-700 p-0 h-auto mt-3 font-bold group">
                    {t('irrigation.viewTips')} <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationPage;
