// TODO: JSDocify every function

// 
// This file contains the 'switchboard' logic to coordinate the various
// lower-level functions that update state. These functions are exposed
// to the consumer of the library.
//

import { omit, isArray, isEmpty, reduce } from 'lodash';

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
} from './constants';

const getRegisteredAsyncDescriptors = () => asyncOperationManagerState.getState().descriptors;

const clearAsyncOperationsManagerState = asyncOperationManagerState.clearState;

const getAsyncOperationDescriptor = (descriptorId) => {
  const asyncOperationDescriptors = getRegisteredAsyncDescriptors();
  return asyncOperationStateUtils.getAsyncOperationDescriptor(asyncOperationDescriptors, descriptorId);
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
  const existingAsyncOperationDescriptors = getRegisteredAsyncDescriptors();
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
    }, existingAsyncOperationDescriptors);
  } else {
    newState = asyncOperationStateUtils.updateAsyncOperationDescriptor(existingAsyncOperationDescriptors, asyncOperationDescriptors);
  }

  return asyncOperationManagerState.setState(newState);
};

const getAsyncOperation = (state, descriptorId, params, otherFields) => {
  const {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
  } = getAsyncOperationInfo(descriptorId, params);

  return asyncOperationStateUtils.getAsyncOperation(state, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, otherFields);
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


  newState = asyncOperationManagerState.setState(state);

  const asyncOperationToTranform = getAsyncOperation(newState, descriptorId, asyncOperationParams, otherFields);
  const newAsyncOperation = transformTypeLookup[asyncOperationDescriptor.operationType](asyncOperationToTranform, asyncOperationStep, asyncOperationParams, otherFields);
  
  newState = asyncOperationStateUtils.updateAsyncOperation(newState, asyncOperationKey, newAsyncOperation, asyncOperationDescriptor);
  return asyncOperationManagerState.setState(newState).operations;
};

export {
  getRegisteredAsyncDescriptors,
  clearAsyncOperationsManagerState,
  getAsyncOperation,
  registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor,
  getStateForOperationAfterStep,
  getAsyncOperationInfo,
};