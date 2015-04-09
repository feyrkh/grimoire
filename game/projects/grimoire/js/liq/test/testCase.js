function buildTestCaseHelper(testSpecs, prefix, k) {
    return new (liq.test.TestCase.extend(prefix + k, {},
        {
            runTest: function() {
                if (testSpecs.__before) {
                    testSpecs.__before();
                }
                try {
                    testSpecs[k].bind(this)();
                } finally {
                    if (testSpecs.__after) {
                        testSpecs.__after();
                    }
                }
            }
        }
    ));
}

liq.test.TestCase = pc.Scene.extend('liq.test.TestCase',
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
    {
        finished: false,
        failureMsg: null,
        longRunning: false,

        /**
         * @param longRunning If true, ends the test after a single processing step. Otherwise, tests must
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
            if (expected !== actual) {
                this.fail(msg + ' - expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual));
            }
        },

        assertSetEquals: function(msg, expected, actual) {
            if (typeof actual == 'undefined') {
                actual = expected;
                expected = msg;
                msg = 'Assertion failed';
            }
            var failed = false;
            if (expected.length != actual.length) {
                failed = true;
            } else {
                for (var i = 0; i < expected.length; i++) {
                    if (expected.indexOf(actual[i]) < 0) {
                        failed = true;
                        break;
                    }
                }
            }
            if (failed) {
                this.fail(msg + ' - expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual));
            }
        },

        assertTrue: function(msg, flag) {
            if (typeof msg == 'undefined') {
                flag = msg;
                msg = 'Assertion failed';
            }
            if (!flag) {
                this.fail(msg + ' - expected truthy value, got ' + JSON.stringify(flag));
            }
        },

        expectException: function(msg, fn) {
            if (typeof msg == 'undefined') {
                fn = msg;
                msg = 'Assertion failed';
            }
            try {
                fn();
                throw "EXPECTED EXCEPTION";
            } catch (e) {
                if (e.indexOf("EXPECTED EXCEPTION") >= 0) {
                    this.fail(msg + ' - expected an exception but didn\'t get one.');
                }
            }
        }
    });