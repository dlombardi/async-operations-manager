"use strict";

var _chai = require("chai");

var _asyncOperationReducer = _interopRequireDefault(require("../asyncOperationReducer"));

var _constants = require("../../constants");

var _asyncOperationReduxUtils = require("../asyncOperationReduxUtils");

var _asyncOperationManagerUtils = require("../../asyncOperationManagerUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
describe('scenario tests', function () {
  var state;
  beforeEach(function () {
    (0, _asyncOperationManagerUtils.clearAsyncOperationsManagerState)();
    var dateNowStub = jest.fn(function () {
      return 1530518207007;
    });
    global.Date.now = dateNowStub;
  });
  describe('READ operation scenarios', function () {
    var initialAction;
    var beginAction;
    beforeEach(function () {
      state = {};
      (0, _asyncOperationManagerUtils.clearAsyncOperationsManagerState)();
      (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ'
      });
      initialAction = (0, _asyncOperationReduxUtils.createAsyncOperationInitialAction)('FETCH_PERSON_DATA', {
        personId: 111
      });
      beginAction = (0, _asyncOperationReduxUtils.createAsyncOperationBeginAction)('FETCH_PERSON_DATA', {
        personId: 111
      });
    });
    it('should update a successful READ operation as expected from start to finish', function () {
      var resolveAction = (0, _asyncOperationReduxUtils.createAsyncOperationResolveAction)('FETCH_PERSON_DATA', {
        personId: 111
      });
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, initialAction)).to.deep.equal(state);
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, beginAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: _constants.FETCH_STATUS.PENDING,
          dataStatus: _constants.DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111
        }
      });
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, resolveAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: _constants.FETCH_STATUS.SUCCESSFUL,
          dataStatus: _constants.DATA_STATUS.PRESENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 1530518207007,
          personId: 111,
          lastFetchFailed: false
        }
      });
    });
    it('should update a failed READ operation as expected from start to finish', function () {
      var rejectAction = (0, _asyncOperationReduxUtils.createAsyncOperationRejectAction)('FETCH_PERSON_DATA', {
        personId: 111
      });
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, initialAction)).to.deep.equal(state);
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, beginAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: _constants.FETCH_STATUS.PENDING,
          dataStatus: _constants.DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111
        }
      });
      (0, _chai.expect)((0, _asyncOperationReducer.default)(state, rejectAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: _constants.FETCH_STATUS.FAILED,
          dataStatus: _constants.DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111,
          lastFetchFailed: true
        }
      });
    });
  });
  describe('WRITE operation scenarios', function () {
    beforeEach(function () {
      state = {};
      (0, _asyncOperationManagerUtils.clearAsyncOperationsManagerState)();
    });
  });
});
//# sourceMappingURL=functional_tests.js.map