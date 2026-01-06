import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AdminListAllPropertiesData {
  properties: ({
    id: UUIDString;
    name: string;
    address?: string | null;
    users: ({
      email: string;
      role: string;
    })[];
  } & Property_Key)[];
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  propertyId: UUIDString;
  guestName: string;
  checkIn: DateString;
  checkOut: DateString;
}

export interface GetPropertyDashboardData {
  property?: {
    name: string;
    address?: string | null;
  };
    bookings: ({
      id: UUIDString;
      guestName: string;
      status: string;
      checkInDate: DateString;
      checkOutDate: DateString;
      room?: {
        roomNumber: string;
      };
    } & Booking_Key)[];
      rooms: ({
        id: UUIDString;
        roomNumber: string;
        status?: string | null;
      } & Room_Key)[];
}

export interface GetPropertyDashboardVariables {
  propertyId: UUIDString;
}

export interface Property_Key {
  id: UUIDString;
  __typename?: 'Property_Key';
}

export interface Room_Key {
  id: UUIDString;
  __typename?: 'Room_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface AdminListAllPropertiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllPropertiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListAllPropertiesData, undefined>;
  operationName: string;
}
export const adminListAllPropertiesRef: AdminListAllPropertiesRef;

export function adminListAllProperties(): QueryPromise<AdminListAllPropertiesData, undefined>;
export function adminListAllProperties(dc: DataConnect): QueryPromise<AdminListAllPropertiesData, undefined>;

interface GetPropertyDashboardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyDashboardVariables): QueryRef<GetPropertyDashboardData, GetPropertyDashboardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPropertyDashboardVariables): QueryRef<GetPropertyDashboardData, GetPropertyDashboardVariables>;
  operationName: string;
}
export const getPropertyDashboardRef: GetPropertyDashboardRef;

export function getPropertyDashboard(vars: GetPropertyDashboardVariables): QueryPromise<GetPropertyDashboardData, GetPropertyDashboardVariables>;
export function getPropertyDashboard(dc: DataConnect, vars: GetPropertyDashboardVariables): QueryPromise<GetPropertyDashboardData, GetPropertyDashboardVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

