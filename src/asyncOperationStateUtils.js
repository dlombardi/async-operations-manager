
// TODO: JSDocify every function
import { pick, forEach, reduce } from 'lodash';
import PropTypes from 'prop-types';

import asyncOperationManagerConfig from './config';

import {
  ASYNC_OPERATION_TYPES,
  readAsyncOperationFieldsToPullFromParent,
} from './constants';

import {
  getAsyncOperationInfo,
} from './helpers';

import {
  asyncOperationDescriptorPropType,
  asyncOperationPropType,
} from './types';

import {
  initialReadAsyncOperationForAction,
  initialWriteAsyncOperationForAction,
} from './asyncOperationUtils';

// // //
// // // These are all pure functions that return new or existing state or
// // // pieces of new or existing state from their inputs.
// // //

const updateAsyncOperationDescriptor = (state, descriptorOptions) => {
  const asyncOperationDescriptor = {
    debug: false,
    parentOperationDescriptorId: null,
    invalidatingOperationsDescriptorIds: null,
    alwaysImmutable: false,
    minCacheTime: 5000,
    maxCacheTime: 60000,
    requiredParams: {},
    ...descriptorOptions,
  };

  PropTypes.checkPropTypes(asyncOperationDescriptorPropType, asyncOperationDescriptor, 'prop', 'asyncOperationDescriptor');
  
  return {
    ...state,
    descriptors: {
      ...state.descriptors,
      [asyncOperationDescriptor.descriptorId]: asyncOperationDescriptor,
    },
  };
};

// This function will do all the work to determine if an async operation is returned as an initial async operation
// (if it is not found in state), an asyncOperation with parentAsyncOperation metaData (recursively searched to find if the parentAsyncOperation is more
// up-to-date) or just the asyncOperation itself if the none of the above apply.
const getAsyncOperation = (state, asyncOperationKey, asyncOperationDescriptor, asyncOperationParams, fieldsToAdd) => {
  const { operations, descriptors } = state;

  let parentAsyncOperation;
  const asyncOperation = operations[asyncOperationKey] || null;

  const config = asyncOperationManagerConfig.getConfig();
  const fieldsToAddToAction = {
    ...asyncOperationParams,
    ...fieldsToAdd,
    // key for the descriptor of the asyncOperation
    descriptorId: asyncOperationDescriptor.descriptorId,
  };

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

  if (asyncOperationDescriptor.parentOperationDescriptorId) {
    // grab key, descriptor, params, and async operation for parentAsyncOperation
    const {
      asyncOperationDescriptor: parentAsyncOperationDescriptor,
      asyncOperationKey: parentAsyncOperationKey,
    } = getAsyncOperationInfo(descriptors, asyncOperationDescriptor.parentOperationDescriptorId, asyncOperationParams);

    parentAsyncOperation = getAsyncOperation(state, parentAsyncOperationKey, parentAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction);
  }

  if (!asyncOperation) {
    if (asyncOperationDescriptor.debug) {
      config.logger.verboseLoggingCallback(`asyncOperation not found with given key: ${asyncOperationKey}. Defaulting to an initial asyncOperation`);
    }
    return asyncOperationDescriptor.operationType === ASYNC_OPERATION_TYPES.READ
      ? initialReadAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation)
      : initialWriteAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction, parentAsyncOperation);
  }

  if (asyncOperationDescriptor.invalidatingOperationsDescriptorIds) {
    // we want to detect whether to invalidate the async operation if an async operation has been found
    let invalidateOperation = false;

    forEach(asyncOperationDescriptor.invalidatingOperationsDescriptorIds, (acc, descriptorId) => {
      const {
        asyncOperationDescriptor: invalidatingAsyncOperationDescriptor,
        asyncOperationKey: invalidatingAsyncOperationKey,
      } = getAsyncOperationInfo(descriptors, descriptorId, asyncOperationParams);

      const invalidatingOperation = getAsyncOperation(state, invalidatingAsyncOperationKey, invalidatingAsyncOperationDescriptor, asyncOperationParams, fieldsToAddToAction);
      if (invalidatingOperation.lastDataStatusTime.valueOf() >= asyncOperation.lastDataStatusTime.valueOf()) {
        invalidateOperation = true;
        return false;
      }
      return true;
    });

    if (invalidateOperation) {
      return asyncOperationDescriptor.operationType === ASYNC_OPERATION_TYPES.READ
        ? initialReadAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction)
        : initialWriteAsyncOperationForAction(asyncOperationDescriptor.descriptorId, fieldsToAddToAction);
    }
  }

  // We want to determine whether or not to use that parentAsyncOperation metaData based on the
  // newness of it's data in comparison to the asyncOperation
  if (parentAsyncOperation) {
    return parentAsyncOperation.lastDataStatusTime.valueOf() >= asyncOperation.lastDataStatusTime.valueOf()
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
    },
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
};
