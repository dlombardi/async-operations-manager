// TODO: JSDocify every function

import {
  assign,
  every,
  keyBy,
  has,
  isString,
  partial,
  pick,
  omit,
  some,
  values,
} from 'lodash';

import asyncOperationManagerConfig from './config';

const makeConstantsObject = (sourceValues = [], extraOverrides = {}) =>
  Object.freeze(
    // The keyBy create our keys-and-values object, then we manipulate it and freeze it.s
    assign(keyBy(sourceValues), extraOverrides)
  );


const generateAsyncOperationKey = (descriptorId, requiredParams) => {
  const config = asyncOperationManagerConfig.getConfig();
  
  if (!descriptorId || !isString(descriptorId)) {
    config.logger.exceptionsCallback('A descriptorId string to create the async operation key was not provided');
  }
  if (requiredParams) {
    return `${descriptorId}_${values(requiredParams).join('_')}`;
  }
  return descriptorId;
};

const getAndValidateParams = (paramsToCheck, asyncOperationDescriptor) => {
  let asyncOperationParams = null;
  const { logger } = asyncOperationManagerConfig.getConfig();
  if (asyncOperationDescriptor.requiredParams) {
    asyncOperationParams = asyncOperationDescriptor.requiredParams ? pick(paramsToCheck, asyncOperationDescriptor.requiredParams) : null;
    if (!every(asyncOperationDescriptor.requiredParams, partial(has, asyncOperationParams)) || (asyncOperationParams && some(asyncOperationParams, paramValue => !paramValue))) {
      // This warning is here just to catch typos
      logger.exceptionsCallback(`
        It looks like ${asyncOperationDescriptor.descriptorId} is missing a param/requiredParams.
        requiredParams provided: : ${asyncOperationParams}
        requiredParams: : ${asyncOperationDescriptor.requiredParams}
      `);
    }
  }

  return asyncOperationParams;
};

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

const getAsyncOperationInfo = (descriptors, descriptorId, params) => {
  const asyncOperationDescriptor = getAsyncOperationDescriptor(descriptors, descriptorId);
  const asyncOperationParams = getAndValidateParams(params, asyncOperationDescriptor);
  const asyncOperationKey = generateAsyncOperationKey(descriptorId, asyncOperationParams);
  const otherFields = omit(params, asyncOperationDescriptor.requiredParams);

  return {
    asyncOperationDescriptor,
    asyncOperationParams,
    asyncOperationKey,
    otherFields,
  };
};

export {
  makeConstantsObject,
  generateAsyncOperationKey,
  getAndValidateParams,
  getAsyncOperationInfo,
};
