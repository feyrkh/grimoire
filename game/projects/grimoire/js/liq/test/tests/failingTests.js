liq.test.TestCase.buildTests('liq.test.tests.failing', {
    failTest: function() {
        this.fail("Sorry, this test can't pass.");
    },
    failTest2: function() {
        this.assertEquals(2, 1 + 2);
    }
});