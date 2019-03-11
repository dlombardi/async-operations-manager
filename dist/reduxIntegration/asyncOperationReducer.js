"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _asyncOperationManagerUtils = require("../asyncOperationManagerUtils");

var _constants = require("../constants");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncOperationReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _asyncOperationManagerUtils.getAsyncOperationsManagerState)();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  if ((0, _lodash.includes)(_constants.ASYNC_OPERATION_STEPS, action.operationStep) && action.descriptorId) {
    return _objectSpread({}, state, (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, action.operationStep, action.descriptorId, action));
  }

  return state;
}

var _default = asyncOperationReducer;
exports.default = _default;
//# sourceMappingURL=asyncOperationReducer.js.map