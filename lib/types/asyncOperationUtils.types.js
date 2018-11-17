"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncOperationDescriptorPropType = exports.asyncOperationPropType = void 0;

require("core-js/modules/web.dom.iterable");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @flow

/**
 * Flow types!
 */
// type asyncOperationType = {
//   fetchStatus: 'NULL' | 'PENDING' | 'SUCCESSFUL' | 'FAILED',
//   dataStatus: 'ABSENT' | 'PRESENT',
//   message: any,
//   lastFetchStatusTime: string,
//   lastDataStatusTime: string,
//   actionType: string,
// };
// type asyncOperationDescriptorType = {
//   descriptorId: string,
//   requiredParams: any,   // label + params make the key automatically
//   parentOperationDescriptorId: string, // trivial case: just reference by name
//   operationType: 'READ' | 'WRITE',
// };

/**
 * PropTypes!
 */
const asyncOperationPropType = {
  descriptorId: _propTypes.default.string.isRequired,
  fetchStatus: _propTypes.default.oneOf(_lodash.default.values(_constants.FETCH_STATUS)).isRequired,
  dataStatus: _propTypes.default.oneOf(_lodash.default.values(_constants.DATA_STATUS)),
  message: _propTypes.default.string,
  lastFetchStatusTime: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  lastDataStatusTime: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
exports.asyncOperationPropType = asyncOperationPropType;
const asyncOperationDescriptorPropType = {
  descriptorId: _propTypes.default.string.isRequired,
  requiredParams: _propTypes.default.arrayOf(_propTypes.default.string),
  parentOperationDescriptorId: _propTypes.default.string,
  operationType: _propTypes.default.oneOf(_lodash.default.values(_constants.ASYNC_OPERATION_TYPES)).isRequired
}; // export type {
//   asyncOperationType,
//   asyncOperationDescriptorType,
// };

exports.asyncOperationDescriptorPropType = asyncOperationDescriptorPropType;