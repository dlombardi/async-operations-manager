
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FETCH_STATUS, DATA_STATUS, ASYNC_OPERATION_TYPES } from '../constants';

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
  invalidatingOperationsDescriptorIds: PropTypes.arrayOf(PropTypes.string),
  operationType: PropTypes.oneOf(_.values(ASYNC_OPERATION_TYPES)).isRequired,
};
