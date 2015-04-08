liq.test.TestCase.buildTests('liq.test.tests.passing', {
    passTest: function() {
        this.info("Passing test");
    },
    passTest2: function() {
        this.assertEquals('Equality check works', 2, 1 + 1);
    },
    verifyLongRunningWorks: function() {
        if (!this.setupComplete) {
            this.longRunning = true; // Ensures the test doesn't complete after 1st frame
            this.secondsToRun = 5;
            this.timeLeft = this.secondsToRun * 1000;
            this.setupComplete = true;
            this.framesUsed = 0;
        }

        this.timeLeft -= pc.device.elapsed;
        this.framesUsed += 1;
        if (this.timeLeft < 0) {
            var framesExpected = this.secondsToRun * 29; // Expect at least 29 FPS
            this.assertTrue('Expected ' + framesExpected + ' or more frames in ' + this.secondsToRun + ' seconds, but got ' + this.framesUsed,
                    this.framesUsed > framesExpected);
            this.longRunning = false;
        }
    }
});