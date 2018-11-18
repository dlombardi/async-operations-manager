/* eslint-env jest */
import { expect } from 'chai';
import sinon from 'sinon';

import asyncOperationManagerConfig from '../config';

import {
  makeConstantsObject,
  generateAsyncOperationKey,
  getAndValidateParams,
} from '../helpers';

describe('helpers', () => {
  beforeEach(() => {
    asyncOperationManagerConfig.setConfig({
      logger: {
        exceptionsCallback: sinon.spy(),
      },
    });
  });

  describe('generateAsyncOperationKey', () => {
    it('should create an asyncOperation key with no params', () => {
      const asyncOperationKey = generateAsyncOperationKey('updatePersonData');
      expect(asyncOperationKey).to.equal('updatePersonData');
    });
    it('should create an asyncOperation key with one param', () => {
      const asyncOperationKey = generateAsyncOperationKey('updatePersonData', { personId: 111 });
      expect(asyncOperationKey).to.equal('updatePersonData_111');
    });
    it('should create an asyncOperation key with multiple params', () => {
      const asyncOperationKey = generateAsyncOperationKey('updatePersonData', { teamId: 222, personId: 111 });
      expect(asyncOperationKey).to.equal('updatePersonData_222_111');
    });
    it('should throw an exception if a label is not provided', () => {
      const { logger } = asyncOperationManagerConfig.getConfig();
      generateAsyncOperationKey();
      generateAsyncOperationKey('');
      generateAsyncOperationKey(undefined);
      expect(logger.exceptionsCallback.called).to.equal(true);
      expect(logger.exceptionsCallback.callCount).to.equal(3);
    });
    it('should throw an exception if a label is not a string', () => {
      const { logger } = asyncOperationManagerConfig.getConfig();
      generateAsyncOperationKey({});
      generateAsyncOperationKey([]);
      generateAsyncOperationKey(2);
      expect(logger.exceptionsCallback.called).to.equal(true);
      expect(logger.exceptionsCallback.callCount).to.equal(3);
    });
  });

  describe('getAndValidateParams', () => {
    beforeEach(() => {
      asyncOperationManagerConfig.setConfig({
        logger: {
          exceptionsCallback: sinon.spy(),
        },
      });
    });

    it('should validate and successfully return correct asyncOperation params', () => {
      const params = {
        personId: 2,
        teamId: 10,
        name: 'Darien',
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId'],
      };
      const asyncOperationParams = getAndValidateParams(params, asyncOperationDescriptor);
      expect(asyncOperationParams).to.deep.equal({ personId: 2, teamId: 10 });
    });
    it('should validate and fail on an undefined param', () => {
      const { logger } = asyncOperationManagerConfig.getConfig();
      
      const params = {
        personId: undefined,
        teamId: 10,
        name: 'Darien',
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId'],
      };
      getAndValidateParams(params, asyncOperationDescriptor);
      expect(logger.exceptionsCallback.called).to.equal(true);
    });
    it('should validate and fail on a missing param', () => {
      const { logger } = asyncOperationManagerConfig.getConfig();
      
      const params = {
        personId: 2,
        name: 'Darien',
      };
      const asyncOperationDescriptor = {
        requiredParams: ['personId', 'teamId'],
      };
      getAndValidateParams(params, asyncOperationDescriptor);
      expect(logger.exceptionsCallback.called).to.equal(true);
    });
  });

  describe('makeConstantsObject', () => {
    beforeEach(() => {
      asyncOperationManagerConfig.setConfig({
        logger: {
          exceptionsCallback: sinon.spy(),
        },
      });
    });

    it('should make a constants object out of an array of string values', () => {
      const fruits = makeConstantsObject(['APPLE', 'BANANA']);
      expect(fruits).to.deep.equal({
        APPLE: 'APPLE',
        BANANA: 'BANANA',
      });
    });

    it('should make a constants object that is immutable', () => {
      const fruits = makeConstantsObject(['APPLE', 'BANANA']);
      expect(Object.isExtensible(fruits)).to.be.false;
    });
  });
});
