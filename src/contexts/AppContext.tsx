import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SoilData, LocationData } from '@/services/recommendationEngine';

// Application State Types
// Application State Types
export interface FarmLocation {
  id: string;
  name: string;
  coordinates: LocationData;
  createdAt: string;
}

export interface SoilReading {
  id: string;
  locationId?: string;
  data: SoilData;
  createdAt: string;
}

export interface AppState {
  // User settings
  user: any | null; // Placeholder for user object
  language: 'en' | 'hi' | 'mr';
  isOnline: boolean;

  // Farm data
  locations: FarmLocation[];
  currentLocation: FarmLocation | null;

  // Soil data
  soilReadings: SoilReading[];
  currentSoilData: SoilData | null;

  // UI state
  isSyncing: boolean;
  lastSyncTime: string | null;
}

// Action Types
type AppAction =
  | { type: 'SET_USER'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' | 'mr' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_LOCATION'; payload: FarmLocation }
  | { type: 'SET_CURRENT_LOCATION'; payload: FarmLocation | null }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'ADD_SOIL_READING'; payload: SoilReading }
  | { type: 'SET_CURRENT_SOIL_DATA'; payload: SoilData | null }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_LAST_SYNC_TIME'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Initial State
const initialState: AppState = {
  user: null,
  language: 'en',
  isOnline: navigator.onLine,
  locations: [],
  currentLocation: null,
  soilReadings: [],
  currentSoilData: null,
  isSyncing: false,
  lastSyncTime: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };

    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
        currentLocation: action.payload,
      };

    case 'SET_CURRENT_LOCATION':
      return { ...state, currentLocation: action.payload };

    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter(l => l.id !== action.payload),
        currentLocation: state.currentLocation?.id === action.payload
          ? null
          : state.currentLocation,
      };

    case 'ADD_SOIL_READING':
      return {
        ...state,
        soilReadings: [...state.soilReadings, action.payload],
        currentSoilData: action.payload.data,
      };

    case 'SET_CURRENT_SOIL_DATA':
      return { ...state, currentSoilData: action.payload };

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  login: (user: any) => void;
  logout: () => void;
  addLocation: (name: string, lat: number, lng: number) => void;
  saveSoilReading: (data: SoilData) => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage key
const STORAGE_KEY = 'smart-crop-advisory-state';

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      const toSave = {
        user: state.user,
        language: state.language,
        locations: state.locations,
        currentLocation: state.currentLocation,
        soilReadings: state.soilReadings,
        currentSoilData: state.currentSoilData,
        lastSyncTime: state.lastSyncTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state.user, state.language, state.locations, state.currentLocation, state.soilReadings, state.currentSoilData, state.lastSyncTime]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper functions
  const login = (user: any) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addLocation = (name: string, lat: number, lng: number) => {
    const location: FarmLocation = {
      id: `loc-${Date.now()}`,
      name,
      coordinates: { lat, lng },
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LOCATION', payload: location });
  };

  const saveSoilReading = (data: SoilData) => {
    const reading: SoilReading = {
      id: `soil-${Date.now()}`,
      locationId: state.currentLocation?.id,
      data,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SOIL_READING', payload: reading });
  };

  const setLanguage = (lang: 'en' | 'hi' | 'mr') => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, addLocation, saveSoilReading, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
};


// Custom hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
