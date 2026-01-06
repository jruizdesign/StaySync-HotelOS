# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { adminListProperties, getPropertyDashboard, createBooking, updateProperty, updateUserStatus, updateRoom, createRoom, createUser } from '@firebasegen/default';


// Operation AdminListProperties: 
const { data } = await AdminListProperties(dataConnect);

// Operation GetPropertyDashboard:  For variables, look at type GetPropertyDashboardVars in ../index.d.ts
const { data } = await GetPropertyDashboard(dataConnect, getPropertyDashboardVars);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation UpdateProperty:  For variables, look at type UpdatePropertyVars in ../index.d.ts
const { data } = await UpdateProperty(dataConnect, updatePropertyVars);

// Operation UpdateUserStatus:  For variables, look at type UpdateUserStatusVars in ../index.d.ts
const { data } = await UpdateUserStatus(dataConnect, updateUserStatusVars);

// Operation UpdateRoom:  For variables, look at type UpdateRoomVars in ../index.d.ts
const { data } = await UpdateRoom(dataConnect, updateRoomVars);

// Operation CreateRoom:  For variables, look at type CreateRoomVars in ../index.d.ts
const { data } = await CreateRoom(dataConnect, createRoomVars);

// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);


```