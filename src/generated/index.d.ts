import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AdminListPropertiesData {
  properties: ({
    id: UUIDString;
    name: string;
    address?: string | null;
    email?: string | null;
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

export interface CreatePropertyData {
  property_insert: Property_Key;
}

export interface CreatePropertyVariables {
  name: string;
  address?: string | null;
}

export interface CreateRoomData {
  room_insert: Room_Key;
}

export interface CreateRoomEntryData {
  room_insert: Room_Key;
}

export interface CreateRoomEntryVariables {
  roomNumber: string;
  roomType: string;
  floor?: number | null;
  roomStatus?: string | null;
  capacity?: number | null;
  price?: number | null;
  propertyId: UUIDString;
}

export interface CreateRoomVariables {
  propertyId: UUIDString;
  roomNumber: string;
  roomType: string;
  floor?: number | null;
  price?: number | null;
  status?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  email: string;
  role: string;
  name?: string | null;
  propertyId?: UUIDString | null;
  status?: string | null;
}

export interface GetPropertyDashboardData {
  property?: {
    id: UUIDString;
    name: string;
    address?: string | null;
  } & Property_Key;
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
        roomType: string;
        floor?: number | null;
        roomStatus?: string | null;
        price?: number | null;
      } & Room_Key)[];
        users: ({
          id: string;
          email: string;
          role: string;
          name?: string | null;
          pin?: string | null;
          status?: string | null;
        } & User_Key)[];
}

export interface GetPropertyDashboardVariables {
  propertyId: UUIDString;
}

export interface LinkUserToPropertyData {
  user_update?: User_Key | null;
}

export interface LinkUserToPropertyVariables {
  id: string;
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

export interface UpdatePropertyData {
  property_update?: Property_Key | null;
}

export interface UpdatePropertyVariables {
  id: UUIDString;
  name?: string | null;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface UpdateRoomData {
  room_update?: Room_Key | null;
}

export interface UpdateRoomVariables {
  id: UUIDString;
  status?: string | null;
  type?: string | null;
  floor?: number | null;
  number?: string | null;
}

export interface UpdateUserStatusData {
  user_update?: User_Key | null;
}

export interface UpdateUserStatusVariables {
  id: string;
  status: string;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  id: string;
  email: string;
  role: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateRoomEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomEntryVariables): MutationRef<CreateRoomEntryData, CreateRoomEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRoomEntryVariables): MutationRef<CreateRoomEntryData, CreateRoomEntryVariables>;
  operationName: string;
}
export const createRoomEntryRef: CreateRoomEntryRef;

export function createRoomEntry(vars: CreateRoomEntryVariables): MutationPromise<CreateRoomEntryData, CreateRoomEntryVariables>;
export function createRoomEntry(dc: DataConnect, vars: CreateRoomEntryVariables): MutationPromise<CreateRoomEntryData, CreateRoomEntryVariables>;

interface AdminListPropertiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListPropertiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AdminListPropertiesData, undefined>;
  operationName: string;
}
export const adminListPropertiesRef: AdminListPropertiesRef;

export function adminListProperties(): QueryPromise<AdminListPropertiesData, undefined>;
export function adminListProperties(dc: DataConnect): QueryPromise<AdminListPropertiesData, undefined>;

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

interface UpdatePropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
  operationName: string;
}
export const updatePropertyRef: UpdatePropertyRef;

export function updateProperty(vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;
export function updateProperty(dc: DataConnect, vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface UpdateUserStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
  operationName: string;
}
export const updateUserStatusRef: UpdateUserStatusRef;

export function updateUserStatus(vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;
export function updateUserStatus(dc: DataConnect, vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface UpdateRoomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
  operationName: string;
}
export const updateRoomRef: UpdateRoomRef;

export function updateRoom(vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;
export function updateRoom(dc: DataConnect, vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface CreateRoomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
  operationName: string;
}
export const createRoomRef: CreateRoomRef;

export function createRoom(vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;
export function createRoom(dc: DataConnect, vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface CreatePropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
  operationName: string;
}
export const createPropertyRef: CreatePropertyRef;

export function createProperty(vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;
export function createProperty(dc: DataConnect, vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface LinkUserToPropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LinkUserToPropertyVariables): MutationRef<LinkUserToPropertyData, LinkUserToPropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LinkUserToPropertyVariables): MutationRef<LinkUserToPropertyData, LinkUserToPropertyVariables>;
  operationName: string;
}
export const linkUserToPropertyRef: LinkUserToPropertyRef;

export function linkUserToProperty(vars: LinkUserToPropertyVariables): MutationPromise<LinkUserToPropertyData, LinkUserToPropertyVariables>;
export function linkUserToProperty(dc: DataConnect, vars: LinkUserToPropertyVariables): MutationPromise<LinkUserToPropertyData, LinkUserToPropertyVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

