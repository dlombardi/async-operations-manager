"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAsyncOperationInfo = exports.getStateForOperationAfterStep = exports.getAsyncOperationDescriptor = exports.registerAsyncOperationDescriptors = exports.getAsyncOperation = exports.clearRegisteredAsyncDescriptors = exports.getRegisteredAsyncDescriptors = void 0;

var _lodash = require("lodash");

var _asyncOperationStateUtils = _interopRequireDefault(require("./asyncOperationStateUtils"));

var _config = _interopRequireDefault(require("./config"));

var _asyncOperationDescriptorRegistry = require("./asyncOperationDescriptorRegistry");

var _asyncOperationUtils = require("./asyncOperationUtils");

var _helpers = require("./helpers");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: JSDocify every function
// 
// This file contains the 'switchboard' logic to coordinate the various
// lower-level functions that update state. These functions are exposed
// to the consumer of the library.
//
const getRegisteredAsyncDescriptors = _asyncOperationDescriptorRegistry.asyncOperationDescriptorRegistry.getAsyncOperationDescriptors;
exports.getRegisteredAsyncDescriptors = getRegisteredAsyncDescriptors;
const clearRegisteredAsyncDescriptors = _asyncOperationDescriptorRegistry.asyncOperationDescriptorRegistry.clearAsyncOperationDescriptors;
exports.clearRegisteredAsyncDescriptors = clearRegisteredAsyncDescriptors;

const getAsyncOperationDescriptor = descriptorId => {
  const asyncOperationDescriptors = _asyncOperationDescriptorRegistry.asyncOperationDescriptorRegistry.getAsyncOperationDescriptors();

  return _asyncOperationStateUtils.default.getAsyncOperationDescriptor(asyncOperationDescriptors, descriptorId);
};

exports.getAsyncOperationDescriptor = getAsyncOperationDescriptor;

const getAsyncOperationInfo = (descriptorId, params) => {
  const asyncOperationDescriptor = getAsyncOperationDescriptor(descriptorId);
  const asyncOperationParams = (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
  const asyncOperationKey = (0, _helpers.generateAsyncOperationKey)(descriptorId, asyncOperationParams);
  const otherFields = (0, _lodash.omit)(params, [...asyncOperationDescriptor.requiredParams]);
  return {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
    otherFields
  };
};

exports.getAsyncOperationInfo = getAsyncOperationInfo;

const registerAsyncOperationDescriptors = function registerAsyncOperationDescriptors(asyncOperationDescriptors) {
  let newAsyncOperationDescriptors;

  const existingAsyncOperationDescriptors = _asyncOperationDescriptorRegistry.asyncOperationDescriptorRegistry.getAsyncOperationDescriptors();

  const config = _config.default.getConfig();

  for (var _len = arguments.length, otherDescriptors = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    otherDescriptors[_key - 1] = arguments[_key];
  }

  if (!(0, _lodash.isEmpty)(otherDescriptors)) {
    config.logger.exceptionsCallback(`
      You provided more than one argument to registerAsyncOperationDescriptors.
      You likely forgot to put multiple descriptors within an array`, new Error());
  } // handle array or single object arguments


  if ((0, _lodash.isArray)(asyncOperationDescriptors)) {
    newAsyncOperationDescriptors = (0, _lodash.reduce)(asyncOperationDescriptors, (acc, asyncOperationDescriptor) => {
      return _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(acc, asyncOperationDescriptor);
    }, existingAsyncOperationDescriptors);
  } else {
    newAsyncOperationDescriptors = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(existingAsyncOperationDescriptors, asyncOperationDescriptors);
  }

  _asyncOperationDescriptorRegistry.asyncOperationDescriptorRegistry.setAsyncOperationDescriptors(newAsyncOperationDescriptors);

  return newAsyncOperationDescriptors;
}; // TODO: heavy unit testing needed!


exports.registerAsyncOperationDescriptors = registerAsyncOperationDescriptors;

const getAsyncOperation = (state, descriptorId, params, otherFields) => {
  const _getAsyncOperationInf = getAsyncOperationInfo(descriptorId, params),
        asyncOperationDescriptor = _getAsyncOperationInf.asyncOperationDescriptor,
        asyncOperationParams = _getAsyncOperationInf.asyncOperationParams,
        asyncOperationKey = _getAsyncOperationInf.asyncOperationKey;

  const registeredAsyncOperationDescriptors = getRegisteredAsyncDescriptors();
  return _asyncOperationStateUtils.default.getAsyncOperation(state, registeredAsyncOperationDescriptors, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, otherFields);
}; // switchboard for resolving the Read operation steps


exports.getAsyncOperation = getAsyncOperation;
const readStepLookup = {
  [_constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.beginReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields),
  [_constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.resolveReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields),
  [_constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.rejectReadAsyncOperation)(asyncOperation, asyncOperationParams, otherFields)
}; // switchboard for resolving Write operation steps

const writeStepLookup = {
  [_constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.beginWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields),
  [_constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.resolveWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields),
  [_constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION]: (asyncOperation, asyncOperationParams, otherFields) => (0, _asyncOperationUtils.rejectWriteAsyncOperation)(asyncOperation, asyncOperationParams, otherFields)
}; // first switchboard to transform an async operation

const transformTypeLookup = {
  [_constants.ASYNC_OPERATION_TYPES.READ]: (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) => readStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields),
  [_constants.ASYNC_OPERATION_TYPES.WRITE]: (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) => writeStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields)
}; // this function is called in the reducer (in redux integration)

const getStateForOperationAfterStep = (state, asyncOperationStep, descriptorId, params) => {
  let newState = state;

  const _getAsyncOperationInf2 = getAsyncOperationInfo(descriptorId, params),
        asyncOperationDescriptor = _getAsyncOperationInf2.asyncOperationDescriptor,
        asyncOperationParams = _getAsyncOperationInf2.asyncOperationParams,
        asyncOperationKey = _getAsyncOperationInf2.asyncOperationKey,
        otherFields = _getAsyncOperationInf2.otherFields;

  const asyncOperationToTranform = getAsyncOperation(state, descriptorId, asyncOperationParams, otherFields);
  const newAsyncOperation = transformTypeLookup[asyncOperationDescriptor.operationType](asyncOperationToTranform, asyncOperationStep, asyncOperationParams, otherFields);
  newState = _asyncOperationStateUtils.default.updateAsyncOperation(state, asyncOperationKey, newAsyncOperation, asyncOperationDescriptor);
  return newState;
};

exports.getStateForOperationAfterStep = getStateForOperationAfterStep;