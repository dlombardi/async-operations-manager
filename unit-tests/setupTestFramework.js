/* eslint-env jasmine, jest */
/* global global */
const path = require('path');

const chai = require('chai');
const chaiJestSnapshot = require('chai-jest-snapshot')

const jasmineReporters = require('jasmine-reporters');


// We do snapshot testing with Chai, to detect when things render differently than they did
// the last time we ran the unit tests.
chai.use(chaiJestSnapshot);


// We use the JUnitXml reporter for Jasmine, for CI on Jenkins.
//
// This snippet is blatantly stolen from https://github.com/JoeDevine/jest-jasmine-reporters-example
// (and just adjusted to make the linter happy and to set a custom output dir)
jasmine.VERBOSE = true;
jasmine.getEnv().addReporter(
  new jasmineReporters.JUnitXmlReporter({
    consolidateAll: false,
    savePath: path.join(__dirname, 'junit-xml-output/'),
    filePrefix: 'test-results-',
  })
);
