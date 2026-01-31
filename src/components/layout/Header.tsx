import { Globe, Wifi, WifiOff, Menu, Search, User, ChevronDown, Wheat, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
] as const;

export const Header = () => {
  const { state, setLanguage } = useApp();
  const currentLang = languages.find(l => l.code === state.language) || languages[0];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Top Utility Bar (Government Standard) */}
      <div className="bg-[#1b325f] text-white text-xs py-1 px-4 hidden md:flex justify-between items-center">
        <div className="flex gap-4">
          <a href="#main-content" className="hover:underline">Skip to Main Content</a>
          <span className="opacity-50">|</span>
          <a href="#" className="hover:underline flex items-center gap-1">
            <span className="sr-only">Screen Reader Access</span>
            Screen Reader
          </a>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center bg-white/10 rounded px-2">
            <span className="text-[10px] uppercase opacity-70">Text Size:</span>
            <button className="hover:text-yellow-300 font-bold px-1">A-</button>
            <button className="hover:text-yellow-300 font-bold px-1">A</button>
            <button className="hover:text-yellow-300 font-bold px-1">A+</button>
          </div>
          <span className="opacity-50">|</span>
          <Link to="/auth" className="flex items-center gap-1 hover:text-orange-400 font-medium">
            <User className="h-4 w-4" /> Login / Check Status
          </Link>
          <span className="opacity-50">|</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:underline flex items-center gap-1">
                {currentLang.label} <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. Main Branding Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="bg-orange-500 rounded-full p-2 text-white shadow-lg group-hover:scale-105 transition-transform">
              {/* Emulating Emblem/Official Logo */}
              <Wheat className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">Ministry of Agriculture & Farmers Welfare</span>
              <h1 className="text-xl md:text-3xl font-extrabold text-[#1b325f] leading-none">
                AAPLA <span className="text-orange-600">७/१२</span>
              </h1>
              <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">Government of India Initiative</span>
            </div>
          </Link>

          {/* Right Branding / Emblems for Trust */}
          <div className="hidden md:flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyamev Jayate" className="h-12 opacity-80" />
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-gray-500">Kisan Call Center</div>
              <div className="text-lg font-bold text-[#1b325f]">1800-180-1551</div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2 border-b pb-4">
                  <div className="bg-orange-500 rounded-full p-1.5 text-white">
                    <Wheat className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-[#1b325f]">AAPLA 7/12</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <Link to="/" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Home</Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Digital 7/12</Link>
                  <Link to="/crops" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Crop Advisory</Link>
                  <Link to="/soil" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Soil Health Card</Link>
                  <Link to="/disease" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Disease Detection</Link>
                  <Link to="/irrigation" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Irrigation & Weather</Link>
                  <Link to="/market" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Market Prices</Link>
                  <Link to="/community" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">Community</Link>
                  <a href="https://mahadbt.maharashtra.gov.in/" target="_blank" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg flex items-center gap-2">
                    Govt Schemes
                  </a>
                </nav>
                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <Link to="/auth" className="font-bold text-[#1b325f]">Login / Register</Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 3. Navigation Bar (Mega Menu Style) */}
      <nav className="bg-[#1b325f] text-white hidden md:block shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            <li><Link to="/" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">Home</Link></li>

            {/* Digital 7/12 - Core Service */}
            <li><Link to="/profile" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">Digital 7/12</Link></li>

            {/* Farmer Services Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-6 py-3 font-medium hover:bg-orange-600 transition-colors outline-none h-full">
                    Farmer Services <ChevronDown className="h-4 w-4" opacity={0.7} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-t-4 border-orange-500 font-sans shadow-xl transform translate-y-1">
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/crops">Crop Advisory</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/soil">Soil Health Card</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/">Weather Forecast</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li><a href="https://mahadbt.maharashtra.gov.in/Farmer/AgriLogin/AgriLogin" target="_blank" rel="noopener noreferrer" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">Schemes</a></li>

            <li><Link to="/map" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">Map View</Link></li>

            <li><Link to="/contact" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">Contact Us</Link></li>

            <li className="ml-auto flex items-center pr-2">
              <button className="p-2 hover:bg-orange-600 rounded-full">
                <Search className="h-5 w-5" />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. Connectivity Strip */}
      <div className="bg-gray-100 border-b border-gray-200 py-1 px-4 text-xs font-medium text-gray-600 flex justify-end gap-3 md:hidden">
        <span className="flex items-center gap-1">
          {state.isOnline ? (
            <><Wifi className="h-3 w-3 text-green-600" /> Online</>
          ) : (
            <><WifiOff className="h-3 w-3 text-red-600" /> Offline</>
          )}
        </span>
        {state.isSyncing && (
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin text-blue-600" /> Syncing...
          </span>
        )}
      </div>
    </div>
  );
};
