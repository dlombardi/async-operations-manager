"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _config = _interopRequireDefault(require("./config"));

var _constants = require("./constants");

var _helpers = require("./helpers");

var _types = require("./types");

var _asyncOperationUtils = require("./asyncOperationUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// // //
// // // These are all pure functions that return new or existing state or
// // // pieces of new or existing state from their inputs.
// // //
var updateAsyncOperationDescriptor = function updateAsyncOperationDescriptor(state, descriptorOptions) {
  var asyncOperationDescriptor = _objectSpread({
    debug: false,
    parentOperationDescriptorId: null,
    invalidatingOperationsDescriptorIds: null,
    alwaysImmutable: false,
    minCacheTime: 5000,
    maxCacheTime: 60000,
    requiredParams: {}
  }, descriptorOptions);

  _propTypes.default.checkPropTypes(_types.asyncOperationDescriptorPropType, asyncOperationDescriptor, 'prop', 'asyncOperationDescriptor');

  return _objectSpread({}, state, {
    descriptors: _objectSpread({}, state.descriptors, _defineProperty({}, asyncOperationDescriptor.descriptorId, asyncOperationDescriptor))
  });
}; // This function will do all the work to determine if an async operation is returned as an initial async operation
// (if it is not found in state), an asyncOperation with parentAsyncOperation metaData (recursively searched to find if the parentAsyncOperation is more
// up-to-date) or just the asyncOperation itself if the none of the above apply.


var getAsyncOperation = function getAsyncOperation(state, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, fieldsToAdd) {
  var operations = state.operations,
      descriptors = state.descriptors;
  var parentAsyncOperation;
  var asyncOperation = operations[asyncOperationKey] || null;

  var config = _config.default.getConfig();

  var fieldsToAddToAction = _objectSpread({}, asyncOperationParams, fieldsToAdd, {
    // key for the descriptor of the asyncOperation
    descriptorId: asyncOperationDescriptor.descriptorId
  });

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback("Inside getAsyncOperation for ".concat(asyncOperationKey));
    config.logger.infoLoggingCallback('getAsyncOperation [Data Snapshot]:', {
      state: state,
      asyncOperationParams: asyncOperationParams,
      asyncOperationDescriptor: asyncOperationDescriptor,
      asyncOperation: asyncOperation,
      asyncOperationKey: asyncOperationKey
    });
  }

  if (asyncOperationDescriptor.parentOperationDescriptorId) {
    // grab key, descriptor, params, and async operation for parentAsyncOperation
    var _getAsyncOperationInf = (0, _helpers.getAsyncOperationInfo)(descriptors, asyncOperationDescriptor.parentOperationDescriptorId, asyncOperationParams),
        parentAsyncOperationDescriptor = _getAsyncOperationInf.asyncOperationDescriptor,
        parentAsyncOperationKey = _getAsyncOperationInf.asyncOperationKey;

    if (parentAsyncOperationDescriptor.operationType === _constants.ASYNC_OPERATION_TYPES.READ) {
      parentAsyncOperation = getAsyncOperation(state, parentAsyncOperationKey, parentAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction);
    }
  }

  if (!asyncOperation) {
    if (asyncOperationDescriptor.debug) {
      config.logger.verboseLoggingCallback("asyncOperation not found with given key: ".concat(asyncOperationKey, ". Defaulting to an initial asyncOperation"));
    }

    return asyncOperationDescriptor.operationType === _constants.ASYNC_OPERATION_TYPES.READ ? (0, _asyncOperationUtils.initialReadAsyncOperationForAction)(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation) : (0, _asyncOperationUtils.initialWriteAsyncOperationForAction)(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation);
  }

  if (asyncOperationDescriptor.invalidatingOperationsDescriptorIds) {
    // we want to detect whether to invalidate the async operation if an async operation has been found
    var invalidateOperation = false;
    (0, _lodash.forEach)(asyncOperationDescriptor.invalidatingOperationsDescriptorIds, function (descriptorId) {
      // hanlde if an asyncOperation invalidates itself
      if (descriptorId === asyncOperationDescriptor.descriptorId) {
        invalidateOperation = true;
        return false;
      }

      var _getAsyncOperationInf2 = (0, _helpers.getAsyncOperationInfo)(descriptors, descriptorId, asyncOperationParams),
          invalidatingAsyncOperationDescriptor = _getAsyncOperationInf2.asyncOperationDescriptor,
          invalidatingAsyncOperationKey = _getAsyncOperationInf2.asyncOperationKey;

      var invalidatingOperation = getAsyncOperation(state, invalidatingAsyncOperationKey, invalidatingAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction); // Handle invalidating operations with write or read operations.

      invalidateOperation = invalidatingAsyncOperationDescriptor.operationType === _constants.ASYNC_OPERATION_TYPES.READ ? invalidatingOperation.lastDataStatusTime.valueOf() >= asyncOperation.lastDataStatusTime.valueOf() : invalidatingOperation.lastFetchStatusTime.valueOf() >= asyncOperation.lastFetchStatusTime.valueOf();

      if (invalidateOperation) {
        return false;
      }

      return true;
    });

    if (invalidateOperation) {
      return (0, _asyncOperationUtils.initialReadAsyncOperationForAction)(asyncOperationDescriptor.descriptorId, fieldsToAddToAction);
    }
  } // We want to determine whether or not to use that parentAsyncOperation metaData based on the
  // newness of it's data in comparison to the asyncOperation


  if (parentAsyncOperation) {
    return parentAsyncOperation.lastDataStatusTime.valueOf() >= asyncOperation.lastDataStatusTime.valueOf() ? _objectSpread({}, asyncOperation, (0, _lodash.pick)(parentAsyncOperation, _constants.readAsyncOperationFieldsToPullFromParent)) : asyncOperation;
  }

  return asyncOperation;
};

var updateAsyncOperation = function updateAsyncOperation(state, asyncOperationKey, asyncOperation, asyncOperationDescriptor) {
  var config = _config.default.getConfig();

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback("Inside updateAsyncOperation for ".concat(asyncOperationKey));
    config.logger.infoLoggingCallback('updateAsyncOperation [Data Snapshot]:', {
      asyncOperationDescriptor: asyncOperationDescriptor,
      asyncOperation: asyncOperation,
      asyncOperationKey: asyncOperationKey
    });
  }

  _propTypes.default.checkPropTypes(_types.asyncOperationPropType, asyncOperation, 'prop', 'asyncOperation');

  return {
    operations: _objectSpread({}, state.operations, _defineProperty({}, asyncOperationKey, asyncOperation))
  };
};

var bulkUpdateAsyncOperations = function bulkUpdateAsyncOperations(state, asyncOperationsList) {
  return (0, _lodash.reduce)(asyncOperationsList, function (accumulator, _ref) {
    var asyncOperationKey = _ref.asyncOperationKey,
        asyncOperation = _ref.asyncOperation,
        asyncOperationDescriptor = _ref.asyncOperationDescriptor;
    return updateAsyncOperation(accumulator, asyncOperationKey, asyncOperation, asyncOperationDescriptor);
  }, state);
};

var _default = {
  updateAsyncOperationDescriptor: updateAsyncOperationDescriptor,
  updateAsyncOperation: updateAsyncOperation,
  bulkUpdateAsyncOperations: bulkUpdateAsyncOperations,
  getAsyncOperation: getAsyncOperation
};
exports.default = _default;
//# sourceMappingURL=asyncOperationStateUtils.js.map