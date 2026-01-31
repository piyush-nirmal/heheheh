import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SoilData, LocationData } from '@/services/recommendationEngine';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  saveLocationToDb, getUserLocations, deleteLocationFromDb,
  saveSoilDataToDb, getUserSoilData,
  saveLandRecordToDb, getUserLandRecords, deleteLandRecordFromDb, LandRecord
} from '@/services/dbService';

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
  user: User | null;
  isLoadingAuth: boolean;
  language: 'en' | 'hi' | 'mr';
  isOnline: boolean;

  // Farm data
  locations: FarmLocation[];
  currentLocation: FarmLocation | null;

  // Soil data
  soilReadings: SoilReading[];
  currentSoilData: SoilData | null;

  // Land Records
  landRecords: LandRecord[];

  // UI state
  isSyncing: boolean;
  lastSyncTime: string | null;
}

// Action Types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' | 'mr' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_LOCATION'; payload: FarmLocation }
  | { type: 'SET_LOCATIONS'; payload: FarmLocation[] }
  | { type: 'SET_CURRENT_LOCATION'; payload: FarmLocation | null }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'ADD_SOIL_READING'; payload: SoilReading }
  | { type: 'SET_SOIL_READINGS'; payload: SoilReading[] }
  | { type: 'SET_CURRENT_SOIL_DATA'; payload: SoilData | null }
  | { type: 'ADD_LAND_RECORD'; payload: LandRecord }
  | { type: 'SET_LAND_RECORDS'; payload: LandRecord[] }
  | { type: 'REMOVE_LAND_RECORD'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_LAST_SYNC_TIME'; payload: string }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// Initial State
const initialState: AppState = {
  user: null,
  isLoadingAuth: true,
  language: 'en',
  isOnline: navigator.onLine,
  locations: [],
  currentLocation: null,
  soilReadings: [],
  currentSoilData: null,
  landRecords: [],
  isSyncing: false,
  lastSyncTime: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_AUTH_LOADING':
      return { ...state, isLoadingAuth: action.payload };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        locations: [],
        soilReadings: [],
        landRecords: [],
        currentLocation: null,
        currentSoilData: null
      };

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

    case 'SET_LOCATIONS':
      return { ...state, locations: action.payload };

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

    case 'SET_SOIL_READINGS':
      return { ...state, soilReadings: action.payload };

    case 'SET_CURRENT_SOIL_DATA':
      return { ...state, currentSoilData: action.payload };

    case 'ADD_LAND_RECORD':
      return { ...state, landRecords: [...state.landRecords, action.payload] };

    case 'SET_LAND_RECORDS':
      return { ...state, landRecords: action.payload };

    case 'REMOVE_LAND_RECORD':
      return { ...state, landRecords: state.landRecords.filter(r => r.id !== action.payload) };

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
  login: (user: User) => void;
  logout: () => Promise<void>;
  addLocation: (name: string, lat: number, lng: number) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  saveSoilReading: (data: SoilData) => Promise<void>;
  addLandRecord: (record: Omit<LandRecord, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  removeLandRecord: (id: string) => Promise<void>;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage key (Only for non-sensitive UI prefs like language)
const STORAGE_KEY = 'smart-crop-advisory-prefs';

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auth Listener & Data Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        try {
          // Fetch Data on Login
          const locs = await getUserLocations(user.uid);
          dispatch({ type: 'SET_LOCATIONS', payload: locs });

          const soils = await getUserSoilData(user.uid);
          dispatch({ type: 'SET_SOIL_READINGS', payload: soils });

          const records = await getUserLandRecords(user.uid);
          dispatch({ type: 'SET_LAND_RECORDS', payload: records });
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
    });
    return () => unsubscribe();
  }, []);

  // Load language prefs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) dispatch({ type: 'SET_LANGUAGE', payload: parsed.language });
      }
    } catch (error) {
      console.error('Error loading prefs:', error);
    }
  }, []);

  // Save language prefs
  useEffect(() => {
    const toSave = { language: state.language };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state.language]);

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
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addLocation = async (name: string, lat: number, lng: number) => {
    if (!state.user) return; // Guard
    try {
      const newLoc = await saveLocationToDb(state.user.uid, { name, coordinates: { lat, lng } });
      dispatch({ type: 'ADD_LOCATION', payload: newLoc });
    } catch (e) {
      console.error("Failed to add location", e);
      throw e;
    }
  };

  const removeLocation = async (id: string) => {
    try {
      await deleteLocationFromDb(id);
      dispatch({ type: 'REMOVE_LOCATION', payload: id });
    } catch (e) {
      console.error("Failed to remove location", e);
      throw e;
    }
  }

  const saveSoilReading = async (data: SoilData) => {
    if (!state.user) return;
    try {
      const newReading = await saveSoilDataToDb(state.user.uid, {
        locationId: state.currentLocation?.id,
        data
      });
      dispatch({ type: 'ADD_SOIL_READING', payload: newReading });
    } catch (e) {
      console.error("Failed to save soil data", e);
      throw e;
    }
  };

  const addLandRecord = async (record: Omit<LandRecord, 'id' | 'createdAt' | 'userId'>) => {
    if (!state.user) return;
    try {
      const newRecord = await saveLandRecordToDb(state.user.uid, record);
      dispatch({ type: 'ADD_LAND_RECORD', payload: newRecord });
    } catch (e) {
      console.error("Failed to add land record", e);
      throw e;
    }
  };

  const removeLandRecord = async (id: string) => {
    try {
      await deleteLandRecordFromDb(id);
      dispatch({ type: 'REMOVE_LAND_RECORD', payload: id });
    } catch (e) {
      console.error("Failed to remove land record", e);
      throw e;
    }
  };

  const setLanguage = (lang: 'en' | 'hi' | 'mr') => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, addLocation, removeLocation, saveSoilReading, addLandRecord, removeLandRecord, setLanguage }}>
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
