[![Build Status](https://travis-ci.com/dlombardi/async-operations-manager.svg?branch=master)](https://travis-ci.com/dlombardi/async-operations-manager)

## Core APIs
---
### Config API
| Function | Description | Args |
| ------ | ------ | ------ |
| initializeWithOptions | Set runtime config options for library |

### State API
| Function | Description | Args |
| ------ | ------ | ------ |
| getAsyncOperationsManagerState | Get current AOM state |
| clearAsyncOperationsManagerState | Clear current AOM state |
| setAsyncOperationsManagerStatee | Set current AOM state |

### Operation API
| Function | Description | Args |
| ------ | ------ | ------ |
| registerAsyncOperationDescriptors | Register async operation (a) descriptor(s) |
| getAsyncOperation | Get Async Operation from library state |
| getAsyncOperationDescriptor | Get a Descriptor for an Async Operation from library state |
| getStateForOperationAfterStep | Transform and return an Async Operation with a given step (Begin, Resolve, Reject) |
| shouldRunOperation | Return a bool if *fetc*h Operation should be run according to corresponding Descriptor's caching options |


## Integrations
---
### Redux Integration API
| Function | Description | Args |
| ------ | ------ | ------ |
| createAsyncOperationInitialAction | Get current AOM state |
| createAsyncOperationBeginAction | Clear current AOM state |
| createAsyncOperationResolveAction | Set current AOM state |
| createAsyncOperationRejectAction | Set current AOM state |
| getAsyncOperationResolveActionType | Set current AOM state |
| asyncOperationReducer | Set current AOM state |
| getActionForAsyncOperation | Set current AOM state |

