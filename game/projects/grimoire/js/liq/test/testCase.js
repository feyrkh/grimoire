function buildTestCaseHelper(testSpecs, prefix, k) {
    return new (liq.test.TestCase.extend(prefix + k, {},
        {
            runTest: function() {
                if (testSpecs.__before) {
                    testSpecs.__before.bind(this)();
                }
                try {
                    testSpecs[k].bind(this)();
                } finally {
                    if (testSpecs.__after) {
                        testSpecs.__after.bind(this)();
                    }
                }
            }
        }
    ));
}

liq.test.TestCase = pc.Scene.extend('liq.test.TestCase',
    /** @lends liq.test.TestCase **/
    {
        /**
         *
         * @param testSpecs
         */
        buildTests: function(namespace, testSpecs) {
            if (!testSpecs) return;
            var prefix = namespace || '';
            if (prefix && !prefix.endsWith('.')) prefix = prefix + '.';
            for (var k in testSpecs) {
                if (!testSpecs.hasOwnProperty(k)) continue;
                if (k.startsWith('__')) continue;
                buildTestCaseHelper(testSpecs, prefix, k);
            }
        }
    },

    /** @lends liq.test.TestCase.prototype **/
    {
        finished: false,
        failureMsg: null,
        stackTrace: null,
        longRunning: false,

        /**
         * @constructs
         * @param {bool} longRunning If true, ends the test after a single processing step. Otherwise, tests must
         *  set 'finished' field themselves.
         */
        init: function(longRunning) {
            this.debug("Creating test: " + this.Class.fullName);
            this._super();
            this.longRunning = longRunning;
            liq.test.TestRunner.testCases.push(this);
        },

        runTest: function() {
            this.warn('Unspecified test case!');
        },

        process: function() {
            try {
                this.runTest();
                if (!this.longRunning) {
                    this.finished = true;
                }
            } catch (e) {
                this.failureMsg = 'FAIL: ' + (e.message ? e.message : JSON.stringify(e));
                this.finished = true;
                if (e.stack) {
                    var stack = e.stack.split('\n');
                    this.failureMsg += '; ' + stack[0];
                    this.stackTrace = '    ' + stack[1];
                }

            }
        },

        fail: function(msg) {
            this.error(msg);
            throw msg;
        },

        assertEquals: function(msg, expected, actual) {
            if (typeof actual == 'undefined') {
                actual = expected;
                expected = msg;
                msg = 'Assertion failed';
            }
            if (!_.isEqual(expected, actual)) {
                this.fail(msg + ' - expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual));
            }
        },
        assertSetEquals: function(msg, expected, actual) {
            var failed = false;
            if (typeof actual == 'undefined') {
                actual = expected;
                expected = msg;
                msg = 'Assertion failed';
            }
            if (expected == null && actual == null) {
                failed = false;
            } else if (expected == null || actual == null) {
                failed = true;
            } else {
                var sortedExpected = _.clone(expected).sort();
                var sortedActual = _.clone(actual).sort();
                failed = !_.isEqual(sortedExpected, sortedActual);
            }
            if (failed) {
                this.fail(msg + ' - expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual));
            }
        },

        assertTrue: function(msg, flag) {
            if (typeof flag == 'undefined') {
                flag = msg;
                msg = 'Assertion failed';
            }
            if (!flag) {
                this.fail(msg + ' - expected truthy value, got ' + JSON.stringify(flag));
            }
        },

        assertFalse: function(msg, flag) {
            if (typeof flag == 'undefined') {
                flag = msg;
                msg = 'Assertion failed';
            }
            if (flag) {
                this.fail(msg + ' - expected false value, got ' + JSON.stringify(flag));
            }
        },

        expectException: function(msg, fn) {
            if (typeof fn == 'undefined') {
                fn = msg;
                msg = 'Assertion failed';
            }
            try {
                fn.bind(this)();
                throw "EXPECTED EXCEPTION";
            } catch (e) {
                if (typeof(e) == 'string' && e.indexOf("EXPECTED EXCEPTION") >= 0) {
                    this.fail(msg + ' - expected an exception but didn\'t get one.');
                }
            }
        }
    });