import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { fetchMandiPrices, MandiRecord } from '@/services/mandiService';

export const MarketTrends = () => {
    const [marketData, setMarketData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchMandiPrices('Maharashtra', 5);
            setMarketData(data);
            setIsLoading(false);
        };
        loadData();
    }, []);
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
                    {isLoading ? (
                        <div className="p-8 text-center flex flex-col items-center">
                            <RefreshCw className="h-6 w-6 text-orange-500 animate-spin mb-2" />
                            <span className="text-xs text-gray-500">Loading Live Prices...</span>
                        </div>
                    ) : (
                        marketData.map((item, index) => {
                            const trend = item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'stable';
                            return (
                                <div key={index} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="font-semibold text-sm text-gray-800">{item.commodity}</div>
                                        <div className="text-xs text-gray-500">{item.market}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">₹{item.price} <span className="text-xs font-normal text-gray-500">/Qtl</span></div>
                                        <div className={`text-xs flex items-center justify-end gap-1 ${trend === 'up' ? 'text-green-600' :
                                                trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                            }`}>
                                            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                                            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                                            {trend === 'stable' && <Minus className="h-3 w-3" />}
                                            {Math.abs(item.change)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <div className="p-2 text-center border-t bg-gray-50">
                    <Link to="/market" className="text-xs font-bold text-orange-600 hover:underline uppercase tracking-wide block w-full">
                        View All Mandi Prices
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
