"use strict";

require("core-js/modules/web.dom.iterable");

var _chai = require("chai");

var _asyncOperationManagerUtils = require("../asyncOperationManagerUtils");

/* eslint-env jest */
describe('asyncOperationManagerUtils', () => {
  let state;
  beforeEach(() => {
    state = {};
  });
  describe('registerAsyncOperationDescriptors', () => {
    it('should accept object argument to register one async operation decriptor to state', () => {
      (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
        descriptorId: 'FETCH_ALL_BEVERAGES_FOR_ORG',
        requiredParams: ['orgId'],
        operationType: 'READ'
      });
      const registeredAsyncDescriptors = (0, _asyncOperationManagerUtils.getRegisteredAsyncDescriptors)(state);
      (0, _chai.expect)(Object.keys(registeredAsyncDescriptors)).to.have.lengthOf(1);
      (0, _chai.expect)(registeredAsyncDescriptors).to.have.all.keys('FETCH_ALL_BEVERAGES_FOR_ORG');
    });
    it('should accept array argument to register multiple async operation descriptors to state', () => {
      (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)([{
        descriptorId: 'FETCH_ALL_BEVERAGES_FOR_ORG',
        requiredParams: ['orgId'],
        operationType: 'READ'
      }, {
        descriptorId: 'DRINK_BEVERAGE_BY_ID_FOR_ORG',
        requiredParams: ['orgId', 'beverageId'],
        operationType: 'WRITE'
      }]);
      const registeredAsyncDescriptors = (0, _asyncOperationManagerUtils.getRegisteredAsyncDescriptors)(state);
      (0, _chai.expect)(Object.keys(registeredAsyncDescriptors)).to.have.lengthOf(2);
      (0, _chai.expect)(registeredAsyncDescriptors).to.have.all.keys('FETCH_ALL_BEVERAGES_FOR_ORG', 'DRINK_BEVERAGE_BY_ID_FOR_ORG');
    });
  });
  describe('getAsyncOperationDescriptor', () => {
    it('should successfully return a registered asyncOperationDescriptor', () => {
      (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
        descriptorId: 'FETCH_PERSON_DATA_BY_ID',
        requiredParams: ['personId'],
        operationType: 'READ',
        // optional values
        parentAsyncOperation: 'FETCH_ALL_PERSON_DATA',
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000
      });
      const asyncOperationDescriptor = (0, _asyncOperationManagerUtils.getAsyncOperationDescriptor)('FETCH_PERSON_DATA_BY_ID');
      (0, _chai.expect)(asyncOperationDescriptor).to.be.an('object');
      (0, _chai.expect)(asyncOperationDescriptor).to.matchSnapshot('well formed async operation descriptor');
    });
  });
  describe('getStateForOperationAfterStep', () => {
    beforeEach(() => {
      const dateNowStub = jest.fn(() => 1530518207007);
      global.Date.now = dateNowStub;
    });
    describe('READ async operations', () => {
      it('should update state to read show async operation as pending state from initial state', () => {
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'FETCH_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'READ'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'BEGIN_ASYNC_OPERATION', 'FETCH_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'FETCH_PERSON_DATA_111.fetchStatus': 'PENDING'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing begun read async operation');
      });
      it('should update state to read show async operation as successful state from pending state', () => {
        state = {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'PENDING',
            dataStatus: 'ABSENT',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111
          }
        };
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'FETCH_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'READ'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'RESOLVE_ASYNC_OPERATION', 'FETCH_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'FETCH_PERSON_DATA_111.fetchStatus': 'SUCCESSFUL'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing successful read async operation');
      });
      it('should update state to read show async operation as failed state from pending state', () => {
        state = {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'PENDING',
            dataStatus: 'ABSENT',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111
          }
        };
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'FETCH_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'READ'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'REJECT_ASYNC_OPERATION', 'FETCH_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'FETCH_PERSON_DATA_111.fetchStatus': 'FAILED'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing rejected async operation');
      });
    });
    describe('WRITE async operations', () => {
      it('should update state to show write async operation as pending state from initial state', () => {
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'UPDATE_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'WRITE'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'BEGIN_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'UPDATE_PERSON_DATA_111.fetchStatus': 'PENDING'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing pending write async operation');
      });
      it('should update state to show write async operation as successful state from pending state', () => {
        state = {
          UPDATE_PERSON_DATA_111: {
            descriptorId: 'UPDATE_PERSON_DATA',
            fetchStatus: 'PENDING',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111
          }
        };
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'UPDATE_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'WRITE'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'RESOLVE_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'UPDATE_PERSON_DATA_111.fetchStatus': 'SUCCESSFUL'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing successful write async operation');
      });
      it('should update state to show write async operation as failed state from pending state', () => {
        state = {
          UPDATE_PERSON_DATA_111: {
            descriptorId: 'UPDATE_PERSON_DATA',
            fetchStatus: 'PENDING',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111
          }
        };
        (0, _asyncOperationManagerUtils.registerAsyncOperationDescriptors)({
          descriptorId: 'UPDATE_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'WRITE'
        });
        const transformedState = (0, _asyncOperationManagerUtils.getStateForOperationAfterStep)(state, 'REJECT_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', {
          personId: 111
        });
        (0, _chai.expect)(transformedState).to.nested.include({
          'UPDATE_PERSON_DATA_111.fetchStatus': 'FAILED'
        });
        (0, _chai.expect)(transformedState).to.matchSnapshot('updated state showing failed write async operation');
      });
    });
  });
});