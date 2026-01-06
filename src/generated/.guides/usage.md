# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { adminListProperties, getPropertyDashboard, createBooking } from '@firebasegen/default';


// Operation AdminListProperties: 
const { data } = await AdminListProperties(dataConnect);

// Operation GetPropertyDashboard:  For variables, look at type GetPropertyDashboardVars in ../index.d.ts
const { data } = await GetPropertyDashboard(dataConnect, getPropertyDashboardVars);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);


```