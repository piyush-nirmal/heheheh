import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { FarmLocation, SoilReading } from '@/contexts/AppContext';

// --- Types ---
export interface LandRecord {
    id: string;
    userId?: string;
    district: string;
    taluka: string;
    village: string;
    surveyNumber: string;
    subdivision?: string;
    ownerName: string;
    area?: string;
    createdAt: string;
}

// --- Locations ---
export const saveLocationToDb = async (userId: string, location: Omit<FarmLocation, 'id' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'locations'), {
            userId,
            ...location,
            createdAt: Timestamp.now()
        });
        return { id: docRef.id, ...location, createdAt: new Date().toISOString() } as FarmLocation;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getUserLocations = async (userId: string): Promise<FarmLocation[]> => {
    const q = query(collection(db, 'locations'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            coordinates: data.coordinates,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as FarmLocation;
    });
};

export const deleteLocationFromDb = async (locationId: string) => {
    await deleteDoc(doc(db, 'locations', locationId));
};


// --- Soil Data ---
export const saveSoilDataToDb = async (userId: string, reading: Omit<SoilReading, 'id' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'soil_readings'), {
            userId,
            ...reading,
            createdAt: Timestamp.now()
        });
        return { id: docRef.id, ...reading, createdAt: new Date().toISOString() } as SoilReading;
    } catch (e) {
        throw e;
    }
};

export const getUserSoilData = async (userId: string): Promise<SoilReading[]> => {
    const q = query(collection(db, 'soil_readings'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            locationId: data.locationId,
            data: data.data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as SoilReading;
    });
};

// --- Land Records (7/12) ---
export const saveLandRecordToDb = async (userId: string, record: Omit<LandRecord, 'id' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'land_records'), {
            userId,
            ...record,
            createdAt: Timestamp.now()
        });
        return { id: docRef.id, ...record, createdAt: new Date().toISOString() } as LandRecord;
    } catch (e) {
        throw e;
    }
};

export const getUserLandRecords = async (userId: string): Promise<LandRecord[]> => {
    const q = query(collection(db, 'land_records'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            district: data.district,
            taluka: data.taluka,
            village: data.village,
            surveyNumber: data.surveyNumber,
            subdivision: data.subdivision,
            ownerName: data.ownerName,
            area: data.area,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
        } as LandRecord;
    });
};

export const deleteLandRecordFromDb = async (id: string) => {
    await deleteDoc(doc(db, 'land_records', id));
};
