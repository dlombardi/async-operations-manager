"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldRunOperation = exports.getStateForOperationAfterStep = exports.registerAsyncOperationDescriptors = exports.getAsyncOperation = exports.setAsyncOperationsManagerState = exports.clearAsyncOperationsManagerState = exports.getAsyncOperationsManagerState = void 0;

var _lodash = require("lodash");

var _asyncOperationStateUtils = _interopRequireDefault(require("./asyncOperationStateUtils"));

var _config = _interopRequireDefault(require("./config"));

var _asyncOperationManagerState = require("./asyncOperationManagerState");

var _asyncOperationUtils = require("./asyncOperationUtils");

var _helpers = require("./helpers");

var _constants = require("./constants");

var _readStepLookup, _writeStepLookup, _transformTypeLookup;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getAsyncOperationsManagerState = _asyncOperationManagerState.asyncOperationManagerState.getState;
exports.getAsyncOperationsManagerState = getAsyncOperationsManagerState;
var clearAsyncOperationsManagerState = _asyncOperationManagerState.asyncOperationManagerState.clearState;
exports.clearAsyncOperationsManagerState = clearAsyncOperationsManagerState;
var setAsyncOperationsManagerState = _asyncOperationManagerState.asyncOperationManagerState.setState;
exports.setAsyncOperationsManagerState = setAsyncOperationsManagerState;

var registerAsyncOperationDescriptors = function registerAsyncOperationDescriptors(asyncOperationDescriptors) {
  var newState;
  var state = getAsyncOperationsManagerState();

  var config = _config.default.getConfig();

  for (var _len = arguments.length, otherDescriptors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    otherDescriptors[_key - 1] = arguments[_key];
  }

  if (!(0, _lodash.isEmpty)(otherDescriptors)) {
    config.logger.exceptionsCallback("\n      You provided more than one argument to registerAsyncOperationDescriptors.\n      You likely forgot to put multiple descriptors within an array", new Error());
  } // handle array or single object arguments


  if ((0, _lodash.isArray)(asyncOperationDescriptors)) {
    newState = (0, _lodash.reduce)(asyncOperationDescriptors, function (acc, asyncOperationDescriptor) {
      return _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(acc, asyncOperationDescriptor);
    }, state);
  } else {
    newState = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(state, asyncOperationDescriptors);
  }

  return _asyncOperationManagerState.asyncOperationManagerState.setState(newState);
};

exports.registerAsyncOperationDescriptors = registerAsyncOperationDescriptors;

var getAsyncOperation = function getAsyncOperation(state, descriptorId, params, otherFields) {
  var _getAsyncOperationInf = (0, _helpers.getAsyncOperationInfo)(state.descriptors, descriptorId, params),
      asyncOperationDescriptor = _getAsyncOperationInf.asyncOperationDescriptor,
      asyncOperationParams = _getAsyncOperationInf.asyncOperationParams,
      asyncOperationKey = _getAsyncOperationInf.asyncOperationKey; // in case operation/descriptor state is initialized in userland we pass that through
  // to the library state.


  var newState = _asyncOperationManagerState.asyncOperationManagerState.setState(state);

  return _asyncOperationStateUtils.default.getAsyncOperation(newState, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, otherFields);
};

exports.getAsyncOperation = getAsyncOperation;

var shouldRunOperation = function shouldRunOperation(descriptorId, params) {
  var state = _asyncOperationManagerState.asyncOperationManagerState.getState();

  var _getAsyncOperationInf2 = (0, _helpers.getAsyncOperationInfo)(state.descriptors, descriptorId, params),
      asyncOperationDescriptor = _getAsyncOperationInf2.asyncOperationDescriptor,
      asyncOperationParams = _getAsyncOperationInf2.asyncOperationParams;

  var asyncOperation = getAsyncOperation(state, descriptorId, asyncOperationParams);

  if (asyncOperationDescriptor.operationType === _constants.ASYNC_OPERATION_TYPES.READ && asyncOperation.fetchStatus !== _constants.FETCH_STATUS.NULL) {
    return Date.now() - asyncOperation.lastFetchStatusTime >= asyncOperationDescriptor.minCacheTime;
  }

  return true;
}; // switchboard for resolving the Read operation steps


exports.shouldRunOperation = shouldRunOperation;
var readStepLookup = (_readStepLookup = {}, _defineProperty(_readStepLookup, _constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.beginReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _defineProperty(_readStepLookup, _constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.resolveReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _defineProperty(_readStepLookup, _constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.rejectReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _readStepLookup); // switchboard for resolving Write operation steps

var writeStepLookup = (_writeStepLookup = {}, _defineProperty(_writeStepLookup, _constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.beginWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _defineProperty(_writeStepLookup, _constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.resolveWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _defineProperty(_writeStepLookup, _constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION, function (asyncOperation, asyncOperationParams, otherFields) {
  return (0, _asyncOperationUtils.rejectWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields);
}), _writeStepLookup); // first switchboard to transform an async operation

var transformTypeLookup = (_transformTypeLookup = {}, _defineProperty(_transformTypeLookup, _constants.ASYNC_OPERATION_TYPES.READ, function (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) {
  return readStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields);
}), _defineProperty(_transformTypeLookup, _constants.ASYNC_OPERATION_TYPES.WRITE, function (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) {
  return writeStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields);
}), _transformTypeLookup); // this function is called in the reducer (in redux integration)

var getStateForOperationAfterStep = function getStateForOperationAfterStep(state, asyncOperationStep, descriptorId, params) {
  var newState = _asyncOperationManagerState.asyncOperationManagerState.setState(state);

  var _getAsyncOperationInf3 = (0, _helpers.getAsyncOperationInfo)(newState.descriptors, descriptorId, params),
      asyncOperationDescriptor = _getAsyncOperationInf3.asyncOperationDescriptor,
      asyncOperationParams = _getAsyncOperationInf3.asyncOperationParams,
      asyncOperationKey = _getAsyncOperationInf3.asyncOperationKey,
      otherFields = _getAsyncOperationInf3.otherFields; // in case operation/descriptor state is initialized in userland we pass that through
  // to the library state.


  var asyncOperationToTranform = getAsyncOperation(newState, descriptorId, asyncOperationParams, otherFields);
  var newAsyncOperation = transformTypeLookup[asyncOperationDescriptor.operationType](asyncOperationToTranform, asyncOperationStep, asyncOperationParams, otherFields);
  newState = _asyncOperationStateUtils.default.updateAsyncOperation(newState, asyncOperationKey, newAsyncOperation, asyncOperationDescriptor);
  return _asyncOperationManagerState.asyncOperationManagerState.setState(newState).operations;
};

exports.getStateForOperationAfterStep = getStateForOperationAfterStep;
//# sourceMappingURL=asyncOperationManagerUtils.js.map