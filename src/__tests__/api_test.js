/* eslint-env jest */
import { expect } from 'chai';

import asyncOperationsManager, { reduxIntegration } from '../index';


describe('asyncOperationStateUtils', () => {
  it('should update state with an asyncOperationDescriptor', () => {
    expect(reduxIntegration).to.exist;
    expect(asyncOperationsManager).to.exist;
  });
 });
