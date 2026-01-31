import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { MapPin, Navigation, Loader2, Check, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

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

  // Default center (India)
  const defaultCenter = new LatLng(20.5937, 78.9629);
  const center = selectedPosition || defaultCenter;

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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-xl font-bold mb-1">Farm Location</h1>
        <p className="text-sm text-muted-foreground">
          Tap on the map to set your farm location
        </p>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search village or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative mx-4 rounded-lg overflow-hidden border">
        <MapContainer
          center={center}
          zoom={selectedPosition ? 15 : 5}
          className="h-full w-full"
          zoomControl={false}
        >
          {/* Satellite tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {/* Labels overlay */}
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

        {/* Syncing overlay */}
        {isSyncing && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-[1000]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Syncing local data...</p>
            </div>
          </div>
        )}

        {/* GPS button */}
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

      {/* Location info panel */}
      <div className="p-4">
        {selectedPosition ? (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-mono">
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
          <Card className="border-dashed">
            <CardContent className="p-4 text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Tap on the map or use GPS to select your farm location</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MapPage;
