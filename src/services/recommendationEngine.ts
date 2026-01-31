// Mock Recommendation Engine
// This can be migrated to a Node.js backend later
// Currently runs entirely in the frontend

import { cropDatabase, CropData } from '@/data/cropDatabase';
import { CurrentWeather } from '@/data/mockWeatherData';

export interface SoilData {
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  ph: number;
}

export interface LocationData {
  lat: number;
  lng: number;
  region?: string;
  state?: string;
}

export interface RecommendationInput {
  soil: SoilData;
  location: LocationData;
  weather?: CurrentWeather;
}

export interface CropRecommendation {
  crop: CropData;
  matchScore: number; // 0-100
  reasons: RecommendationReason[];
  warnings: string[];
  optimalityDetails: {
    nitrogen: MatchDetail;
    phosphorus: MatchDetail;
    potassium: MatchDetail;
    ph: MatchDetail;
    temperature?: MatchDetail;
    humidity?: MatchDetail;
    region: MatchDetail;
  };
}

export interface RecommendationReason {
  type: 'positive' | 'neutral' | 'negative';
  text: string;
  icon: string;
}

export interface MatchDetail {
  status: 'optimal' | 'good' | 'marginal' | 'poor';
  current: number | string;
  optimal: string;
  score: number; // 0-100
}

// Calculate how well a value matches an ideal range
const calculateRangeMatch = (
  value: number,
  min: number,
  max: number,
  optimal: number
): MatchDetail => {
  let score = 0;
  let status: MatchDetail['status'] = 'poor';

  if (value >= min && value <= max) {
    // Within acceptable range
    const distanceFromOptimal = Math.abs(value - optimal);
    const maxDistance = Math.max(optimal - min, max - optimal);
    score = Math.max(0, 100 - (distanceFromOptimal / maxDistance) * 50);
    
    if (score >= 80) status = 'optimal';
    else if (score >= 60) status = 'good';
    else status = 'marginal';
  } else {
    // Outside range - calculate how far
    const distanceOutside = value < min ? min - value : value - max;
    const rangeSize = max - min;
    score = Math.max(0, 40 - (distanceOutside / rangeSize) * 40);
    status = score > 20 ? 'marginal' : 'poor';
  }

  return {
    status,
    current: value,
    optimal: `${min}-${max} (optimal: ${optimal})`,
    score,
  };
};

// Map Indian states to regions in crop database
const stateToRegions: Record<string, string[]> = {
  'uttar pradesh': ['Uttar Pradesh', 'UP', 'Northern India'],
  'punjab': ['Punjab', 'Northern India'],
  'haryana': ['Haryana', 'Northern India'],
  'madhya pradesh': ['Madhya Pradesh', 'MP', 'Central India'],
  'maharashtra': ['Maharashtra', 'Western India'],
  'karnataka': ['Karnataka', 'Southern India'],
  'tamil nadu': ['Tamil Nadu', 'Southern India'],
  'andhra pradesh': ['Andhra Pradesh', 'Southern India'],
  'telangana': ['Telangana', 'Southern India'],
  'west bengal': ['West Bengal', 'Eastern India'],
  'gujarat': ['Gujarat', 'Western India'],
  'rajasthan': ['Rajasthan', 'Northwestern India'],
  'bihar': ['Bihar', 'Eastern India'],
  'odisha': ['Odisha', 'Eastern India'],
  'kerala': ['Kerala', 'Southern India'],
  'assam': ['Assam', 'Northeastern India'],
};

// Determine region based on coordinates (simplified)
const getRegionFromCoordinates = (lat: number, lng: number): string => {
  // Very simplified region detection for India
  if (lat > 28) return 'Northern India';
  if (lat < 15) return 'Southern India';
  if (lng < 75) return 'Western India';
  if (lng > 85) return 'Eastern India';
  return 'Central India';
};

// Main recommendation function
export const getRecommendations = (
  input: RecommendationInput
): CropRecommendation[] => {
  const { soil, location, weather } = input;
  
  const recommendations: CropRecommendation[] = [];
  const region = location.state 
    ? stateToRegions[location.state.toLowerCase()]?.[0] || location.state
    : getRegionFromCoordinates(location.lat, location.lng);

  for (const crop of cropDatabase) {
    const reasons: RecommendationReason[] = [];
    const warnings: string[] = [];

    // Calculate nutrient matches
    const nitrogenMatch = calculateRangeMatch(
      soil.nitrogen,
      crop.idealConditions.nitrogen.min,
      crop.idealConditions.nitrogen.max,
      crop.idealConditions.nitrogen.optimal
    );

    const phosphorusMatch = calculateRangeMatch(
      soil.phosphorus,
      crop.idealConditions.phosphorus.min,
      crop.idealConditions.phosphorus.max,
      crop.idealConditions.phosphorus.optimal
    );

    const potassiumMatch = calculateRangeMatch(
      soil.potassium,
      crop.idealConditions.potassium.min,
      crop.idealConditions.potassium.max,
      crop.idealConditions.potassium.optimal
    );

    const phMatch = calculateRangeMatch(
      soil.ph,
      crop.idealConditions.ph.min,
      crop.idealConditions.ph.max,
      crop.idealConditions.ph.optimal
    );

    // Temperature and humidity match (if weather provided)
    let temperatureMatch: MatchDetail | undefined;
    let humidityMatch: MatchDetail | undefined;

    if (weather) {
      temperatureMatch = calculateRangeMatch(
        weather.temperature,
        crop.idealConditions.temperature.min,
        crop.idealConditions.temperature.max,
        crop.idealConditions.temperature.optimal
      );

      humidityMatch = calculateRangeMatch(
        weather.humidity,
        crop.idealConditions.humidity.min,
        crop.idealConditions.humidity.max,
        crop.idealConditions.humidity.optimal
      );
    }

    // Region match
    const regionMatches = crop.regions.some(r => 
      r.toLowerCase().includes(region.toLowerCase()) ||
      region.toLowerCase().includes(r.toLowerCase())
    );

    const regionMatch: MatchDetail = {
      status: regionMatches ? 'optimal' : 'marginal',
      current: region,
      optimal: crop.regions.join(', '),
      score: regionMatches ? 100 : 50,
    };

    // Calculate overall score
    const weights = {
      nitrogen: 0.15,
      phosphorus: 0.15,
      potassium: 0.15,
      ph: 0.20,
      temperature: weather ? 0.15 : 0,
      humidity: weather ? 0.10 : 0,
      region: 0.10,
    };

    // Normalize weights if no weather
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    
    let matchScore = 
      (nitrogenMatch.score * weights.nitrogen +
      phosphorusMatch.score * weights.phosphorus +
      potassiumMatch.score * weights.potassium +
      phMatch.score * weights.ph +
      (temperatureMatch?.score || 0) * weights.temperature +
      (humidityMatch?.score || 0) * weights.humidity +
      regionMatch.score * weights.region) / totalWeight;

    matchScore = Math.round(matchScore);

    // Generate reasons
    if (phMatch.status === 'optimal' || phMatch.status === 'good') {
      reasons.push({
        type: 'positive',
        text: `pH ${soil.ph} is ${phMatch.status} for ${crop.name}`,
        icon: '✓',
      });
    }

    if (nitrogenMatch.status === 'optimal') {
      reasons.push({
        type: 'positive',
        text: `Nitrogen levels match ${crop.name}'s needs`,
        icon: '✓',
      });
    }

    if (regionMatches) {
      reasons.push({
        type: 'positive',
        text: `${crop.name} grows well in ${region}`,
        icon: '📍',
      });
    }

    if (weather && temperatureMatch?.status === 'optimal') {
      reasons.push({
        type: 'positive',
        text: `Current ${weather.temperature}°C is ideal for ${crop.name}`,
        icon: '🌡️',
      });
    }

    if (weather && humidityMatch?.status === 'optimal') {
      reasons.push({
        type: 'positive',
        text: `Humidity ${weather.humidity}% suits ${crop.name}`,
        icon: '💧',
      });
    }

    // Generate warnings
    if (nitrogenMatch.status === 'poor') {
      warnings.push(`Nitrogen level ${soil.nitrogen} kg/ha is ${soil.nitrogen < crop.idealConditions.nitrogen.min ? 'too low' : 'too high'}`);
    }

    if (phosphorusMatch.status === 'poor') {
      warnings.push(`Phosphorus level needs adjustment`);
    }

    if (potassiumMatch.status === 'poor') {
      warnings.push(`Potassium level is suboptimal`);
    }

    if (phMatch.status === 'poor') {
      warnings.push(`pH ${soil.ph} is outside recommended range (${crop.idealConditions.ph.min}-${crop.idealConditions.ph.max})`);
    }

    if (weather && temperatureMatch?.status === 'poor') {
      warnings.push(`Current temperature not ideal - best sown in ${crop.growingSeason.sowing.join('/')}`);
    }

    // Only include crops with reasonable match score
    if (matchScore >= 30) {
      recommendations.push({
        crop,
        matchScore,
        reasons,
        warnings,
        optimalityDetails: {
          nitrogen: nitrogenMatch,
          phosphorus: phosphorusMatch,
          potassium: potassiumMatch,
          ph: phMatch,
          temperature: temperatureMatch,
          humidity: humidityMatch,
          region: regionMatch,
        },
      });
    }
  }

  // Sort by match score descending
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};

// Get top N recommendations
export const getTopRecommendations = (
  input: RecommendationInput,
  count: number = 6
): CropRecommendation[] => {
  return getRecommendations(input).slice(0, count);
};

// Get recommendations filtered by category
export const getRecommendationsByCategory = (
  input: RecommendationInput,
  category: CropData['category']
): CropRecommendation[] => {
  return getRecommendations(input).filter(r => r.crop.category === category);
};
