"use strict";

require("core-js/modules/web.dom.iterable");

var _chai = require("chai");

var _asyncOperationReducer = _interopRequireDefault(require("../asyncOperationReducer"));

var _asyncOperationManagerUtils = require("../../asyncOperationManagerUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
describe('asyncOperationReducer', () => {
  let state;
  beforeEach(() => {
    state = {};
    (0, _asyncOperationManagerUtils.clearRegisteredAsyncDescriptors)();
    const dateNowStub = jest.fn(() => 1530518207007);
    global.Date.now = dateNowStub;
  });
  it('should return the initial state', () => {
    (0, _chai.expect)((0, _asyncOperationReducer.default)(undefined, {})).to.deep.equal(state);
  });
  it('should handle BEGIN_ASYNC_OPERATION for write action', () => {
    const action = {
      descriptorId: 'UPDATE_PERSON_DATA',
      operationStep: 'BEGIN_ASYNC_OPERATION',
      type: 'AOM//BEGIN__UPDATE_PERSON_DATA',
      actionType: 'UPDATE_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'UPDATE_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'WRITE'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('UPDATE_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for begun write async operation');
  });
  it('should handle RESOLVE_ASYNC_OPERATION for write action', () => {
    const action = {
      descriptorId: 'UPDATE_PERSON_DATA',
      operationStep: 'RESOLVE_ASYNC_OPERATION',
      type: 'AOM//RESOLVE__UPDATE_PERSON_DATA',
      actionType: 'UPDATE_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'UPDATE_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'WRITE'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('UPDATE_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for resolved write async operation');
  });
  it('should handle REJECT_ASYNC_OPERATION for write action', () => {
    const action = {
      descriptorId: 'UPDATE_PERSON_DATA',
      operationStep: 'REJECT_ASYNC_OPERATION',
      type: 'AOM//REJECT__UPDATE_PERSON_DATA',
      actionType: 'UPDATE_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'UPDATE_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'WRITE'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('UPDATE_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for rejected read async operation');
  });
  it('should handle BEGIN_ASYNC_OPERATION for read action', () => {
    const action = {
      descriptorId: 'FETCH_PERSON_DATA',
      operationStep: 'BEGIN_ASYNC_OPERATION',
      type: 'AOM//BEGIN__FETCH_PERSON_DATA',
      actionType: 'FETCH_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'FETCH_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'READ'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('FETCH_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for begun read async operation');
  });
  it('should handle RESOLVE_ASYNC_OPERATION for read action', () => {
    const action = {
      descriptorId: 'FETCH_PERSON_DATA',
      operationStep: 'RESOLVE_ASYNC_OPERATION',
      type: 'AOM//RESOLVE__FETCH_PERSON_DATA',
      actionType: 'FETCH_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'FETCH_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'READ'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('FETCH_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for resolved read async operation');
  });
  it('should handle REJECT_ASYNC_OPERATION for write action', () => {
    const action = {
      descriptorId: 'FETCH_PERSON_DATA',
      operationStep: 'REJECT_ASYNC_OPERATION',
      type: 'AOM//REJECT__FETCH_PERSON_DATA',
      actionType: 'FETCH_PERSON_DATA',
      personId: 111
    };
    (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
      descriptorId: 'FETCH_PERSON_DATA',
      requiredParams: ['personId'],
      operationType: 'WRITE'
    });
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.have.all.keys('FETCH_PERSON_DATA_111');
    (0, _chai.expect)((0, _asyncOperationReducer.default)(state, action)).to.matchSnapshot('well formed state for rejected write async operation');
  });
});