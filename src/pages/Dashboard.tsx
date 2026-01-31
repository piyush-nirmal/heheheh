import { MapPin, CloudSun, FileText, ChevronRight, AlertTriangle, ExternalLink, Calendar, Newspaper, ArrowRight, Sprout, Scan, Droplets, TrendingUp, Users, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { ActionableAdvice } from '@/components/dashboard/ActionableAdvice';
import { MarketTrends } from '@/components/dashboard/MarketTrends';
import { CropCalendar } from '@/components/dashboard/CropCalendar';
import { useApp } from '@/contexts/AppContext';

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

const Dashboard = () => {
  const { state } = useApp();

  return (
    <div className="space-y-8 pb-12 bg-gray-50/50 min-h-screen">
      {/* 1. Scrolling Ticker (Marquee) */}
      <div className="bg-[#1b325f] text-white py-2 overflow-hidden relative flex items-center shadow-md border-b-2 border-orange-500">
        <div className="bg-orange-600 px-5 py-1 text-xs font-bold absolute left-0 z-10 h-full flex items-center uppercase tracking-wider shadow-md">
          What's New
        </div>
        <div className="animate-marquee whitespace-nowrap pl-40 text-sm font-medium flex gap-12 items-center">
          <span className="flex items-center gap-2">📢 PM-KISAN 16th Installment released. Check status now!</span>
          <span className="flex items-center gap-2">🌱 Soil Health Card Scheme renewal deadline extended.</span>
          <span className="flex items-center gap-2">🚜 New subsidy announced for solar pumps under PM-KUSUM.</span>
          <span className="flex items-center gap-2">⚠️ Heavy rainfall alert for coastal districts.</span>
          <span className="flex items-center gap-2">🌾 MSP for Wheat increased by ₹150 for Rabi Season 2024-25.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* 2. Top Section: Hero Banner & Leadership */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Slider (9 Cols) */}
          <div className="lg:col-span-9 relative rounded-xl overflow-hidden shadow-lg group h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1625246333195-bf79133bd53c?q=80&w=1200&auto=format&fit=crop"
              alt="Banner"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b325f]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
              <div className="max-w-2xl transform transition-transform duration-500 group-hover:-translate-y-2">
                <span className="bg-orange-500 text-xs font-bold px-3 py-1 rounded-sm mb-3 inline-block shadow-sm">
                  KEY INITIATIVE
                </span>
                <h2 className="text-3xl font-extrabold leading-tight mb-3 drop-shadow-md">
                  Digital Agriculture Mission 2024
                </h2>
                <p className="text-gray-100 text-lg line-clamp-2 drop-shadow-sm font-medium">
                  Use advanced drone technology and AI-based advisory for precision farming. Empowering farmers with real-time data.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button className="bg-white text-[#1b325f] hover:bg-gray-100 font-bold border-none">
                    Read Guidelines
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Apply For Subsidy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Card (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="flex-1 shadow-md border-t-4 border-t-orange-500 overflow-hidden bg-white">
              <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gradient-to-b from-orange-50/50 to-white">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/P._M._Modi_Image.jpg.jpg" alt="PM Modi" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-[#1b325f] text-lg">Shri Narendra Modi</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Hon'ble Prime Minister</p>
              </div>
            </Card>
            <Card className="flex-1 shadow-md border-t-4 border-t-[#1b325f] overflow-hidden bg-white">
              <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gradient-to-b from-blue-50/50 to-white">
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden mb-2 bg-gray-200 flex items-center justify-center text-2xl">
                  🏛️
                </div>
                <h3 className="font-bold text-[#1b325f] text-base">Shri Shivraj Singh Chouhan</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-1">Hon'ble Agriculture Minister</p>
              </div>
            </Card>
          </div>
        </div>

        {/* 3. Feature Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Crop Advisory",
              hi: "फसल सलाह",
              desc: "Get AI-powered crop recommendations",
              icon: <Sprout className="h-6 w-6 text-white" />,
              color: "bg-green-600",
              link: "/crops"
            },
            {
              title: "Soil Report",
              hi: "मिट्टी रिपोर्ट",
              desc: "Analyze your soil health",
              icon: <FileText className="h-6 w-6 text-white" />,
              color: "bg-brown-600",
              link: "/soil"
            },
            {
              title: "Disease Detection",
              hi: "रोग पहचान",
              desc: "AI-powered disease identification",
              icon: <Scan className="h-6 w-6 text-white" />,
              color: "bg-red-500",
              link: "/disease"
            },
            {
              title: "Irrigation Tips",
              hi: "सिंचाई सुझाव",
              desc: "Smart watering guidance",
              icon: <Droplets className="h-6 w-6 text-white" />,
              color: "bg-blue-500",
              link: "/weather"
            },
            {
              title: "Market Prices",
              hi: "बाज़ार भाव",
              desc: "Latest mandi rates",
              icon: <TrendingUp className="h-6 w-6 text-white" />,
              color: "bg-amber-500",
              link: "/market"
            },
            {
              title: "Community",
              hi: "समुदाय",
              desc: "Connect with other farmers",
              icon: <Users className="h-6 w-6 text-white" />,
              color: "bg-purple-600",
              link: "/community"
            },
            {
              title: "Voice Assistant",
              hi: "आवाज़ सहायक",
              desc: "Speak in your language",
              icon: <Mic className="h-6 w-6 text-white" />,
              color: "bg-green-500",
              link: "#",
              isSpecial: true,
              badge: "NEW"
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
                  {item.title === 'Voice Assistant' && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
                      <Mic className="h-3 w-3" /> 12+ Languages
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
                  <Newspaper className="h-4 w-4" /> LATEST NEWS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar divide-y divide-gray-100 bg-white">
                  <NewsItem title="Registration open for PM-KMY pension scheme" date="Jan 31, 2024" />
                  <NewsItem title="Cabinet approves MSP for Copra for 2024 season" date="Jan 30, 2024" />
                  <NewsItem title="ICAR develops new heat-resistant wheat variety" date="Jan 28, 2024" />
                  <NewsItem title="Union Minister inaugurates National Conference" date="Jan 25, 2024" />
                  <NewsItem title="Export of onions banned till March 31st" date="Jan 22, 2024" />
                  <NewsItem title="Digital crop survey launched in 10 states" date="Jan 18, 2024" />
                </div>
                <div className="p-2 bg-gray-50 text-center border-t">
                  <Link to="/news" className="text-xs font-bold text-[#1b325f] hover:underline">VIEW ARCHIVE</Link>
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
                  <CloudSun className="h-5 w-5 text-blue-600" /> Location Weather
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">LIVE</span>
              </div>
              <div className="p-5">
                <WeatherWidget />
              </div>
            </div>

            {/* Advisory Widget - The most important part */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-white px-5 py-3 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1b325f] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" /> Agro-Advisory
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
                <h4 className="font-bold text-lg mb-2">Have a Query?</h4>
                <p className="text-sm opacity-80 mb-4">Chat with our AI assistant or call kisan helpline.</p>
                <Button variant="secondary" className="w-full text-[#1b325f] font-bold hover:bg-gray-100">
                  Ask Kisan AI
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
