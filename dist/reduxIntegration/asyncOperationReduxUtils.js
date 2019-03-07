"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionForAsyncOperation = exports.getAsyncOperationResolveActionType = exports.createAsyncOperationRejectAction = exports.createAsyncOperationResolveAction = exports.createAsyncOperationBeginAction = exports.createAsyncOperationInitialAction = void 0;

var _constants = require("../constants");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createAsyncOperationInitialAction = function createAsyncOperationInitialAction(descriptorId, action) {
  return _objectSpread({}, action, {
    type: descriptorId,
    descriptorId: descriptorId
  });
};

exports.createAsyncOperationInitialAction = createAsyncOperationInitialAction;

var createAsyncOperationBeginAction = function createAsyncOperationBeginAction(descriptorId, action) {
  return _objectSpread({}, action, {
    descriptorId: descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION,
    type: "AOM//BEGIN__".concat(descriptorId)
  });
};

exports.createAsyncOperationBeginAction = createAsyncOperationBeginAction;

var createAsyncOperationResolveAction = function createAsyncOperationResolveAction(descriptorId, action) {
  return _objectSpread({}, action, {
    descriptorId: descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION,
    type: "AOM//RESOLVE__".concat(descriptorId)
  });
};

exports.createAsyncOperationResolveAction = createAsyncOperationResolveAction;

var createAsyncOperationRejectAction = function createAsyncOperationRejectAction(descriptorId, action) {
  return _objectSpread({}, action, {
    descriptorId: descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION,
    type: "AOM//REJECT__".concat(descriptorId)
  });
};

exports.createAsyncOperationRejectAction = createAsyncOperationRejectAction;

var getAsyncOperationResolveActionType = function getAsyncOperationResolveActionType(descriptorId) {
  return "AOM//RESOLVE__".concat(descriptorId);
};

exports.getAsyncOperationResolveActionType = getAsyncOperationResolveActionType;

var getActionForAsyncOperation = function getActionForAsyncOperation(operation) {
  var extraParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // We're going to pull out all the fields we recognize -- for both Read and Write operations --
  // and anything left over is assumed to be part of the action (i.e., any necessary IDs or params)
  var fetchStatus = operation.fetchStatus,
      dataStatus = operation.dataStatus,
      message = operation.message,
      lastFetchStatusTime = operation.lastFetchStatusTime,
      lastDataStatusTime = operation.lastDataStatusTime,
      descriptorId = operation.descriptorId,
      otherProps = _objectWithoutProperties(operation, ["fetchStatus", "dataStatus", "message", "lastFetchStatusTime", "lastDataStatusTime", "descriptorId"]);

  if (!descriptorId) {
    console.warn('AsyncOperation needs to include descriptorId so that we can re-dispatch it.', operation);
  }

  return _objectSpread({
    type: descriptorId
  }, otherProps, extraParams);
};

exports.getActionForAsyncOperation = getActionForAsyncOperation;
//# sourceMappingURL=asyncOperationReduxUtils.js.map