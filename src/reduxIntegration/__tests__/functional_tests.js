/* eslint-env jest */
import { expect } from 'chai';

import asyncOperationReducer from '../asyncOperationReducer';

import { FETCH_STATUS, DATA_STATUS } from '../../constants';

import {
  createAsyncOperationInitialAction,
  createAsyncOperationBeginAction,
  createAsyncOperationResolveAction,
  createAsyncOperationRejectAction,
} from '../asyncOperationReduxUtils';

import {
  clearAsyncOperationsManagerState,
  registerAsyncOperationDescriptors,
} from '../../asyncOperationManagerUtils';

describe('scenario tests', () => {
  let state;

  beforeEach(() => {
    clearAsyncOperationsManagerState();
    const dateNowStub = jest.fn(() => 1530518207007);
    global.Date.now = dateNowStub;
  });

  describe('READ operation scenarios', () => {
    let initialAction;
    let beginAction;
    beforeEach(() => {
      state = {};
      clearAsyncOperationsManagerState();
      registerAsyncOperationDescriptors({
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
      });
  
      initialAction = createAsyncOperationInitialAction('FETCH_PERSON_DATA', {
        personId: 111,
      });
      beginAction = createAsyncOperationBeginAction('FETCH_PERSON_DATA', {
        personId: 111,
      });
    });

    it('should update a successful READ operation as expected from start to finish', () => {
      const resolveAction = createAsyncOperationResolveAction('FETCH_PERSON_DATA', {
        personId: 111,
      });

      expect(asyncOperationReducer(state, initialAction)).to.deep.equal(state);
      expect(asyncOperationReducer(state, beginAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: FETCH_STATUS.PENDING,
          dataStatus: DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111,
        },
      });
      expect(asyncOperationReducer(state, resolveAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: FETCH_STATUS.SUCCESSFUL,
          dataStatus: DATA_STATUS.PRESENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 1530518207007,
          personId: 111,
          lastFetchFailed: false,
        },
      });
    });

    it('should update a failed READ operation as expected from start to finish', () => {
      const rejectAction = createAsyncOperationRejectAction('FETCH_PERSON_DATA', {
        personId: 111,
      });

      expect(asyncOperationReducer(state, initialAction)).to.deep.equal(state);
      expect(asyncOperationReducer(state, beginAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: FETCH_STATUS.PENDING,
          dataStatus: DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111,
        },
      });
      expect(asyncOperationReducer(state, rejectAction)).to.deep.equal({
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: FETCH_STATUS.FAILED,
          dataStatus: DATA_STATUS.ABSENT,
          message: null,
          lastFetchStatusTime: 1530518207007,
          lastDataStatusTime: 0,
          personId: 111,
          lastFetchFailed: true,
        },
      });
    });
  });

  describe('WRITE operation scenarios', () => {
    beforeEach(() => {
      state = {};
      clearAsyncOperationsManagerState();
    });
  });
});
