export interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

const API_KEY = '579b464db66ec23bdd00000163933cdcd53f4f84786c03761ba976e3';
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

// Simple helper to assign categories based on commodity name
const getCategory = (commodity: string) => {
  const name = commodity.toLowerCase();
  if (name.includes('wheat') || name.includes('rice') || name.includes('jowar') || name.includes('bajra') || name.includes('maize') || name.includes('paddy')) return 'Cereals';
  if (name.includes('dal') || name.includes('gram') || name.includes('moong') || name.includes('urad') || name.includes('lentil') || name.includes('arhar')) return 'Pulses';
  if (name.includes('onion') || name.includes('tomato') || name.includes('potato') || name.includes('cabbage') || name.includes('brinjal') || name.includes('garlic')) return 'Vegetables';
  if (name.includes('apple') || name.includes('banana') || name.includes('mango') || name.includes('grapes') || name.includes('pomegranate')) return 'Fruits';
  if (name.includes('soyabean') || name.includes('cotton') || name.includes('mustard') || name.includes('groundnut') || name.includes('castor')) return 'Oilseeds';
  if (name.includes('turmeric') || name.includes('chilly') || name.includes('coriander') || name.includes('cumin')) return 'Spices';
  return 'Other';
};

export const fetchMandiPrices = async (stateName = 'Maharashtra', limit = 150) => {
  try {
    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=${limit}`;
    
    if (stateName) {
        url += `&filters[state]=${encodeURIComponent(stateName)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.records) {
        return data.records.map((record: MandiRecord, index: number) => ({
            id: index,
            commodity: record.commodity,
            variety: record.variety,
            market: record.market,
            price: parseFloat(record.modal_price) || 0,
            // We don't have yesterday's price in this single call, so we mock a realistic 24h change
            change: parseFloat(((Math.random() * 6) - 3).toFixed(1)), 
            date: record.arrival_date,
            category: getCategory(record.commodity),
            state: record.state,
            district: record.district
        }));
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch Mandi prices:", error);
    return [];
  }
};
