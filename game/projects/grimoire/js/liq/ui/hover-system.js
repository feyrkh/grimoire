(function() {
    var worldMouseCoords = new pc.Point(0, 0);

    liq.ui.HoverSystem = pc.systems.EntitySystem.extend('liq.ui.HoverSystem',
        /** @lends liq.ui.HoverSystem */
        {},
        /** @lends liq.ui.HoverSystem.prototype */
        {
            /**
             * @constructs
             */
            init: function(layer) {
                pc.assert(pc.valid(layer), 'Must provide a layer for world coordinates');
                this._super(['hover']);
                this.layer = layer;
            },

            processAll: function() {
                var origin = this.layer.origin;
                worldMouseCoords.match(pc.device.input.mousePos);
                worldMouseCoords.add(origin);
//                this.writeCoords();

                this._super();
            },

            writeCoords: function() {
                var ctx = pc.device.ctx;
                ctx.fillStyle = "#ffffff";
                ctx.font = 'Arial 12pt';
                ctx.fillText(pc.device.input.mousePos.toString(), pc.device.input.mousePos.x, pc.device.input.mousePos.y + 30);
                ctx.fillText(worldMouseCoords.toString(), pc.device.input.mousePos.x, pc.device.input.mousePos.y + 44);

            },

            process: function(entity) {
                var s = entity.getComponent('spatial');
                var c = entity.getComponent('hover');
                if (!c.active) return;

                if ((c.onHover || c.onEnter) && s.getScreenRect().containsPoint(pc.device.input.mousePos)) {
                    if (c.hovering) {
                        if (c.onHover)
                            c.onHover(entity);
                    } else {
                        c.hovering = true;
                        if (c.onEnter)
                            c.onEnter(entity);
                    }
                } else if (c.hovering && c.onLeave) {
                    c.onLeave(entity);
                    c.hovering = false;
                }
            }

        });
})();