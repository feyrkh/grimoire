/**
 * GameScene
 * A template game scene
 */
liq.test.TestRunner = pc.Scene.extend('liq.test.TestRunner',
    {
        testCases: []
    },
    {
        activeTest: null,
        nextScene: null,
        testIdx: 0,
        init: function(nextScene) {
            this._super();
            this.nextScene = nextScene;
            this.testCases = liq.test.TestRunner.testCases;
            this.failingTests = [];
        },

        printFailingTests: function() {
            pc.device.ctx.fillStyle = '#ffffff';
            pc.device.ctx.font = 'bold 12px Verdana';
            pc.device.ctx.fillText('Finished ' + this.testIdx + ' of ' + this.testCases.length + ' tests, had ' + this.failingTests.length + ' failures', 10, 14);
            if (this.activeTest) {
                pc.device.ctx.fillText('Running test: ' + this.activeTest.Class.fullName, 10, 28);
            }
            if (this.failingTests.length == 0) return;
            var y = 49;
            for (var i = 0; i < this.failingTests.length; i++) {
                var test = this.failingTests[i];
                pc.device.ctx.fillText(test.Class.fullName + ' ' + test.failureMsg, 10, y);
                y += 14;
            }
        },

        process: function() {
            if (this.activeTest && this.activeTest.finished) {
                this.testIdx += 1;
                // Currently running test is complete, deactivate and clear it
                pc.device.game.deactivateScene(this.activeTest);
                if (this.activeTest.failureMsg) {
                    this.failingTests.push(this.activeTest);
                }
                this.activeTest = null;
            }

            // clear the background
            if (this.failingTests.length > 0) {
                pc.device.ctx.fillStyle = '#ff0000';
            } else {
                pc.device.ctx.fillStyle = '#00ff00';
            }
            pc.device.ctx.fillRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);

            this.printFailingTests();

            if (!this.finished) {
                if (!this.activeTest) {
                    // No test is running now
                    if (this.testIdx >= this.testCases.length) {
                        if (this.failingTests.length > 0) {
                            this.error("Can't continue, had " + this.failingTests.length + " failing tests.");
                            this.finished = true;
                            return;
                        }
                        // All tests passed, load the next scene
                        pc.device.game.deactivateScene(this);
                        pc.device.game.activateScene(this.nextScene);
                        return;
                    }
                    this.activeTest = this.testCases[this.testIdx];
                    pc.device.game.activateScene(this.activeTest);
                    this.info('Starting test: ' + this.activeTest.Class.fullName);
                }
            }

            // always call the super
            this._super();
        }
    });
