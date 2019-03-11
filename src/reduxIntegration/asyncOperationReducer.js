import { includes } from 'lodash';

import {
  getStateForOperationAfterStep,
  getAsyncOperationsManagerState,
} from '../asyncOperationManagerUtils';

import {
  ASYNC_OPERATION_STEPS,
} from '../constants';

function asyncOperationReducer(state = getAsyncOperationsManagerState(), action) {
  if (includes(ASYNC_OPERATION_STEPS, action.operationStep) && action.descriptorId) {
    return {
      ...state,
      ...getStateForOperationAfterStep(state, action.operationStep, action.descriptorId, action),
    };
  }
  return state;
}


export default asyncOperationReducer;
