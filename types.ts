
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  STAFF = 'STAFF',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  DIRTY = 'DIRTY',
  MAINTENANCE = 'MAINTENANCE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  propertyId: string | null;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
}

export interface Room {
  id: string;
  number: string;
  type: 'Single' | 'Double' | 'Suite' | 'Penthouse';
  floor: number;
  status: RoomStatus;
  guestName?: string;
  checkoutDate?: string;
}

export interface GuestDocument {
  id: string;
  type: 'ID Card' | 'Passport' | 'Driver License' | 'Invoice' | 'Receipt' | 'Other';
  fileName: string;
  uploadDate: string;
  amount?: number; // Added for financial documents
  referenceId?: string;
}

export interface GuestHistory {
  id: string;
  stayDate: string;
  roomNumber: string;
  amount: number;
  status: 'Completed' | 'Cancelled' | 'Active';
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  totalStays: number;
  lifetimeSpend: number;
  status: 'Regular' | 'VIP' | 'Restricted';
  documents: GuestDocument[];
  history: GuestHistory[];
  isDNR: boolean;
  dnrReason?: string;
  photoUrl?: string;
}

export interface Booking {
  id: string;
  guestId?: string; // Linked for automated doc creation
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  totalAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: 'Revenue' | 'Expense';
  amount: number;
  status: 'Pending' | 'Cleared';
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: string;
  status: 'Completed' | 'Active' | 'On-Break';
}
