import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'staysync-hotelos-service',
  location: 'us-central1'
};

export const adminListPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListProperties');
}
adminListPropertiesRef.operationName = 'AdminListProperties';

export function adminListProperties(dc) {
  return executeQuery(adminListPropertiesRef(dc));
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

export const updatePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProperty', inputVars);
}
updatePropertyRef.operationName = 'UpdateProperty';

export function updateProperty(dcOrVars, vars) {
  return executeMutation(updatePropertyRef(dcOrVars, vars));
}

export const updateUserStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserStatus', inputVars);
}
updateUserStatusRef.operationName = 'UpdateUserStatus';

export function updateUserStatus(dcOrVars, vars) {
  return executeMutation(updateUserStatusRef(dcOrVars, vars));
}

export const updateRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRoom', inputVars);
}
updateRoomRef.operationName = 'UpdateRoom';

export function updateRoom(dcOrVars, vars) {
  return executeMutation(updateRoomRef(dcOrVars, vars));
}

export const createRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRoom', inputVars);
}
createRoomRef.operationName = 'CreateRoom';

export function createRoom(dcOrVars, vars) {
  return executeMutation(createRoomRef(dcOrVars, vars));
}

export const createPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProperty', inputVars);
}
createPropertyRef.operationName = 'CreateProperty';

export function createProperty(dcOrVars, vars) {
  return executeMutation(createPropertyRef(dcOrVars, vars));
}

export const linkUserToPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LinkUserToProperty', inputVars);
}
linkUserToPropertyRef.operationName = 'LinkUserToProperty';

export function linkUserToProperty(dcOrVars, vars) {
  return executeMutation(linkUserToPropertyRef(dcOrVars, vars));
}

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

