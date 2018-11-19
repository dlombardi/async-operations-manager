// TODO: JSDocify every function

import { get } from 'lodash';

const initialAsyncOperationManagerState = {
  descriptors: {},
  operations: {},
};

const asyncOperationManagerState = (() => {
  let state;

  const getState = () => {
    if (!asyncOperationManagerState) {
      state = initialAsyncOperationManagerState;
    }
    return asyncOperationManagerState;
  };

  const setState = (newState = {}) => {
    const newDescriptors = get(newState, 'descriptors', {});
    const newOperations = get(newState, 'operations', {});
    state = {
      descriptors: {
        ...asyncOperationManagerState.descriptors,
        ...newDescriptors,
      },
      operations: {
        ...asyncOperationManagerState.operations,
        ...newOperations,
      },
    };
    return asyncOperationManagerState;
  };

  const clearState = () => {
    state = initialAsyncOperationManagerState;
    return state;
  };

  return {
    getState,
    setState,
    clearState,
  };
})();

export {
  initialAsyncOperationManagerState,
  asyncOperationManagerState,
};
