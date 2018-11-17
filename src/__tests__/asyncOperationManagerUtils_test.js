/* eslint-env jest */
import { expect } from 'chai';

import {
  getRegisteredAsyncDescriptors,
  registerAsyncOperationDescriptors,
  getAsyncOperationDescriptor,
  getStateForOperationAfterStep,
} from '../asyncOperationManagerUtils';

describe('asyncOperationManagerUtils', () => {
  let state;
  beforeEach(() => {
    state = {};
  });
  describe('registerAsyncOperationDescriptors', () => {
    it('should accept object argument to register one async operation decriptor to state', () => {
      registerAsyncOperationDescriptors(
        {
          descriptorId: 'FETCH_ALL_BEVERAGES_FOR_ORG',
          requiredParams: ['orgId'],
          operationType: 'READ',
        },
      );

      const registeredAsyncDescriptors = getRegisteredAsyncDescriptors(state);
      expect(Object.keys(registeredAsyncDescriptors)).to.have.lengthOf(1);
      expect(registeredAsyncDescriptors).to.have.all.keys('FETCH_ALL_BEVERAGES_FOR_ORG');
    });

    it('should accept array argument to register multiple async operation descriptors to state', () => {
      registerAsyncOperationDescriptors([
        {
          descriptorId: 'FETCH_ALL_BEVERAGES_FOR_ORG',
          requiredParams: ['orgId'],
          operationType: 'READ',
        },
        {
          descriptorId: 'DRINK_BEVERAGE_BY_ID_FOR_ORG',
          requiredParams: ['orgId', 'beverageId'],
          operationType: 'WRITE',
        },
      ]);

      const registeredAsyncDescriptors = getRegisteredAsyncDescriptors(state);
      expect(Object.keys(registeredAsyncDescriptors)).to.have.lengthOf(2);
      expect(registeredAsyncDescriptors).to.have.all.keys('FETCH_ALL_BEVERAGES_FOR_ORG', 'DRINK_BEVERAGE_BY_ID_FOR_ORG');
    });
  });

  describe('getAsyncOperationDescriptor', () => {
    it('should successfully return a registered asyncOperationDescriptor', () => {
      registerAsyncOperationDescriptors({
        descriptorId: 'FETCH_PERSON_DATA_BY_ID',
        requiredParams: ['personId'],
        operationType: 'READ',
        // optional values
        parentAsyncOperation: 'FETCH_ALL_PERSON_DATA',
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000,
      });
      const asyncOperationDescriptor = getAsyncOperationDescriptor('FETCH_PERSON_DATA_BY_ID');
      expect(asyncOperationDescriptor).to.be.an('object');
      expect(asyncOperationDescriptor).to.matchSnapshot('well formed async operation descriptor');
    });
  });

  describe('getStateForOperationAfterStep', () => {
    beforeEach(() => {
      const dateNowStub = jest.fn(() => 1530518207007);
      global.Date.now = dateNowStub;
    });

    describe('READ async operations', () => {
      it('should update state to read show async operation as pending state from initial state', () => {
        registerAsyncOperationDescriptors(
          {
            descriptorId: 'FETCH_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'READ',
          },
        );

        const transformedState = getStateForOperationAfterStep(state, 'BEGIN_ASYNC_OPERATION', 'FETCH_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'FETCH_PERSON_DATA_111.fetchStatus': 'PENDING' });
        expect(transformedState).to.matchSnapshot('updated state showing begun read async operation');
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
            personId: 111,
          },
        };

        registerAsyncOperationDescriptors(
          {
            descriptorId: 'FETCH_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'READ',
          },
        );

        const transformedState = getStateForOperationAfterStep(state, 'RESOLVE_ASYNC_OPERATION', 'FETCH_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'FETCH_PERSON_DATA_111.fetchStatus': 'SUCCESSFUL' });
        expect(transformedState).to.matchSnapshot('updated state showing successful read async operation');
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
            personId: 111,
          },
        };

        registerAsyncOperationDescriptors(
          {
            descriptorId: 'FETCH_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'READ',
          },
        );

        const transformedState = getStateForOperationAfterStep(state, 'REJECT_ASYNC_OPERATION', 'FETCH_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'FETCH_PERSON_DATA_111.fetchStatus': 'FAILED' });
        expect(transformedState).to.matchSnapshot('updated state showing rejected async operation');
      });
    });

    describe('WRITE async operations', () => {
      it('should update state to show write async operation as pending state from initial state', () => {
        registerAsyncOperationDescriptors(
          {
            descriptorId: 'UPDATE_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'WRITE',
          },
        );
  
        const transformedState = getStateForOperationAfterStep(state, 'BEGIN_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'UPDATE_PERSON_DATA_111.fetchStatus': 'PENDING' });
        expect(transformedState).to.matchSnapshot('updated state showing pending write async operation');
      });
  
      it('should update state to show write async operation as successful state from pending state', () => {
        state = {
          UPDATE_PERSON_DATA_111: {
            descriptorId: 'UPDATE_PERSON_DATA',
            fetchStatus: 'PENDING',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111,
          },
        };
  
        registerAsyncOperationDescriptors(
          {
            descriptorId: 'UPDATE_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'WRITE',
          },
        );
  
        const transformedState = getStateForOperationAfterStep(state, 'RESOLVE_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'UPDATE_PERSON_DATA_111.fetchStatus': 'SUCCESSFUL' });
        expect(transformedState).to.matchSnapshot('updated state showing successful write async operation');
      });

      it('should update state to show write async operation as failed state from pending state', () => {
        state = {
          UPDATE_PERSON_DATA_111: {
            descriptorId: 'UPDATE_PERSON_DATA',
            fetchStatus: 'PENDING',
            message: null,
            lastFetchStatusTime: 0,
            lastDataStatusTime: 0,
            personId: 111,
          },
        };
  
        registerAsyncOperationDescriptors(
          {
            descriptorId: 'UPDATE_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'WRITE',
          },
        );
  
        const transformedState = getStateForOperationAfterStep(state, 'REJECT_ASYNC_OPERATION', 'UPDATE_PERSON_DATA', { personId: 111 });
        expect(transformedState).to.nested.include({ 'UPDATE_PERSON_DATA_111.fetchStatus': 'FAILED' });
        expect(transformedState).to.matchSnapshot('updated state showing failed write async operation');
      });
    });
  });
});
