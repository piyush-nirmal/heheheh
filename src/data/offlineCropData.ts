export interface OfflineCropGuide {
    name: string;
    scientificName?: string;
    season: 'Rabi' | 'Kharif' | 'Zaid' | 'All Season';
    fertilizer: {
        basal: string;
        topDressing: string;
    };
    pests: {
        symptom: string;
        solution: string;
        organic: string;
    }[];
    harvesting: string;
}

export const offlineCropData: Record<string, OfflineCropGuide> = {
    wheat: {
        name: "Wheat (Gehu)",
        season: "Rabi",
        fertilizer: {
            basal: "DAP 50kg/acre + Potash 20kg/acre at sowing.",
            topDressing: "Urea 40kg/acre at 21 days (CRI stage) and 45 days."
        },
        pests: [
            {
                symptom: "Yellow rust / stripes on leaves",
                solution: "Spray Propiconazole 25 EC @ 1ml/liter water.",
                organic: "Spray 5% Neem extract."
            }
        ],
        harvesting: "Harvest when grain is hard and moisture is < 12%. Usually March-April."
    },
    rice: {
        name: "Rice (Paddy/Dhan)",
        season: "Kharif",
        fertilizer: {
            basal: "DAP 35kg + MOP 20kg + Zinc 10kg per acre.",
            topDressing: "Urea 30kg/acre at tillering and panicle initiation."
        },
        pests: [
            {
                symptom: "Stem Borer (Dead heart)",
                solution: "Apply Cartap Hydro chloride 4G @ 8kg/acre.",
                organic: "Install pheromone traps (5/acre)."
            }
        ],
        harvesting: "Harvest when 80% panicles turn golden yellow."
    },
    tomato: {
        name: "Tomato",
        season: "All Season",
        fertilizer: {
            basal: "FYM 10 tons + NPK 19:19:19 50kg/acre.",
            topDressing: "Calcium Nitrate 10kg/acre during fruiting."
        },
        pests: [
            {
                symptom: "Leaf Curl Virus (Curled leaves)",
                solution: "Control whitefly using Imidacloprid @ 0.5ml interaction.",
                organic: "Yellow sticky traps."
            }
        ],
        harvesting: "Pick fruits at breaker stage for transport."
    },
    maize: {
        name: "Maize (Makka)",
        season: "Kharif",
        fertilizer: {
            basal: "DAP 50kg + Zinc 10kg per acre.",
            topDressing: "Urea 40kg/acre at knee-high stage."
        },
        pests: [
            {
                symptom: "Armyworm (Leaves eaten)",
                solution: "Emamectin Benzoate @ 0.4g/liter.",
                organic: "Metarhizium anisopliae spray."
            }
        ],
        harvesting: "Harvest when cob husk turns dry and pale yellow."
    },
    cotton: {
        name: "Cotton (Kapas)",
        season: "Kharif",
        fertilizer: {
            basal: "DAP 50kg/acre.",
            topDressing: "Urea in 3 splits (sowing, square formation, flowering)."
        },
        pests: [
            {
                symptom: "Pink Bollworm",
                solution: "Profenofos @ 2ml/liter.",
                organic: "Light traps and IPM."
            }
        ],
        harvesting: "Pick fully opened bolls early morning to avoid trash."
    }
};

export const QUICK_QUESTIONS = {
    en: ["Fertilizer for Wheat?", "Tomato leaf curl remedy", "Rice planting time", "Cotton pest control"],
    hi: ["गेहूं के लिए खाद?", "टमाटर पत्ती मरोड़ उपाय", "धान की बुवाई कब करें?", "कपास कीट नियंत्रण"],
    mr: ["गव्हासाठी खत?", "टोमॅटोवरील रोगाचे उपाय", "भात लावणीची वेळ", "कापूस कीड नियंत्रण"]
};
