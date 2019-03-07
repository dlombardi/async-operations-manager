"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DATA_STATUS = exports.FETCH_STATUS = exports.ASYNC_OPERATION_STEPS = exports.ASYNC_OPERATION_TYPES = exports.readAsyncOperationFieldsToPullFromParent = void 0;

var _helpers = require("./helpers");

var readAsyncOperationFieldsToPullFromParent = ['fetchStatus', 'dataStatus', 'lastFetchStatusTime', 'lastDataStatusTime'];
exports.readAsyncOperationFieldsToPullFromParent = readAsyncOperationFieldsToPullFromParent;
var ASYNC_OPERATION_STEPS = (0, _helpers.makeConstantsObject)(['BEGIN_ASYNC_OPERATION', 'RESOLVE_ASYNC_OPERATION', 'REJECT_ASYNC_OPERATION']);
exports.ASYNC_OPERATION_STEPS = ASYNC_OPERATION_STEPS;
var ASYNC_OPERATION_TYPES = (0, _helpers.makeConstantsObject)(['READ', 'WRITE']);
/**
 * In general this is used to note the status of the last fetch attempted for a backend operation.
 */

exports.ASYNC_OPERATION_TYPES = ASYNC_OPERATION_TYPES;
var FETCH_STATUS = (0, _helpers.makeConstantsObject)([// Default: we haven't tried to fetch yet
'NULL', // Indicates that a request is in flight.
'PENDING', // Indicates that the request completed and all is well
'SUCCESSFUL', // Indicates that something went wrong: the request didn't complete, or it completed with
// an http, payload/parsing, or business logic error.
// @TODO: Should we distinguish between "request completed by result failed" vs
//        "request didn't complete due to timeout or network error"?
'FAILED']);
/**
 * In general this is used to note the presence of data for a specific backend operation.
 */

exports.FETCH_STATUS = FETCH_STATUS;
var DATA_STATUS = (0, _helpers.makeConstantsObject)([// Default: we haven't received anything
'ABSENT', // Result was received and we have data
'PRESENT']);
exports.DATA_STATUS = DATA_STATUS;
//# sourceMappingURL=constants.js.map