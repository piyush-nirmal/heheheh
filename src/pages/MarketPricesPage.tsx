import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, MapPin, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { fetchMandiPrices } from '@/services/mandiService';

const MarketPricesPage = () => {
  const { t } = useTranslation();
  const [allMarketData, setAllMarketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchMandiPrices(selectedState);
      setAllMarketData(data);
      setIsLoading(false);
    };
    loadData();
  }, [selectedState]);

  const categories = [
    { id: 'All', label: t('market.all') },
    { id: 'Cereals', label: t('market.cereals') },
    { id: 'Pulses', label: t('market.pulses') },
    { id: 'Vegetables', label: t('market.vegetables') },
    { id: 'Fruits', label: t('market.fruits') },
    { id: 'Oilseeds', label: t('market.oilseeds') },
    { id: 'Spices', label: t('market.spices') },
  ];

  const filtered = allMarketData.filter(item => {
    const safeCommodity = item.commodity || '';
    const safeMarket = item.market || '';
    const matchSearch = safeCommodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeMarket.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const topGainer = allMarketData.length > 0 ? [...allMarketData].sort((a, b) => b.change - a.change)[0] : null;
  const topLoser = allMarketData.length > 0 ? [...allMarketData].sort((a, b) => a.change - b.change)[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-amber-600 text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" /> {t('market.pageTitle')}
          </h1>
          <p className="opacity-90 mt-2">{t('market.pageSubtitle')}</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 py-8 space-y-6">

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('market.searchPlaceholder')}
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('market.selectState')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                <Filter className="h-4 w-4 mr-2" /> {t('market.filters')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className={`rounded-full shrink-0 ${selectedCategory === cat.id ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Data Grid */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1b325f] text-white">
                <tr>
                  <th className="px-6 py-4 font-bold">{t('market.commodity')}</th>
                  <th className="px-6 py-4 font-bold">{t('market.marketMandi')}</th>
                  <th className="px-6 py-4 font-bold text-right">{t('market.priceQtl')}</th>
                  <th className="px-6 py-4 font-bold text-center">{t('market.trend24h')}</th>
                  <th className="px-6 py-4 font-bold text-right">{t('market.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Fetching live Mandi prices from Agmarknet...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">{t('crops.noResults')}</td>
                  </tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.commodity}</div>
                      <div className="text-xs text-gray-500">{item.variety || 'Standard'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="h-3 w-3 text-amber-600" /> {item.market}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 ml-4">{item.district}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-lg font-bold text-gray-800">₹{item.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center gap-1 font-bold ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {item.change > 0 ? <TrendingUp className="h-4 w-4" /> :
                          item.change < 0 ? <TrendingDown className="h-4 w-4" /> :
                            <Minus className="h-4 w-4" />}
                        {Math.abs(item.change)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Trend Highlight */}
        {!isLoading && topGainer && topLoser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-700 font-bold mb-1">{t('market.topGainer')}</div>
                  <div className="text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="truncate max-w-[150px]" title={topGainer.commodity}>{topGainer.commodity}</span> 
                    <Badge className="bg-green-600 hover:bg-green-600 text-white w-fit">+{topGainer.change}%</Badge>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-300 shrink-0" />
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-red-700 font-bold mb-1">{t('market.topLoser')}</div>
                  <div className="text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="truncate max-w-[150px]" title={topLoser.commodity}>{topLoser.commodity}</span> 
                    <Badge className="bg-red-600 hover:bg-red-600 text-white w-fit">{topLoser.change}%</Badge>
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-300 shrink-0" />
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-700 font-bold mb-1">{t('market.marketSentiment')}</div>
                  <div className="text-xl font-bold text-blue-900">{t('market.bullish')}</div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-300 shrink-0" />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPricesPage;
