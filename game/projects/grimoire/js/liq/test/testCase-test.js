liq.test.TestCase.buildTests('liq.logic.Precept', {
    passingAssertEqualsOk: function() {
        this.assertEquals(1, 1);
        this.assertEquals(0, 0);
        this.assertEquals('test', 'test');
        this.assertEquals('with msg 1', 1, 1);
        this.assertEquals('with msg 2', 0, 0);
        this.assertEquals('with msg 3', 'test', 'test');
    },
    failingAssertEqualsThrowsException: function() {
        this.expectException('0 vs 1', function() {
            this.assertEquals(0, 1)
        });
        this.expectException('with whitespace diff', function() {
            this.assertEquals('test', 'test ')
        });
        this.expectException('diff strings', function() {
            this.assertEquals('foo', 'bar')
        });
        this.expectException('0 vs 1 with msg', function() {
            this.assertEquals('msg', 0, 1)
            this.assertEquals(0, 0, 1)
            this.assertEquals(1, 0, 1)
        });
        this.expectException('with whitespace diff with msg', function() {
            this.assertEquals('msg', 'test', 'test ')
            this.assertEquals('test', 'test', 'test ')
            this.assertEquals('test ', 'test', 'test ')
        });
        this.expectException('diff strings with msg', function() {
            this.assertEquals('msg', 'foo', 'bar')
            this.assertEquals('foo', 'foo', 'bar')
            this.assertEquals('bar', 'foo', 'bar')
        });
    },

    passingAssertTrueOk: function() {
        this.assertTrue(true);
        this.assertTrue(1);
        this.assertTrue('true');
        this.assertTrue('msg', true);
        this.assertTrue('', true);
        this.assertTrue('msg', 1);
        this.assertTrue('', 1);
        this.assertTrue('msg', 'true');
        this.assertTrue('', 'true');
    },

    failingAssertTrueThrowsException: function() {
        this.expectException('false', function() {
            this.assertTrue(false);
        });
        this.expectException('0', function() {
            this.assertTrue(0);
        });
        this.expectException('false with msg', function() {
            this.assertTrue('msg', false);
        });
        this.expectException('false with empty msg', function() {
            this.assertTrue('', false);
        });
        this.expectException('0 with msg', function() {
            this.assertTrue('msg', 0);
        });
        this.expectException('0 with empty msg', function() {
            this.assertTrue('', 0);
        });
    },

    assertSetEqualsWithOneNullSet: function() {
        this.expectException('null 1st', function() {
            this.assertSetEquals(null, [1]);
        });
        this.expectException('null 2nd', function() {
            this.assertSetEquals([1], null);
        });
        this.expectException('null 1st empty 2nd', function() {
            this.assertSetEquals(null, []);
        });
        this.expectException('empty 1st null 2nd', function() {
            this.assertSetEquals([], null);
        });
        this.expectException('null 1st plus msg', function() {
            this.assertSetEquals('msg', null, [1]);
        });
        this.expectException('null 2nd plus msg', function() {
            this.assertSetEquals('msg', [1], null);
        });
        this.expectException('null 1st empty 2nd plus msg', function() {
            this.assertSetEquals('msg', null, []);
        });
        this.expectException('empty 1st null 2nd plus msg', function() {
            this.assertSetEquals('msg', [], null);
        });
    },

    assertSetEqualsWithTwoNullSets: function() {
        this.assertSetEquals(null, null);
        this.assertSetEquals('msg', null, null);
    },

    assertSetEqualsWithEqualInOrderSets: function() {
        this.assertSetEquals([1, 2, 3, 4, 'a', 'b', 'c'], [1, 2, 3, 4, 'a', 'b', 'c']);
        this.assertSetEquals('msg', [1, 2, 3, 4, 'a', 'b', 'c'], [1, 2, 3, 4, 'a', 'b', 'c']);
    },

    assertSetEqualsWithEqualOutOfOrderSets: function() {
        this.assertSetEquals([1, 2, 'three'], ['three', 2, 1]);
        this.assertSetEquals('msg', [1, 2, 'three'], [2, 'three', 1]);
    },


    assertSetEqualsWithEqualSetsAndDuplicates: function() {
        this.assertSetEquals([1, 2, 2], [2, 2, 1]);
        this.assertSetEquals('msg', [1, 2, 2], [2, 2, 1]);
    },

    assertSetEqualsWithUnEqualSetsAndDuplicates: function() {
        this.expectException('no msg', function() {
            this.assertSetEquals([1, 1, 2], [1, 2, 2]);
        });
        this.expectException('with msg', function() {
            this.assertSetEquals('msg', [1, 1, 2], [1, 2, 2]);
        });
    },

    assertSetEqualsWithDifferentSizeSets: function() {
        this.expectException('no msg', function() {
            this.assertSetEquals([1, 2], [1, 2, 3]);
        });
        this.expectException('with msg', function() {
            this.assertSetEquals('msg', [1, 2], [1, 2, 3]);
        });
    },

    assertSetEqualsWithUnequalSameSizeSets: function() {
        this.expectException('no msg', function() {
            this.assertSetEquals([1, 2], [1, 3]);
        });
        this.expectException('with msg', function() {
            this.assertSetEquals('msg', [1, 2], [1, 3]);
        });
    },

    expectExceptionWithExceptionOk: function() {
        this.expectException('msg', function() {
            this.fail('failing');
        });
        this.expectException(function() {
            this.fail('failing');
        });
    },

    expectExceptionWithoutExceptionFails: function() {
        this.expectException('msg', function() {
            this.expectException('msg', function() {
                // no exceptions
            });
        });
        this.expectException(function() {
            this.expectException('msg', function() {
                // no exceptions
            });
        });
    }
});