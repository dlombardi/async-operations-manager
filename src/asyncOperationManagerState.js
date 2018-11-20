// TODO: JSDocify every function

import { get } from 'lodash';

const initialAsyncOperationManagerState = {
  descriptors: {},
  operations: {},
};

const asyncOperationManagerState = (() => {
  let state;

  const getState = () => {
    if (!state) {
      state = initialAsyncOperationManagerState;
    }
    return state;
  };

  const setState = (newState = {}) => {
    const newDescriptors = get(newState, 'descriptors', {});
    const newOperations = get(newState, 'operations', {});
    state = {
      descriptors: {
        ...state.descriptors,
        ...newDescriptors,
      },
      operations: {
        ...state.operations,
        ...newOperations,
      },
    };
    return state;
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
