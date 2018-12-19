## Getting Started
1. Setup reducer
```javascript
// rootReducer.js

import asyncOperationManager from 'async-operations-manager';

const rootReducer = combineReducers({
  asyncOperations: asyncOperationManager.reduxIntegration.asyncOperationReducer,
  // ... other reducers
});
```
2. Register descriptors and create actions
```javacript
// employeeActions.js

import asyncOperationManager from 'async-operations-manager';

const {
  reduxIntegration: {
      createAsyncOperationBeginAction,
      createAsyncOperationResolveAction,
      createAsyncOperationRejectAction,
  },
} = asyncOperationManager;

export const FETCH_ALL_EMPLOYEES_BY_STORE_ID = 'FETCH_ALL_EMPLOYEES_BY_STORE_ID'

asyncOperationManager.registerAsyncOperationDescriptors(
  {
    descriptorId: FETCH_ALL_EMPLOYEES_BY_STORE_ID,
    requiredParams: ['storeId'],
    operationType: asyncOperationManager.ASYNC_OPERATION_TYPES.READ,
  },
);

export function fetchAllEmployeesForStoreIdBeginAction(storeId) {
  // provides certain properties necessary to every async operation action
  return createAsyncOperationBeginAction(FETCH_ALL_EMPLOYEES_BY_STORE_ID, {
    storeId,
  });
}

export function fetchAllEmployeesForStoreIdResolveAction(storeId) {
  // provides certain properties necessary to every async operation action
  return createAsyncOperationBeginAction(FETCH_ALL_EMPLOYEES_BY_STORE_ID, {
    storeId,
  });
}

export function fetchAllEmployeesForStoreIdRejectAction(storeId) {
  // provides certain properties necessary to every async operation action
  return createAsyncOperationBeginAction(FETCH_ALL_EMPLOYEES_BY_STORE_ID, {
    storeId,
  });
}
```
#### Async request journey:
1. Identify an async request is going to happen (a request to fetch all users)
```javascript
const fetchAllEmployeesByStoreId = (storeId) => {
    // returns a promise
    return api.fetchAllEmployeesByStoreId(storeId);
};
```
2. `Begin` an async operation when you begin an async request (`getStateForOperationAfterStep`)
```javascript
import {
    fetchAllEmployeesForStoreIdBeginAction,
    fetchAllEmployeesForStoreIdResolveAction,
    fetchAllEmployeesForStoreIdRejectAction,
} from './employeeActions.js';

const fetchAllEmployeesByStoreId = (storeId) => {
    dispatch(fetchAllEmployeesForStoreIdBeginAction(storeId));
    // returns a promise
    return api.fetchAllEmployeesByStoreId(storeId)
};
```
3. `Resolve` or `Reject` an async operation after an async response (server response?) is received (`getStateForOperationAfterStep`)
```javascript
import {
    fetchAllEmployeesForStoreIdBeginAction,
    fetchAllEmployeesForStoreIdResolveAction,
    fetchAllEmployeesForStoreIdRejectAction,
} from './employeeActions.js';

const fetchAllEmployeesByStoreId = (storeId) => {
    dispatch(fetchAllEmployeesForStoreIdBeginAction(storeId));
    return api.fetchAllEmployeesByStoreId(storeId).then(response => {
            dispatch(fetchAllEmployeesForStoreIdResolveAction(storeId));
            return response;
    }).catch(err => {
        dispatch(fetchAllEmployeesForStoreIdRejectAction(storeId));
        return err
    ));
};
```



### Redux Integration API
| Name | Type |Description | Args |
| ------ | ------ | ------ | ------ |
| createAsyncOperationInitialAction | Function | Action Creator for an initial action with necessary properties to be used to kick-off an async operation for use in thunks, sagas, etc... when dispatched | (descriptorId: String, action: Object)
| createAsyncOperationBeginAction | Function | Action Creator for a `BEGIN` action for an async operation | (descriptorId: String, action: Object)
| createAsyncOperationResolveAction | Function | Action Creator for a `RESOLVE` action for an async operation | (descriptorId: String, action: Object)
| createAsyncOperationRejectAction | Function | Action Creator for a `REJECT` action for an async operation | (descriptorId: String, action: Object)
| getAsyncOperationResolveActionType | Function | Return the action type for an action that resolves an async operation for use in a reducer | (descriptorId: String)
| asyncOperationReducer | Function | The async operation reducer  | (state: Object, action: Object)