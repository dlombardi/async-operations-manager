"use strict";

var _chai = require("chai");

var _index = _interopRequireWildcard(require("../index"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* eslint-env jest */
describe('API', function () {
  it('should expose library as default export and integrations as named exports', function () {
    (0, _chai.expect)(_index.reduxIntegration).to.exist;
    (0, _chai.expect)(_index.default).to.exist;
  });
});
//# sourceMappingURL=api_test.js.map