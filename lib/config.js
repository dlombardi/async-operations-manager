"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _defaultLoggerOptions = require("./defaultLoggerOptions");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialConfig = {
  logger: _defaultLoggerOptions.defaultLoggerOptions
};

const asyncOperationManagerConfig = (() => {
  let config;

  const getConfig = () => {
    if (!config) {
      config = initialConfig;
    }

    return config;
  };

  const setConfig = newConfig => {
    config = _objectSpread({}, config, newConfig);
    return config;
  };

  return {
    setConfig,
    getConfig
  };
})();

var _default = asyncOperationManagerConfig;
exports.default = _default;