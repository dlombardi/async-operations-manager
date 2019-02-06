/* eslint-env jest */
import { expect } from 'chai';
import asyncOperationsManager, { reduxIntegration } from '../index';


describe('API', () => {
  it('should expose library as default export and integrations as named exports', () => {
    expect(reduxIntegration).to.exist;
    expect(asyncOperationsManager).to.exist;
  });
});
