"use strict";

var _chai = require("chai");

var _sinon = _interopRequireDefault(require("sinon"));

var _asyncOperationStateUtils = _interopRequireDefault(require("../asyncOperationStateUtils"));

var _asyncOperationManagerState = require("../asyncOperationManagerState");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
var initialState = {
  descriptors: {},
  operations: {}
};
describe('asyncOperationStateUtils', function () {
  describe('updateAsyncOperationDescriptor', function () {
    var stub;
    var state;
    beforeEach(function () {
      _asyncOperationManagerState.asyncOperationManagerState.clearState();

      state = initialState;
      stub = _sinon.default.stub(console, 'error');
    });
    afterEach(function () {
      stub.restore();
    });
    it('should update state with an asyncOperationDescriptor', function () {
      var asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
        // optional values
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000
      };

      var _asyncOperationStateU = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(state, asyncOperationDescriptor),
          descriptors = _asyncOperationStateU.descriptors;

      (0, _chai.expect)(descriptors).to.matchSnapshot('state with well formed asyncOperationDescriptor');
    });
    it('should update state with an asyncOperationDescriptor and default optional values', function () {
      var asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE'
      };

      var _asyncOperationStateU2 = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(state, asyncOperationDescriptor),
          descriptors = _asyncOperationStateU2.descriptors;

      (0, _chai.expect)(descriptors.UPDATE_PERSON_DATA).to.deep.include({
        parentOperationDescriptorId: null,
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000
      });
    });
    it('should throw an error if required descriptorId prop is not passed', function () {
      var asyncOperationDescriptor = {
        requiredParams: ['personId'],
        operationType: 'WRITE',
        // optional values
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000
      };

      _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(state, asyncOperationDescriptor);

      (0, _chai.expect)(stub.callCount).to.equal(1);
    });
  });
  describe('updateAsyncOperation', function () {
    var state;
    beforeEach(function () {
      _asyncOperationManagerState.asyncOperationManagerState.clearState();

      state = initialState;
    });
    it('should update state with an asyncOperation', function () {
      var newAsyncOperation = {
        descriptorId: 'UPDATE_PERSON_DATA',
        fetchStatus: 'SUCCESSFUL',
        message: null,
        lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
        lastDataStatusTime: '2018-10-01T19:12:53.189Z',
        personId: 111
      };
      var asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE'
      };

      var _asyncOperationStateU3 = _asyncOperationStateUtils.default.updateAsyncOperation(state, 'UPDATE_PERSON_DATA_111', newAsyncOperation, asyncOperationDescriptor),
          operations = _asyncOperationStateU3.operations;

      (0, _chai.expect)(operations).to.have.all.keys('UPDATE_PERSON_DATA_111');
      (0, _chai.expect)(operations).to.matchSnapshot('state with well formed asyncOperation');
    });
  });
  describe('bulkUpdateAsyncOperations', function () {
    var state;
    beforeEach(function () {
      _asyncOperationManagerState.asyncOperationManagerState.clearState();

      state = initialState;
    });
    it('should update state with multiple async operations', function () {
      var asyncOperationUpdates = [{
        asyncOperation: {
          descriptorId: 'UPDATE_PERSON_DATA',
          fetchStatus: 'SUCCESSFUL',
          dataStatus: 'PRESENT',
          message: null,
          lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
          lastDataStatusTime: '2018-10-01T19:12:53.189Z',
          personId: 111
        },
        asyncOperationKey: 'UPDATE_PERSON_DATA_111',
        asyncOperationDescriptor: {
          descriptorId: 'UPDATE_PERSON_DATA',
          requiredParams: ['personId'],
          operationType: 'WRITE'
        }
      }, {
        asyncOperation: {
          descriptorId: 'UPDATE_TEAM_DATA',
          fetchStatus: 'SUCCESSFUL',
          dataStatus: 'PRESENT',
          message: null,
          lastFetchStatusTime: '2018-10-01T19:12:26.189Z',
          lastDataStatusTime: '2018-10-01T19:12:27.189Z',
          teamId: 2
        },
        asyncOperationKey: 'UPDATE_TEAM_DATA_2',
        asyncOperationDescriptor: {
          descriptorId: 'UPDATE_TEAM_DATA',
          requiredParams: ['teamId'],
          operationType: 'WRITE'
        }
      }];

      var _asyncOperationStateU4 = _asyncOperationStateUtils.default.bulkUpdateAsyncOperations(state, asyncOperationUpdates),
          operations = _asyncOperationStateU4.operations;

      (0, _chai.expect)(operations).to.have.all.keys('UPDATE_PERSON_DATA_111', 'UPDATE_TEAM_DATA_2');
      (0, _chai.expect)(operations).to.matchSnapshot('state with multiple asyncOperations');
    });
  });
  describe('getAsyncOperation', function () {
    var state;
    beforeEach(function () {
      state = initialState;

      _asyncOperationManagerState.asyncOperationManagerState.clearState();
    });
    it('should return an initial read asyncOperation', function () {
      var asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.deep.include({
        fetchStatus: 'NULL',
        dataStatus: 'ABSENT',
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed initial asyncOperation');
    });
    it('should return an initial write asyncOperation', function () {
      var asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'UPDATE_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.deep.include({
        fetchStatus: 'NULL',
        lastFetchStatusTime: 0
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed initial asyncOperation');
    });
    it('should return a pending asyncOperation', function () {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'PENDING',
            dataStatus: 'ABSENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:13.189Z',
            personId: 111
          }
        }
      };
      var asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed pending asyncOperation');
    });
    it('should return a successful asyncOperation', function () {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:53.189Z',
            personId: 111
          }
        }
      };
      var asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed successful asyncOperation');
    });
    it('should return a successful asyncOperation with parentAsyncOperation metaData', function () {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
            lastDataStatusTime: '2018-10-01T19:12:53.189Z',
            personId: 111
          },
          FETCH_ALL_PERSON_DATA: {
            descriptorId: 'FETCH_ALL_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:13:52.189Z',
            lastDataStatusTime: '2018-10-01T19:13:56.189Z'
          }
        },
        descriptors: {
          FETCH_ALL_PERSON_DATA: {
            descriptorId: 'FETCH_ALL_PERSON_DATA',
            operationType: 'READ'
          }
        }
      };
      var fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        // optional values
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', fetchPersonDataAsyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.deep.include({
        lastFetchStatusTime: '2018-10-01T19:13:52.189Z',
        lastDataStatusTime: '2018-10-01T19:13:56.189Z'
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData');
    });
    it('should return a successful asyncOperation with parentAsyncOperation metaData two levels deep', function () {
      state = {
        operations: {
          FETCH_PERSON_DATA_111: {
            descriptorId: 'FETCH_PERSON_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            personId: 111
          },
          FETCH_ALL_PERSON_DATA_FOR_ORG_22: {
            descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            lastDataStatusTime: '2018-09-21T19:13:56.189Z',
            orgId: 22
          },
          FETCH_ALL_DATA_FOR_ORG_22: {
            descriptorId: 'FETCH_ALL_DATA_FOR_ORG',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-10-01T19:16:52.189Z',
            lastDataStatusTime: '2018-10-01T19:23:56.189Z',
            orgId: 22
          }
        },
        descriptors: {
          FETCH_ALL_PERSON_DATA_FOR_ORG: {
            descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
            requiredParams: ['orgId'],
            operationType: 'READ',
            parentOperationDescriptorId: 'FETCH_ALL_DATA_FOR_ORG'
          },
          FETCH_ALL_DATA_FOR_ORG: {
            descriptorId: 'FETCH_ALL_DATA_FOR_ORG',
            requiredParams: ['orgId'],
            operationType: 'READ'
          }
        }
      };
      var fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['orgId', 'personId'],
        operationType: 'READ',
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG'
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_PERSON_DATA_111', fetchPersonDataAsyncOperationDescriptor, {
        personId: 111,
        orgId: 22
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.deep.include({
        lastFetchStatusTime: '2018-10-01T19:16:52.189Z',
        lastDataStatusTime: '2018-10-01T19:23:56.189Z'
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData two levels deep');
    });
    it('should invalidate an async operation if an invalidatingAsyncOperation shares the same descriptorId', function () {
      state = {
        operations: {
          FETCH_APPOINTMENT_DATA_111: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            appointmentId: 111
          },
          FETCH_APPOINTMENT_DATA_222: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            lastDataStatusTime: '2018-09-21T19:13:56.189Z',
            appointmentId: 222
          }
        },
        descriptors: {
          FETCH_APPOINTMENT_DATA: {
            descriptorId: 'FETCH_APPOINTMENT_DATA',
            requiredParams: ['appointmentId'],
            operationType: 'READ',
            invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA']
          }
        }
      };
      var fetchAppointmentDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_APPOINTMENT_DATA',
        requiredParams: ['appointmentId'],
        operationType: 'READ',
        invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA']
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_APPOINTMENT_DATA_111', fetchAppointmentDataAsyncOperationDescriptor, {
        appointmentId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.deep.include({
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed initial read async operation');
    });
    it('should invalidate async operation if an invalidatingAsyncOperation is a write async operation and has a fetchStatus timestamp after async operation fetchStatus timestamp', function () {
      state = {
        operations: {
          FETCH_CALENDAR_DATA_33: {
            descriptorId: 'FETCH_CALENDAR_DATA',
            fetchStatus: 'SUCCESSFUL',
            dataStatus: 'PRESENT',
            message: null,
            lastFetchStatusTime: '2018-09-01T19:12:46.189Z',
            lastDataStatusTime: '2018-09-01T19:12:53.189Z',
            orgId: 33
          },
          UPDATE_APPOINTMENT_DATA_222: {
            descriptorId: 'UPDATE_APPOINTMENT_DATA',
            fetchStatus: 'SUCCESSFUL',
            message: null,
            lastFetchStatusTime: '2018-09-21T19:13:52.189Z',
            appointmentId: 222
          }
        },
        descriptors: {
          UPDATE_APPOINTMENT_DATA: {
            descriptorId: 'UPDATE_APPOINTMENT_DATA',
            requiredParams: ['appointmentId'],
            operationType: 'WRITE'
          },
          FETCH_CALENDAR_DATA: {
            descriptorId: 'FETCH_CALENDAR_DATA',
            requiredParams: ['orgId'],
            operationType: 'READ',
            invalidatingOperationsDescriptorIds: ['FETCH_APPOINTMENT_DATA']
          }
        }
      };
      var fetchAppointmentDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_CALENDAR_DATA',
        requiredParams: ['orgId'],
        operationType: 'READ',
        invalidatingOperationsDescriptorIds: ['UPDATE_APPOINTMENT_DATA']
      };

      var asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, 'FETCH_APPOINTMENT_DATA_111', fetchAppointmentDataAsyncOperationDescriptor, {
        orgId: 33
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.deep.include({
        lastFetchStatusTime: 0,
        lastDataStatusTime: 0
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed initial read asyncOperation');
    });
  });
});
//# sourceMappingURL=asyncOperationStateUtils_test.js.map