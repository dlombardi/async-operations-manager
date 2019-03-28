"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAsyncOperationInfo = exports.getAndValidateParams = exports.generateAsyncOperationKey = exports.makeConstantsObject = void 0;

var _lodash = require("lodash");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var makeConstantsObject = function makeConstantsObject() {
  var sourceValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var extraOverrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.freeze( // The keyBy create our keys-and-values object, then we manipulate it and freeze it.s
  (0, _lodash.assign)((0, _lodash.keyBy)(sourceValues), extraOverrides));
};

exports.makeConstantsObject = makeConstantsObject;

var generateAsyncOperationKey = function generateAsyncOperationKey(descriptorId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var config = _config.default.getConfig();

  var baseAsyncOperationKey = descriptorId;

  if (!descriptorId || !(0, _lodash.isString)(descriptorId)) {
    config.logger.exceptionsCallback('A descriptorId string to create the async operation key was not provided');
  }

  if (!(0, _lodash.isEmpty)(params)) {
    baseAsyncOperationKey = "".concat(baseAsyncOperationKey, "_").concat((0, _lodash.values)(params).join('_'));
  }

  return baseAsyncOperationKey;
};

exports.generateAsyncOperationKey = generateAsyncOperationKey;

var getAndValidateParams = function getAndValidateParams(paramsToCheck, asyncOperationDescriptor) {
  // Pick out designated required and optional params exclusively.
  var asyncOperationParams = _objectSpread({}, asyncOperationDescriptor.requiredParams ? (0, _lodash.pick)(paramsToCheck, asyncOperationDescriptor.requiredParams) : {}, asyncOperationDescriptor.optionalParams ? (0, _lodash.pick)(paramsToCheck, asyncOperationDescriptor.optionalParams) : {});

  var _asyncOperationManage = _config.default.getConfig(),
      logger = _asyncOperationManage.logger;

  if (asyncOperationDescriptor.requiredParams) {
    // make sure that every requiredParams is included in the asyncOperationParams object and that
    // none of the values are undefined
    if (!(0, _lodash.every)(asyncOperationDescriptor.requiredParams, (0, _lodash.partial)(_lodash.has, asyncOperationParams)) || asyncOperationParams && (0, _lodash.some)(asyncOperationParams, function (paramValue) {
      return (0, _lodash.isUndefined)(paramValue);
    })) {
      // This warning is here just to catch typos
      logger.exceptionsCallback("\n        It looks like ".concat(asyncOperationDescriptor.descriptorId, " is missing a param/requiredParams.\n        requiredParams provided: : ").concat(Object.keys(asyncOperationParams), "\n        requiredParams: : ").concat(asyncOperationDescriptor.requiredParams, "\n      "));
    }
  }

  return asyncOperationParams;
};

exports.getAndValidateParams = getAndValidateParams;

var getAsyncOperationDescriptor = function getAsyncOperationDescriptor(asyncOperationDescriptors, descriptorId) {
  var config = _config.default.getConfig();

  var asyncOperationDescriptor = asyncOperationDescriptors[descriptorId];

  if (!asyncOperationDescriptor) {
    config.logger.warningsCallback("descriptorId \"".concat(descriptorId, "\" does not match with any registered async operation descriptor"));
    return null;
  }

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback("Inside getAsyncOperationDescriptor for ".concat(descriptorId));
    config.logger.infoLoggingCallback('getAsyncOperationDescriptor [Data Snapshot]:', {
      asyncOperationDescriptors: asyncOperationDescriptors,
      asyncOperationDescriptor: asyncOperationDescriptor
    });
  }

  return asyncOperationDescriptor;
};

var getAsyncOperationInfo = function getAsyncOperationInfo(descriptors, descriptorId, params) {
  var asyncOperationDescriptor = getAsyncOperationDescriptor(descriptors, descriptorId);
  var asyncOperationParams = getAndValidateParams(params, asyncOperationDescriptor);
  var asyncOperationKey = generateAsyncOperationKey(descriptorId, asyncOperationParams);
  var otherFields = (0, _lodash.omit)(params, asyncOperationDescriptor.requiredParams);
  return {
    asyncOperationDescriptor: asyncOperationDescriptor,
    asyncOperationParams: asyncOperationParams,
    asyncOperationKey: asyncOperationKey,
    otherFields: otherFields
  };
};

exports.getAsyncOperationInfo = getAsyncOperationInfo;
//# sourceMappingURL=helpers.js.map