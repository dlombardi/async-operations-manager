// TODO: JSDocify every function

import _ from 'lodash';
import asyncOperationMangerConfig from './config';

const makeConstantsObject = (sourceValues = [], extraOverrides = {}) =>
  Object.freeze(
    // The keyBy create our keys-and-values object, then we manipulate it and freeze it.s
    _.assign(_.keyBy(sourceValues), extraOverrides)
  );


const generateAsyncOperationKey = (descriptorId, requiredParams) => {
  const config = asyncOperationMangerConfig.getConfig();
  
  if (!descriptorId || !_.isString(descriptorId)) {
    config.logger.exceptionsCallback('A descriptorId string to create the async operation key was not provided');
  }
  if (requiredParams) {
    return `${descriptorId}_${_.values(requiredParams).join('_')}`;
  }
  return descriptorId;
};

const getAndValidateParams = (paramsToCheck, asyncOperationDescriptor) => {
  let asyncOperationParams = null;
  const { logger } = asyncOperationMangerConfig.getConfig();
  if (asyncOperationDescriptor.requiredParams) {
    asyncOperationParams = asyncOperationDescriptor.requiredParams ? _.pick(paramsToCheck, asyncOperationDescriptor.requiredParams) : null;
    if (!_.every(asyncOperationDescriptor.requiredParams, _.partial(_.has, asyncOperationParams)) || (asyncOperationParams && _.some(asyncOperationParams, paramValue => !paramValue))) {
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

export {
  makeConstantsObject,
  generateAsyncOperationKey,
  getAndValidateParams,
};
