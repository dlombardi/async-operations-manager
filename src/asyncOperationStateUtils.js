
// TODO: JSDocify every function
import { pick, reduce } from 'lodash';
import PropTypes from 'prop-types';

import asyncOperationManagerConfig from './config';

import { asyncOperationManagerState } from './asyncOperationManagerState';

import {
  ASYNC_OPERATION_TYPES,
  readAsyncOperationFieldsToPullFromParent,
} from './constants';

import {
  generateAsyncOperationKey,
  getAndValidateParams,
} from './helpers';

import {
  asyncOperationDescriptorPropType,
  asyncOperationPropType,
} from './types';

import {
  initialReadAsyncOperationForAction,
  initialWriteAsyncOperationForAction,
} from './asyncOperationUtils';

const updateAsyncOperationDescriptor = (state, descriptorOptions) => {
  const asyncOperationDescriptor = {
    debug: false,
    parentOperationDescriptorId: null,
    alwaysImmutable: false,
    minCacheTime: 5000,
    maxCacheTime: 60000,
    ...descriptorOptions,
  };

  PropTypes.checkPropTypes(asyncOperationDescriptorPropType, asyncOperationDescriptor, 'prop', 'asyncOperationDescriptor');
  
  return {
    ...state,
    descriptors: {
      ...state.descriptors,
      [asyncOperationDescriptor.descriptorId]: asyncOperationDescriptor,
    }
  };
};

// validate whether the asyncOperationDescriptor exists
const getAsyncOperationDescriptor = (asyncOperationDescriptors, descriptorId) => {
  const config = asyncOperationManagerConfig.getConfig();
  const asyncOperationDescriptor = asyncOperationDescriptors[descriptorId];

  if (!asyncOperationDescriptor) {
    config.logger.warningsCallback(`descriptorId "${descriptorId}" does not match with any registered async operation descriptor`);
    return null;
  }

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside getAsyncOperationDescriptor for ${descriptorId}`);
    config.logger.infoLoggingCallback('getAsyncOperationDescriptor [Data Snapshot]:', {
      asyncOperationDescriptors,
      asyncOperationDescriptor,
    });
  }

  return asyncOperationDescriptor;
};

// This function will do all the work to determine if an async operation is returned as an initial async operation
// (if it is not found in state), an asyncOperation with parentAsyncOperation metaData (recursively searched to find if the parentAsyncOperation is more
// up-to-date) or just the asyncOperation itself if the none of the above apply.
const getAsyncOperation = (state, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, fieldsToAdd) => {
  const { descriptors: registeredDescriptors, operations } = state;

  const config = asyncOperationManagerConfig.getConfig();
  const fieldsToAddToAction = {
    ...asyncOperationParams,
    ...fieldsToAdd,
    // key for the descriptor of the asyncOperation
    descriptorId: asyncOperationDescriptor.descriptorId,
  };

  let parentAsyncOperation;
  let asyncOperation = operations[asyncOperationKey] || null;

  if (asyncOperationDescriptor.parentOperationDescriptorId) {
    // grab key, descriptor, params, and async operation for parentAsyncOperation
    const parentAsyncOperationDescriptor = getAsyncOperationDescriptor(registeredDescriptors, asyncOperationDescriptor.parentOperationDescriptorId);
    const parentAsyncOperationParams = getAndValidateParams(asyncOperationParams, parentAsyncOperationDescriptor);
    const parentAsyncOperationKey = generateAsyncOperationKey(
      asyncOperationDescriptor.parentOperationDescriptorId,
      parentAsyncOperationParams,
    );
    parentAsyncOperation = getAsyncOperation(state, parentAsyncOperationKey, parentAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction);
  }

  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside getAsyncOperation for ${asyncOperationKey}`);
    config.logger.infoLoggingCallback('getAsyncOperation [Data Snapshot]:', {
      state,
      asyncOperationParams,
      asyncOperationDescriptor,
      asyncOperation,
      asyncOperationKey,
    });
  }

  if (!asyncOperation) {
    if (asyncOperationDescriptor.debug) {
      config.logger.verboseLoggingCallback(`asyncOperation not found with given key: ${asyncOperationKey}. Defaulting to an initial asyncOperation`);
    }
    asyncOperation = asyncOperationDescriptor.operationType === ASYNC_OPERATION_TYPES.READ
      ? initialReadAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation)
      : initialWriteAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation);
  }

  // We want to determine whether or not to use that parentAsyncOperation metaData based on the
  // newness of it's data in comparison to the asyncOperation
  if (parentAsyncOperation && asyncOperation) {
    return parentAsyncOperation.lastDataStatusTime.valueOf() > asyncOperation.lastDataStatusTime.valueOf()
      ? {
        ...asyncOperation,
        // use parent async operation metaData (lastDataStatusTime, lastFetchStatusTime. etc...)
        ...pick(parentAsyncOperation, readAsyncOperationFieldsToPullFromParent),
      }
      : asyncOperation;
  }

  return asyncOperation;
};

const updateAsyncOperation = (state, asyncOperationKey, asyncOperation, asyncOperationDescriptor) => {
  const config = asyncOperationManagerConfig.getConfig();
  if (asyncOperationDescriptor.debug) {
    config.logger.verboseLoggingCallback(`Inside updateAsyncOperation for ${asyncOperationKey}`);
    config.logger.infoLoggingCallback('updateAsyncOperation [Data Snapshot]:', {
      asyncOperationDescriptor,
      asyncOperation,
      asyncOperationKey,
    });
  }

  PropTypes.checkPropTypes(asyncOperationPropType, asyncOperation, 'prop', 'asyncOperation');

  return {
    operations: {
      ...state.operations,
      [asyncOperationKey]: asyncOperation,
    }
  };
};

const bulkUpdateAsyncOperations = (state, asyncOperationsList) => {
  return reduce(asyncOperationsList, (accumulator, { asyncOperationKey, asyncOperation, asyncOperationDescriptor }) => {
    return updateAsyncOperation(accumulator, asyncOperationKey, asyncOperation, asyncOperationDescriptor);
  }, state);
};

export default {
  updateAsyncOperationDescriptor,

  updateAsyncOperation,
  bulkUpdateAsyncOperations,

  getAsyncOperation,
  getAsyncOperationDescriptor,
};
