import {
  makeConstantsObject,
} from './helpers';

const readAsyncOperationFieldsToPullFromParent = [
  'fetchStatus',
  'dataStatus',
  'lastFetchStatusTime',
  'lastDataStatusTime',
];

const ASYNC_OPERATION_STEPS = makeConstantsObject([
  'BEGIN_ASYNC_OPERATION',
  'RESOLVE_ASYNC_OPERATION',
  'REJECT_ASYNC_OPERATION',
]);

const ASYNC_OPERATION_TYPES  = makeConstantsObject([
  'READ',
  'WRITE',
]);

/**
 * In general this is used to note the status of the last fetch attempted for a backend operation.
 */
const FETCH_STATUS = makeConstantsObject([
  // Default: we haven't tried to fetch yet
  'NULL',
  // Indicates that a request is in flight.
  'PENDING',
  // Indicates that the request completed and all is well
  'SUCCESSFUL',
  // Indicates that something went wrong: the request didn't complete, or it completed with
  // an http, payload/parsing, or business logic error.
  // @TODO: Should we distinguish between "request completed by result failed" vs
  //        "request didn't complete due to timeout or network error"?
  'FAILED',
  // @TODO: Is it worth adding 'SKIPPED' or 'OFFLINE' for cases where we were asked to
  //        do a fetch but didn't even try?
]);


/**
 * In general this is used to note the presence of data for a specific backend operation.
 */
const DATA_STATUS = makeConstantsObject([
  // Default: we haven't received anything
  'ABSENT',
  // Result was received and we have data
  'PRESENT',
  // @TODO: Is it worth tracking an OFFLINE-like state?
]);

export {
  readAsyncOperationFieldsToPullFromParent,

  ASYNC_OPERATION_TYPES,
  ASYNC_OPERATION_STEPS,
  FETCH_STATUS,
  DATA_STATUS,
};
