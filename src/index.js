import {
  getAsyncOperationsManagerState,
  clearAsyncOperationsManagerState,
  setAsyncOperationsManagerState,

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

  // State API //
  getAsyncOperationsManagerState,
  clearAsyncOperationsManagerState,
  setAsyncOperationsManagerState,

  // Operation & Decriptor API //
  getAsyncOperation,
  getAsyncOperationDescriptor,
  registerAsyncOperationDescriptors,

  // CONSTANTS //
  ASYNC_OPERATION_TYPES,
};
