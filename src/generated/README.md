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

// Or, you can use the `Promise` API.
adminListProperties().then((response) => {
  const data = response.data;
  console.log(data.properties);
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

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.properties);
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
        status?: string | null;
        pricePerNight?: number | null;
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
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@firebasegen/default';

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

