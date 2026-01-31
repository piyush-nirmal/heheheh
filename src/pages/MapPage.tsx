import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import {
  MapPin, Navigation, Loader2, Check, Search,
  Cloud, Droplets, Wind, Eye, Gauge, Sunrise, Sunset,
  Thermometer, Building2, ShoppingCart, Sprout, Calendar,
  TrendingUp, History, MapPinned, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { getRealWeatherData } from '@/services/weatherService';
import { WeatherData } from '@/data/mockWeatherData';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to fly to a location
const FlyToLocation = ({ position }: { position: LatLng | null }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
};

// Soil type prediction based on coordinates (mock data)
const predictSoilType = (lat: number, lng: number) => {
  // Simple heuristic based on regions in India
  if (lat > 28 && lng > 75 && lng < 80) return { type: 'Alluvial', quality: 'Excellent', ph: 7.2 };
  if (lat > 20 && lat < 25 && lng > 72 && lng < 78) return { type: 'Black Cotton', quality: 'Good', ph: 7.8 };
  if (lat < 15 && lng > 75) return { type: 'Red Soil', quality: 'Moderate', ph: 6.5 };
  if (lat > 25 && lng < 75) return { type: 'Sandy Loam', quality: 'Good', ph: 7.0 };
  return { type: 'Loamy', quality: 'Good', ph: 6.8 };
};

// Nearby services (mock data based on location)
const getNearbyServices = (lat: number, lng: number) => {
  return {
    government: [
      { name: 'Agriculture Office', distance: '2.3 km', type: 'Krishi Bhavan' },
      { name: 'Tehsil Office', distance: '3.5 km', type: 'Revenue Office' },
      { name: 'Veterinary Hospital', distance: '4.1 km', type: 'Animal Care' },
    ],
    markets: [
      { name: 'Main Mandi', distance: '5.2 km', type: 'Wholesale Market', timing: '6 AM - 2 PM' },
      { name: 'Vegetable Market', distance: '3.8 km', type: 'Retail Market', timing: '5 AM - 12 PM' },
      { name: 'Grain Market', distance: '6.5 km', type: 'APMC Mandi', timing: '7 AM - 4 PM' },
    ]
  };
};

// Historical crop data (mock)
const getHistoricalData = (lat: number, lng: number) => {
  return {
    cropCycles: [
      { season: 'Kharif 2025', crop: 'Rice', yield: '4.2 tons/ha', status: 'Completed' },
      { season: 'Rabi 2024-25', crop: 'Wheat', yield: '3.8 tons/ha', status: 'Completed' },
      { season: 'Kharif 2024', crop: 'Cotton', yield: '2.1 tons/ha', status: 'Completed' },
    ],
    weatherHistory: [
      { month: 'Jan 2026', avgTemp: '18°C', rainfall: '12 mm', condition: 'Dry' },
      { month: 'Dec 2025', avgTemp: '15°C', rainfall: '8 mm', condition: 'Cold' },
      { month: 'Nov 2025', avgTemp: '22°C', rainfall: '5 mm', condition: 'Pleasant' },
    ],
    yieldTrends: [
      { year: '2025', avgYield: '4.0 tons/ha', trend: '+12%' },
      { year: '2024', avgYield: '3.6 tons/ha', trend: '+8%' },
      { year: '2023', avgYield: '3.3 tons/ha', trend: '+5%' },
    ]
  };
};

const MapPage = () => {
  const { state, addLocation, dispatch } = useApp();
  const { toast } = useToast();

  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(
    state.currentLocation
      ? new LatLng(state.currentLocation.coordinates.lat, state.currentLocation.coordinates.lng)
      : null
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState(state.currentLocation?.name || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Default center (India)
  const defaultCenter = new LatLng(20.5937, 78.9629);
  const center = selectedPosition || defaultCenter;

  // Fetch weather data when location is selected
  useEffect(() => {
    if (selectedPosition) {
      setLoadingWeather(true);
      getRealWeatherData(selectedPosition.lat, selectedPosition.lng)
        .then(data => {
          setWeatherData(data);
          setLoadingWeather(false);
        })
        .catch(err => {
          console.error('Weather fetch error:', err);
          setLoadingWeather(false);
        });
    }
  }, [selectedPosition]);

  const handleLocationSelect = (lat: number, lng: number) => {
    const position = new LatLng(lat, lng);
    setSelectedPosition(position);

    // Simulate syncing
    setIsSyncing(true);
    dispatch({ type: 'SET_SYNCING', payload: true });

    setTimeout(() => {
      setIsSyncing(false);
      dispatch({ type: 'SET_SYNCING', payload: false });
      toast({
        title: 'Location Selected',
        description: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    }, 1500);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleLocationSelect(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        toast({
          title: 'Location Error',
          description: 'Unable to get your location. Please select manually.',
          variant: 'destructive',
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSaveLocation = () => {
    if (!state.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to save your farm location.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedPosition) return;

    const name = locationName.trim() || `Farm ${state.locations.length + 1}`;
    addLocation(name, selectedPosition.lat, selectedPosition.lng);

    toast({
      title: 'Location Saved!',
      description: `${name} has been added to your farms.`,
    });
  };

  const soilData = selectedPosition ? predictSoilType(selectedPosition.lat, selectedPosition.lng) : null;
  const nearbyServices = selectedPosition ? getNearbyServices(selectedPosition.lat, selectedPosition.lng) : null;
  const historicalData = selectedPosition ? getHistoricalData(selectedPosition.lat, selectedPosition.lng) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Farm Location Intelligence
          </h1>
          <p className="text-muted-foreground">
            Select your farm location to get detailed insights, weather data, and historical analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search village, district, or pin code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5" />
                  Interactive Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] relative">
                  <MapContainer
                    center={center}
                    zoom={selectedPosition ? 15 : 5}
                    className="h-full w-full"
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <TileLayer
                      attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                    />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    <FlyToLocation position={selectedPosition} />
                    {selectedPosition && (
                      <Marker position={selectedPosition} icon={customIcon} />
                    )}
                  </MapContainer>

                  {isSyncing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-[1000]">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Syncing local data...</p>
                      </div>
                    </div>
                  )}

                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 z-[1000] shadow-lg"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Navigation className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save Location Card */}
            {selectedPosition ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-mono font-semibold">
                      {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                    </span>
                  </div>
                  <Input
                    placeholder="Enter farm name (e.g., Main Field)"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={handleSaveLocation}
                    disabled={isSyncing}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Farm Location
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No Location Selected</p>
                  <p className="text-sm mt-1">Tap on the map or use GPS to select your farm location</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Details Section */}
          <div>
            {selectedPosition ? (
              <Card className="h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Location Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-4 rounded-none">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="weather">Weather</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                      {/* Soil Information */}
                      {soilData && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2 text-green-700">
                            <Sprout className="h-4 w-4" />
                            Soil Analysis
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <p className="text-xs text-muted-foreground">Soil Type</p>
                              <p className="font-semibold text-green-700">{soilData.type}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-xs text-muted-foreground">Quality</p>
                              <p className="font-semibold text-blue-700">{soilData.quality}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <p className="text-xs text-muted-foreground">pH Level</p>
                              <p className="font-semibold text-purple-700">{soilData.ph}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                              <p className="text-xs text-muted-foreground">Fertility</p>
                              <p className="font-semibold text-amber-700">High</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Weather Summary */}
                      {weatherData && !loadingWeather && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                            <Cloud className="h-4 w-4" />
                            Current Weather
                          </h3>
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-3xl font-bold text-blue-700">
                                  {weatherData.current.temperature}°C
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {weatherData.current.description}
                                </p>
                              </div>
                              <Thermometer className="h-12 w-12 text-blue-400" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <div className="text-center">
                                <Droplets className="h-4 w-4 mx-auto text-blue-500" />
                                <p className="text-xs mt-1">{weatherData.current.humidity}%</p>
                              </div>
                              <div className="text-center">
                                <Wind className="h-4 w-4 mx-auto text-blue-500" />
                                <p className="text-xs mt-1">{weatherData.current.windSpeed} km/h</p>
                              </div>
                              <div className="text-center">
                                <Eye className="h-4 w-4 mx-auto text-blue-500" />
                                <p className="text-xs mt-1">{weatherData.current.visibility} km</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recommended Crops */}
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2 text-emerald-700">
                          <Sprout className="h-4 w-4" />
                          Recommended Crops
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Rice</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Wheat</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Cotton</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">Sugarcane</Badge>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Weather Tab */}
                    <TabsContent value="weather" className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                      {loadingWeather ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : weatherData ? (
                        <>
                          {/* Detailed Current Weather */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Current Conditions</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Thermometer className="h-4 w-4 text-blue-600" />
                                  <p className="text-xs text-muted-foreground">Temperature</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.temperature}°C</p>
                                <p className="text-xs text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</p>
                              </div>
                              <div className="bg-cyan-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Droplets className="h-4 w-4 text-cyan-600" />
                                  <p className="text-xs text-muted-foreground">Humidity</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.humidity}%</p>
                              </div>
                              <div className="bg-indigo-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Wind className="h-4 w-4 text-indigo-600" />
                                  <p className="text-xs text-muted-foreground">Wind</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.windSpeed} km/h</p>
                                <p className="text-xs text-muted-foreground">{weatherData.current.windDirection}</p>
                              </div>
                              <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gauge className="h-4 w-4 text-purple-600" />
                                  <p className="text-xs text-muted-foreground">Pressure</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.pressure} hPa</p>
                              </div>
                            </div>

                            {/* Sun Times */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-orange-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Sunrise className="h-4 w-4 text-orange-600" />
                                  <p className="text-xs text-muted-foreground">Sunrise</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.sunrise}</p>
                              </div>
                              <div className="bg-pink-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Sunset className="h-4 w-4 text-pink-600" />
                                  <p className="text-xs text-muted-foreground">Sunset</p>
                                </div>
                                <p className="font-semibold">{weatherData.current.sunset}</p>
                              </div>
                            </div>
                          </div>

                          {/* 5-Day Forecast */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">5-Day Forecast</h3>
                            <div className="space-y-2">
                              {weatherData.forecast.map((day, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 text-center">
                                      <p className="font-semibold text-sm">{day.dayName}</p>
                                    </div>
                                    <Cloud className="h-5 w-5 text-blue-500" />
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-sm font-semibold">{day.high}° / {day.low}°</p>
                                      <p className="text-xs text-muted-foreground">{day.rainChance}% rain</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No weather data available</p>
                      )}
                    </TabsContent>

                    {/* Services Tab */}
                    <TabsContent value="services" className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                      {nearbyServices && (
                        <>
                          {/* Government Offices */}
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                              <Building2 className="h-4 w-4" />
                              Nearby Government Offices
                            </h3>
                            <div className="space-y-2">
                              {nearbyServices.government.map((office, idx) => (
                                <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-blue-900">{office.name}</p>
                                      <p className="text-xs text-blue-600">{office.type}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{office.distance}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Local Markets */}
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-green-700">
                              <ShoppingCart className="h-4 w-4" />
                              Local Markets
                            </h3>
                            <div className="space-y-2">
                              {nearbyServices.markets.map((market, idx) => (
                                <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex justify-between items-start mb-1">
                                    <div>
                                      <p className="font-semibold text-green-900">{market.name}</p>
                                      <p className="text-xs text-green-600">{market.type}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">{market.distance}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {market.timing}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                      {historicalData && (
                        <>
                          {/* Previous Crop Cycles */}
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-emerald-700">
                              <Sprout className="h-4 w-4" />
                              Previous Crop Cycles
                            </h3>
                            <div className="space-y-2">
                              {historicalData.cropCycles.map((cycle, idx) => (
                                <div key={idx} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-semibold text-emerald-900">{cycle.season}</p>
                                      <p className="text-sm text-emerald-700">{cycle.crop}</p>
                                    </div>
                                    <Badge className="bg-emerald-600">{cycle.status}</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Yield: <span className="font-semibold">{cycle.yield}</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Weather History */}
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-blue-700">
                              <History className="h-4 w-4" />
                              Weather History
                            </h3>
                            <div className="space-y-2">
                              {historicalData.weatherHistory.map((record, idx) => (
                                <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-blue-900">{record.month}</p>
                                      <p className="text-xs text-blue-600">{record.condition}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold">{record.avgTemp}</p>
                                      <p className="text-xs text-muted-foreground">{record.rainfall} rain</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Yield Trends */}
                          <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-purple-700">
                              <TrendingUp className="h-4 w-4" />
                              Yield Trends
                            </h3>
                            <div className="space-y-2">
                              {historicalData.yieldTrends.map((trend, idx) => (
                                <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-purple-900">{trend.year}</p>
                                      <p className="text-sm text-purple-700">{trend.avgYield}</p>
                                    </div>
                                    <Badge className="bg-green-600">{trend.trend}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center border-dashed border-2">
                <CardContent className="text-center text-muted-foreground p-12">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-xl font-medium mb-2">Select a Location</p>
                  <p className="text-sm">Click on the map to view detailed location intelligence</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
