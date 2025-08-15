import React, { createContext, useContext, useMemo, FC, PropsWithChildren, useState, useEffect } from 'react';
import { Settings, Charge, ProcessedCharge, Vehicle } from '../types';
import { processCharges } from '../utils/calculations';
import { vehicles as defaultVehicles } from '../data/vehicleData';
import { db } from '../firebase/config';

interface AppContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  charges: ProcessedCharge[];
  addCharge: (charge: Omit<Charge, 'id'>) => void;
  deleteCharge: (id: string) => void;
  importCharges: (charges: Omit<Charge, 'id'>[]) => Promise<{ addedCount: number; skippedCount: number }>;
  vehicles: Vehicle[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  recapEmail: '',
  batteryCapacity: 52,
  pricePeak: 0.2516,
  priceOffPeak: 0.1828,
  priceTempoBluePeak: 0.1798,
  priceTempoBlueOffPeak: 0.1296,
  priceTempoWhitePeak: 0.3022,
  priceTempoWhiteOffPeak: 0.1486,
  priceTempoRedPeak: 0.7562,
  priceTempoRedOffPeak: 0.1526,
};

// AppProvider now requires a userId to interact with Firestore
export const AppProvider: FC<PropsWithChildren<{ userId: string }>> = ({ children, userId }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [rawCharges, setRawCharges] = useState<Charge[]>([]);
  const [vehicles] = useState<Vehicle[]>(defaultVehicles);

  useEffect(() => {
    if (!userId) {
      setSettings(defaultSettings);
      setRawCharges([]);
      return;
    }

    const userDocRef = db.collection('users').doc(userId);

    // Listener for settings
    const settingsDocRef = userDocRef.collection('settings').doc('main');
    const unsubscribeSettings = settingsDocRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        setSettings(docSnap.data() as Settings);
      } else {
        // If no settings, create with defaults
        settingsDocRef.set(defaultSettings, { merge: true });
        setSettings(defaultSettings);
      }
    });

    // Listener for charges
    const chargesColRef = userDocRef.collection('charges');
    const q = chargesColRef.orderBy('odometer');
    const unsubscribeCharges = q.onSnapshot((snapshot) => {
      const chargesFromDb = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Charge[];
      setRawCharges(chargesFromDb);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeCharges();
    };
  }, [userId]);


  const updateSettings = async (newSettings: Partial<Settings>) => {
    const settingsDocRef = db.collection('users').doc(userId).collection('settings').doc('main');
    await settingsDocRef.set(newSettings, { merge: true });
  };

  const addCharge = async (chargeData: Omit<Charge, 'id'>) => {
    const chargesColRef = db.collection('users').doc(userId).collection('charges');
    await chargesColRef.add(chargeData);
  };
  
  const deleteCharge = async (id: string) => {
    const chargeDocRef = db.collection('users').doc(userId).collection('charges').doc(id);
    await chargeDocRef.delete();
  }

  const importCharges = async (chargesToImport: Omit<Charge, 'id'>[]): Promise<{ addedCount: number; skippedCount: number }> => {
    const existingOdometerSet = new Set(rawCharges.map(c => c.odometer));
    const uniqueNewCharges: Omit<Charge, 'id'>[] = [];

    for (const newCharge of chargesToImport) {
        if (!existingOdometerSet.has(newCharge.odometer)) {
            uniqueNewCharges.push(newCharge);
            existingOdometerSet.add(newCharge.odometer);
        }
    }
    
    const addedCount = uniqueNewCharges.length;
    const skippedCount = chargesToImport.length - addedCount;

    if (addedCount > 0) {
        const batch = db.batch();
        const chargesColRef = db.collection('users').doc(userId).collection('charges');
        uniqueNewCharges.forEach(chargeData => {
            const newDocRef = chargesColRef.doc(); // Create new doc with auto-ID
            batch.set(newDocRef, chargeData);
        });
        await batch.commit();
    }
    
    return { addedCount, skippedCount };
  };

  const processedCharges = useMemo(() => processCharges(rawCharges, settings), [rawCharges, settings]);

  const value = {
    settings,
    updateSettings,
    charges: processedCharges,
    addCharge,
    deleteCharge,
    importCharges,
    vehicles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
