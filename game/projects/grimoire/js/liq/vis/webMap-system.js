(function() {
    var tmpPoint = new pc.Point(0, 0);
    var epsilon = 1;

    function getConnectingLineSegment(e1, e2) {
        var s1 = e1.getComponent('spatial');
        var s2 = e2.getComponent('spatial');
        var p1 = s1.getCenterPos();
        var p2 = s2.getCenterPos();
        tmpPoint.match(p1);
        tmpPoint.moveTowards(p2, s1.dim.x / 2);
        var line = [
            {x: tmpPoint.x, y: tmpPoint.y}
        ];

        tmpPoint.moveTowards(p2, p1.distance(p2) - (s2.dim.x));
        line.push({x: tmpPoint.x, y: tmpPoint.y});
        return line;
    }

    liq.vis.WebMapSystem = pc.systems.EntitySystem.extend('liq.vis.WebMapSystem',
        /** @lends liq.vis.WebMapSystem */
        {
            buildDefaultAttractionCallback: function(defaultPos, springConstant) {
                return function defaultAttractionCallback(e1, e2, f1, f2) {
                    var s1 = e1.getComponent('spatial');
                    var s2 = e2.getComponent('spatial');
                    var p1 = s1.getCenterPos();
                    var p2 = s2.getCenterPos();
                    var force = (p1.distance(p2) - defaultPos) * springConstant;
                    tmpPoint.match(p1);
                    tmpPoint.moveTowards(p2, force);
                    f1.x += tmpPoint.x - p1.x;
                    f1.y += tmpPoint.y - p1.y;
                    tmpPoint.match(p2);
                    tmpPoint.moveTowards(p1, force);
                    f2.x += tmpPoint.x - p2.x;
                    f2.y += tmpPoint.y - p2.y;
                }
            },

            buildDefaultRepulsionCallback: function(atDistance, repulsionShouldBePixelsPerSecond) {
                var atDistSquared = atDistance * atDistance;
                return function(e1, e2, f1, f2) {
                    var s1 = e1.getComponent('spatial');
                    var s2 = e2.getComponent('spatial');
                    var p1 = s1.getCenterPos();
                    var p2 = s2.getCenterPos();
                    var distSquared = (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
                    var force = -(repulsionShouldBePixelsPerSecond / (distSquared / atDistSquared));

                    tmpPoint.match(p1);
                    tmpPoint.moveTowards(p2, force);
                    f1.x += tmpPoint.x - p1.x;
                    f1.y += tmpPoint.y - p1.y;
                    tmpPoint.match(p2);
                    tmpPoint.moveTowards(p1, force);
                    f2.x += tmpPoint.x - p2.x;
                    f2.y += tmpPoint.y - p2.y;
                }
            },


            buildDefaultRenderCallback: function(layer) {
                return function(e1, e2) {
                    var line = getConnectingLineSegment(e1, e2);

                    var context = pc.device.ctx;
                    var pos = layer.origin;
                    context.beginPath();
                    context.moveTo(line[0].x - pos.x, line[0].y - pos.y);
                    context.lineTo(line[1].x - pos.x, line[1].y - pos.y);

                    // set line color
                    context.strokeStyle = '#0000ff';
                    context.stroke();
                }
            }
        },
        /** @lends liq.vis.WebMapSystem.prototype */
        {
            /**
             * If set to a function, the function will be called
             *  with each pair of linked items. The returned vector will be applied to each item in each pair to move them
             *  closer/farther away. The 2nd entity in the pair will receive the negative of the return value.
             *  The sum of all repulsion/attractions will be the final movement amount.
             *  @type {linkAttractionCallback}
             */
            attractionCallback: null,
            /**
             * If set to a function, the function will be called to render links between
             *  each pair of linked items. For bidirectional links, this function will be called twice.
             *  @type {linkRenderCallback}
             */
            renderCallback: null,

            /**
             * All entities, keyed by the WebItem's id. Used to run the attraction callback.
             * @type {pc.Hashmap}
             */
            itemsById: new pc.Hashmap(),

            /**
             * All entities, in order of addition. Used to run the repulsion callback.
             */
            items: [],

            /**
             * @type {pc.Point}
             */
            force: new pc.Point(0, 0),

            /**
             * If true, stop processing force updates. By default this is set to true if nothing moves
             * over a single frame.
             */
            isStatic: false,

            /**
             * If true, something moved during the last update.
             */
            movedInFrame: true,

            /**
             * @constructs
             * @param {linkRenderCallback} settings.renderCallback
             * @param {linkAttractionCallback} settings.attractionCallback - Called with each linked pair
             * @param {linkAttractionCallback} settings.repulsionCallback - Called with each pair
             * @param {object} settings.gravity
             * @param settings.gravity.x
             * @param settings.gravity.y
             * @param settings.gravity.strength
             */
            init: function(settings) {
                this._super(['webitem']);
                this.renderCallback = settings.renderCallback;
                this.attractionCallback = settings.attractionCallback;
                this.repulsionCallback = settings.repulsionCallback;
                this.gravity = settings.gravity;
            },

            onEntityAdded: function(entity) {
                /**
                 * @type {liq.vis.WebItem|*}
                 */
                var c = entity.getComponent('webitem');
                entity.webMapForce = pc.Point.create(0, 0);
                if (this.itemsById.get(c.id)) {
                    var msg = 'Tried to overwrite entity with the same ID';
                    this.error(msg);
                    throw(msg);
                }
                this.items.push(entity);
                this.itemsById.put(c.id, entity);
            },

            onEntityRemoved: function(entity) {
                if (entity.webMapForce) {
                    entity.webMapForce.release();
                }
                var c = entity.getComponent('webitem');
                this.items.remove(entity);
                var myEntityCopy = this.itemsById.get(c.id);
                if (myEntityCopy !== entity) return;
                this.itemsById.remove(entity);
            },

            randomizeLayout: function(x, y) {
                this.isStatic = false;
                _.forEach(this.items, function(entity) {
                    var spatial = entity.getComponent('spatial');
                    spatial.pos.x = x + Math.random() * 30;
                    spatial.pos.y = y + Math.random() * 30;
                });
                this.reachEquilibrium(500);
            },

            reachEquilibrium: function(timeoutInMs) {
                var origRender = this.renderCallback;
                this.renderCallback = null;
                var prevElapsed = pc.device.elapsed;
                var endTime = timeoutInMs + Date.now();
                while (!this.isStatic && Date.now() < endTime) {
                    pc.device.elapsed = 50;
                    this.processAll();
                }
                pc.device.elapsed = prevElapsed;
                var crossed = this.findCrossedLines();
                if (this.isStatic) {
                    this.debug('Reached equilibrium with ' + crossed + ' crossed lines');
                } else {
                    this.debug('No equilibrium with ' + crossed + ' crossed lines');
                }
                this.renderCallback = origRender;
                return crossed;
            },

            findBestEquilibrium: function(minLoops, maxLoops) {
                var bestCrossedCount = Infinity;
                for (var i = 0; i < minLoops; i++) {
                    maxLoops--;
                    this.randomizeLayout(1000, 1000);
                    var crossed = this.reachEquilibrium(1000);
                    if (crossed < bestCrossedCount) {
                        bestCrossedCount = crossed;
                    }
                    this.debug('Best seen equilibrium: ' + bestCrossedCount);
                }
                while (crossed > bestCrossedCount && maxLoops > 0) {
                    maxLoops--;
                    this.randomizeLayout(1000, 1000);
                    crossed = this.reachEquilibrium(1000);
                    this.debug('Checking equilibrium: ' + crossed);
                }
            },

            findCrossedLines: function() {
                var crossed = 0;
                var lines = [];
                var webSys = this;
                _.forEach(this.items, function(e1) {
                    var s1 = e1.getComponent('spatial');
                    var myWebItem = e1.getComponent('webitem');

                    for (var linkIdx in myWebItem.links) {
                        if (!myWebItem.links.hasOwnProperty(linkIdx)) continue;
                        var linkName = myWebItem.links[linkIdx];
                        var linkEntity = webSys.itemsById.get(linkName);
                        var s2 = linkEntity.getComponent('spatial');
                        var line = getConnectingLineSegment(e1, linkEntity);
                        lines.push({p1: line[0], p2: line[1]});
                    }
                });

                for (var i = 0; i < lines.length; i++) {
                    for (var j = i; j < lines.length; j++) {
                        if (doLineSegmentsIntersect(lines[i].p1, lines[i].p2, lines[j].p1, lines[j].p2)) {
                            crossed++;
                        }
                    }
                }
                this.debug('Total lines: ' + lines.length);
                return crossed;
            },

            processAll: function() {
                if (!this.isStatic) {
                    this.movedInFrame = false;
                    for (var i = 0; i < this.items.length; i++) {
                        this.items[i].webMapForce.setXY(0, 0);
                    }
                    for (i = 0; i < this.items.length; i++) {
                        var myEntity = this.items[i];
                        if (this.gravity) {
                            mySpatial = myEntity.getComponent('spatial');
                            if (mySpatial.pos.distance(this.gravity) > 5)
                                mySpatial.pos.moveTowards(this.gravity, this.gravity.strength * pc.device.elapsed / 1000.0);
                        }
                        /**
                         * @type {liq.vis.WebItem}
                         */
                        myWebItem = myEntity.getComponent('webitem');
                        for (var j = i + 1; j < this.items.length; j++) {
                            var otherEntity = this.items[j];
                            this.repulsionCallback(myEntity, otherEntity, myEntity.webMapForce, otherEntity.webMapForce);
                        }
                        for (var linkIdx in myWebItem.links) {
                            var linkName = myWebItem.links[linkIdx];
                            var linkEntity = this.itemsById.get(linkName);
                            this.attractionCallback(myEntity, linkEntity, myEntity.webMapForce, linkEntity.webMapForce);
                        }
                    }

                    for (i = 0; i < this.items.length; i++) {
                        var movingEntity = this.items[i];
                        var movement = movingEntity.webMapForce;
                        if (Math.abs(movement.x) < epsilon && Math.abs(movement.y) < epsilon) continue;
                        /**
                         * @type {pc.components.Spatial}
                         */
                        var mySpatial = movingEntity.getComponent('spatial');
                        mySpatial.pos.x += movement.x * pc.device.elapsed / 1000.0;
                        mySpatial.pos.y += movement.y * pc.device.elapsed / 1000.0;
                        this.movedInFrame = true;
                    }
                }
                if (this.renderCallback) {
                    for (i = 0; i < this.items.length; i++) {
                        myEntity = this.items[i];
                        /**
                         * @type {liq.vis.WebItem}
                         */
                        var myWebItem = myEntity.getComponent('webitem');

                        for (linkIdx in myWebItem.links) {
                            linkName = myWebItem.links[linkIdx];
                            linkEntity = this.itemsById.get(linkName);
                            this.renderCallback(myEntity, linkEntity);
                        }
                    }
                }

                this._super();
                if (!this.movedInFrame) {
                    this.isStatic = true;
                }
            },

            process: function(entity) {
                /**
                 * @type {liq.vis.WebItem|*}
                 */
                var c = entity.getComponent('webitem');
                if (!c.active) return;

                /**
                 * @type {pc.components.Spatial|*}
                 */
                var spatial = entity.getComponent('spatial');
                if (!spatial || !spatial.active) return;

                if (!this.isStatic) {
//                this.processMovement(c, spatial, entity);
                }
//
//            c.decrease(pc.device.elapsed);
//            if (c.hasExpired())
//                entity.remove();
            }

        });
})();

/**
 * This callback renders a link between a pair of WebItem entries. May be called twice
 * if there are bidirectional links.
 *
 * @callback linkRenderCallback
 * @param {pc.Entity} entity1
 * @param {pc.Entity} entity2
 */

/**
 * This callback calculates the attractive force between two linked entities. If modeling a spring,
 * this may be negative if the entities are too close, but the linkRepulsionCallback may also be
 * used to compensate for too-closeness.
 *
 * @callback linkAttractionCallback
 * @param {pc.Entity} entity1
 * @param {pc.Entity} entity2
 * @param {pc.Point} force1 A vector that should be modified by adding the appropriate force on entity1.
 * @param {pc.Point} force2 A vector that should be modified by adding the appropriate force on entity2.
 */