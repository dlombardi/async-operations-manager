"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncOperationDescriptorRegistry = exports.initialAsyncOperationDescriptors = void 0;

require("core-js/modules/web.dom.iterable");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: JSDocify every function
const initialAsyncOperationDescriptors = {};
exports.initialAsyncOperationDescriptors = initialAsyncOperationDescriptors;

const asyncOperationDescriptorRegistry = (() => {
  let asyncOperationDescriptors;

  const getAsyncOperationDescriptors = () => {
    if (!asyncOperationDescriptors) {
      asyncOperationDescriptors = initialAsyncOperationDescriptors;
    }

    return asyncOperationDescriptors;
  };

  const setAsyncOperationDescriptors = newAsyncOperationDescriptors => {
    asyncOperationDescriptors = _objectSpread({}, asyncOperationDescriptors, newAsyncOperationDescriptors);
    return asyncOperationDescriptors;
  };

  const clearAsyncOperationDescriptors = () => {
    asyncOperationDescriptors = initialAsyncOperationDescriptors;
    return asyncOperationDescriptors;
  };

  return {
    getAsyncOperationDescriptors,
    setAsyncOperationDescriptors,
    clearAsyncOperationDescriptors
  };
})();

exports.asyncOperationDescriptorRegistry = asyncOperationDescriptorRegistry;