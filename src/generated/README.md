# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*AdminListProperties*](#adminlistproperties)
  - [*GetPropertyDashboard*](#getpropertydashboard)
- [**Mutations**](#mutations)
  - [*CreateBooking*](#createbooking)
  - [*UpdateProperty*](#updateproperty)
  - [*UpdateUserStatus*](#updateuserstatus)
  - [*UpdateRoom*](#updateroom)
  - [*CreateRoom*](#createroom)
  - [*CreateProperty*](#createproperty)
  - [*LinkUserToProperty*](#linkusertoproperty)
  - [*CreateUser*](#createuser)
  - [*UpsertUser*](#upsertuser)
  - [*CreateRoomEntry*](#createroomentry)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## AdminListProperties
You can execute the `AdminListProperties` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
adminListProperties(): QueryPromise<AdminListPropertiesData, undefined>;

interface AdminListPropertiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListPropertiesData, undefined>;
}
export const adminListPropertiesRef: AdminListPropertiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListProperties(dc: DataConnect): QueryPromise<AdminListPropertiesData, undefined>;

interface AdminListPropertiesRef {
  ...
  (dc: DataConnect): QueryRef<AdminListPropertiesData, undefined>;
}
export const adminListPropertiesRef: AdminListPropertiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListPropertiesRef:
```typescript
const name = adminListPropertiesRef.operationName;
console.log(name);
```

### Variables
The `AdminListProperties` query has no variables.
### Return Type
Recall that executing the `AdminListProperties` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListPropertiesData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AdminListPropertiesData {
  properties: ({
    id: UUIDString;
    name: string;
    address?: string | null;
    email?: string | null;
  } & Property_Key)[];
    rooms: ({
      id: UUIDString;
      propertyId: UUIDString;
      roomStatus?: string | null;
    } & Room_Key)[];
      bookings: ({
        id: UUIDString;
        propertyId: UUIDString;
        status: string;
      } & Booking_Key)[];
}
```
### Using `AdminListProperties`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListProperties } from '@firebasegen/default';


// Call the `adminListProperties()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListProperties();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListProperties(dataConnect);

console.log(data.properties);
console.log(data.rooms);
console.log(data.bookings);

// Or, you can use the `Promise` API.
adminListProperties().then((response) => {
  const data = response.data;
  console.log(data.properties);
  console.log(data.rooms);
  console.log(data.bookings);
});
```

### Using `AdminListProperties`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListPropertiesRef } from '@firebasegen/default';


// Call the `adminListPropertiesRef()` function to get a reference to the query.
const ref = adminListPropertiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListPropertiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.properties);
console.log(data.rooms);
console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.properties);
  console.log(data.rooms);
  console.log(data.bookings);
});
```

## GetPropertyDashboard
You can execute the `GetPropertyDashboard` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
getPropertyDashboard(vars: GetPropertyDashboardVariables): QueryPromise<GetPropertyDashboardData, GetPropertyDashboardVariables>;

interface GetPropertyDashboardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPropertyDashboardVariables): QueryRef<GetPropertyDashboardData, GetPropertyDashboardVariables>;
}
export const getPropertyDashboardRef: GetPropertyDashboardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPropertyDashboard(dc: DataConnect, vars: GetPropertyDashboardVariables): QueryPromise<GetPropertyDashboardData, GetPropertyDashboardVariables>;

interface GetPropertyDashboardRef {
  ...
  (dc: DataConnect, vars: GetPropertyDashboardVariables): QueryRef<GetPropertyDashboardData, GetPropertyDashboardVariables>;
}
export const getPropertyDashboardRef: GetPropertyDashboardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPropertyDashboardRef:
```typescript
const name = getPropertyDashboardRef.operationName;
console.log(name);
```

### Variables
The `GetPropertyDashboard` query requires an argument of type `GetPropertyDashboardVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPropertyDashboardVariables {
  propertyId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPropertyDashboard` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertyDashboardData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPropertyDashboardData {
  property?: {
    id: UUIDString;
    name: string;
    address?: string | null;
  } & Property_Key;
    bookings: ({
      id: UUIDString;
      guestName: string;
      guestEmail?: string | null;
      guestPhone?: string | null;
      numberOfGuests?: number | null;
      dailyRate?: number | null;
      currentStayTotalAmount?: number | null;
      amountPaid?: number | null;
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
```
### Using `GetPropertyDashboard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPropertyDashboard, GetPropertyDashboardVariables } from '@firebasegen/default';

// The `GetPropertyDashboard` query requires an argument of type `GetPropertyDashboardVariables`:
const getPropertyDashboardVars: GetPropertyDashboardVariables = {
  propertyId: ..., 
};

// Call the `getPropertyDashboard()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPropertyDashboard(getPropertyDashboardVars);
// Variables can be defined inline as well.
const { data } = await getPropertyDashboard({ propertyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPropertyDashboard(dataConnect, getPropertyDashboardVars);

console.log(data.property);
console.log(data.bookings);
console.log(data.rooms);
console.log(data.users);

// Or, you can use the `Promise` API.
getPropertyDashboard(getPropertyDashboardVars).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.bookings);
  console.log(data.rooms);
  console.log(data.users);
});
```

### Using `GetPropertyDashboard`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertyDashboardRef, GetPropertyDashboardVariables } from '@firebasegen/default';

// The `GetPropertyDashboard` query requires an argument of type `GetPropertyDashboardVariables`:
const getPropertyDashboardVars: GetPropertyDashboardVariables = {
  propertyId: ..., 
};

// Call the `getPropertyDashboardRef()` function to get a reference to the query.
const ref = getPropertyDashboardRef(getPropertyDashboardVars);
// Variables can be defined inline as well.
const ref = getPropertyDashboardRef({ propertyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPropertyDashboardRef(dataConnect, getPropertyDashboardVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.property);
console.log(data.bookings);
console.log(data.rooms);
console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.bookings);
  console.log(data.rooms);
  console.log(data.users);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  propertyId: UUIDString;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  numberOfGuests?: number | null;
  dailyRate?: number | null;
  currentStayTotalAmount?: number | null;
  checkIn: DateString;
  checkOut: DateString;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@firebasegen/default';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  propertyId: ..., 
  guestName: ..., 
  guestEmail: ..., // optional
  guestPhone: ..., // optional
  numberOfGuests: ..., // optional
  dailyRate: ..., // optional
  currentStayTotalAmount: ..., // optional
  checkIn: ..., 
  checkOut: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ propertyId: ..., guestName: ..., guestEmail: ..., guestPhone: ..., numberOfGuests: ..., dailyRate: ..., currentStayTotalAmount: ..., checkIn: ..., checkOut: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@firebasegen/default';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  propertyId: ..., 
  guestName: ..., 
  guestEmail: ..., // optional
  guestPhone: ..., // optional
  numberOfGuests: ..., // optional
  dailyRate: ..., // optional
  currentStayTotalAmount: ..., // optional
  checkIn: ..., 
  checkOut: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ propertyId: ..., guestName: ..., guestEmail: ..., guestPhone: ..., numberOfGuests: ..., dailyRate: ..., currentStayTotalAmount: ..., checkIn: ..., checkOut: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## UpdateProperty
You can execute the `UpdateProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateProperty(vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface UpdatePropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
}
export const updatePropertyRef: UpdatePropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProperty(dc: DataConnect, vars: UpdatePropertyVariables): MutationPromise<UpdatePropertyData, UpdatePropertyVariables>;

interface UpdatePropertyRef {
  ...
  (dc: DataConnect, vars: UpdatePropertyVariables): MutationRef<UpdatePropertyData, UpdatePropertyVariables>;
}
export const updatePropertyRef: UpdatePropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePropertyRef:
```typescript
const name = updatePropertyRef.operationName;
console.log(name);
```

### Variables
The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePropertyVariables {
  id: UUIDString;
  name?: string | null;
  address?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}
```
### Return Type
Recall that executing the `UpdateProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePropertyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePropertyData {
  property_update?: Property_Key | null;
}
```
### Using `UpdateProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProperty, UpdatePropertyVariables } from '@firebasegen/default';

// The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`:
const updatePropertyVars: UpdatePropertyVariables = {
  id: ..., 
  name: ..., // optional
  address: ..., // optional
  email: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updateProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProperty(updatePropertyVars);
// Variables can be defined inline as well.
const { data } = await updateProperty({ id: ..., name: ..., address: ..., email: ..., phoneNumber: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProperty(dataConnect, updatePropertyVars);

console.log(data.property_update);

// Or, you can use the `Promise` API.
updateProperty(updatePropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

### Using `UpdateProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePropertyRef, UpdatePropertyVariables } from '@firebasegen/default';

// The `UpdateProperty` mutation requires an argument of type `UpdatePropertyVariables`:
const updatePropertyVars: UpdatePropertyVariables = {
  id: ..., 
  name: ..., // optional
  address: ..., // optional
  email: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updatePropertyRef()` function to get a reference to the mutation.
const ref = updatePropertyRef(updatePropertyVars);
// Variables can be defined inline as well.
const ref = updatePropertyRef({ id: ..., name: ..., address: ..., email: ..., phoneNumber: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePropertyRef(dataConnect, updatePropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

## UpdateUserStatus
You can execute the `UpdateUserStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateUserStatus(vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface UpdateUserStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
}
export const updateUserStatusRef: UpdateUserStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserStatus(dc: DataConnect, vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface UpdateUserStatusRef {
  ...
  (dc: DataConnect, vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
}
export const updateUserStatusRef: UpdateUserStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserStatusRef:
```typescript
const name = updateUserStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserStatusVariables {
  id: string;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateUserStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserStatusData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserStatusData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserStatus, UpdateUserStatusVariables } from '@firebasegen/default';

// The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`:
const updateUserStatusVars: UpdateUserStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateUserStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserStatus(updateUserStatusVars);
// Variables can be defined inline as well.
const { data } = await updateUserStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserStatus(dataConnect, updateUserStatusVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserStatus(updateUserStatusVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserStatusRef, UpdateUserStatusVariables } from '@firebasegen/default';

// The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`:
const updateUserStatusVars: UpdateUserStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateUserStatusRef()` function to get a reference to the mutation.
const ref = updateUserStatusRef(updateUserStatusVars);
// Variables can be defined inline as well.
const ref = updateUserStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserStatusRef(dataConnect, updateUserStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## UpdateRoom
You can execute the `UpdateRoom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
updateRoom(vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface UpdateRoomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
}
export const updateRoomRef: UpdateRoomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRoom(dc: DataConnect, vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface UpdateRoomRef {
  ...
  (dc: DataConnect, vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
}
export const updateRoomRef: UpdateRoomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRoomRef:
```typescript
const name = updateRoomRef.operationName;
console.log(name);
```

### Variables
The `UpdateRoom` mutation requires an argument of type `UpdateRoomVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRoomVariables {
  id: UUIDString;
  status?: string | null;
  type?: string | null;
  floor?: number | null;
  number?: string | null;
}
```
### Return Type
Recall that executing the `UpdateRoom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRoomData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRoomData {
  room_update?: Room_Key | null;
}
```
### Using `UpdateRoom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRoom, UpdateRoomVariables } from '@firebasegen/default';

// The `UpdateRoom` mutation requires an argument of type `UpdateRoomVariables`:
const updateRoomVars: UpdateRoomVariables = {
  id: ..., 
  status: ..., // optional
  type: ..., // optional
  floor: ..., // optional
  number: ..., // optional
};

// Call the `updateRoom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRoom(updateRoomVars);
// Variables can be defined inline as well.
const { data } = await updateRoom({ id: ..., status: ..., type: ..., floor: ..., number: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRoom(dataConnect, updateRoomVars);

console.log(data.room_update);

// Or, you can use the `Promise` API.
updateRoom(updateRoomVars).then((response) => {
  const data = response.data;
  console.log(data.room_update);
});
```

### Using `UpdateRoom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRoomRef, UpdateRoomVariables } from '@firebasegen/default';

// The `UpdateRoom` mutation requires an argument of type `UpdateRoomVariables`:
const updateRoomVars: UpdateRoomVariables = {
  id: ..., 
  status: ..., // optional
  type: ..., // optional
  floor: ..., // optional
  number: ..., // optional
};

// Call the `updateRoomRef()` function to get a reference to the mutation.
const ref = updateRoomRef(updateRoomVars);
// Variables can be defined inline as well.
const ref = updateRoomRef({ id: ..., status: ..., type: ..., floor: ..., number: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRoomRef(dataConnect, updateRoomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_update);
});
```

## CreateRoom
You can execute the `CreateRoom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createRoom(vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface CreateRoomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
}
export const createRoomRef: CreateRoomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRoom(dc: DataConnect, vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface CreateRoomRef {
  ...
  (dc: DataConnect, vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
}
export const createRoomRef: CreateRoomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRoomRef:
```typescript
const name = createRoomRef.operationName;
console.log(name);
```

### Variables
The `CreateRoom` mutation requires an argument of type `CreateRoomVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRoomVariables {
  propertyId: UUIDString;
  roomNumber: string;
  roomType: string;
  floor?: number | null;
  price?: number | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `CreateRoom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRoomData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRoomData {
  room_insert: Room_Key;
}
```
### Using `CreateRoom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRoom, CreateRoomVariables } from '@firebasegen/default';

// The `CreateRoom` mutation requires an argument of type `CreateRoomVariables`:
const createRoomVars: CreateRoomVariables = {
  propertyId: ..., 
  roomNumber: ..., 
  roomType: ..., 
  floor: ..., // optional
  price: ..., // optional
  status: ..., // optional
};

// Call the `createRoom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRoom(createRoomVars);
// Variables can be defined inline as well.
const { data } = await createRoom({ propertyId: ..., roomNumber: ..., roomType: ..., floor: ..., price: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRoom(dataConnect, createRoomVars);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
createRoom(createRoomVars).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

### Using `CreateRoom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRoomRef, CreateRoomVariables } from '@firebasegen/default';

// The `CreateRoom` mutation requires an argument of type `CreateRoomVariables`:
const createRoomVars: CreateRoomVariables = {
  propertyId: ..., 
  roomNumber: ..., 
  roomType: ..., 
  floor: ..., // optional
  price: ..., // optional
  status: ..., // optional
};

// Call the `createRoomRef()` function to get a reference to the mutation.
const ref = createRoomRef(createRoomVars);
// Variables can be defined inline as well.
const ref = createRoomRef({ propertyId: ..., roomNumber: ..., roomType: ..., floor: ..., price: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRoomRef(dataConnect, createRoomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

## CreateProperty
You can execute the `CreateProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createProperty(vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface CreatePropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
}
export const createPropertyRef: CreatePropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProperty(dc: DataConnect, vars: CreatePropertyVariables): MutationPromise<CreatePropertyData, CreatePropertyVariables>;

interface CreatePropertyRef {
  ...
  (dc: DataConnect, vars: CreatePropertyVariables): MutationRef<CreatePropertyData, CreatePropertyVariables>;
}
export const createPropertyRef: CreatePropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPropertyRef:
```typescript
const name = createPropertyRef.operationName;
console.log(name);
```

### Variables
The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePropertyVariables {
  name: string;
  address?: string | null;
}
```
### Return Type
Recall that executing the `CreateProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePropertyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePropertyData {
  property_insert: Property_Key;
}
```
### Using `CreateProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProperty, CreatePropertyVariables } from '@firebasegen/default';

// The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`:
const createPropertyVars: CreatePropertyVariables = {
  name: ..., 
  address: ..., // optional
};

// Call the `createProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProperty(createPropertyVars);
// Variables can be defined inline as well.
const { data } = await createProperty({ name: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProperty(dataConnect, createPropertyVars);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
createProperty(createPropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

### Using `CreateProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPropertyRef, CreatePropertyVariables } from '@firebasegen/default';

// The `CreateProperty` mutation requires an argument of type `CreatePropertyVariables`:
const createPropertyVars: CreatePropertyVariables = {
  name: ..., 
  address: ..., // optional
};

// Call the `createPropertyRef()` function to get a reference to the mutation.
const ref = createPropertyRef(createPropertyVars);
// Variables can be defined inline as well.
const ref = createPropertyRef({ name: ..., address: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPropertyRef(dataConnect, createPropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

## LinkUserToProperty
You can execute the `LinkUserToProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
linkUserToProperty(vars: LinkUserToPropertyVariables): MutationPromise<LinkUserToPropertyData, LinkUserToPropertyVariables>;

interface LinkUserToPropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LinkUserToPropertyVariables): MutationRef<LinkUserToPropertyData, LinkUserToPropertyVariables>;
}
export const linkUserToPropertyRef: LinkUserToPropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
linkUserToProperty(dc: DataConnect, vars: LinkUserToPropertyVariables): MutationPromise<LinkUserToPropertyData, LinkUserToPropertyVariables>;

interface LinkUserToPropertyRef {
  ...
  (dc: DataConnect, vars: LinkUserToPropertyVariables): MutationRef<LinkUserToPropertyData, LinkUserToPropertyVariables>;
}
export const linkUserToPropertyRef: LinkUserToPropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the linkUserToPropertyRef:
```typescript
const name = linkUserToPropertyRef.operationName;
console.log(name);
```

### Variables
The `LinkUserToProperty` mutation requires an argument of type `LinkUserToPropertyVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LinkUserToPropertyVariables {
  id: string;
  propertyId: UUIDString;
}
```
### Return Type
Recall that executing the `LinkUserToProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LinkUserToPropertyData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LinkUserToPropertyData {
  user_update?: User_Key | null;
}
```
### Using `LinkUserToProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, linkUserToProperty, LinkUserToPropertyVariables } from '@firebasegen/default';

// The `LinkUserToProperty` mutation requires an argument of type `LinkUserToPropertyVariables`:
const linkUserToPropertyVars: LinkUserToPropertyVariables = {
  id: ..., 
  propertyId: ..., 
};

// Call the `linkUserToProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await linkUserToProperty(linkUserToPropertyVars);
// Variables can be defined inline as well.
const { data } = await linkUserToProperty({ id: ..., propertyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await linkUserToProperty(dataConnect, linkUserToPropertyVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
linkUserToProperty(linkUserToPropertyVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `LinkUserToProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, linkUserToPropertyRef, LinkUserToPropertyVariables } from '@firebasegen/default';

// The `LinkUserToProperty` mutation requires an argument of type `LinkUserToPropertyVariables`:
const linkUserToPropertyVars: LinkUserToPropertyVariables = {
  id: ..., 
  propertyId: ..., 
};

// Call the `linkUserToPropertyRef()` function to get a reference to the mutation.
const ref = linkUserToPropertyRef(linkUserToPropertyVars);
// Variables can be defined inline as well.
const ref = linkUserToPropertyRef({ id: ..., propertyId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = linkUserToPropertyRef(dataConnect, linkUserToPropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  email: string;
  role: string;
  name?: string | null;
  propertyId?: UUIDString | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@firebasegen/default';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  role: ..., 
  name: ..., // optional
  propertyId: ..., // optional
  status: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., email: ..., role: ..., name: ..., propertyId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@firebasegen/default';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  role: ..., 
  name: ..., // optional
  propertyId: ..., // optional
  status: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., email: ..., role: ..., name: ..., propertyId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  id: string;
  email: string;
  role: string;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@firebasegen/default';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  role: ..., 
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ id: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@firebasegen/default';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  id: ..., 
  email: ..., 
  role: ..., 
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ id: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateRoomEntry
You can execute the `CreateRoomEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [generated/index.d.ts](./index.d.ts):
```typescript
createRoomEntry(vars: CreateRoomEntryVariables): MutationPromise<CreateRoomEntryData, CreateRoomEntryVariables>;

interface CreateRoomEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomEntryVariables): MutationRef<CreateRoomEntryData, CreateRoomEntryVariables>;
}
export const createRoomEntryRef: CreateRoomEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRoomEntry(dc: DataConnect, vars: CreateRoomEntryVariables): MutationPromise<CreateRoomEntryData, CreateRoomEntryVariables>;

interface CreateRoomEntryRef {
  ...
  (dc: DataConnect, vars: CreateRoomEntryVariables): MutationRef<CreateRoomEntryData, CreateRoomEntryVariables>;
}
export const createRoomEntryRef: CreateRoomEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRoomEntryRef:
```typescript
const name = createRoomEntryRef.operationName;
console.log(name);
```

### Variables
The `CreateRoomEntry` mutation requires an argument of type `CreateRoomEntryVariables`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRoomEntryVariables {
  roomNumber: string;
  roomType: string;
  floor?: number | null;
  roomStatus?: string | null;
  capacity?: number | null;
  price?: number | null;
  propertyId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateRoomEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRoomEntryData`, which is defined in [generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRoomEntryData {
  room_insert: Room_Key;
}
```
### Using `CreateRoomEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRoomEntry, CreateRoomEntryVariables } from '@firebasegen/default';

// The `CreateRoomEntry` mutation requires an argument of type `CreateRoomEntryVariables`:
const createRoomEntryVars: CreateRoomEntryVariables = {
  roomNumber: ..., 
  roomType: ..., 
  floor: ..., // optional
  roomStatus: ..., // optional
  capacity: ..., // optional
  price: ..., // optional
  propertyId: ..., 
};

// Call the `createRoomEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRoomEntry(createRoomEntryVars);
// Variables can be defined inline as well.
const { data } = await createRoomEntry({ roomNumber: ..., roomType: ..., floor: ..., roomStatus: ..., capacity: ..., price: ..., propertyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRoomEntry(dataConnect, createRoomEntryVars);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
createRoomEntry(createRoomEntryVars).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

### Using `CreateRoomEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRoomEntryRef, CreateRoomEntryVariables } from '@firebasegen/default';

// The `CreateRoomEntry` mutation requires an argument of type `CreateRoomEntryVariables`:
const createRoomEntryVars: CreateRoomEntryVariables = {
  roomNumber: ..., 
  roomType: ..., 
  floor: ..., // optional
  roomStatus: ..., // optional
  capacity: ..., // optional
  price: ..., // optional
  propertyId: ..., 
};

// Call the `createRoomEntryRef()` function to get a reference to the mutation.
const ref = createRoomEntryRef(createRoomEntryVars);
// Variables can be defined inline as well.
const ref = createRoomEntryRef({ roomNumber: ..., roomType: ..., floor: ..., roomStatus: ..., capacity: ..., price: ..., propertyId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRoomEntryRef(dataConnect, createRoomEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

