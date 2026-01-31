import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ChevronDown,
  Droplets,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Wheat,
  Sprout,
  Carrot,
  Apple,
  Leaf,
  Flower,
  Timer
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { getTopRecommendations, CropRecommendation } from '@/services/recommendationEngine';
import { categoryLabels, CropData } from '@/data/cropDatabase';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { getRealWeatherData } from '@/services/weatherService';
import { CurrentWeather } from '@/data/mockWeatherData';

const waterRequirementConfig = {
  low: { color: 'text-sky-400', label: 'Low water' },
  medium: { color: 'text-blue-500', label: 'Medium water' },
  high: { color: 'text-blue-700', label: 'High water' },
};

const getCropIcon = (category: string) => {
  switch (category) {
    case 'cereal':
      return <Wheat className="h-6 w-6 text-amber-500" />;
    case 'pulse':
      return <Sprout className="h-6 w-6 text-green-600" />;
    case 'oilseed':
      return <Flower className="h-6 w-6 text-yellow-500" />;
    case 'vegetable':
      return <Carrot className="h-6 w-6 text-orange-500" />;
    case 'fruit':
      return <Apple className="h-6 w-6 text-red-500" />;
    case 'cash_crop':
      return <Leaf className="h-6 w-6 text-emerald-600" />;
    default:
      return <Sprout className="h-6 w-6 text-green-500" />;
  }
};

const CropCard = ({ recommendation, onClick }: { recommendation: CropRecommendation; onClick: () => void }) => {
  const { crop, matchScore, warnings } = recommendation;
  const scoreColor = matchScore >= 70 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = matchScore >= 70 ? 'bg-emerald-50' : matchScore >= 50 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <Card
      className="group hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-muted/50 rounded-xl group-hover:bg-primary/5 transition-colors">
              {getCropIcon(crop.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-none">{crop.name}</h3>
                {crop.nameHindi && (
                  <span className="text-xs text-muted-foreground font-medium">({crop.nameHindi})</span>
                )}
              </div>
              <Badge variant="outline" className="mt-1.5 text-[10px] uppercase tracking-wider font-semibold">
                {categoryLabels[crop.category]}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className={cn('text-sm font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5', scoreBg, scoreColor)}>
              <TrendingUp className="h-3 w-3" />
              {matchScore}% Match
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-full bg-sky-50", waterRequirementConfig[crop.waterRequirement].color)}>
              <Droplets className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Water</span>
              <span className="text-xs font-medium capitalize">{crop.waterRequirement}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-orange-50 text-orange-600">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Duration</span>
              <span className="text-xs font-medium">{crop.growingSeason.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <div className="p-1.5 rounded-full bg-slate-100 text-slate-600">
              <Timer className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Yield</span>
              <span className="text-xs font-medium">{crop.yieldPerHectare}</span>
            </div>
          </div>
        </div>

        {recommendation.reasons.length > 0 && (
          <div className="mt-4 pt-3 border-t flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50/50 -mx-5 -mb-5 p-4">
            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="font-medium line-clamp-1">{recommendation.reasons[0].text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CropDetailDialog = ({
  recommendation,
  open,
  onClose
}: {
  recommendation: CropRecommendation | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!recommendation) return null;

  const { crop, matchScore, reasons, warnings, optimalityDetails } = recommendation;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-muted/50 rounded-lg">
              {getCropIcon(crop.category)}
            </div>
            <div>
              <div className="text-xl">{crop.name}</div>
              {crop.nameHindi && (
                <div className="text-sm font-normal text-muted-foreground">{crop.nameHindi}</div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Match score */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="font-medium">Suitability Score</span>
            <div className={cn(
              'text-2xl font-bold',
              matchScore >= 70 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-red-600'
            )}>
              {matchScore}%
            </div>
          </div>

          {/* Why this crop */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Why This Crop?
            </h4>
            <div className="space-y-2">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className={cn("mt-0.5", reason.type === 'positive' ? 'text-emerald-600' : 'text-muted-foreground')}>
                    {reason.type === 'positive' ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  </span>
                  <span>{reason.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-3 bg-warning/10 rounded-lg">
              <h4 className="font-semibold mb-2 text-warning-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Considerations
              </h4>
              <ul className="text-sm space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Growing info */}
          <div>
            <h4 className="font-semibold mb-2">Growing Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-muted rounded">
                <div className="text-muted-foreground">Sowing Season</div>
                <div className="font-medium">{crop.growingSeason.sowing.join(', ')}</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="text-muted-foreground">Harvest</div>
                <div className="font-medium">{crop.growingSeason.harvesting.join(', ')}</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="text-muted-foreground">Duration</div>
                <div className="font-medium">{crop.growingSeason.duration}</div>
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="text-muted-foreground">Water Need</div>
                <div className="font-medium capitalize flex items-center gap-2">
                  <span className={waterRequirementConfig[crop.waterRequirement].color}>
                    <Droplets className="h-4 w-4" />
                  </span>
                  {crop.waterRequirement}
                </div>
              </div>
              <div className="p-2 bg-muted rounded col-span-2">
                <div className="text-muted-foreground">Expected Yield</div>
                <div className="font-medium">{crop.yieldPerHectare}</div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-semibold mb-2">Growing Tips</h4>
            <ul className="text-sm space-y-1">
              {crop.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Best regions */}
          <div>
            <h4 className="font-semibold mb-2">Best Regions</h4>
            <div className="flex flex-wrap gap-1">
              {crop.regions.map((region) => (
                <Badge key={region} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CropsPage = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CropData['category'] | 'all'>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | undefined>(undefined);

  // Fetch real weather for better recommendations
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = state.currentLocation?.coordinates.lat || 20.5937;
        const lng = state.currentLocation?.coordinates.lng || 78.9629;
        const data = await getRealWeatherData(lat, lng);
        setCurrentWeather(data.current);
      } catch (e) {
        console.error("Failed to fetch weather for recommendations:", e);
      }
    };
    fetchWeather();
  }, [state.currentLocation]);

  // Get recommendations
  const recommendations = useMemo(() => {
    const soilData = state.currentSoilData || {
      nitrogen: 85,
      phosphorus: 45,
      potassium: 55,
      ph: 6.5,
    };

    const location = state.currentLocation?.coordinates || {
      lat: 20.5937,
      lng: 78.9629,
    };

    return getTopRecommendations(
      { soil: soilData, location, weather: currentWeather },
      30 // Get more recommendations to filter
    );
  }, [state.currentSoilData, state.currentLocation, currentWeather]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const matchesSearch =
        rec.crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.crop.nameHindi?.includes(searchQuery) ?? false);

      const matchesCategory = categoryFilter === 'all' || rec.crop.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [recommendations, searchQuery, categoryFilter]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-[#1b325f] text-white py-6 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Crop Advisory System</h1>
          <p className="opacity-80 text-sm mt-1">
            AI-based recommendations optimized for your soil parameters and local climate.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {state.currentSoilData ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6 flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Recommendations grounded on your latest Soil Health Card</span>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 flex items-center gap-2 text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <span>Viewing Demo Data. Please <Link to="/soil" className="underline font-bold">upload your Soil Health Card</Link> for accurate accuracy.</span>
          </div>
        )}

        {/* Search and filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {categoryFilter === 'all' ? 'All' : categoryLabels[categoryFilter]}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                All Categories
              </DropdownMenuItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setCategoryFilter(key as CropData['category'])}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-3">
          Showing {filteredRecommendations.length} crops
        </p>

        {/* Crop grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecommendations.map((recommendation) => (
            <CropCard
              key={recommendation.crop.id}
              recommendation={recommendation}
              onClick={() => setSelectedCrop(recommendation)}
            />
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>No crops match your search criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Detail dialog */}
        <CropDetailDialog
          recommendation={selectedCrop}
          open={!!selectedCrop}
          onClose={() => setSelectedCrop(null)}
        />
      </div>
    </div>
  );
};

export default CropsPage;
