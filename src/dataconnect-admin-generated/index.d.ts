import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'AdminListAllProperties' Query. Allow users to execute without passing in DataConnect. */
export function adminListAllProperties(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<AdminListAllPropertiesData>>;
/** Generated Node Admin SDK operation action function for the 'AdminListAllProperties' Query. Allow users to pass in custom DataConnect instances. */
export function adminListAllProperties(options?: OperationOptions): Promise<ExecuteOperationResponse<AdminListAllPropertiesData>>;

/** Generated Node Admin SDK operation action function for the 'GetPropertyDashboard' Query. Allow users to execute without passing in DataConnect. */
export function getPropertyDashboard(dc: DataConnect, vars: GetPropertyDashboardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPropertyDashboardData>>;
/** Generated Node Admin SDK operation action function for the 'GetPropertyDashboard' Query. Allow users to pass in custom DataConnect instances. */
export function getPropertyDashboard(vars: GetPropertyDashboardVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPropertyDashboardData>>;

/** Generated Node Admin SDK operation action function for the 'CreateBooking' Mutation. Allow users to execute without passing in DataConnect. */
export function createBooking(dc: DataConnect, vars: CreateBookingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBookingData>>;
/** Generated Node Admin SDK operation action function for the 'CreateBooking' Mutation. Allow users to pass in custom DataConnect instances. */
export function createBooking(vars: CreateBookingVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateBookingData>>;

