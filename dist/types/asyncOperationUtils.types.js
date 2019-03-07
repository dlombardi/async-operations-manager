"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncOperationDescriptorPropType = exports.asyncOperationPropType = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * PropTypes!
 */
var asyncOperationPropType = {
  descriptorId: _propTypes.default.string.isRequired,
  fetchStatus: _propTypes.default.oneOf(_lodash.default.values(_constants.FETCH_STATUS)).isRequired,
  dataStatus: _propTypes.default.oneOf(_lodash.default.values(_constants.DATA_STATUS)),
  message: _propTypes.default.string,
  lastFetchStatusTime: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  lastDataStatusTime: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
exports.asyncOperationPropType = asyncOperationPropType;
var asyncOperationDescriptorPropType = {
  descriptorId: _propTypes.default.string.isRequired,
  requiredParams: _propTypes.default.arrayOf(_propTypes.default.string),
  parentOperationDescriptorId: _propTypes.default.string,
  invalidatingOperationsDescriptorIds: _propTypes.default.arrayOf(_propTypes.default.string),
  operationType: _propTypes.default.oneOf(_lodash.default.values(_constants.ASYNC_OPERATION_TYPES)).isRequired
};
exports.asyncOperationDescriptorPropType = asyncOperationDescriptorPropType;
//# sourceMappingURL=asyncOperationUtils.types.js.map