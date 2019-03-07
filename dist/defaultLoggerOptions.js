"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLoggerOptions = exports.defaultInitialLoggerOptions = void 0;

/* global __DEV__ */

/**
 * The default values used for some of the options are exported on their own, so that they can be referenced
 * if the consumer ever needs to reference the original value, after setting new defaults.
 */
var defaultInitialLoggerOptions = {
  exceptionsCallback: function exceptionsCallback(errorMessage, error) {
    console.error(errorMessage, error); // eslint-disable-line no-console

    throw error;
  }
};
exports.defaultInitialLoggerOptions = defaultInitialLoggerOptions;
var defaultLoggerOptions = {
  useConsoleGroup: true,
  verboseLoggingEnabled: false,
  verboseLoggingCallback: console.log,

  /* eslint-disable-line no-console */
  infoLoggingCallback: console.info,

  /* eslint-disable-line no-console */
  performanceChecksEnabled: typeof __DEV__ !== 'undefined' && !!__DEV__,
  performanceChecksCallback: console.log,

  /* eslint-disable-line no-console */
  warningsEnabled: true,
  warningsCallback: console.warn,

  /* eslint-disable-line no-console */
  exceptionsCallback: defaultInitialLoggerOptions.exceptionsCallback
};
exports.defaultLoggerOptions = defaultLoggerOptions;
//# sourceMappingURL=defaultLoggerOptions.js.map