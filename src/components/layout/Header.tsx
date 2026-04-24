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
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
] as const;

export const Header = () => {
  const { state, setLanguage, setFontSize } = useApp();
  const { t } = useTranslation();
  const currentLang = languages.find(l => l.code === state.language) || languages[0];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Top Utility Bar (Government Standard) */}
      <div className="bg-[#1b325f] text-white text-xs py-1 px-4 hidden md:flex justify-end items-center">
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center bg-white/10 rounded px-2">
            <span className="text-[10px] uppercase opacity-70">{t('nav.textSize')}</span>
            <button
              onClick={() => setFontSize('small')}
              className={`font-bold px-1 text-xs transition-colors ${state.fontSize === 'small' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >A-</button>
            <button
              onClick={() => setFontSize('medium')}
              className={`font-bold px-1 text-sm transition-colors ${state.fontSize === 'medium' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >A</button>
            <button
              onClick={() => setFontSize('large')}
              className={`font-bold px-1 text-base transition-colors ${state.fontSize === 'large' ? 'text-yellow-300' : 'hover:text-yellow-300'}`}
            >A+</button>
          </div>
          <span className="opacity-50">|</span>
          <Link to="/auth" className="flex items-center gap-1 hover:text-orange-400 font-medium">
            <User className="h-4 w-4" /> {t('nav.loginCheckStatus')}
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
        <div className="max-w-screen-2xl mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 group">
            <div className="bg-orange-500 rounded-full p-2 text-white shadow-lg group-hover:scale-105 transition-transform">
              <Wheat className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wider">{t('nav.ministryLabel')}</span>
              <h1 className="text-xl md:text-3xl font-extrabold text-[#1b325f] leading-none">
                AAPLA <span className="text-orange-600">७/१२</span>
              </h1>
              <span className="text-xs md:text-sm text-gray-500 font-medium mt-1">{t('nav.govtInitiative')}</span>
            </div>
          </Link>

          {/* Right Branding / Emblems for Trust */}
          <div className="hidden md:flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Satyamev Jayate" className="h-12 opacity-80" />
            <div className="text-right hidden lg:block">
              <div className="text-xs font-bold text-gray-500">{t('nav.kisanCallCenter')}</div>
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
                  <Link to="/" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('nav.home')}</Link>
                  <Link to="/profile" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('nav.digital712')}</Link>
                  <Link to="/crops" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('nav.cropAdvisory')}</Link>
                  <Link to="/soil" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('nav.soilHealthCard')}</Link>
                  <Link to="/market" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('market.title')}</Link>
                  <Link to="/community" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg">{t('dashboard.services.community')}</Link>
                  <a href="https://mahadbt.maharashtra.gov.in/" target="_blank" className="px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium rounded-lg flex items-center gap-2">
                    {t('nav.schemes')}
                  </a>
                </nav>
                <div className="mt-auto border-t pt-4">
                  <div className="flex items-center gap-2 px-4 mb-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <Link to="/auth" className="font-bold text-[#1b325f]">{t('nav.loginCheckStatus')}</Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* 3. Navigation Bar (Mega Menu Style) */}
      <nav className="bg-[#1b325f] text-white hidden md:block shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            <li><Link to="/" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">{t('nav.home')}</Link></li>

            <li><Link to="/profile" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">{t('nav.digital712')}</Link></li>

            {/* Farmer Services Dropdown */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-6 py-3 font-medium hover:bg-orange-600 transition-colors outline-none h-full">
                    {t('nav.farmerServices')} <ChevronDown className="h-4 w-4" opacity={0.7} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-t-4 border-orange-500 font-sans shadow-xl transform translate-y-1">
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/crops">{t('nav.cropAdvisory')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/soil">{t('nav.soilHealthCard')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer">
                    <Link to="/">{t('nav.weatherForecast')}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li><a href="https://mahadbt.maharashtra.gov.in/Farmer/AgriLogin/AgriLogin" target="_blank" rel="noopener noreferrer" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">{t('nav.schemes')}</a></li>

            <li><Link to="/map" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">{t('nav.mapView')}</Link></li>

            <li><Link to="/contact" className="block px-6 py-3 font-medium hover:bg-orange-600 transition-colors">{t('nav.contactUs')}</Link></li>

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
            <><Wifi className="h-3 w-3 text-green-600" /> {t('common.online')}</>
          ) : (
            <><WifiOff className="h-3 w-3 text-red-600" /> {t('common.offline')}</>
          )}
        </span>
        {state.isSyncing && (
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin text-blue-600" /> {t('common.syncing')}
          </span>
        )}
      </div>
    </div>
  );
};
