"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "reduxIntegration", {
  enumerable: true,
  get: function get() {
    return _reduxIntegration2.default;
  }
});
exports.default = void 0;

var _asyncOperationManagerUtils = require("./asyncOperationManagerUtils");

var _constants = require("./constants");

var _defaultLoggerOptions = require("./defaultLoggerOptions");

var _config = _interopRequireDefault(require("./config"));

var _reduxIntegration2 = _interopRequireDefault(require("./reduxIntegration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export integration as named exports
// This is the library as exposed to the consumer
var _default = {
  // CONFIG //
  initializeWithOptions: _config.default.setConfig,
  defaultLoggerOptions: _defaultLoggerOptions.defaultLoggerOptions,
  // State API //
  getAsyncOperationsManagerState: _asyncOperationManagerUtils.getAsyncOperationsManagerState,
  clearAsyncOperationsManagerState: _asyncOperationManagerUtils.clearAsyncOperationsManagerState,
  setAsyncOperationsManagerState: _asyncOperationManagerUtils.setAsyncOperationsManagerState,
  // Operation & Decriptor API //
  getAsyncOperation: _asyncOperationManagerUtils.getAsyncOperation,
  getAsyncOperationDescriptor: _asyncOperationManagerUtils.getAsyncOperationDescriptor,
  getStateForOperationAfterStep: _asyncOperationManagerUtils.getStateForOperationAfterStep,
  registerAsyncOperationDescriptors: _asyncOperationManagerUtils.registerAsyncOperationDescriptors,
  shouldRunOperation: _asyncOperationManagerUtils.shouldRunOperation,
  // CONSTANTS //
  ASYNC_OPERATION_TYPES: _constants.ASYNC_OPERATION_TYPES,
  ASYNC_OPERATION_STEPS: _constants.ASYNC_OPERATION_STEPS,
  FETCH_STATUS: _constants.FETCH_STATUS,
  DATA_STATUS: _constants.DATA_STATUS
};
exports.default = _default;
//# sourceMappingURL=index.js.map