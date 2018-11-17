"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _lodash = _interopRequireDefault(require("lodash"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _config = _interopRequireDefault(require("./config"));

var _constants = require("./constants");

var _helpers = require("./helpers");

var _types = require("./types");

var _asyncOperationUtils = require("./asyncOperationUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const updateAsyncOperationDescriptor = (asyncOperationDescriptors, descriptorOptions) => {
  const asyncOperationDescriptor = _objectSpread({
    debug: false,
    parentOperationDescriptorId: null,
    alwaysImmutable: false,
    minCacheTime: 5000,
    maxCacheTime: 60000
  }, descriptorOptions);

  _propTypes.default.checkPropTypes(_types.asyncOperationDescriptorPropType, asyncOperationDescriptor, 'prop', 'asyncOperationDescriptor');

  return _objectSpread({}, asyncOperationDescriptors, {
    [asyncOperationDescriptor.descriptorId]: asyncOperationDescriptor
  });
}; // validate whether the asyncOperationDescriptor exists


const getAsyncOperationDescriptor = (asyncOperationDescriptors, descriptorId) => {
  const config = _config.default.getConfig();

  const asyncOperationDescriptor = asyncOperationDescriptors[descriptorId];

  if (!asyncOperationDescriptor) {
    config.logger.warningsCallback(`descriptorId "${descriptorId}" does not match with any registered async operation descriptor`);
    return null;
  }

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside getAsyncOperationDescriptor for ${descriptorId}`);
    config.logger.infoLoggingCallback('getAsyncOperationDescriptor [Data Snapshot]:', {
      asyncOperationDescriptors,
      asyncOperationDescriptor
    });
  }

  return asyncOperationDescriptor;
}; // This function will do all the work to determine if an async operation is returned as an initial async operation
// (if it is not found in state), an asyncOperation with parentAsyncOperation metaData (recursively searched to find if the parentAsyncOperation is more
// up-to-date) or just the asyncOperation itself if the none of the above apply.


const getAsyncOperation = (state, registeredAsyncOperationDescriptors, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, fieldsToAdd) => {
  const config = _config.default.getConfig();

  const fieldsToAddToAction = _objectSpread({}, asyncOperationParams, fieldsToAdd, {
    // key for the descriptor of the asyncOperation
    descriptorId: asyncOperationDescriptor.descriptorId
  });

  let parentAsyncOperation;
  let asyncOperation = state[asyncOperationKey] || null;

  if (asyncOperationDescriptor.parentOperationDescriptorId) {
    // grab key, descriptor, params, and async operation for parentAsyncOperation
    const parentAsyncOperationDescriptor = getAsyncOperationDescriptor(registeredAsyncOperationDescriptors, asyncOperationDescriptor.parentOperationDescriptorId);
    const parentAsyncOperationParams = (0, _helpers.getAndValidateParams)(asyncOperationParams, parentAsyncOperationDescriptor);
    const parentAsyncOperationKey = (0, _helpers.generateAsyncOperationKey)(asyncOperationDescriptor.parentOperationDescriptorId, parentAsyncOperationParams);
    parentAsyncOperation = getAsyncOperation(state, registeredAsyncOperationDescriptors, parentAsyncOperationKey, parentAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction);
  }

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside getAsyncOperation for ${asyncOperationKey}`);
    config.logger.infoLoggingCallback('getAsyncOperation [Data Snapshot]:', {
      state,
      asyncOperationParams,
      asyncOperationDescriptor,
      asyncOperation,
      asyncOperationKey
    });
  }

  if (!asyncOperation) {
    if (asyncOperationDescriptor.debug) {
      config.logger.verboseLoggingCallback(`asyncOperation not found with given key: ${asyncOperationKey}. Defaulting to an initial asyncOperation`);
    }

    asyncOperation = asyncOperationDescriptor.operationType === _constants.ASYNC_OPERATION_TYPES.READ ? (0, _asyncOperationUtils.initialReadAsyncOperationForAction)(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation) : (0, _asyncOperationUtils.initialWriteAsyncOperationForAction)(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation);
  } // We want to determine whether or not to use that parentAsyncOperation metaData based on the
  // newness of it's data in comparison to the asyncOperation


  if (parentAsyncOperation && asyncOperation) {
    return parentAsyncOperation.lastDataStatusTime.valueOf() > asyncOperation.lastDataStatusTime.valueOf() ? _objectSpread({}, asyncOperation, _lodash.default.pick(parentAsyncOperation, _constants.readAsyncOperationFieldsToPullFromParent)) : asyncOperation;
  }

  return asyncOperation;
};

const updateAsyncOperation = (state, asyncOperationKey, asyncOperation, asyncOperationDescriptor) => {
  const config = _config.default.getConfig();

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside updateAsyncOperation for ${asyncOperationKey}`);
    config.logger.infoLoggingCallback('updateAsyncOperation [Data Snapshot]:', {
      state,
      asyncOperationDescriptor,
      asyncOperation,
      asyncOperationKey
    });
  }

  _propTypes.default.checkPropTypes(_types.asyncOperationPropType, asyncOperation, 'prop', 'asyncOperation');

  return _objectSpread({}, state, {
    [asyncOperationKey]: asyncOperation
  });
};

const bulkUpdateAsyncOperations = (state, asyncOperationsList) => {
  return _lodash.default.reduce(asyncOperationsList, (accumulator, _ref) => {
    let asyncOperationKey = _ref.asyncOperationKey,
        asyncOperation = _ref.asyncOperation,
        asyncOperationDescriptor = _ref.asyncOperationDescriptor;
    return updateAsyncOperation(accumulator, asyncOperationKey, asyncOperation, asyncOperationDescriptor);
  }, state);
};

var _default = {
  updateAsyncOperationDescriptor,
  updateAsyncOperation,
  bulkUpdateAsyncOperations,
  getAsyncOperation,
  getAsyncOperationDescriptor
};
exports.default = _default;