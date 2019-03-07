"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rejectWriteAsyncOperation = exports.rejectReadAsyncOperation = exports.resolveWriteAsyncOperation = exports.resolveReadAsyncOperation = exports.beginWriteAsyncOperation = exports.beginReadAsyncOperation = exports.initialWriteAsyncOperationForAction = exports.initialReadAsyncOperationForAction = void 0;

var _lodash = require("lodash");

var _constants = require("./constants");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var alwaysImmutable = false;
/**
 * This is the default look of brand new, never-touched asyncOperation.
 */

var initialReadAsyncOperation = {
  // Note that descriptorId is NOT included here: it MUST be provided!
  fetchStatus: _constants.FETCH_STATUS.NULL,
  dataStatus: _constants.DATA_STATUS.ABSENT,
  message: null,
  lastFetchStatusTime: 0,
  lastFetchFailed: false,
  lastDataStatusTime: 0
};
var initialWriteAsyncOperation = {
  // Note that descriptorId is NOT included here: it MUST be provided!
  fetchStatus: _constants.FETCH_STATUS.NULL,
  message: null,
  lastFetchStatusTime: 0
}; // Note that we'll pull in any status (dataStatus, fetchStatus, etc) from the parent
// operation (which *should* be fetchAllBeveragesForOrg) to seed the initial status.

var initialReadAsyncOperationForAction = function initialReadAsyncOperationForAction(descriptorId) {
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parentAsyncOperation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return _objectSpread({}, initialReadAsyncOperation, parentAsyncOperation ? (0, _lodash.pick)(parentAsyncOperation, _constants.readAsyncOperationFieldsToPullFromParent) : {}, fieldsToAdd, {
    descriptorId: descriptorId
  });
};

exports.initialReadAsyncOperationForAction = initialReadAsyncOperationForAction;

var initialWriteAsyncOperationForAction = function initialWriteAsyncOperationForAction(descriptorId) {
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _objectSpread({}, initialWriteAsyncOperation, fieldsToAdd, {
    descriptorId: descriptorId
  });
};
/**
 * These are intended for use in reducers, when a __BEGIN action comes in:
 * For read operations, we'll retain any prior dataStatus, but everything else gets reset.
 * Write operations are always a new, blank backendAsyncOperation.
 *
 * Note that you'll always want to specify `descriptorId` in fieldsToAdd, along with any IDs.
 */


exports.initialWriteAsyncOperationForAction = initialWriteAsyncOperationForAction;

var beginReadAsyncOperation = function beginReadAsyncOperation() {
  var previousAsyncOperation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialReadAsyncOperation;
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var fieldsForNewAsyncOperation = _objectSpread({
    // We re-initialize the entire operation state (except descriptorId and dataStatus) on __BEGIN.
    // (resolve/reject *don't* re-initialize: they carry through any IDs or other fields from before)
    descriptorId: previousAsyncOperation.descriptorId,
    fetchStatus: _constants.FETCH_STATUS.PENDING,
    dataStatus: previousAsyncOperation.dataStatus,
    message: null,
    lastFetchStatusTime: Date.now(),
    lastDataStatusTime: previousAsyncOperation.lastDataStatusTime
  }, fieldsToAdd);

  if (alwaysImmutable || previousAsyncOperation.dataStatus !== _constants.DATA_STATUS.PRESENT) {
    return fieldsForNewAsyncOperation;
  }

  Object.assign(previousAsyncOperation, fieldsForNewAsyncOperation);
  return previousAsyncOperation;
}; // Note that the 'write' works the same way as 'read', but instead of calling the base
// operation "previousAsyncOperation" we call it "initialAsyncOperation" since its role is different.


exports.beginReadAsyncOperation = beginReadAsyncOperation;

var beginWriteAsyncOperation = function beginWriteAsyncOperation() {
  var initialAsyncOperation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialWriteAsyncOperation;
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _objectSpread({
    descriptorId: initialAsyncOperation.descriptorId,
    fetchStatus: _constants.FETCH_STATUS.PENDING,
    message: null,
    lastFetchStatusTime: Date.now()
  }, fieldsToAdd);
};
/**
 * These are intended for use in reducers, when a __RESOLVE action comes in:
 * we'll mark that we have data, and will overwrite any prior data status.
 */


exports.beginWriteAsyncOperation = beginWriteAsyncOperation;

var resolveReadAsyncOperation = function resolveReadAsyncOperation() {
  var previousAsyncOperation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialReadAsyncOperation;
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currentTime = Date.now();

  var fieldsToUpdate = _objectSpread({
    fetchStatus: _constants.FETCH_STATUS.SUCCESSFUL,
    dataStatus: _constants.DATA_STATUS.PRESENT,
    lastFetchStatusTime: currentTime,
    lastFetchFailed: false,
    lastDataStatusTime: currentTime
  }, fieldsToAdd);

  if (alwaysImmutable || previousAsyncOperation.lastFetchFailed || previousAsyncOperation.dataStatus !== _constants.DATA_STATUS.PRESENT) {
    return _objectSpread({}, previousAsyncOperation, fieldsToUpdate);
  } // Else: we already had data, and we weren't asked to be immutable, so this isn't a noteworthy change,
  // so mutate in place. (Eep)


  Object.assign(previousAsyncOperation, fieldsToUpdate);
  return previousAsyncOperation;
};

exports.resolveReadAsyncOperation = resolveReadAsyncOperation;

var resolveWriteAsyncOperation = function resolveWriteAsyncOperation() {
  var previousAsyncOperation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialReadAsyncOperation;
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currentTime = Date.now();
  return _objectSpread({}, previousAsyncOperation, {
    fetchStatus: _constants.FETCH_STATUS.SUCCESSFUL,
    lastFetchStatusTime: currentTime
  }, fieldsToAdd);
};
/**
 * These are intended for use in reducers, when a __REJECT action comes in:
 * we'll mark that things failed, but won't alter any prior data status (if it's a read).
 *
 * Note that you'll almost always want to specify `message` in fieldsToAdd.
 */


exports.resolveWriteAsyncOperation = resolveWriteAsyncOperation;

var rejectReadAsyncOperation = function rejectReadAsyncOperation() {
  var previousAsyncOperation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialReadAsyncOperation;
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _objectSpread({}, previousAsyncOperation, {
    fetchStatus: _constants.FETCH_STATUS.FAILED,
    lastFetchStatusTime: Date.now(),
    lastFetchFailed: true
  }, fieldsToAdd);
};

exports.rejectReadAsyncOperation = rejectReadAsyncOperation;

var rejectWriteAsyncOperation = function rejectWriteAsyncOperation(previousAsyncOperation) {
  var fieldsToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _objectSpread({}, previousAsyncOperation, {
    fetchStatus: _constants.FETCH_STATUS.FAILED,
    lastFetchStatusTime: Date.now()
  }, fieldsToAdd);
};

exports.rejectWriteAsyncOperation = rejectWriteAsyncOperation;
//# sourceMappingURL=asyncOperationUtils.js.map