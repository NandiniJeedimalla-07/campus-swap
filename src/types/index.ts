export interface User {
  id: string;
  email: string;
  name: string;
  collegeId: string;
  phone: string;
  role: 'buyer' | 'seller' | null;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerContact: string;
  availability: boolean;
  quantity: number;
  createdAt: Date;
}

export interface FreeItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerContact: string;
  availability: boolean;
  quantity: number;
  freeDays: number;
  createdAt: Date;
}

export interface RentalRequest {
  id: string;
  itemId: string;
  itemName: string;
  buyerId: string;
  buyerName: string;
  buyerContact: string;
  sellerId: string;
  requestedQuantity: number;
  durationDays: number; // Added duration
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Rental {
  id: string;
  itemId: string;
  itemName: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  pricePerDay: number;
  status: 'pending' | 'active' | 'returned';
  startDate: Date;
  endDate: Date; // Now required
}

export type Category =
  | 'Books'
  | 'Electronics'
  | 'Lab Equipment'
  | 'Sports'
  | 'Clothing'
  | 'Stationery'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Sports',
  'Clothing',
  'Stationery',
  'Other'
];

// Import images for demo items
import calculatorImg from '@/assets/calculator.png';
import labCoatImg from '@/assets/lab-coat.png';
import draftingSetImg from '@/assets/drafting-set.png';
import geometryBoxImg from '@/assets/geometry-box.png';

// Demo items for display
export const DEMO_ITEMS: Omit<Item, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerContact'>[] = [
  {
    name: 'Scientific Calculator',
    description: 'Casio FX-991EX scientific calculator, perfect for engineering students',
    pricePerDay: 15,
    category: 'Electronics',
    images: [calculatorImg],
    availability: true,
    quantity: 3,
  },
  {
    name: 'Drafting Set',
    description: 'Complete engineering drafting set with compass, ruler, and protractor',
    pricePerDay: 10,
    category: 'Stationery',
    images: [draftingSetImg],
    availability: true,
    quantity: 5,
  },
  {
    name: 'Lab Coat',
    description: 'White lab coat, size M, clean and well-maintained',
    pricePerDay: 20,
    category: 'Lab Equipment',
    images: [labCoatImg],
    availability: true,
    quantity: 2,
  },
  {
    name: 'Geometry Box',
    description: 'Complete geometry box with compass, protractor, and rulers',
    pricePerDay: 5,
    category: 'Stationery',
    images: [geometryBoxImg],
    availability: true,
    quantity: 8,
  },
];

export const DEMO_FREE_ITEMS: Omit<FreeItem, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerContact'>[] = [
  {
    name: 'Ruled Notebook',
    description: 'Brand new ruled notebook, perfect for class notes',
    category: 'Stationery',
    images: [geometryBoxImg],
    availability: true,
    quantity: 5,
    freeDays: 7,
  },
  {
    name: 'Engineering Textbooks',
    description: 'Collection of previous year engineering textbooks, free to borrow',
    category: 'Books',
    images: [draftingSetImg],
    availability: true,
    quantity: 10,
    freeDays: 30,
  },
];
