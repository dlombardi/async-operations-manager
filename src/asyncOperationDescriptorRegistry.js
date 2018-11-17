// TODO: JSDocify every function

const initialAsyncOperationDescriptors = {};

const asyncOperationDescriptorRegistry = (() => {
  let asyncOperationDescriptors;

  const getAsyncOperationDescriptors = () => {
    if (!asyncOperationDescriptors) {
      asyncOperationDescriptors = initialAsyncOperationDescriptors;
    }
    return asyncOperationDescriptors;
  };

  const setAsyncOperationDescriptors = (newAsyncOperationDescriptors) => {
    asyncOperationDescriptors = {
      ...asyncOperationDescriptors,
      ...newAsyncOperationDescriptors,
    };
    return asyncOperationDescriptors;
  };

  const clearAsyncOperationDescriptors = () => {
    asyncOperationDescriptors = initialAsyncOperationDescriptors;
    return asyncOperationDescriptors;
  };

  return {
    getAsyncOperationDescriptors,
    setAsyncOperationDescriptors,
    clearAsyncOperationDescriptors,
  };
})();

export {
  initialAsyncOperationDescriptors,
  asyncOperationDescriptorRegistry,
};
