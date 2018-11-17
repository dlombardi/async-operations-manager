// TODO: JSDocify every function

import {
  ASYNC_OPERATION_STEPS,
} from '../constants';

const createAsyncOperationInitialAction = (descriptorId, action) => {
  return {
    ...action,
    type: descriptorId,
    descriptorId,
  };
};

const createAsyncOperationBeginAction = (descriptorId, action) => {
  return {
    ...action,
    descriptorId,
    operationStep: ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION,
    type: `AOM//BEGIN__${descriptorId}`,
  };
};

const createAsyncOperationResolveAction = (descriptorId, action) => {
  return {
    ...action,
    descriptorId,
    operationStep: ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION,
    type: `AOM//RESOLVE__${descriptorId}`,
  };
};

const createAsyncOperationRejectAction = (descriptorId, action) => {
  return {
    ...action,
    descriptorId,
    operationStep: ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION,
    type: `AOM//REJECT__${descriptorId}`,
  };
};

export {
  createAsyncOperationInitialAction,
  createAsyncOperationBeginAction,
  createAsyncOperationResolveAction,
  createAsyncOperationRejectAction,
};
