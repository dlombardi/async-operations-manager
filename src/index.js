import {
  getRegisteredAsyncDescriptors,
  clearRegisteredAsyncDescriptors,
  getAsyncOperation,
  registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor,
} from './asyncOperationManagerUtils';

import {
  ASYNC_OPERATION_TYPES,
} from './constants';

import {
  defaultLoggerOptions,
} from './defaultLoggerOptions';

import asyncOperationManagerConfig from './config';

import reduxIntegration from './reduxIntegration';

// This is the library as exposed to the consumer
export default {
  // INTEGRATIONS //
  reduxIntegration,

  // CONFIG //
  initializeWithOptions: asyncOperationManagerConfig.setConfig,
  defaultLoggerOptions,

  // API //
  getRegisteredAsyncDescriptors,
  clearRegisteredAsyncDescriptors,
  getAsyncOperation,
  registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor,

  // CONSTANTS //
  ASYNC_OPERATION_TYPES,
};
