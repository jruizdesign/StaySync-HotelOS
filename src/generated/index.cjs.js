const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'staysync-hotelos-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const adminListPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListProperties');
}
adminListPropertiesRef.operationName = 'AdminListProperties';
exports.adminListPropertiesRef = adminListPropertiesRef;

exports.adminListProperties = function adminListProperties(dc) {
  return executeQuery(adminListPropertiesRef(dc));
};

const getPropertyDashboardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertyDashboard', inputVars);
}
getPropertyDashboardRef.operationName = 'GetPropertyDashboard';
exports.getPropertyDashboardRef = getPropertyDashboardRef;

exports.getPropertyDashboard = function getPropertyDashboard(dcOrVars, vars) {
  return executeQuery(getPropertyDashboardRef(dcOrVars, vars));
};

const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';
exports.createBookingRef = createBookingRef;

exports.createBooking = function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
};

const updatePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProperty', inputVars);
}
updatePropertyRef.operationName = 'UpdateProperty';
exports.updatePropertyRef = updatePropertyRef;

exports.updateProperty = function updateProperty(dcOrVars, vars) {
  return executeMutation(updatePropertyRef(dcOrVars, vars));
};

const updateUserStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserStatus', inputVars);
}
updateUserStatusRef.operationName = 'UpdateUserStatus';
exports.updateUserStatusRef = updateUserStatusRef;

exports.updateUserStatus = function updateUserStatus(dcOrVars, vars) {
  return executeMutation(updateUserStatusRef(dcOrVars, vars));
};

const updateRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRoom', inputVars);
}
updateRoomRef.operationName = 'UpdateRoom';
exports.updateRoomRef = updateRoomRef;

exports.updateRoom = function updateRoom(dcOrVars, vars) {
  return executeMutation(updateRoomRef(dcOrVars, vars));
};

const createRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRoom', inputVars);
}
createRoomRef.operationName = 'CreateRoom';
exports.createRoomRef = createRoomRef;

exports.createRoom = function createRoom(dcOrVars, vars) {
  return executeMutation(createRoomRef(dcOrVars, vars));
};
