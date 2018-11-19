// TODO: JSDocify every function

import { get } from 'lodash';

const initialAsyncOperationManagerState = {
  descriptors: {},
  operations: {},
}

const asyncOperationManagerState = (() => {
  let asyncOperationManagerState;

  const getState = () => {
    if (!asyncOperationManagerState) {
      asyncOperationManagerState = initialAsyncOperationManagerState;
    }
    return asyncOperationManagerState;
  };

  const setState = (newState) => {
    const newDescriptors = get(newState, 'descriptors', {});
    const newOperations = get(newState, 'operations', {});
    asyncOperationManagerState = {
      descriptors: {
        ...asyncOperationManagerState.descriptors,
        ...newDescriptors,
      },
      operations: {
        ...asyncOperationManagerState.operations,
        ...newOperations,
      }
    };
    return asyncOperationManagerState;
  };

  const clearState = () => {
    asyncOperationManagerState = initialAsyncOperationManagerState;
    return asyncOperationManagerState;
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
