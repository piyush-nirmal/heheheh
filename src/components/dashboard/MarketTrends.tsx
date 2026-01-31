import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketPrice {
    crop: string;
    price: number;
    unit: string;
    change: number; // percentage
    trend: 'up' | 'down' | 'stable';
}

const marketData: MarketPrice[] = [
    { crop: 'Wheat (Gehu)', price: 2275, unit: '₹/Quintal', change: 2.5, trend: 'up' },
    { crop: 'Rice (Dhan)', price: 2183, unit: '₹/Quintal', change: -0.8, trend: 'down' },
    { crop: 'Cotton', price: 6800, unit: '₹/Quintal', change: 0.0, trend: 'stable' },
    { crop: 'Soybean', price: 4600, unit: '₹/Quintal', change: 1.2, trend: 'up' },
    { crop: 'Onion', price: 1800, unit: '₹/Quintal', change: 15.4, trend: 'up' },
];

export const MarketTrends = () => {
    return (
        <Card className="h-full">
            <CardHeader className="py-3 px-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-lg">📈</span> Market Trends (Mandi)
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-normal bg-white">
                        Updated: Today, 10:00 AM
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                    {marketData.map((item, index) => (
                        <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <div className="font-semibold text-sm text-gray-800">{item.crop}</div>
                                <div className="text-xs text-gray-500">Avg. Market Price</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-gray-900">{item.price} <span className="text-xs font-normal text-gray-500">{item.unit}</span></div>
                                <div className={`text-xs flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-green-600' :
                                        item.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                    }`}>
                                    {item.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                                    {item.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                                    {item.trend === 'stable' && <Minus className="h-3 w-3" />}
                                    {Math.abs(item.change)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-2 text-center border-t bg-gray-50">
                    <button className="text-xs font-bold text-orange-600 hover:underline uppercase tracking-wide">
                        View All Mandi Prices
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};
