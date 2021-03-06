/**
 * A sample game.js for you to work from
 */

TheGame = pc.Game.extend('TheGame',
    { },
    {
        gameScene: null,
        menuScene: null,

        onReady: function() {
            this._super();

            // disable caching when developing
            // if (pc.device.devMode)
            //    pc.device.loader.setDisableCache();

            // no resources are loaded in this template, so this is all commented out
            // pc.device.loader.add(new pc.Image('an id', 'images/an image.png'));
            pc.device.loader.add(new pc.DataResource('precepts.json', 'data/precepts.json',
                function(data) {
                    liq.logic.Precept.loadFile(data)
                }));

            //if (pc.device.soundEnabled)
            //   pc.device.loader.add(new pc.Sound('fire', 'sounds/fire', ['ogg', 'mp3'], 15));

            // fire up the loader
            pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
        },

        onLoading: function(percentageComplete) {
            // draw title screen -- with loading bar
        },

        onLoaded: function() {
            //this.addScene(new liq.test.TestRunner(new liq.test.MyTestSuite()));

            // create the game scene (notice we do it here AFTER the resources are loaded)
            this.gameScene = new PreceptViewScene();
            this.addScene(this.gameScene, false);

//            // create the menu scene (but don't make it active)
//            this.menuScene = new MenuScene();
//            this.addScene(this.menuScene, false);

            var testRunner = new liq.test.TestRunner(this.gameScene);

            // resources are all ready, start the main game scene
            // (or a menu if you have one of those)
            this.activateScene(testRunner);
        },

        activateMenu: function() {
            this.deactivateScene(this.gameScene);
            this.activateScene(this.menuScene);
        },

        deactivateMenu: function() {
            this.deactivateScene(this.menuScene);
            this.activateScene(this.gameScene);
        }
    });


