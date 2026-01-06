const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'staysync-hotelos-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const adminListAllPropertiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminListAllProperties');
}
adminListAllPropertiesRef.operationName = 'AdminListAllProperties';
exports.adminListAllPropertiesRef = adminListAllPropertiesRef;

exports.adminListAllProperties = function adminListAllProperties(dc) {
  return executeQuery(adminListAllPropertiesRef(dc));
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
