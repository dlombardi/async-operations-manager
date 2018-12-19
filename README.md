[![Build Status](https://travis-ci.com/dlombardi/async-operations-manager.svg?branch=master)](https://travis-ci.com/dlombardi/async-operations-manager)

# Getting Started
---
This project is in its infancy, and does not yet have an installable package or distribution.

If you want to use it anyway, you can import it by specifying the desired commit hash in package.json, and then instruct Babel to transform node_modules/async-operations-manager.

A distributed package is currently planned for after the API has stabilized and test coverage is satisfactory.

## Mission Statement:
`async-operations-manager` seeks to minimize the boilerplate to handle and maximize the exposure of stateful information of async requests in a state-driven application.

## What is an Async Operation?

The idea is for an async operation is an object containing all of the metaData inherent to accurately represent the state of an async request. There are fundamentally two types of async operations; `read` and `write`.

```javascript
const readAsyncOperation = {
  descriptorId: 'FETCH_EXAMPLE',
  // The fetch status of the async operation ('NULL' | 'PENDING' | 'SUCCESSFUL' | 'FAILED')
  fetchStatus: FETCH_STATUS.NULL,
  // The status of the data of an async operation ('ABSENT' | 'PRESENT')
  dataStatus: DATA_STATUS.ABSENT,
  // Any message returned as a response from the request
  message: null,
  // Date-time of the last time the async operation had a fetch status of 'SUCCESSFUL'
  lastFetchStatusTime: 0,
  lastFetchFailed: false,
  // Date-time of the last time the async operation had a data status of 'PRESENT'
  lastDataStatusTime: 0,
}

// The write async operation has no need to have dataStatus metaData since it does not
// involve fetching data
const writeAsyncOperation = {
  descriptorId: 'UPDATE_EXAMPLE',
  fetchStatus: FETCH_STATUS.NULL,
  message: null,
  lastFetchStatusTime: 0,
};
```

This metaData can be used to better optimize async requests to a server (`lastFetchStatusTime`, `lastDataStatusTime`, `lastFetchFailed`) and also provides an api to hook into when determining what visual feedback to present the user as the async request makes its journey (`dataStatus` and `fetchStatus`).


## Core APIs
---
### Config API
| Name | Type |Description | Args |
| ------ | ------ | ------ | ------ |
| initializeWithOptions | Function | Set runtime config options for library | (config: { logger: Object })

### State API
| Name | Type |Description | Args |
| ------ | ------ | ------ | ------ |
| getAsyncOperationsManagerState | Function | Get current AOM state | None
| clearAsyncOperationsManagerState | Function | Clear current AOM state | None
| setAsyncOperationsManagerStatee | Function | Set current AOM state | None

### Operation API
| Name | Type |Description | Args |
| ------ | ------ | ------ | ------ |
| registerAsyncOperationDescriptors | Function | Register async operation descriptor(s) | (asyncOperationDescriptor(s): can be an array of descriptors or one descriptor object)
| getAsyncOperation | Function | Get Async Operation from library state | (state: Object, descriptorId: String, params: Object, otherFields: Object)
| getAsyncOperationDescriptor | Function | Get a Descriptor for an Async Operation from library state | (descriptorId: String)
| getStateForOperationAfterStep | Function | Transform and return an Async Operation with a given step (Begin, Resolve, Reject) | (state: Object, asyncOperationStep: String, descriptorId: String, params: Object)
| shouldRunOperation | Function | Return a bool if *fetch* Operation should be run according to the corresponding Operation's Descriptor's caching options | (descriptorId: String, params: Object)


## Integrations
---
### Redux Integration API
| Name | Type |Description | Args |
| ------ | ------ | ------ | ------ |
| createAsyncOperationInitialAction | Function | Action Creator for an initial action with necessary properties to be used to kick-off an async operation when dispatched | (descriptorId: String, action: Object)
| createAsyncOperationBeginAction | Function | Action Creator for a `BEGIN` action for an async operation | (descriptorId: String, action: Object)
| createAsyncOperationResolveAction | Function | Action Creator for a `RESOLVE` action for an async operation | (descriptorId: String, action: Object)
| createAsyncOperationRejectAction | Function | Action Creator for a `REJECT` action for an async operation | (descriptorId: String, action: Object)
| getAsyncOperationResolveActionType | Function | Return the action type for an action that resolves an async operation for use in a reducer | (descriptorId: String)
| asyncOperationReducer | Function | The async operation reducer  | (state: Object, action: Object)

