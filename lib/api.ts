import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
    checkHealth: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/health`);
            return res.ok;
        } catch {
            return false;
        }
    },

    bookings: {
        create: async (data: {
            roomId?: string; // The ID of the room
            roomNumber?: string;
            guestName: string;
            checkIn: string; // ISO Date string
            checkOut: string; // ISO Date string
            numberOfGuests: number;
            dailyRate: number;
        }) => {
            return authenticatedFetch('/bookings', data);
        }
    },

    properties: {
        create: async (data: { name: string; address: string }) => {
            return authenticatedFetch('/properties', data);
        },
        list: async () => {
            // For Admin Property Selector
            return authenticatedFetch('/properties', undefined, 'GET');
        },
        getDashboard: async (id: string) => {
            // For the main dashboard view
            // Returns { property, rooms, bookings, etc } (DashboardDTO)
            return authenticatedFetch(`/properties/${id}/dashboard`, undefined, 'GET');
        },
        update: async (id: string, data: any) => {
            return authenticatedFetch(`/properties/${id}`, data, 'PUT');
        }
    },

    rooms: {
        create: async (data: {
            propertyId: string;
            roomNumber: string;
            roomType: string;
            floor: number;
            price: number;
            capacity?: number;
        }) => {
            return authenticatedFetch('/rooms', data);
        },

        update: async (id: string, data: {
            status?: string;
            type?: string;
            floor?: number;
            price?: number;
        }) => {
            return authenticatedFetch(`/rooms/${id}`, data, 'PUT');
        }
    },

    users: {
        create: async (data: {
            email: string;
            password: string; // Only sent to backend, not stored there (handled by Firebase Admin)
            name: string;
            role: string;
            propertyId: string;
        }) => {
            return authenticatedFetch('/users', data);
        },
        getMe: async (uid: string) => {
            return authenticatedFetch(`/users/${uid}`, undefined, 'GET');
        }
    }
};

// Helper for authenticated requests
const authenticatedFetch = async (endpoint: string, data: any, method = 'POST') => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();

    const options: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed request to ${endpoint}`);
    }

    return response.json();
};
