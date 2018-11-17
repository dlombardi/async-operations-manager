import { defaultLoggerOptions } from './defaultLoggerOptions';

const initialConfig = {
  logger: defaultLoggerOptions,
};

const asyncOperationManagerConfig = (() => {
  let config;

  const getConfig = () => {
    if (!config) {
      config = initialConfig;
    }
    return config;
  };

  const setConfig = (newConfig) => {
    config = {
      ...config,
      ...newConfig,
    };
    return config;
  };

  return {
    setConfig,
    getConfig,
  };
})();


export default asyncOperationManagerConfig;
