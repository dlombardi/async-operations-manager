// TODO: JSDocify every function

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
    asyncOperationManagerState = {
      descriptors: {
        ...asyncOperationManagerState.descriptors,
        ...newState.descriptors,
      },
      operations: {
        ...asyncOperationManagerState.operations,
        ...newState.operations,
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
