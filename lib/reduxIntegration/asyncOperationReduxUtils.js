"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsyncOperationRejectAction = exports.createAsyncOperationResolveAction = exports.createAsyncOperationBeginAction = exports.createAsyncOperationInitialAction = void 0;

require("core-js/modules/web.dom.iterable");

var _constants = require("../constants");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const createAsyncOperationInitialAction = (descriptorId, action) => {
  return _objectSpread({}, action, {
    type: descriptorId,
    descriptorId
  });
};

exports.createAsyncOperationInitialAction = createAsyncOperationInitialAction;

const createAsyncOperationBeginAction = (descriptorId, action) => {
  return _objectSpread({}, action, {
    descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION,
    type: `AOM//BEGIN__${descriptorId}`
  });
};

exports.createAsyncOperationBeginAction = createAsyncOperationBeginAction;

const createAsyncOperationResolveAction = (descriptorId, action) => {
  return _objectSpread({}, action, {
    descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION,
    type: `AOM//RESOLVE__${descriptorId}`
  });
};

exports.createAsyncOperationResolveAction = createAsyncOperationResolveAction;

const createAsyncOperationRejectAction = (descriptorId, action) => {
  return _objectSpread({}, action, {
    descriptorId,
    operationStep: _constants.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION,
    type: `AOM//REJECT__${descriptorId}`
  });
};

exports.createAsyncOperationRejectAction = createAsyncOperationRejectAction;