#!/usr/local/bin/node

var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;

// ./test.js [--strict] [root [compile command]]
//
// e.g.
// ./test.js --strict
// ./test.js ./ "g++ lexer.cc"

var strict = process.argv[2] === '--strict';
var root;
var compile;

if (!strict) {
  root = process.argv[2] || '.';
  compile = process.argv[3] && process.argv[3].replace('"', '') || 'g++ ' + root + '/*.cc';
} else {
  root = process.argv[3] || '.';
  compile = process.argv[4] && process.argv[4].replace('"', '') || 'g++ ' + root + '/*.cc';
}

var tests = root + '/tests';
var testsIn = tests + '/in';
var testsOut = tests + '/out';

console.log();
console.log('CS 241 Test Runner'.bold.underline);
console.log('Running out of: ' + root);
outputBreak();
console.log('Compiling files using: ' + compile);

exec(compile, function(err, stdout, stderr) {
  var errorMsg = stderr && stderr.toString();

  if (err || errorMsg) {
    console.log('Compilation error.'.red);
    console.log(errorMsg);
  } else {
    console.log('Compilation succeeded.'.green);
    outputBreak();
    runTests();
  }
});

function runTests() {
  var testStart = Date.now();
  var allTests = fs.readdirSync(testsIn);
  var numComplete = 0;
  var numCorrect = 0;

  console.log('Found ' + (allTests.length + "").bold + ' test(s).');
  console.log(allTests);

  function complete() {
    if (numComplete === allTests.length) {
      outputBreak();
      console.log(('Passed ' + numCorrect + ' test case(s).').green);
      console.log(('Failed ' + (numComplete - numCorrect) + ' test case(s).').red);
      console.log('Summary: '.bold + numCorrect + '/' + numComplete);
      console.log('Test Suite Runtime: ' + ((Date.now() - testStart) / 1000) + 's');
      console.log();
    }
  }

  allTests.forEach(function(testCase) {
    var expectedOutputFile = testsOut + '/' + testCase.substr(0, testCase.lastIndexOf('.')) + '.out';
    var expectedOutput = fs.readFileSync(expectedOutputFile, {encoding: 'utf8'});

    exec('./a.out < ' + testsIn + '/' + testCase, function(err, stdout, stderr) {
      numComplete++;
      if (!err) {
        if (stdout.toString() === expectedOutput) {
          numCorrect++;
          console.log('Pass - '.green + testCase);
        } else {
          console.log('Fail - '.red + testCase);
        }
      }
      complete();
    });
  });
}

function outputBreak() {
  console.log('------------------------------'.bold);
}
