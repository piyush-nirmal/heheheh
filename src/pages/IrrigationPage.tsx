import { useState } from 'react';
import { Droplets, CloudRain, Sun, Zap, CalendarDays, ArrowRight, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';

const IrrigationPage = () => {
    const [selectedCrop, setSelectedCrop] = useState<string>('rice');
    const [farmSize, setFarmSize] = useState<string>('1');
    const [result, setResult] = useState<number | null>(null);

    const crops: Record<string, { name: string, waterPerDay: number, emoji: string }> = {
        wheat: { name: 'Wheat', waterPerDay: 4500, emoji: '🌾' },
        rice: { name: 'Rice', waterPerDay: 15000, emoji: '🍚' },
        maize: { name: 'Maize', waterPerDay: 5500, emoji: '🌽' },
        sugarcane: { name: 'Sugarcane', waterPerDay: 22000, emoji: '🌿' },
    };

    const calculateWater = () => {
        const size = parseFloat(farmSize);
        if (isNaN(size) || size <= 0) return;

        // Simple basic calculation: Water per acre * acres
        // In a real app, this would factor in evapotranspiration (ET0) from weather data
        const totalWater = crops[selectedCrop].waterPerDay * size;
        setResult(totalWater);
    };

    return (
        <div className="bg-blue-50/30 min-h-screen pb-12">
            <div className="bg-[#0077b6] text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Droplets className="h-8 w-8 text-blue-200" /> Smart Irrigation Advisory
                    </h1>
                    <p className="opacity-90 mt-2 text-blue-100">
                        Optimize water usage based on real-time weather data and soil moisture levels.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

                {/* Top: Weather & Quick Status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <Card className="h-full border-blue-100 shadow-md overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-50 py-3">
                                <CardTitle className="flex items-center gap-2 text-[#0077b6] text-lg">
                                    <Sun className="h-5 w-5" /> Local Weather Conditions
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4">
                                <WeatherWidget />
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4">
                        <Card className="h-full bg-blue-600 text-white shadow-lg border-none relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Droplets className="h-40 w-40" />
                            </div>
                            <CardContent className="flex flex-col justify-center h-full p-6 relative z-10">
                                <h3 className="font-medium text-blue-100 flex items-center gap-2 mb-4">
                                    <Zap className="h-4 w-4" /> CURRENT ADVISORY
                                </h3>

                                <div className="mb-6">
                                    <span className="text-5xl font-bold block mb-1">Low</span>
                                    <span className="text-lg opacity-90">Irrigation Need</span>
                                </div>

                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                                    <p className="font-medium">Recent rainfall detected.</p>
                                    <p className="text-sm opacity-80 mt-1">Skip irrigation for today to prevent waterlogging.</p>
                                </div>

                                <Button className="mt-6 bg-white text-blue-600 hover:bg-blue-50 w-full font-bold">
                                    View Schedule
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Calculator Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="shadow-md border-gray-200">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-gray-800 flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-[#0077b6]" /> Water Requirement Calculator
                            </CardTitle>
                            <CardDescription>Estimate daily water needs for your specific crop</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div>
                                <Label className="mb-3 block text-gray-700">Select Crop Type</Label>
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
                                            <span className="text-2xl filter drop-shadow-sm">{data.emoji}</span>
                                            <span className={`font-semibold text-sm ${selectedCrop === key ? 'text-blue-700' : 'text-gray-600'}`}>
                                                {data.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-gray-700">Farm Size (in Acres)</Label>
                                <div className="flex gap-4">
                                    <Input
                                        type="number"
                                        value={farmSize}
                                        onChange={(e) => setFarmSize(e.target.value)}
                                        className="text-lg font-bold"
                                    />
                                    <Button onClick={calculateWater} className="bg-[#0077b6] hover:bg-[#005f9e] px-8">
                                        Calculate
                                    </Button>
                                </div>
                            </div>

                            {result !== null && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 animate-in fade-in slide-in-from-top-2">
                                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <Droplets className="h-4 w-4" /> Estimated Requirement
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-extrabold text-[#0077b6]">{result.toLocaleString()}</span>
                                        <span className="text-gray-600 font-medium">Liters / Day</span>
                                    </div>
                                    <p className="text-xs text-blue-600/80 mt-2">
                                        *Based on standard peak season requirement for {crops[selectedCrop].name}. Adjust for current rainfall.
                                    </p>
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
                                    <h4 className="font-bold text-gray-800 text-lg">Rainwater Harvesting</h4>
                                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                        Heavy rains expected next week. Ensure farm ponds are cleared to capture runoff.
                                    </p>
                                    <Button variant="link" className="text-green-700 p-0 h-auto mt-3 font-bold group">
                                        Read Guide <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
                                    <h4 className="font-bold text-gray-800 text-lg">Next Critical Stage</h4>
                                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                        Flowering stage approaching in 10 days. Moisture stress at this time reduces yield by 30%.
                                    </p>
                                    <Button variant="link" className="text-amber-700 p-0 h-auto mt-3 font-bold group">
                                        View Tips <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
