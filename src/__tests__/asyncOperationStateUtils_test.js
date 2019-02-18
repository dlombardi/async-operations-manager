/* eslint-env jest */
import { expect } from 'chai';
import sinon from 'sinon';

import asyncOperationStateUtils from '../asyncOperationStateUtils';
import { asyncOperationManagerState } from '../asyncOperationManagerState';

const initialState = {
  descriptors: {},
  operations: {},
};

describe('asyncOperationStateUtils', () => {
  describe('updateAsyncOperationDescriptor', () => {
    let stub;
    let state;

    beforeEach(() => {
      asyncOperationManagerState.clearState();
      state = initialState;
      stub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should update state with an asyncOperationDescriptor', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
        // optional values
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000,
      };

      const { descriptors } = asyncOperationStateUtils.updateAsyncOperationDescriptor(state, asyncOperationDescriptor);
      expect(descriptors).to.matchSnapshot('state with well formed asyncOperationDescriptor');
    });

    it('should update state with an asyncOperationDescriptor and default optional values', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
      };

      const { descriptors } = asyncOperationStateUtils.updateAsyncOperationDescriptor(state, asyncOperationDescriptor);
      expect(descriptors.UPDATE_PERSON_DATA).to.deep.include({
        parentOperationDescriptorId: null,
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000,
      });
    });

    it('should throw an error if required descriptorId prop is not passed', () => {
      const asyncOperationDescriptor = {
        requiredParams: ['personId'],
        operationType: 'WRITE',
        // optional values
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000,
      };

      asyncOperationStateUtils.updateAsyncOperationDescriptor(state, asyncOperationDescriptor);
      expect(stub.callCount).to.equal(1);
    });
  });

  describe('updateAsyncOperation', () => {
    let state;
    beforeEach(() => {
      asyncOperationManagerState.clearState();
      state = initialState;
    });

    it('should update state with an asyncOperation', () => {
      const newAsyncOperation = {
        descriptorId: 'UPDATE_PERSON_DATA',
        fetchStatus: 'SUCCESSFUL',
        message: null,
        lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
        lastDataStatusTime: '2018-10-01T19:12:53.189Z',
        personId: 111,
      };

      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
      };

      const { operations } = asyncOperationStateUtils.updateAsyncOperation(state, 'UPDATE_PERSON_DATA_111', newAsyncOperation, asyncOperationDescriptor);
      expect(operations).to.have.all.keys('UPDATE_PERSON_DATA_111');
      expect(operations).to.matchSnapshot('state with well formed asyncOperation');
    });
  });

  describe('bulkUpdateAsyncOperations', () => {
    let state;
    beforeEach(() => {
      asyncOperationManagerState.clearState();
      state = initialState;
    });

    it('should update state with multiple async operations', () => {
      const asyncOperationUpdates = [
        {
          asyncOperation: {
            descriptorId: 'UPDATE_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:53.189Z',
            personId: 111,
          },
          asyncOperationKey: 'UPDATE_PERSON_DATA_111',
          asyncOperationDescriptor: {
            descriptorId: 'UPDATE_PERSON_DATA',
            requiredParams: ['personId'],
            operationType: 'WRITE',
          },
        },
        {
          asyncOperation: {
            descriptorId: 'UPDATE_TEAM_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:26.189Z',
            lastDataStatusTime: '2018-10-01T19:12:27.189Z',
            teamId: 2,
          },
          asyncOperationKey: 'UPDATE_TEAM_DATA_2',
          asyncOperationDescriptor: {
            descriptorId: 'UPDATE_TEAM_DATA',
            requiredParams: ['teamId'],
            operationType: 'WRITE',
          },
        },
      ];

      const { operations } = asyncOperationStateUtils.bulkUpdateAsyncOperations(state, asyncOperationUpdates);
      expect(operations).to.have.all.keys('UPDATE_PERSON_DATA_111', 'UPDATE_TEAM_DATA_2');
      expect(operations).to.matchSnapshot('state with multiple asyncOperations');
    });
  });

  describe('getAsyncOperation', () => {
    let state;
    beforeEach(() => {
      state = initialState;
      asyncOperationManagerState.clearState();
    });

    it('should return an initial read asyncOperation', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, { personId: 111 });

      expect(asyncOperation).to.deep.include({
        fetchStatus: 'NULL',
        dataStatus: 'ABSENT',
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0,
      });
      expect(asyncOperation).to.matchSnapshot('well formed initial asyncOperation');
    });

    it('should return an initial write asyncOperation', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'UPDATE_PERSON_DATA_111', asyncOperationDescriptor, { personId: 111 });
      expect(asyncOperation).to.deep.include({
        fetchStatus: 'NULL',
        lastFetchStatusTime: 0,
      });
      expect(asyncOperation).to.matchSnapshot('well formed initial asyncOperation');
    });

    it('should return a pending asyncOperation', () => {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'PENDING',
            dataStatus: 'ABSENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:13.189Z',
            personId: 111,
          },
        },
      };

      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, { personId: 111 });
      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.matchSnapshot('well formed pending asyncOperation');
    });

    it('should return a successful asyncOperation', () => {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:53.189Z',
            personId: 111,
          },
        },
      };

      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, { personId: 111 });
      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.matchSnapshot('well formed successful asyncOperation');
    });

    it('should return a successful asyncOperation with parentAsyncOperation metaData', () => {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:53.189Z',
            personId: 111,
          },
          FETCH_ALL_PERSON_DATA: {
            descriptorId: 'FETCH_ALL_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:13:52.189Z',
            lastDataStatusTime: '2018-10-01T19:13:56.189Z',
          },
        },
        descriptors: {
          FETCH_ALL_PERSON_DATA: {
            descriptorId: 'FETCH_ALL_PERSON_DATA',
            operationType: 'READ',
          },
        },
      };

      const fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        // optional values
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', fetchPersonDataAsyncOperationDescriptor, { personId: 111 });

      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.deep.include({
        lastFetchStatusTime: '2018-10-01T19:13:52.189Z',
        lastDataStatusTime: '2018-10-01T19:13:56.189Z',
      });
      expect(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData');
    });

    it('should return a successful asyncOperation with parentAsyncOperation metaData two levels deep', () => {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            personId: 111,
          },
          FETCH_ALL_PERSON_DATA_FOR_ORG_22: {
            descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            lastDataStatusTime: '2018-09-21T19:13:56.189Z',
            orgId: 22,
          },
          FETCH_ALL_DATA_FOR_ORG_22: {
            descriptorId: 'FETCH_ALL_DATA_FOR_ORG',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:16:52.189Z',
            lastDataStatusTime: '2018-10-01T19:23:56.189Z',
            orgId: 22,
          },
        },
        descriptors: {
          FETCH_ALL_PERSON_DATA_FOR_ORG: {
            descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
            requiredParams: ['orgId'],
            operationType: 'READ',
            parentOperationDescriptorId: 'FETCH_ALL_DATA_FOR_ORG',
          },
          FETCH_ALL_DATA_FOR_ORG: {
            descriptorId: 'FETCH_ALL_DATA_FOR_ORG',
            requiredParams: ['orgId'],
            operationType: 'READ',
          },
        },
      };


      const fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['orgId', 'personId'],
        operationType: 'READ',
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', fetchPersonDataAsyncOperationDescriptor, { personId: 111, orgId: 22 });
      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.deep.include({
        lastFetchStatusTime: '2018-10-01T19:16:52.189Z',
        lastDataStatusTime: '2018-10-01T19:23:56.189Z',
      });
      expect(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData two levels deep');
    });

    it('should invalidate async operation if an invalidatingAsyncOperation has a resolve timestamp after async operation', () => {
      state = {
        operations: {
          FETCH_APPOINTMENT_DATA_111: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            appointmentId: 111,
          },
          FETCH_APPOINTMENT_DATA_222: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            lastDataStatusTime: '2018-09-21T19:13:56.189Z',
            appointmentId: 222,
          },
        },
        descriptors: {
          FETCH_APPOINTMENT_DATA: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            requiredParams: ['appointmentId'],
            operationType: 'READ',
            invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA'],
          },
        },
      };

      const fetchAppointmentDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_APPOINTMENT_DATA',
        requiredParams: ['appointmentId'],
        operationType: 'READ',
        invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA'],
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_APPOINTMENT_DATA_111', fetchAppointmentDataAsyncOperationDescriptor, { appointmentId: 111 });
      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.deep.include({
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0,
      });
      expect(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData two levels deep');
    });

    it('should invalidate async operation if an invalidatingAsyncOperation has a resolve timestamp after async operation and is two levels deep', () => {
      state = {
        operations: {
          FETCH_APPOINTMENT_DATA_111: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            appointmentId: 111,
          },
          FETCH_APPOINTMENT_DATA_222: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            lastDataStatusTime: '2018-09-21T19:13:56.189Z',
            appointmentId: 222,
          },
        },
        descriptors: {
          FETCH_APPOINTMENT_DATA: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            requiredParams: ['appointmentId'],
            operationType: 'READ',
            invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA'],
          },
        },
      };

      const fetchAppointmentDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_APPOINTMENT_DATA',
        requiredParams: ['appointmentId'],
        operationType: 'READ',
        invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA'],
      };

      const asyncOperation = asyncOperationStateUtils.getAsyncOperation(state, 'FETCH_APPOINTMENT_DATA_111', fetchAppointmentDataAsyncOperationDescriptor, { appointmentId: 111 });
      expect(asyncOperation).to.be.an('object');
      expect(asyncOperation).to.deep.include({
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0,
      });
      expect(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData two levels deep');
    });
  });
});
