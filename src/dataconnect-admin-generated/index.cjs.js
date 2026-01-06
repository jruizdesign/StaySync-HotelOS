const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'staysync-hotelos-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

function adminListAllProperties(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('AdminListAllProperties', undefined, inputOpts);
}
exports.adminListAllProperties = adminListAllProperties;

function getPropertyDashboard(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetPropertyDashboard', inputVars, inputOpts);
}
exports.getPropertyDashboard = getPropertyDashboard;

function createBooking(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateBooking', inputVars, inputOpts);
}
exports.createBooking = createBooking;

