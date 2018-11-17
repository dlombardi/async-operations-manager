"use strict";

require("core-js/modules/web.dom.iterable");

var _chai = require("chai");

var _sinon = _interopRequireDefault(require("sinon"));

var _asyncOperationStateUtils = _interopRequireDefault(require("../asyncOperationStateUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
describe('asyncOperationStateUtils', () => {
  describe('updateAsyncOperationDescriptor', () => {
    let stub;
    let registeredAsyncOperationDescriptors;
    beforeEach(() => {
      registeredAsyncOperationDescriptors = {};
      stub = _sinon.default.stub(console, 'error');
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
        maxCacheTime: 60000
      };

      const newState = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(registeredAsyncOperationDescriptors, asyncOperationDescriptor);

      (0, _chai.expect)(newState).to.matchSnapshot('state with well formed asyncOperationDescriptor');
    });
    it('should update state with an asyncOperationDescriptor and default optional values', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE'
      };

      const asyncOperationDescriptors = _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(registeredAsyncOperationDescriptors, asyncOperationDescriptor);

      (0, _chai.expect)(asyncOperationDescriptors.UPDATE_PERSON_DATA).to.deep.include({
        parentOperationDescriptorId: null,
        debug: false,
        alwaysImmutable: false,
        minCacheTime: 5000,
        maxCacheTime: 60000
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
        maxCacheTime: 60000
      };

      _asyncOperationStateUtils.default.updateAsyncOperationDescriptor(registeredAsyncOperationDescriptors, asyncOperationDescriptor);

      (0, _chai.expect)(stub.callCount).to.equal(1);
    });
  });
  describe('updateAsyncOperation', () => {
    let state;
    beforeEach(() => {
      state = {};
    });
    it('should update state with an asyncOperation', () => {
      const newAsyncOperation = {
        descriptorId: 'UPDATE_PERSON_DATA',
        fetchStatus: 'SUCCESSFUL',
        message: null,
        lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
        lastDataStatusTime: '2018-10-01T19:12:53.189Z',
        personId: 111
      };
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE'
      };

      const newState = _asyncOperationStateUtils.default.updateAsyncOperation(state, 'UPDATE_PERSON_DATA_111', newAsyncOperation, asyncOperationDescriptor);

      (0, _chai.expect)(newState).to.have.all.keys('UPDATE_PERSON_DATA_111');
      (0, _chai.expect)(newState).to.matchSnapshot('state with well formed asyncOperation');
    });
  });
  describe('bulkUpdateAsyncOperations', () => {
    let state;
    beforeEach(() => {
      state = {};
    });
    it('should update state with multiple async operations', () => {
      const asyncOperationUpdates = [{
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

      const newState = _asyncOperationStateUtils.default.bulkUpdateAsyncOperations(state, asyncOperationUpdates);

      (0, _chai.expect)(newState).to.have.all.keys('UPDATE_PERSON_DATA_111', 'UPDATE_TEAM_DATA_2');
      (0, _chai.expect)(newState).to.matchSnapshot('state with multiple asyncOperations');
    });
  });
  describe('getAsyncOperation', () => {
    let state;
    beforeEach(() => {
      state = {};
    });
    it('should return an initial read asyncOperation', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        descriptorId: 'FETCH_PERSON_DATA'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, {}, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
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
    it('should return an initial write asyncOperation', () => {
      const asyncOperationDescriptor = {
        descriptorId: 'UPDATE_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'WRITE',
        descriptorId: 'UPDATE_PERSON_DATA'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, {}, 'UPDATE_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.deep.include({
        fetchStatus: 'NULL',
        lastFetchStatusTime: 0
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed initial asyncOperation');
    });
    it('should return a pending asyncOperation', () => {
      state = {
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: 'PENDING',
          dataStatus: 'ABSENT',
          message: null,
          lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
          lastDataStatusTime: '2018-10-01T19:12:13.189Z',
          personId: 111
        }
      };
      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        descriptorId: 'FETCH_PERSON_DATA'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, {}, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed pending asyncOperation');
    });
    it('should return a successful asyncOperation', () => {
      state = {
        FETCH_PERSON_DATA_111: {
          descriptorId: 'FETCH_PERSON_DATA',
          fetchStatus: 'SUCCESSFUL',
          dataStatus: 'PRESENT',
          message: null,
          lastFetchStatusTime: '2018-10-01T19:12:46.189Z',
          lastDataStatusTime: '2018-10-01T19:12:53.189Z',
          personId: 111
        }
      };
      const asyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        descriptorId: 'FETCH_PERSON_DATA'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, {}, 'FETCH_PERSON_DATA_111', asyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed successful asyncOperation');
    });
    it('should return a successful asyncOperation with parentAsyncOperation metaData', () => {
      state = {
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
      };
      const registeredAsyncOperationDescriptors = {
        FETCH_ALL_PERSON_DATA: {
          descriptorId: 'FETCH_ALL_PERSON_DATA',
          operationType: 'READ',
          descriptorId: 'FETCH_ALL_PERSON_DATA'
        }
      };
      const fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['personId'],
        operationType: 'READ',
        descriptorId: 'FETCH_PERSON_DATA',
        // optional values
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, registeredAsyncOperationDescriptors, 'FETCH_PERSON_DATA_111', fetchPersonDataAsyncOperationDescriptor, {
        personId: 111
      });

      (0, _chai.expect)(asyncOperation).to.be.an('object');
      (0, _chai.expect)(asyncOperation).to.deep.include({
        lastFetchStatusTime: '2018-10-01T19:13:52.189Z',
        lastDataStatusTime: '2018-10-01T19:13:56.189Z'
      });
      (0, _chai.expect)(asyncOperation).to.matchSnapshot('well formed successful asyncOperation with parentAsyncOperation metaData');
    });
    it('should return a successful asyncOperation with parentAsyncOperation metaData two levels deep', () => {
      state = {
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
      };
      const registeredAsyncOperationDescriptors = {
        FETCH_ALL_PERSON_DATA_FOR_ORG: {
          descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
          requiredParams: ['orgId'],
          operationType: 'READ',
          descriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG',
          parentOperationDescriptorId: 'FETCH_ALL_DATA_FOR_ORG'
        },
        FETCH_ALL_DATA_FOR_ORG: {
          descriptorId: 'FETCH_ALL_DATA_FOR_ORG',
          requiredParams: ['orgId'],
          operationType: 'READ',
          descriptorId: 'FETCH_ALL_DATA_FOR_ORG'
        }
      };
      const fetchPersonDataAsyncOperationDescriptor = {
        descriptorId: 'FETCH_PERSON_DATA',
        requiredParams: ['orgId', 'personId'],
        descriptorId: 'FETCH_PERSON_DATA',
        operationType: 'READ',
        parentOperationDescriptorId: 'FETCH_ALL_PERSON_DATA_FOR_ORG'
      };

      const asyncOperation = _asyncOperationStateUtils.default.getAsyncOperation(state, registeredAsyncOperationDescriptors, 'fetchPersonData_111', fetchPersonDataAsyncOperationDescriptor, {
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
  });
});