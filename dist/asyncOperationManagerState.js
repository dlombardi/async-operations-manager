"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncOperationManagerState = exports.initialAsyncOperationManagerState = void 0;

var _lodash = require("lodash");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialAsyncOperationManagerState = {
  descriptors: {},
  operations: {}
};
exports.initialAsyncOperationManagerState = initialAsyncOperationManagerState;

var asyncOperationManagerState = function () {
  var state;

  var getState = function getState() {
    if (!state) {
      state = initialAsyncOperationManagerState;
    }

    return state;
  };

  var setState = function setState() {
    var newState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var newDescriptors = (0, _lodash.get)(newState, 'descriptors', {});
    var newOperations = (0, _lodash.get)(newState, 'operations', {});
    state = {
      descriptors: _objectSpread({}, state.descriptors, newDescriptors),
      operations: _objectSpread({}, state.operations, newOperations)
    };
    return state;
  };

  var clearState = function clearState() {
    state = initialAsyncOperationManagerState;
    return state;
  };

  return {
    getState: getState,
    setState: setState,
    clearState: clearState
  };
}();

exports.asyncOperationManagerState = asyncOperationManagerState;
//# sourceMappingURL=asyncOperationManagerState.js.map