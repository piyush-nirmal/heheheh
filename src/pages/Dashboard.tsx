import { MapPin, CloudSun, FileText, ChevronRight, AlertTriangle, ExternalLink, Calendar, Newspaper, ArrowRight, Sprout, Scan, Droplets, TrendingUp, Users, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ActionableAdvice } from '@/components/dashboard/ActionableAdvice';
import { MarketTrends } from '@/components/dashboard/MarketTrends';
import { CropCalendar } from '@/components/dashboard/CropCalendar';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const NewsItem = ({ title, date }: { title: string; date: string }) => (
  <div className="flex flex-col border-b border-gray-100 py-3 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded">
    <a href="#" className="font-medium text-sm text-[#1b325f] hover:text-orange-600 line-clamp-2">
      {title}
    </a>
    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
      <Calendar className="h-3 w-3" /> {date}
    </span>
  </div>
);

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000&auto=format&fit=crop',
    badge: 'KEY INITIATIVE',
    title: 'Digital Agriculture Mission 2024',
    desc: 'Use advanced drone technology and AI-based advisory for precision farming.',
    color: 'from-white/95 via-white/50',
  },
  {
    img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop',
    badge: 'GOVT SCHEME',
    title: 'PM-KISAN Samman Nidhi',
    desc: '₹6,000 per year direct income support for all eligible farmer families.',
    color: 'from-white/95 via-green-50/50',
  },
  {
    img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2000&auto=format&fit=crop',
    badge: 'WEATHER ADVISORY',
    title: 'Precision Weather Farming',
    desc: 'Get hyperlocal weather forecasts and crop-specific alerts to protect your harvest.',
    color: 'from-white/95 via-blue-50/50',
  },
];

const Dashboard = () => {
  const { state } = useApp();
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 pb-12 bg-gray-50/50 min-h-screen">
      {/* 1. Scrolling Ticker (Marquee) */}
      <div className="bg-[#1b325f] text-white py-2 overflow-hidden relative flex items-center shadow-md border-b-2 border-orange-500">
        <div className="bg-orange-600 px-5 py-1 text-xs font-bold absolute left-0 z-10 h-full flex items-center uppercase tracking-wider shadow-md">
          {t('dashboard.whatsNew')}
        </div>
        <div className="animate-marquee whitespace-nowrap pl-40 text-sm font-medium flex gap-12 items-center">
          <span className="flex items-center gap-2">📢 {t('dashboard.ticker.pmKisan')}</span>
          <span className="flex items-center gap-2">🌱 {t('dashboard.ticker.soilHealth')}</span>
          <span className="flex items-center gap-2">🚜 {t('dashboard.ticker.solar')}</span>
          <span className="flex items-center gap-2">⚠️ {t('dashboard.ticker.rainfall')}</span>
          <span className="flex items-center gap-2">🌾 {t('dashboard.ticker.msp')}</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 space-y-8">

        {/* 2. Top Section: Hero Banner & Leadership */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Slider (9 Cols) */}
          <div className="lg:col-span-9 relative rounded-xl overflow-hidden shadow-lg h-[320px]">
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} to-transparent flex flex-col justify-end p-8 text-gray-900`}>
                  <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-sm mb-3 inline-block shadow-sm">
                    {slide.badge}
                  </span>
                  <h2 className="text-3xl font-extrabold leading-tight mb-2">{slide.title}</h2>
                  <p className="text-gray-700 text-base mb-4 max-w-lg">{slide.desc}</p>
                  <div className="flex gap-3">
                    <Button className="bg-[#1b325f] text-white hover:bg-[#15274a] font-bold border-none">
                      {t('dashboard.readGuidelines')}
                    </Button>
                    <Button variant="outline" className="text-[#1b325f] border-[#1b325f] hover:bg-[#1b325f] hover:text-white">
                      {t('dashboard.applySubsidy')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {/* Dot indicators */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'bg-orange-500 w-6' : 'bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Leadership Card (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="flex-1 shadow-md border-t-4 border-t-orange-500 overflow-hidden bg-white">
              <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gradient-to-b from-orange-50/50 to-white">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-3">
                  <img src="/Narendra-Modi.jpeg" alt="PM Modi" className="w-full h-full object-cover shadow-sm" />
                </div>
                <h3 className="font-bold text-[#1b325f] text-lg">Shri Narendra Modi</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">{t('dashboard.honblePM')}</p>
              </div>
            </Card>
            <Card className="flex-1 shadow-md border-t-4 border-t-[#1b325f] overflow-hidden bg-white">
              <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gradient-to-b from-blue-50/50 to-white">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden mb-2">
                  <img src="/1357404-shivraj.avif" alt="Agriculture Minister" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-[#1b325f] text-base">Shri Shivraj Singh Chouhan</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1">{t('dashboard.honbleMinister')}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* 3. Feature Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: t('dashboard.services.cropAdvisory'),
              hi: t('nav.cropAdvisory'),
              desc: t('dashboard.services.cropAdvisoryDesc'),
              icon: <Sprout className="h-6 w-6 text-white" />,
              color: 'bg-green-600',
              link: '/crops'
            },
            {
              title: t('dashboard.services.soilReport'),
              hi: t('nav.soilHealthCard'),
              desc: t('dashboard.services.soilReportDesc'),
              icon: <img src="/soil-health-logo.png" alt="Soil" className="h-6 w-6" />,
              color: 'bg-brown-600',
              link: '/soil'
            },
            {
              title: t('dashboard.services.diseaseDetection'),
              hi: t('dashboard.services.diseaseDetection'),
              desc: t('dashboard.services.diseaseDetectionDesc'),
              icon: <Scan className="h-6 w-6 text-white" />,
              color: 'bg-red-500',
              link: '/disease'
            },
            {
              title: t('dashboard.services.irrigationTips'),
              hi: t('dashboard.services.irrigationTips'),
              desc: t('dashboard.services.irrigationTipsDesc'),
              icon: <Droplets className="h-6 w-6 text-white" />,
              color: 'bg-blue-500',
              link: '/weather'
            },
            {
              title: t('dashboard.services.marketPrices'),
              hi: t('dashboard.services.marketPrices'),
              desc: t('dashboard.services.marketPricesDesc'),
              icon: <TrendingUp className="h-6 w-6 text-white" />,
              color: 'bg-amber-500',
              link: '/market'
            },
            {
              title: t('dashboard.services.community'),
              hi: t('dashboard.services.community'),
              desc: t('dashboard.services.communityDesc'),
              icon: <Users className="h-6 w-6 text-white" />,
              color: 'bg-purple-600',
              link: '/community'
            },
            {
              title: t('dashboard.services.voiceAssistant'),
              hi: t('dashboard.services.voiceAssistant'),
              desc: t('dashboard.services.voiceAssistantDesc'),
              icon: <Mic className="h-6 w-6 text-white" />,
              color: 'bg-green-500',
              link: '/contact',
              isSpecial: true,
              badge: 'NEW'
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`relative bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden ${item.isSpecial ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
            >
              {item.badge && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  {item.badge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className={`${item.color} p-3 rounded-lg shadow-sm shrink-0 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                  <p className="text-xs font-medium text-gray-500 mb-1">{item.hi}</p>
                  <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
                  {item.title === t('dashboard.services.voiceAssistant') && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                      <Mic className="h-3 w-3" /> {t('dashboard.services.languages')}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4. Main Content Grid (Portal Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: News & Notifications (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-md border-gray-200 overflow-hidden">
              <CardHeader className="py-3 px-4 bg-[#1b325f] text-white flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2 tracking-wide">
                  <Newspaper className="h-4 w-4" /> {t('dashboard.latestNews')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar divide-y divide-gray-100 bg-white">
                  <NewsItem title={t('dashboard.news.n1')} date="Jan 31, 2024" />
                  <NewsItem title={t('dashboard.news.n2')} date="Jan 30, 2024" />
                  <NewsItem title={t('dashboard.news.n3')} date="Jan 28, 2024" />
                  <NewsItem title={t('dashboard.news.n4')} date="Jan 25, 2024" />
                  <NewsItem title={t('dashboard.news.n5')} date="Jan 22, 2024" />
                  <NewsItem title={t('dashboard.news.n6')} date="Jan 18, 2024" />
                </div>
                <div className="p-2 bg-gray-50 text-center border-t">
                  <Link to="/contact" className="text-xs font-bold text-[#1b325f] hover:underline">{t('dashboard.viewArchive')}</Link>
                </div>
              </CardContent>
            </Card>

            {/* Promo Banner */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSopR-tGk2v5_lJEkzT2Wdki-V96n2T4jA5fQ&s" alt="G20" className="w-full h-auto" />
            </div>
          </div>

          {/* CENTER: Core Functional Dashboard (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Weather Main Widget */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-white px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1b325f] flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-blue-600" /> {t('dashboard.locationWeather')}
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{t('dashboard.live')}</span>
              </div>
              <div className="p-5">
                <WeatherWidget />
              </div>
            </div>

            {/* Advisory Widget - The most important part */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-white px-5 py-3 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1b325f] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" /> {t('dashboard.agroAdvisory')}
                </h3>
              </div>
              <div className="p-1">
                <ActionableAdvice />
              </div>
            </div>
          </div>

          {/* RIGHT: Market & Calendar (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <MarketTrends />

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <CropCalendar />
            </div>

            <Card className="bg-[#1b325f] text-white overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText className="h-32 w-32" />
              </div>
              <CardContent className="p-6 relative z-10">
                <h4 className="font-bold text-lg mb-2">{t('dashboard.haveQuery')}</h4>
                <p className="text-sm opacity-80 mb-4">{t('dashboard.chatDesc')}</p>
                <Button variant="secondary" className="w-full text-[#1b325f] font-bold hover:bg-gray-100">
                  {t('dashboard.askKisanAI')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. Partners Footer Strip */}
        <div className="border-t-2 border-dashed border-gray-300 pt-8 pb-4">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-center group cursor-pointer">
              <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform">🇮🇳</span>
              <span className="text-xs font-bold text-gray-600">Digital India</span>
            </div>
            <div className="text-center group cursor-pointer">
              <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform">🌾</span>
              <span className="text-xs font-bold text-gray-600">PM-KISAN</span>
            </div>
            <div className="text-center group cursor-pointer">
              <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform">🔬</span>
              <span className="text-xs font-bold text-gray-600">ICAR</span>
            </div>
            <div className="text-center group cursor-pointer">
              <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform">🌏</span>
              <span className="text-xs font-bold text-gray-600">G20 India</span>
            </div>
            <div className="text-center group cursor-pointer">
              <span className="text-4xl block mb-1 group-hover:scale-110 transition-transform">🛡️</span>
              <span className="text-xs font-bold text-gray-600">Fasal Bima</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
