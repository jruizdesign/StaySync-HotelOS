import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'staysync-hotelos-service',
  location: 'us-central1'
};

export const adminListAllPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllProperties');
}
adminListAllPropertiesRef.operationName = 'AdminListAllProperties';

export function adminListAllProperties(dc) {
  return executeQuery(adminListAllPropertiesRef(dc));
}

export const getPropertyDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertyDashboard', inputVars);
}
getPropertyDashboardRef.operationName = 'GetPropertyDashboard';

export function getPropertyDashboard(dcOrVars, vars) {
  return executeQuery(getPropertyDashboardRef(dcOrVars, vars));
}

export const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';

export function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
}

