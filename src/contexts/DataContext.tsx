import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, FreeItem, RentalRequest, Rental, DEMO_ITEMS, DEMO_FREE_ITEMS } from '@/types';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

interface DataContextType {
  items: Item[];
  freeItems: FreeItem[];
  requests: RentalRequest[];
  rentals: Rental[];
  loading: boolean;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  addFreeItem: (item: Omit<FreeItem, 'id' | 'createdAt'>) => Promise<void>;
  updateFreeItem: (id: string, updates: Partial<FreeItem>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void; // Added missing updateItem
  deleteItem: (id: string) => Promise<void>;
  deleteFreeItem: (id: string) => Promise<void>;
  createRequest: (request: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>) => void; // Keeping requests local/mock for now as backend doesn't support yet
  updateRequest: (id: string, status: 'accepted' | 'rejected') => void;
  getSellerItems: (sellerId: string) => Item[];
  getSellerFreeItems: (sellerId: string) => FreeItem[];
  getSellerRequests: (sellerId: string) => RentalRequest[];
  getBuyerRentals: (buyerId: string) => Rental[];
  cleanupNonSvecwData: () => Promise<{ deletedUsers: number; deletedItems: number }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initialize demo items with fake seller info
const initializeDemoItems = (): Item[] => {
  return DEMO_ITEMS.map((item, index) => ({
    ...item,
    id: `demo-${index}`,
    sellerId: 'demo-seller',
    sellerName: 'Campus Store',
    sellerContact: '+91 9876543210',
    createdAt: new Date(),
  }));
};

const initializeDemoFreeItems = (): FreeItem[] => {
  return DEMO_FREE_ITEMS.map((item, index) => ({
    ...item,
    id: `demo-free-${index}`,
    sellerId: 'demo-seller',
    sellerName: 'Campus Library',
    sellerContact: '+91 9876543210',
    createdAt: new Date(),
  }));
};



export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [freeItems, setFreeItems] = useState<FreeItem[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  // Use auth context if available, otherwise fallback (we'll assume auth wrapper handles waiting)
  const currentUserId = auth.currentUser?.uid;

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Items
      const itemsSnapshot = await getDocs(collection(db, 'items'));
      const fetchedItems: Item[] = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Item));
      setItems(fetchedItems);

      // Fetch Free Items
      const freeItemsSnapshot = await getDocs(collection(db, 'freeItems'));
      const fetchedFreeItems: FreeItem[] = freeItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FreeItem));
      setFreeItems(fetchedFreeItems);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Load local storage for requests/rentals as they aren't in backend yet
    // NOTE: In a full app, these should also be in Firestore 'requests' and 'rentals' collections.
    const storedRequests = localStorage.getItem('uniswap_requests');
    const storedRentals = localStorage.getItem('uniswap_rentals');
    if (storedRequests) setRequests(JSON.parse(storedRequests));
    if (storedRentals) setRentals(JSON.parse(storedRentals));
  }, []);

  /* Removed saveItems helpers for Items, but need them for Request/Rentals as they are local-only for now */
  const saveRequests = (newRequests: RentalRequest[]) => {
    setRequests(newRequests);
    localStorage.setItem('uniswap_requests', JSON.stringify(newRequests));
  };

  const saveRentals = (newRentals: Rental[]) => {
    setRentals(newRentals);
    localStorage.setItem('uniswap_rentals', JSON.stringify(newRentals));
  };

  const addItem = async (item: Omit<Item, 'id' | 'createdAt'>) => {
    try {
      const newItem = {
        ...item,
        createdAt: new Date(), // Firestore will convert this to Timestamp, we might need a converter or simple cast
        sellerId: auth.currentUser?.uid || 'unknown', // Enforce real seller ID
      };
      const docRef = await addDoc(collection(db, 'items'), newItem);

      // Update local state
      setItems(prev => [...prev, { ...newItem, id: docRef.id } as any]);
    } catch (e) {
      console.error("Error adding item:", e);
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
      await updateDoc(doc(db, 'items', id), updates);
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    } catch (e) {
      console.error("Error updating item:", e);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error("Error deleting item:", e);
    }
  };

  const addFreeItem = async (item: Omit<FreeItem, 'id' | 'createdAt'>) => {
    try {
      const newItem = {
        ...item,
        createdAt: new Date(),
        sellerId: auth.currentUser?.uid || 'unknown',
      };
      const docRef = await addDoc(collection(db, 'freeItems'), newItem);

      // Update local state
      setFreeItems(prev => [...prev, { ...newItem, id: docRef.id } as any]);
    } catch (e) {
      console.error("Error adding free item:", e);
    }
  };

  const updateFreeItem = async (id: string, updates: Partial<FreeItem>) => {
    try {
      await updateDoc(doc(db, 'freeItems', id), updates);
      setFreeItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    } catch (e) {
      console.error("Error updating free item:", e);
    }
  };

  const deleteFreeItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'freeItems', id));
      setFreeItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error("Error deleting free item:", e);
    }
  };

  const cleanupNonSvecwData = async () => {
    try {
      console.log("Starting data cleanup...");
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const invalidUserIds: string[] = [];
      let deletedUsers = 0;
      let deletedItems = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.email && !userData.email.endsWith('@svecw.edu.in')) {
          invalidUserIds.push(userDoc.id);
          await deleteDoc(doc(db, 'users', userDoc.id));
          deletedUsers++;
        }
      }

      if (invalidUserIds.length > 0) {
        // Delete items from invalid users
        const itemsSnapshot = await getDocs(collection(db, 'items'));
        for (const itemDoc of itemsSnapshot.docs) {
          const itemData = itemDoc.data();
          if (invalidUserIds.includes(itemData.sellerId)) {
            await deleteDoc(doc(db, 'items', itemDoc.id));
            deletedItems++;
          }
        }

        // Delete free items from invalid users
        const freeItemsSnapshot = await getDocs(collection(db, 'freeItems'));
        for (const freeDoc of freeItemsSnapshot.docs) {
          const freeData = freeDoc.data();
          if (invalidUserIds.includes(freeData.sellerId)) {
            await deleteDoc(doc(db, 'freeItems', freeDoc.id));
            deletedItems++;
          }
        }
      }

      console.log(`Cleanup complete: ${deletedUsers} users and ${deletedItems} items deleted.`);
      fetchData(); // Refresh local list
      return { deletedUsers, deletedItems };
    } catch (error) {
      console.error("Cleanup failed", error);
      return { deletedUsers: 0, deletedItems: 0 };
    }
  };

  const createRequest = (request: Omit<RentalRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: RentalRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    };
    // In future: addDoc(collection(db, 'requests'), newRequest)
    saveRequests([...requests, newRequest]);
  };

  const updateRequest = (id: string, status: 'accepted' | 'rejected') => {
    const request = requests.find(r => r.id === id);
    if (request && status === 'accepted') {
      const item = items.find(i => i.id === request.itemId);
      if (item) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (request.durationDays || 1));

        const newRental: Rental = {
          id: Date.now().toString(),
          itemId: request.itemId,
          itemName: request.itemName,
          buyerId: request.buyerId,
          sellerId: request.sellerId,
          quantity: request.requestedQuantity,
          pricePerDay: item.pricePerDay,
          status: 'active',
          startDate,
          endDate,
        };
        saveRentals([...rentals, newRental]);

        // We update the item quantity in Firestore
        updateItem(request.itemId, {
          quantity: item.quantity - request.requestedQuantity,
          availability: item.quantity - request.requestedQuantity > 0,
        });
      }
    }
    saveRequests(requests.map(r =>
      r.id === id ? { ...r, status } : r
    ));
  };

  const getSellerItems = (sellerId: string) =>
    items.filter(item => item.sellerId === sellerId);

  const getSellerFreeItems = (sellerId: string) =>
    freeItems.filter(item => item.sellerId === sellerId);

  const getSellerRequests = (sellerId: string) =>
    requests.filter(request => request.sellerId === sellerId);

  const getBuyerRentals = (buyerId: string) =>
    rentals.filter(rental => rental.buyerId === buyerId);

  return (
    <DataContext.Provider value={{
      items,
      freeItems,
      requests,
      rentals,
      loading,
      addItem,
      updateItem,
      deleteItem,
      addFreeItem,
      updateFreeItem,
      deleteFreeItem,
      createRequest,
      updateRequest,
      getSellerItems,
      getSellerFreeItems,
      getSellerRequests,
      getBuyerRentals,
      cleanupNonSvecwData,
    }}>
      {children}
    </DataContext.Provider>
  );
};
