#!/usr/local/bin/node

var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;
var yaml = require('js-yaml');

// ./test.js [--nocompile] [root]

var noCompile = process.argv[2] === '--nocompile';
var root;
var compile;

if (noCompile) {
  root = process.argv[3] || '.';
} else {
  root = process.argv[2] || '.';
}

compile = 'g++ ' + root + '/*.cc';

var tests = root + '/tests';
var testsIn = tests + '/in';
var testsOut = tests + '/out';

console.log();
console.log('CS 241 Test Runner'.bold.underline);
console.log('Running out of: ' + root);
outputBreak();

if (!noCompile) {
  console.log('Compiling files using: ' + compile);

  exec(compile, function(err, stdout, stderr) {
    var errorMsg = stderr && stderr.toString();

    if (err || errorMsg) {
      console.log('Compilation error.'.red);
      console.log(errorMsg);
      console.log();
    } else {
      console.log('Compilation succeeded.'.green);
      outputBreak();
      runTests();
    }
  });
} else {
  console.log('Skipping compilation.'.green);
  console.log('Testing using: '.bold + root + '/a.out');
  outputBreak();
  runTests();
}

function removeExecutable() {
  exec('rm a.out', function() {});
}

function runTests() {
  var testStart = Date.now();
  var allTests = fs.readdirSync(testsIn);
  var numComplete = 0;
  var numCorrect = 0;

  console.log('Found ' + (allTests.length + "").bold + ' test(s).');

  function complete() {
    if (numComplete === allTests.length) {
      outputBreak();
      console.log(('Passed ' + numCorrect + ' test case(s).').green);
      console.log(('Failed ' + (numComplete - numCorrect) + ' test case(s).').red);
      console.log('Summary: '.bold + numCorrect + '/' + numComplete);
      console.log('Test Suite Runtime: ' + ((Date.now() - testStart) / 1000) + 's');
      console.log();
      !noCompile && removeExecutable();
    }
  }

  function resolveTestCase(condition, testCase) {
    if (condition) {
      numCorrect++;
      console.log('Pass - '.green + testCase);
    } else {
      console.log('Fail - '.red + testCase);
    }
  }

  allTests.forEach(function(testCase) {
    var expectedOutputFile = testsOut + '/' + testCase.substr(0, testCase.lastIndexOf('.')) + '.yaml';
    var expected = yaml.safeLoad(fs.readFileSync(expectedOutputFile, {encoding: 'utf8'}));
    var executablePath = noCompile && root + '/a.out' || './a.out';

    exec(executablePath + ' < ' + testsIn + '/' + testCase, function(err, stdout, stderr) {
      numComplete++;
      if (!err) {

        if (!expected.error) {
          // Successful run expected
          resolveTestCase(stdout.toString() === expected.result, testCase);
        } else {
          // Error expected
          var output = stderr.toString();

          if (expected.strict) {
            // Strict Error - Error message must match what is expected
            resolveTestCase(output === expected.result, testCase);
          } else {
            // Non-strict Error - Error message only has to contain the result at some point
            var expectedError = expected.result || 'ERROR';
            resolveTestCase(output.indexOf(expectedError) !== -1, testCase);
          }
        }

      } else {
        console.log('ERROR: Executable not found.'.red);
      }
      complete();
    });
  });
}

function outputBreak() {
  console.log('------------------------------'.bold);
}
