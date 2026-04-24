import { Link, useLocation } from 'react-router-dom';
import { Home, Map, FlaskConical, Wheat, User, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';

export const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { state } = useApp();

  const navItems = [
    { path: '/', label: t('bottomNav.home'), icon: <Home className="h-5 w-5" /> },
    { path: '/map', label: t('bottomNav.map'), icon: <Map className="h-5 w-5" /> },
    { path: '/soil', label: t('bottomNav.soil'), icon: <FlaskConical className="h-5 w-5" /> },
    { path: '/crops', label: t('bottomNav.crops'), icon: <Wheat className="h-5 w-5" /> },
    { path: '/profile', label: t('bottomNav.profile'), icon: <User className="h-5 w-5" />, requiresAuth: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg pb-safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showLock = item.requiresAuth && !state.user;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <span className={cn(
                'transition-transform duration-200 relative',
                isActive && 'scale-110'
              )}>
                {item.icon}
                {showLock && (
                  <span className="absolute -top-1 -right-2 bg-orange-100 rounded-full p-0.5">
                    <Lock className="h-3 w-3 text-orange-600" />
                  </span>
                )}
              </span>
              <span className={cn(
                'text-[10px] font-medium text-center',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
