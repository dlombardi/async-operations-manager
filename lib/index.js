"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncOperationManagerUtils = require("./asyncOperationManagerUtils");

var _constants = require("./constants");

var _defaultLoggerOptions = require("./defaultLoggerOptions");

var _config = _interopRequireDefault(require("./config"));

var _reduxIntegration = _interopRequireDefault(require("./reduxIntegration"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is the library as exposed to the consumer
var _default = {
  // INTEGRATIONS //
  reduxIntegration: _reduxIntegration.default,
  // CONFIG //
  initializeWithOptions: _config.default.setConfig,
  defaultLoggerOptions: _defaultLoggerOptions.defaultLoggerOptions,
  // API //
  getRegisteredAsyncDescriptors: _asyncOperationManagerUtils.getRegisteredAsyncDescriptors,
  clearRegisteredAsyncDescriptors: _asyncOperationManagerUtils.clearRegisteredAsyncDescriptors,
  getAsyncOperation: _asyncOperationManagerUtils.getAsyncOperation,
  registerAsyncOperationDescriptors: _asyncOperationManagerUtils.registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor: _asyncOperationManagerUtils.getAsyncOperationDescriptor,
  // CONSTANTS //
  ASYNC_OPERATION_TYPES: _constants.ASYNC_OPERATION_TYPES
};
exports.default = _default;