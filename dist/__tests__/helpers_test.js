"use strict";

var _chai = require("chai");

var _sinon = _interopRequireDefault(require("sinon"));

var _config = _interopRequireDefault(require("../config"));

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env jest */
describe('helpers', function () {
  beforeEach(function () {
    _config.default.setConfig({
      logger: {
        exceptionsCallback: _sinon.default.spy()
      }
    });
  });
  describe('generateAsyncOperationKey', function () {
    it('should create an asyncOperation key with no params', function () {
      var asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('UPDATE_PERSON_DATA', {});
      (0, _chai.expect)(asyncOperationKey).to.equal('UPDATE_PERSON_DATA');
    });
    it('should create an asyncOperation key with one param', function () {
      var asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('UPDATE_PERSON_DATA', {
        personId: 111
      });
      (0, _chai.expect)(asyncOperationKey).to.equal('UPDATE_PERSON_DATA_111');
    });
    it('should create an asyncOperation key with multiple params', function () {
      var asyncOperationKey = (0, _helpers.generateAsyncOperationKey)('UPDATE_PERSON_DATA', {
        orgId: 222,
        personId: 111
      });
      (0, _chai.expect)(asyncOperationKey).to.equal('UPDATE_PERSON_DATA_222_111');
    });
    it('should throw an exception if a label is not provided', function () {
      var _asyncOperationManage = _config.default.getConfig(),
          logger = _asyncOperationManage.logger;

      (0, _helpers.generateAsyncOperationKey)();
      (0, _helpers.generateAsyncOperationKey)('');
      (0, _helpers.generateAsyncOperationKey)(undefined);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
      (0, _chai.expect)(logger.exceptionsCallback.callCount).to.equal(3);
    });
    it('should throw an exception if a label is not a string', function () {
      var _asyncOperationManage2 = _config.default.getConfig(),
          logger = _asyncOperationManage2.logger;

      (0, _helpers.generateAsyncOperationKey)({});
      (0, _helpers.generateAsyncOperationKey)([]);
      (0, _helpers.generateAsyncOperationKey)(2);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
      (0, _chai.expect)(logger.exceptionsCallback.callCount).to.equal(3);
    });
  });
  describe('getAndValidateParams', function () {
    beforeEach(function () {
      _config.default.setConfig({
        logger: {
          exceptionsCallback: _sinon.default.spy()
        }
      });
    });
    it('should validate requiredParams and successfully return correct asyncOperation params', function () {
      var params = {
        personId: 2,
        orgId: 10,
        name: 'Darien'
      };
      var asyncOperationDescriptor = {
        requiredParams: ['personId', 'orgId']
      };
      var asyncOperationParams = (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(asyncOperationParams).to.deep.equal({
        personId: 2,
        orgId: 10
      });
    });
    it('should validate requiredParams and successfully return all correct asyncOperation params including optionalParams', function () {
      var params = {
        personId: 2,
        orgId: 10,
        age: 25,
        name: 'Darien'
      };
      var asyncOperationDescriptor = {
        requiredParams: ['personId', 'orgId'],
        optionalParams: ['age']
      };
      var asyncOperationParams = (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(asyncOperationParams).to.deep.equal({
        personId: 2,
        orgId: 10,
        age: 25
      });
    });
    it('should return only optionalParams', function () {
      var params = {
        personId: 2,
        orgId: 10,
        age: 25,
        name: 'Darien'
      };
      var asyncOperationDescriptor = {
        optionalParams: ['age']
      };
      var asyncOperationParams = (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(asyncOperationParams).to.deep.equal({
        age: 25
      });
    });
    it('should validate and fail on an undefined required param', function () {
      var _asyncOperationManage3 = _config.default.getConfig(),
          logger = _asyncOperationManage3.logger;

      var params = {
        personId: undefined,
        orgId: 10,
        name: 'Darien'
      };
      var asyncOperationDescriptor = {
        requiredParams: ['personId', 'orgId']
      };
      (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
    });
    it('should validate and succeed on a falsey required param', function () {
      var _asyncOperationManage4 = _config.default.getConfig(),
          logger = _asyncOperationManage4.logger;

      var params = {
        personId: null,
        orgId: 10,
        name: 'TheAceMan'
      };
      var asyncOperationDescriptor = {
        requiredParams: ['personId', 'orgId']
      };
      (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(false);
    });
    it('should validate and fail on a missing required param', function () {
      var _asyncOperationManage5 = _config.default.getConfig(),
          logger = _asyncOperationManage5.logger;

      var params = {
        personId: 2,
        name: 'Darien'
      };
      var asyncOperationDescriptor = {
        requiredParams: ['personId', 'orgId']
      };
      (0, _helpers.getAndValidateParams)(params, asyncOperationDescriptor);
      (0, _chai.expect)(logger.exceptionsCallback.called).to.equal(true);
    });
  });
  describe('makeConstantsObject', function () {
    beforeEach(function () {
      _config.default.setConfig({
        logger: {
          exceptionsCallback: _sinon.default.spy()
        }
      });
    });
    it('should make a constants object out of an array of string values', function () {
      var fruits = (0, _helpers.makeConstantsObject)(['APPLE', 'BANANA']);
      (0, _chai.expect)(fruits).to.deep.equal({
        APPLE: 'APPLE',
        BANANA: 'BANANA'
      });
    });
    it('should make a constants object that is immutable', function () {
      var fruits = (0, _helpers.makeConstantsObject)(['APPLE', 'BANANA']);
      (0, _chai.expect)(Object.isExtensible(fruits)).to.be.false;
    });
  });
});
//# sourceMappingURL=helpers_test.js.map