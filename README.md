CS 241 - Unit Tester
====================

This is a unit tester for CS 241 assignments written in javascript.

This tester will only test C/C++ code that can be compiled using g++.

Requirements
------------

- Ideally, the latest version of Node.js
- Ideally, the latest version of `npm`
- OS X 10.10 (This tester was only tested on OS X 10.10)
  - This tester *should* also work on any other \*nix platforms (including earlier OS X versions) that support Node.js

Installation
------------

First, clone this repository.

`git clone https://github.com/geoffxy/CS241-UnitTester.git`

Next, navigate to the directory with this repository and run:

`npm install`

so that you have all the needed dependencies installed.

That's it!

Usage
-----

`./test.js [--nocompile] [root]`

- `--nocompile` - Adding this flag will bypass the compilation and the test runner will look for an executable named `a.out` in your program's root folder instead.
- `root` - Specify the path to your program's root folder. If you omit this argument, the tester will assume the current directory is your root directory.

Adding Test Cases
-----------------

This test runner will look in the root directory of your program for a directory named `tests`.

Within `tests`, you must have a directory named `in` and a directory named `out`. All test case inputs should be placed in the directory named `in`. These files will be fed into your program's standard input when it is being tested.

To specify the expected output, place a file with the same name (as your test case input file) in the `out` folder but with the `.yaml` extension. This file will need to follow the pattern below:

```yaml
error: true || false
strict: true || false
result: |
  <expected output>
```

If the program is expected to produce an error for the test case, set the `error` property to true. If `error` is set to true, you can specify the `strict` property. A strict error test case is one where the program's output *must exactly match* the string specified in `result`. If the `strict` property is set to false, then the test runner will check that the string specified in `result` occurs somewhere in the program's standard error output. If you don't specify `result` in this case, then the tester will just look to see if the string, "ERROR", appears anywhere in the program's standard output.

If the program is not expected to produce an error, you don't need to include the `error` nor `strict` properties. You just need to include the `result` property with the expected output as specified above.

Example Test Cases
------------------

**Input Test Case File (tests/in/input1.wlp4):**
```c
int wain(int a, int b) {
  return a;
}
```

**Output Test Case File (tests/out/input1.yaml):**
```yaml
result: |
  INT int
  WAIN wain
  LPAREN (
  INT int
  ID a
  COMMA ,
  INT int
  ID b
  RPAREN )
  LBRACE {
  RETURN return
  ID a
  SEMI ;
  RBRACE }
```

**Input Test Case File (tests/in/input2.wlp4):**
```c
int wain(int a, int b) {
  return 123abc123;
}
```

**Output Test Case File (tests/out/input2.yaml):**
```yaml
error: true
strict: false
```

*For test case 2, we only care that the program outputs an error message where the string "ERROR" appears at some point. This is why we use a non-strict error test.*

License
-------

MIT License
