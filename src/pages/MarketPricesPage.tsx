import { TrendingUp, TrendingDown, Minus, Search, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockMarketData = [
    { id: 1, commodity: 'Wheat', variety: 'Lokwan', market: 'Pune APMC', price: 2850, change: 1.5, date: '2024-01-31' },
    { id: 2, commodity: 'Rice', variety: 'Basmati', market: 'Pune APMC', price: 4200, change: -0.8, date: '2024-01-31' },
    { id: 3, commodity: 'Onion', variety: 'Red', market: 'Lasalgaon', price: 1400, change: 5.2, date: '2024-01-30' },
    { id: 4, commodity: 'Tomato', variety: 'Hybrid', market: 'Nashik', price: 1800, change: -2.1, date: '2024-01-31' },
    { id: 5, commodity: 'Soybean', variety: 'Yellow', market: 'Latur', price: 4800, change: 0.0, date: '2024-01-30' },
    { id: 6, commodity: 'Cotton', variety: 'H-4', market: 'Akola', price: 6200, change: 1.2, date: '2024-01-31' },
];

const MarketPricesPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="bg-amber-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-8 w-8" /> Live Mandi Prices
                    </h1>
                    <p className="opacity-90 mt-2">
                        Real-time market rates from APMCs across Maharashtra.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

                {/* Filters */}
                <Card>
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search commodity (e.g. Wheat, Onion)" className="pl-10" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select defaultValue="mh">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mh">Maharashtra</SelectItem>
                                    <SelectItem value="mp">Madhya Pradesh</SelectItem>
                                    <SelectItem value="gj">Gujarat</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" /> Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {['All', 'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Oilseeds', 'Spices'].map((cat, i) => (
                        <Button key={i} variant={i === 0 ? 'default' : 'outline'} className={`rounded-full ${i === 0 ? 'bg-amber-600 hover:bg-amber-700' : ''}`}>
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Data Grid */}
                <Card className="overflow-hidden border-none shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#1b325f] text-white">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Commodity</th>
                                    <th className="px-6 py-4 font-bold">Market (Mandi)</th>
                                    <th className="px-6 py-4 font-bold text-right">Price (₹/Qtl)</th>
                                    <th className="px-6 py-4 font-bold text-center">Trend (24h)</th>
                                    <th className="px-6 py-4 font-bold text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {mockMarketData.map((item) => (
                                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{item.commodity}</div>
                                            <div className="text-xs text-gray-500">{item.variety}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MapPin className="h-3 w-3" /> {item.market}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-bold text-gray-800">₹{item.price}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center justify-center gap-1 font-bold ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                {item.change > 0 ? <TrendingUp className="h-4 w-4" /> :
                                                    item.change < 0 ? <TrendingDown className="h-4 w-4" /> :
                                                        <Minus className="h-4 w-4" />}
                                                {Math.abs(item.change)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500 font-mono">
                                            {item.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Trend Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-green-700 font-bold mb-1">Top Gainer</div>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    Onion <Badge className="bg-green-600 hover:bg-green-600 text-white">+5.2%</Badge>
                                </div>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-300" />
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-red-700 font-bold mb-1">Top Loser</div>
                                <div className="text-xl font-bold flex items-center gap-2">
                                    Tomato <Badge className="bg-red-600 hover:bg-red-600 text-white">-2.1%</Badge>
                                </div>
                            </div>
                            <TrendingDown className="h-8 w-8 text-red-300" />
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-blue-700 font-bold mb-1">Market Sentiment</div>
                                <div className="text-xl font-bold text-blue-900">
                                    Bullish 🐂
                                </div>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-300" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MarketPricesPage;
