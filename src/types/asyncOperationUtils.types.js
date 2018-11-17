// @flow

import PropTypes from 'prop-types';
import _ from 'lodash';
import { FETCH_STATUS, DATA_STATUS, ASYNC_OPERATION_TYPES } from '../constants';

/**
 * Flow types!
 */
// type asyncOperationType = {
//   fetchStatus: 'NULL' | 'PENDING' | 'SUCCESSFUL' | 'FAILED',
//   dataStatus: 'ABSENT' | 'PRESENT',
//   message: any,
//   lastFetchStatusTime: string,
//   lastDataStatusTime: string,
//   actionType: string,
// };

// type asyncOperationDescriptorType = {
//   descriptorId: string,
//   requiredParams: any,   // label + params make the key automatically
//   parentOperationDescriptorId: string, // trivial case: just reference by name
//   operationType: 'READ' | 'WRITE',
// };

/**
 * PropTypes!
 */

export const asyncOperationPropType = {
  descriptorId: PropTypes.string.isRequired,
  fetchStatus: PropTypes.oneOf(_.values(FETCH_STATUS)).isRequired,
  dataStatus: PropTypes.oneOf(_.values(DATA_STATUS)),
  message: PropTypes.string,
  lastFetchStatusTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastDataStatusTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const asyncOperationDescriptorPropType = {
  descriptorId: PropTypes.string.isRequired,
  requiredParams: PropTypes.arrayOf(PropTypes.string),
  parentOperationDescriptorId: PropTypes.string,
  operationType: PropTypes.oneOf(_.values(ASYNC_OPERATION_TYPES)).isRequired,
};

// export type {
//   asyncOperationType,
//   asyncOperationDescriptorType,
// };
