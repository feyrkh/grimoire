/**
 * GameScene
 * A template game scene
 */
GameScene = pc.Scene.extend('GameScene',
    { },
    {
        gameLayer: null,
        boxes: null,

        init: function() {
            this._super();

            this.boxes = [];

            //-----------------------------------------------------------------------------
            // game layer
            //-----------------------------------------------------------------------------
            this.gameLayer = this.addLayer(new pc.EntityLayer('game layer', 10000, 10000));

            var gravity = {x: 500, y: 500, strength: 50};
            // all we need is the render and effects systems
            this.gameLayer.addSystem(new pc.systems.Render());
            this.gameLayer.addSystem(new liq.vis.WebMapSystem({
                attractionCallback: liq.vis.WebMapSystem.buildDefaultAttractionCallback(100, 0.75),
                repulsionCallback: liq.vis.WebMapSystem.buildDefaultRepulsionCallback(100, 50),
                renderCallback: liq.vis.WebMapSystem.buildDefaultRenderCallback(this.gameLayer),
                gravity: gravity
            }));

            var pos = 1000;

            for (var preceptName in liq.logic.Precept.registry) {
                /**
                 * @type liq.logic.Precept
                 */
                pos += 30;
                var precept = liq.logic.Precept.registry[preceptName];
                var preceptEntity = pc.Entity.create(this.gameLayer);
                var preceptSpatial = pc.components.Spatial.create({x: Math.random() * 10 + 500, y: Math.random() * 10 + 500, w: 30, h: 30});
                preceptEntity.addComponent(preceptSpatial);
                preceptEntity.addComponent(pc.components.Circle.create({color: '#ffffff'}));
                preceptEntity.addComponent(pc.components.Text.create({color: '#ff0000', text: preceptName, fontHeight: 12}));
                preceptEntity.addComponent(liq.vis.WebItem.create({id: precept.name, links: precept.linkNames, visible: true}));
                this.cameraTarget = this.cameraTarget || preceptSpatial;
            }
            var gravMarker = pc.Entity.create(this.gameLayer);
            gravMarker.addComponent(pc.components.Circle.create({color: '#00ff00' }));
            gravMarker.addComponent(pc.components.Spatial.create({x: gravity.x, y: gravity.y, w: 10, h: 10}));

            this.cameraTarket = gravMarker.getComponent('spatial');

//            this.gameLayer.addSystem(new pc.systems.Effects());
//
//            for (var i = 0; i < 3; i++)
//            {
//                var box = pc.Entity.create(this.gameLayer);
//                box.addComponent(pc.components.Spatial.create({ x:200 + (i * 100), y:200, w:75, h:75 }));
//                box.addComponent(pc.components.Rect.create({ color:[ pc.Math.rand(0, 255), pc.Math.rand(0, 255), pc.Math.rand(0, 255) ] }));
//
//                this.boxes.push(box);
//            }
//
//            // bind some keys/clicks/touches to access the menu
//            pc.device.input.bindAction(this, 'menu', 'ENTER');
//            pc.device.input.bindAction(this, 'menu', 'ESC');
//            pc.device.input.bindAction(this, 'menu', 'MOUSE_BUTTON_LEFT_DOWN');
//            pc.device.input.bindAction(this, 'menu', 'TOUCH');

        },

        // handle menu actions
        onAction: function(actionName, event, pos, uiTarget) {
            if (pc.device.game.menuScene.active)
                return true;

            if (actionName === 'menu')
                pc.device.game.activateMenu();

            return false; // eat the event (so it wont pass through to the newly activated menuscene
        },

        process: function() {
            // clear the background
            pc.device.ctx.clearRect(0, 0, pc.device.canvasWidth, pc.device.canvasHeight);

            // always call the super
            this._super();
            this.gameLayer.setOrigin(
                    this.cameraTarget.pos.x - (this.viewPort.w / 2),
                    this.cameraTarget.pos.y - (this.viewPort.h / 2));
            //
            // ... do extra processing in here
            //
        }
    });
