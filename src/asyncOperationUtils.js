// @flow
// TODO: JSDocify every function

import _ from 'lodash';

import {
  readAsyncOperationFieldsToPullFromParent,
  FETCH_STATUS,
  DATA_STATUS,
} from './constants';

// An asyncOperation is an object that tracks the status of some data that we fetch from
// somewhere or send to somewhere. Each asyncOperation represents
// a single 'dataset' (which, today, always means a single ajax request -- although that's
// not a fixed constraint), and they're stored in Redux under operation-specific keys.
//
// "read" and "write" operations are *slightly* different, but they work the same way.
//
// The asyncOperation tracks information about:
//  - Our last attempt to fetch or write the data
//  - Whether we have data from a prior successful attempt (for reads only)
//  - The action and params and such that were used to request the data
//
// This file includes standalone functions that transform asyncOperations when we
// begin, resolve, or reject requests. In general, only reducers should use these functions.


/**
 * asyncOperations were originally always treated as proper immutable objects, but for background refreshes
 * it doesn't make sense to create a new object unless the status is actually different somehow, because
 * the new object will cause any screens that select the asyncOperation to rerender.
 *
 * So this is an experiment in having the asyncOperation object be *semi*-immutable: it will only yield
 * a new object instance if there's a noteworthy change in status.
 *
 * @type {boolean}
 */
const alwaysImmutable = false;


/**
 * This is the default look of brand new, never-touched asyncOperation.
 */
const initialReadAsyncOperation = {
  // Note that descriptorId is NOT included here: it MUST be provided!
  fetchStatus: FETCH_STATUS.NULL,
  dataStatus: DATA_STATUS.ABSENT,
  message: null,
  lastFetchStatusTime: 0,
  lastFetchFailed: false,
  lastDataStatusTime: 0,
};


const initialWriteAsyncOperation = {
  // Note that descriptorId is NOT included here: it MUST be provided!
  fetchStatus: FETCH_STATUS.NULL,
  message: null,
  lastFetchStatusTime: 0,
};

// BUT TWFetchData needs an descriptorId, so we'll export a helper that gives you that.
// This is really just syntactic sugar, but requiring people to use this ensures that
// we always have descriptorId.
// Note that we'll pull in any status (dataStatus, fetchStatus, etc) from the parent
// operation (which *should* be fetchAllBeveragesForOrg) to seed the initial status.
const initialReadAsyncOperationForAction = (
  descriptorId,
  fieldsToAdd = {},
  parentAsyncOperation = null
) => ({
  ...initialReadAsyncOperation,
  ...(parentAsyncOperation ? _.pick(parentAsyncOperation, readAsyncOperationFieldsToPullFromParent) : {}),
  ...fieldsToAdd,
  descriptorId,
});

const initialWriteAsyncOperationForAction = (
  descriptorId,
  fieldsToAdd = {}
) => ({
  ...initialWriteAsyncOperation,
  ...fieldsToAdd,
  descriptorId,
});

/**
 * These are intended for use in reducers, when a __BEGIN action comes in:
 * For read operations, we'll retain any prior dataStatus, but everything else gets reset.
 * Write operations are always a new, blank backendAsyncOperation.
 *
 * Note that you'll always want to specify `descriptorId` in fieldsToAdd, along with any IDs.
 */
const beginReadAsyncOperation = (
  previousAsyncOperation = initialReadAsyncOperation,
  fieldsToAdd = {}
) => {
  const fieldsForNewAsyncOperation = {
    // We re-initialize the entire operation state (except descriptorId and dataStatus) on __BEGIN.
    // (resolve/reject *don't* re-initialize: they carry through any IDs or other fields from before)
    descriptorId: previousAsyncOperation.descriptorId,
    fetchStatus: FETCH_STATUS.PENDING,
    dataStatus: previousAsyncOperation.dataStatus,
    message: null,
    lastFetchStatusTime: Date.now(),
    lastDataStatusTime: previousAsyncOperation.lastDataStatusTime,
    ...fieldsToAdd,
  };
  if (alwaysImmutable || previousAsyncOperation.dataStatus !== DATA_STATUS.PRESENT) {
    return fieldsForNewAsyncOperation;
  }
  Object.assign(previousAsyncOperation, fieldsForNewAsyncOperation);
  return previousAsyncOperation;
};
// Note that the 'write' works the same way as 'read', but instead of calling the base
// operation "previousAsyncOperation" we call it "initialAsyncOperation" since its role is different.
const beginWriteAsyncOperation = (
  initialAsyncOperation = initialWriteAsyncOperation,
  fieldsToAdd = {}
) => ({
  descriptorId: initialAsyncOperation.descriptorId,
  fetchStatus: FETCH_STATUS.PENDING,
  message: null,
  lastFetchStatusTime: Date.now(),
  ...fieldsToAdd,
});

/**
 * These are intended for use in reducers, when a __RESOLVE action comes in:
 * we'll mark that we have data, and will overwrite any prior data status.
 */
const resolveReadAsyncOperation = (
  previousAsyncOperation = initialReadAsyncOperation,
  fieldsToAdd = {}
) => {
  const currentTime = Date.now();
  const fieldsToUpdate = {
    fetchStatus: FETCH_STATUS.SUCCESSFUL,
    dataStatus: DATA_STATUS.PRESENT,
    lastFetchStatusTime: currentTime,
    lastFetchFailed: false,
    lastDataStatusTime: currentTime,
    ...fieldsToAdd,
  };
  if (alwaysImmutable || previousAsyncOperation.lastFetchFailed || previousAsyncOperation.dataStatus !== DATA_STATUS.PRESENT) {
    return {
      ...previousAsyncOperation,
      ...fieldsToUpdate,
    };
  }
  // Else: we already had data, and we weren't asked to be immutable, so this isn't a noteworthy change,
  // so mutate in place. (Eep)
  Object.assign(previousAsyncOperation, fieldsToUpdate);
  return previousAsyncOperation;
};

const resolveWriteAsyncOperation = (
  previousAsyncOperation = initialReadAsyncOperation,
  fieldsToAdd = {}
) => {
  const currentTime = Date.now();
  return {
    ...previousAsyncOperation,
    fetchStatus: FETCH_STATUS.SUCCESSFUL,
    lastFetchStatusTime: currentTime,
    ...fieldsToAdd,
  };
};

/**
 * These are intended for use in reducers, when a __REJECT action comes in:
 * we'll mark that things failed, but won't alter any prior data status (if it's a read).
 *
 * Note that you'll almost always want to specify `message` in fieldsToAdd.
 */
const rejectReadAsyncOperation = (
  previousAsyncOperation = initialReadAsyncOperation,
  fieldsToAdd = {}
) => ({
  ...previousAsyncOperation,
  fetchStatus: FETCH_STATUS.FAILED,
  lastFetchStatusTime: Date.now(),
  lastFetchFailed: true,
  ...fieldsToAdd,
});

const rejectWriteAsyncOperation = (
  previousAsyncOperation,
  fieldsToAdd = {}
) => ({
  ...previousAsyncOperation,
  fetchStatus: FETCH_STATUS.FAILED,
  lastFetchStatusTime: Date.now(),
  ...fieldsToAdd,
});

const getActionForAsyncOperation = (
  operation,
  configContainer,
  extraParams = {}
) => {
  // We're going to pull out all the fields we recognize -- for both Read and Write operations --
  // and anything left over is assumed to be part of the action (i.e., any necessary IDs or params)
  const {
    fetchStatus,
    dataStatus,
    message,
    lastFetchStatusTime,
    lastDataStatusTime,
    descriptorId,
    ...otherProps
  } = operation;

  if (!descriptorId) {
    console.warn('AsyncOperation needs to include descriptorId so that we can re-dispatch it.', operation);
  }

  return {
    type: descriptorId,
    configContainer,
    ...otherProps,
    ...extraParams,
  };
};


export {
  initialReadAsyncOperationForAction,
  initialWriteAsyncOperationForAction,
  beginReadAsyncOperation,
  beginWriteAsyncOperation,
  resolveReadAsyncOperation,
  resolveWriteAsyncOperation,
  rejectReadAsyncOperation,
  rejectWriteAsyncOperation,
  getActionForAsyncOperation,
};
