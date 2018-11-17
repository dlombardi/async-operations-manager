/* global __DEV__ */


/**
 * The default values used for some of the options are exported on their own, so that they can be referenced
 * if the consumer ever needs to reference the original value, after setting new defaults.
 */
const defaultInitialLoggerOptions = {
  exceptionsCallback: (errorMessage, error) => {
    console.error(errorMessage, error); // eslint-disable-line no-console
    throw error;
  },
};

const defaultLoggerOptions = {
  useConsoleGroup: true,
  verboseLoggingEnabled: false,
  verboseLoggingCallback: console.log, /* eslint-disable-line no-console */
  infoLoggingCallback: console.info, /* eslint-disable-line no-console */
  performanceChecksEnabled: (typeof __DEV__ !== 'undefined' && !!__DEV__),
  performanceChecksCallback: console.log, /* eslint-disable-line no-console */
  warningsEnabled: true,
  warningsCallback: console.warn, /* eslint-disable-line no-console */
  exceptionsCallback: defaultInitialLoggerOptions.exceptionsCallback,
};

export {
  defaultInitialLoggerOptions,
  defaultLoggerOptions,
};
