import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import SoilPage from "./pages/SoilPage";
import CropsPage from "./pages/CropsPage";
import ProfilePage from "./pages/ProfilePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import IrrigationPage from "./pages/IrrigationPage";
import MarketPricesPage from "./pages/MarketPricesPage";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { state } = useApp();

  if (state.isLoadingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Verifying Farmer ID...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/soil" element={<SoilPage />} />
      <Route path="/crops" element={<CropsPage />} />
      <Route path="/disease" element={<DiseaseDetectionPage />} />
      <Route path="/irrigation" element={<IrrigationPage />} />
      <Route path="/weather" element={<IrrigationPage />} />
      <Route path="/market" element={<MarketPricesPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InstallPrompt />
        <BrowserRouter>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
