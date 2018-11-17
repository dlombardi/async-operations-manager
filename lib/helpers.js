"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAndValidateParams = exports.generateAsyncOperationKey = exports.makeConstantsObject = void 0;

require("core-js/modules/web.dom.iterable");

var _lodash = _interopRequireDefault(require("lodash"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: JSDocify every function
const makeConstantsObject = function makeConstantsObject() {
  let sourceValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let extraOverrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.freeze( // The keyBy create our keys-and-values object, then we manipulate it and freeze it.s
  _lodash.default.assign(_lodash.default.keyBy(sourceValues), extraOverrides));
};

exports.makeConstantsObject = makeConstantsObject;

const generateAsyncOperationKey = (descriptorId, requiredParams) => {
  const config = _config.default.getConfig();

  if (!descriptorId || !_lodash.default.isString(descriptorId)) {
    config.logger.exceptionsCallback('A descriptorId string to create the async operation key was not provided');
  }

  if (requiredParams) {
    return `${descriptorId}_${_lodash.default.values(requiredParams).join('_')}`;
  }

  return descriptorId;
};

exports.generateAsyncOperationKey = generateAsyncOperationKey;

const getAndValidateParams = (paramsToCheck, asyncOperationDescriptor) => {
  let asyncOperationParams = null;

  const _asyncOperationManger = _config.default.getConfig(),
        logger = _asyncOperationManger.logger;

  if (asyncOperationDescriptor.requiredParams) {
    asyncOperationParams = asyncOperationDescriptor.requiredParams ? _lodash.default.pick(paramsToCheck, asyncOperationDescriptor.requiredParams) : null;

    if (!_lodash.default.every(asyncOperationDescriptor.requiredParams, _lodash.default.partial(_lodash.default.has, asyncOperationParams)) || asyncOperationParams && _lodash.default.some(asyncOperationParams, paramValue => !paramValue)) {
      // This warning is here just to catch typos
      logger.exceptionsCallback(`
        It looks like ${asyncOperationDescriptor.descriptorId} is missing a param/requiredParams.
        requiredParams provided: : ${asyncOperationParams}
        requiredParams: : ${asyncOperationDescriptor.requiredParams}
      `);
    }
  }

  return asyncOperationParams;
};

exports.getAndValidateParams = getAndValidateParams;