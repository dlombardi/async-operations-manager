"use strict";

var _chai = require("chai");

var _sinon = _interopRequireDefault(require("sinon"));

var _config = _interopRequireDefault(require("../config"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
describe('helpers', () => {
  beforeEach(() => {
    _config.default.setConfig({
      logger: {
        exceptionsCallback: _sinon.default.spy()
      }
    });
  });
  describe('generateAsyncOperationKey', () => {
    it('should create an asyncOperation key with no params', () => {
      const asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('updatePersonData');
      (0, _chai.expect)(asyncOperationKey).to.equal('updatePersonData');
    });
    it('should create an asyncOperation key with one param', () => {
      const asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('updatePersonData', {
        personId: 111
      });
      (0, _chai.expect)(asyncOperationKey).to.equal('updatePersonData_111');
    });
    it('should create an asyncOperation key with multiple params', () => {
      const asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('updatePersonData', {
        teamId: 222,
        personId: 111
      });
      (0, _chai.expect)(asyncOperationKey).to.equal('updatePersonData_222_111');
    });
    it('should throw an exception if a label is not provided', () => {
      const _asyncOperationManage = _config.default.getConfig(),
            logger = _asyncOperationManage.logger;

      (0, _helpers.generateAsyncOperationKey)();
      (0, _helpers.generateAsyncOperationKey)('');
      (0, _helpers.generateAsyncOperationKey)(undefined);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
      (0, _chai.expect)(logger.exceptionsCallback.callCount).to.equal(3);
    });
    it('should throw an exception if a label is not a string', () => {
      const _asyncOperationManage2 = _config.default.getConfig(),
            logger = _asyncOperationManage2.logger;

      (0, _helpers.generateAsyncOperationKey)({});
      (0, _helpers.generateAsyncOperationKey)([]);
      (0, _helpers.generateAsyncOperationKey)(2);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
      (0, _chai.expect)(logger.exceptionsCallback.callCount).to.equal(3);
    });
  });
  describe('getAndValidateParams', () => {
    beforeEach(() => {
      _config.default.setConfig({
        logger: {
          exceptionsCallback: _sinon.default.spy()
        }
      });
    });
    it('should validate and successfully return correct asyncOperation params', () => {
      const params = {
        personId: 2,
        teamId: 10,
        name: 'Darien'
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId']
      };
      const asyncOperationParams = (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(asyncOperationParams).to.deep.equal({
        personId: 2,
        teamId: 10
      });
    });
    it('should validate and fail on an undefined param', () => {
      const _asyncOperationManage3 = _config.default.getConfig(),
            logger = _asyncOperationManage3.logger;

      const params = {
        personId: undefined,
        teamId: 10,
        name: 'Darien'
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId']
      };
      (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
    });
    it('should validate and fail on a missing param', () => {
      const _asyncOperationManage4 = _config.default.getConfig(),
            logger = _asyncOperationManage4.logger;

      const params = {
        personId: 2,
        name: 'Darien'
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId']
      };
      (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
    });
  });
  describe('makeConstantsObject', () => {
    beforeEach(() => {
      _config.default.setConfig({
        logger: {
          exceptionsCallback: _sinon.default.spy()
        }
      });
    });
    it('should make a constants object out of an array of string values', () => {
      const fruits = (0, _helpers.makeConstantsObject)(['APPLE', 'BANANA']);
      (0, _chai.expect)(fruits).to.deep.equal({
        APPLE: 'APPLE',
        BANANA: 'BANANA'
      });
    });
    it('should make a constants object that is immutable', () => {
      const fruits = (0, _helpers.makeConstantsObject)(['APPLE', 'BANANA']);
      (0, _chai.expect)(Object.isExtensible(fruits)).to.be.false;
    });
  });
});