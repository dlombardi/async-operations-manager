[![Build Status](https://travis-ci.com/dlombardi/async-operations-manager.svg?branch=master)](https://travis-ci.com/dlombardi/async-operations-manager)

# Getting Started
---
This project is in its infancy, and does not yet have an installable package or distribution.

If you want to use it anyway, you can import it by specifying the desired commit hash in package.json, and then instruct Babel to transform node_modules/async-operations-manager.

A distributed package is currently planned for after the API has stabilized and test coverage is satisfactory.

## Integration Guides
| Name | README |
| ---- | ---- |
| Redux | `src/reduxIntegration/README.md` |

## Mission Statement:
`async-operations-manager` seeks to minimize the overhead of generating stateful data of an async request while also providing a system to improve data-fetching performance through async operation parent-child relationships and caching.


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

## How to use Async Operations:

Everytime an async request completes a new stage of its journey we want to update the operation to reflect it's new state.
### Async request journey:
1. Identify an async request is going to happen (a request to fetch all users)
```javascript
const fetchAllEmployeesByStoreId = (storeId) => {
    // returns a promise
    return api.fetchAllEmployeesByStoreId(storeId);
};
```
2. Register an async operation descriptor for that async operation
```javascript
import asyncOperationManager from 'async-operations-manager';
asyncOperationManager.registerAsyncOperationDescriptors(
  {
    descriptorId: 'FETCH_ALL_EMPLOYEES_BY_STORE_ID',
    requiredParams: ['storeId'],
    operationType: asyncOperationManager.ASYNC_OPERATION_TYPES.READ,
  },
);
const fetchAllEmployeesByStoreId = (storeId) => {
    // returns a promise
    return api.fetchAllEmployeesByStoreId(storeId);
};
```
3. `Begin` an async operation when you begin an async request (`getStateForOperationAfterStep`)
```javascript
import asyncOperationManager from 'async-operations-manager';
asyncOperationManager.registerAsyncOperationDescriptors(
  {
    descriptorId: 'FETCH_ALL_EMPLOYEES_BY_STORE_ID',
    requiredParams: ['storeId'],
    operationType: asyncOperationManager.ASYNC_OPERATION_TYPES.READ,
  },
);

const fetchAllEmployeesByStoreId = (storeId) => {
    // transforms async operation to a begun state
    getStateForOperationAfterStep({}, asyncOperationManager.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION, 'FETCH_ALL_EMPLOYEES_BY_STORE_ID', { storeId: 2 })
    // returns a promise
    return api.fetchAllEmployeesByStoreId(storeId)
};
```
4. `Resolve` or `Reject` an async operation after an async response (server response?) is received (`getStateForOperationAfterStep`)
```javascript
import asyncOperationManager from 'async-operations-manager';
asyncOperationManager.registerAsyncOperationDescriptors(
  {
    descriptorId: 'FETCH_ALL_EMPLOYEES_BY_STORE_ID',
    requiredParams: ['storeId'],
    operationType: asyncOperationManager.ASYNC_OPERATION_TYPES.READ,
  },
);

const fetchAllEmployeesByStoreId = (storeId) => {
    // transforms async operation to a begun state
    getStateForOperationAfterStep({}, asyncOperationManager.ASYNC_OPERATION_STEPS.BEGIN_ASYNC_OPERATION, 'FETCH_ALL_EMPLOYEES_BY_STORE_ID', { storeId: 2 })
    return api.fetchAllEmployeesByStoreId(storeId).then(response => {
            // transforms async operation to a resolved state
            getStateForOperationAfterStep({}, asyncOperationManager.ASYNC_OPERATION_STEPS.RESOLVE_ASYNC_OPERATION, 'FETCH_ALL_EMPLOYEES_BY_STORE_ID', { storeId: 2 })
            return response;
    }).catch(err => {
        // transforms async operation to a rejected state
        getStateForOperationAfterStep({}, asyncOperationManager.ASYNC_OPERATION_STEPS.REJECT_ASYNC_OPERATION, 'FETCH_ALL_EMPLOYEES_BY_STORE_ID', { storeId: 2 })
        return err
    ));
};
```

## Async Operations Manager API
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


### Integration APIs
| Name | README |
| ---- | ---- |
| reduxIntegration | `src/reduxIntegration/README.md` |

