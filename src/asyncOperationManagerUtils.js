// TODO: JSDocify every function

// 
// This file contains the 'switchboard' logic to coordinate the various
// lower-level functions that update state. These functions are exposed
// to the consumer of the library.
//

import {
  omit,
  isArray,
  isEmpty,
  reduce,
} from 'lodash';

import asyncOperationStateUtils from './asyncOperationStateUtils';
import asyncOperationManagerConfig from './config';
import { asyncOperationManagerState } from './asyncOperationManagerState';

import {
  beginReadAsyncOperation,
  beginWriteAsyncOperation,
  resolveReadAsyncOperation,
  resolveWriteAsyncOperation,
  rejectReadAsyncOperation,
  rejectWriteAsyncOperation,
} from './asyncOperationUtils';

import {
  generateAsyncOperationKey,
  getAndValidateParams,
} from './helpers';

import {
  ASYNC_OPERATION_TYPES,
  ASYNC_OPERATION_STEPS,
  FETCH_STATUS,
} from './constants';

const getAsyncOperationsManagerState = asyncOperationManagerState.getState;
const clearAsyncOperationsManagerState = asyncOperationManagerState.clearState;
const setAsyncOperationsManagerState = asyncOperationManagerState.setState;

const getAsyncOperationDescriptor = (descriptorId) => {
  const { descriptors } = getAsyncOperationsManagerState();
  return asyncOperationStateUtils.getAsyncOperationDescriptor(descriptors, descriptorId);
};

const getAsyncOperationInfo = (descriptorId, params) => {
  const asyncOperationDescriptor = getAsyncOperationDescriptor(descriptorId);
  const asyncOperationParams = getAndValidateParams(params, asyncOperationDescriptor);
  const asyncOperationKey = generateAsyncOperationKey(descriptorId, asyncOperationParams);
  const otherFields = omit(params, [...asyncOperationDescriptor.requiredParams]);

  return {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
    otherFields,
  };
};

const registerAsyncOperationDescriptors = (asyncOperationDescriptors, ...otherDescriptors) => {
  let newState;
  const state = getAsyncOperationsManagerState();
  const config = asyncOperationManagerConfig.getConfig();

  if (!isEmpty(otherDescriptors)) {
    config.logger.exceptionsCallback(`
      You provided more than one argument to registerAsyncOperationDescriptors.
      You likely forgot to put multiple descriptors within an array`, new Error());
  }
  // handle array or single object arguments
  if (isArray(asyncOperationDescriptors)) {
    newState = reduce(asyncOperationDescriptors, (acc, asyncOperationDescriptor) => {
      return asyncOperationStateUtils.updateAsyncOperationDescriptor(acc, asyncOperationDescriptor);
    }, state);
  } else {
    newState = asyncOperationStateUtils.updateAsyncOperationDescriptor(state, asyncOperationDescriptors);
  }

  return asyncOperationManagerState.setState(newState);
};

const getAsyncOperation = (state, descriptorId, params, otherFields) => {
  const {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
  } = getAsyncOperationInfo(descriptorId, params);

  // in case operation/descriptor state is initialized in userland we pass that through
  // to the library state.
  const newState = asyncOperationManagerState.setState(state);

  return asyncOperationStateUtils.getAsyncOperation(newState, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, otherFields);
};

const shouldRunOperation = (descriptorId, params) => {
  const {
    asyncOperationDescriptor,
    asyncOperationParams,
  } = getAsyncOperationInfo(descriptorId, params);

  const state = asyncOperationManagerState.getState();
  const asyncOperation = getAsyncOperation(state, descriptorId, asyncOperationParams);

  if (asyncOperationDescriptor.operationType === ASYNC_OPERATION_TYPES.READ && asyncOperation.fetchStatus !== FETCH_STATUS.NULL) {
    return (Date.now() - asyncOperation.lastFetchStatusTime) >= asyncOperationDescriptor.minCacheTime;
  }

  return true;
};

// switchboard for resolving the Read operation steps
const readStepLookup = {
  [ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => beginReadAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
  [ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => resolveReadAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
  [ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => rejectReadAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
};

// switchboard for resolving Write operation steps
const writeStepLookup = {
  [ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => beginWriteAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
  [ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => resolveWriteAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
  [ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION]:
    (asyncOperation, asyncOperationParams, otherFields) => rejectWriteAsyncOperation(asyncOperation, asyncOperationParams, otherFields),
};

// first switchboard to transform an async operation
const transformTypeLookup = {
  [ASYNC_OPERATION_TYPES.READ]:
    (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) => readStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields),
  [ASYNC_OPERATION_TYPES.WRITE]:
    (asyncOperation, asyncOperationStep, asyncOperationParams, otherFields) => writeStepLookup[asyncOperationStep](asyncOperation, asyncOperationParams, otherFields),
};

// this function is called in the reducer (in redux integration)
const getStateForOperationAfterStep = (state, asyncOperationStep, descriptorId, params) => {
  let newState;
  const {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
    otherFields,
  } = getAsyncOperationInfo(descriptorId, params);

  // in case operation/descriptor state is initialized in userland we pass that through
  // to the library state.
  newState = asyncOperationManagerState.setState(state);

  const asyncOperationToTranform = getAsyncOperation(newState, descriptorId, asyncOperationParams, otherFields);
  const newAsyncOperation = transformTypeLookup[asyncOperationDescriptor.operationType](asyncOperationToTranform, asyncOperationStep, asyncOperationParams, otherFields);

  newState = asyncOperationStateUtils.updateAsyncOperation(newState, asyncOperationKey, newAsyncOperation, asyncOperationDescriptor);
  return asyncOperationManagerState.setState(newState).operations;
};

export {
  getAsyncOperationsManagerState,
  clearAsyncOperationsManagerState,
  setAsyncOperationsManagerState,

  getAsyncOperation,
  registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor,
  getStateForOperationAfterStep,
  getAsyncOperationInfo,

  shouldRunOperation,
};
