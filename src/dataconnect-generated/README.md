# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*AdminListAllProperties*](#adminlistallproperties)
  - [*GetPropertyDashboard*](#getpropertydashboard)
- [**Mutations**](#mutations)
  - [*CreateBooking*](#createbooking)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@stay-sync/hotel-os` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@stay-sync/hotel-os';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@stay-sync/hotel-os';

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

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## AdminListAllProperties
You can execute the `AdminListAllProperties` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
adminListAllProperties(): QueryPromise<AdminListAllPropertiesData, undefined>;

interface AdminListAllPropertiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AdminListAllPropertiesData, undefined>;
}
export const adminListAllPropertiesRef: AdminListAllPropertiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
adminListAllProperties(dc: DataConnect): QueryPromise<AdminListAllPropertiesData, undefined>;

interface AdminListAllPropertiesRef {
  ...
  (dc: DataConnect): QueryRef<AdminListAllPropertiesData, undefined>;
}
export const adminListAllPropertiesRef: AdminListAllPropertiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the adminListAllPropertiesRef:
```typescript
const name = adminListAllPropertiesRef.operationName;
console.log(name);
```

### Variables
The `AdminListAllProperties` query has no variables.
### Return Type
Recall that executing the `AdminListAllProperties` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AdminListAllPropertiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AdminListAllProperties`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, adminListAllProperties } from '@stay-sync/hotel-os';


// Call the `adminListAllProperties()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await adminListAllProperties();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await adminListAllProperties(dataConnect);

console.log(data.properties);

// Or, you can use the `Promise` API.
adminListAllProperties().then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

### Using `AdminListAllProperties`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, adminListAllPropertiesRef } from '@stay-sync/hotel-os';


// Call the `adminListAllPropertiesRef()` function to get a reference to the query.
const ref = adminListAllPropertiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = adminListAllPropertiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.properties);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

## GetPropertyDashboard
You can execute the `GetPropertyDashboard` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `GetPropertyDashboard` query requires an argument of type `GetPropertyDashboardVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPropertyDashboardVariables {
  propertyId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPropertyDashboard` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertyDashboardData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPropertyDashboard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPropertyDashboard, GetPropertyDashboardVariables } from '@stay-sync/hotel-os';

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

// Or, you can use the `Promise` API.
getPropertyDashboard(getPropertyDashboardVars).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.bookings);
  console.log(data.rooms);
});
```

### Using `GetPropertyDashboard`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertyDashboardRef, GetPropertyDashboardVariables } from '@stay-sync/hotel-os';

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

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.property);
  console.log(data.bookings);
  console.log(data.rooms);
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

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
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
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  propertyId: UUIDString;
  guestName: string;
  checkIn: DateString;
  checkOut: DateString;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@stay-sync/hotel-os';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  propertyId: ..., 
  guestName: ..., 
  checkIn: ..., 
  checkOut: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ propertyId: ..., guestName: ..., checkIn: ..., checkOut: ..., });

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
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@stay-sync/hotel-os';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  propertyId: ..., 
  guestName: ..., 
  checkIn: ..., 
  checkOut: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ propertyId: ..., guestName: ..., checkIn: ..., checkOut: ..., });

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

