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
 * @param {pc.Point} force A vector that should be modified by adding the appropriate force between entity1 and entity2.
 */

(function() {
    liq.vis.WebMapSystem = pc.systems.EntitySystem.extend('liq.vis.WebMapSystem',
        /** @lends liq.vis.WebMapSystem */
        {},
        /** @lends liq.vis.WebMapSystem.prototype */
        {
            /** The root of the web */
            rootId: null,
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
            movedInFrame: false,

            /**
             * @constructs
             * @param {string} settings.rootId If set and a WebItem with the given id exists, the camera will focus on that item.
             * @param {linkRenderCallback} settings.renderCallback
             * @param {linkAttractionCallback} settings.attractionCallback - Called with each linked pair
             * @param {linkAttractionCallback} settings.repulsionCallback - Called with each pair
             */
            init: function(settings) {
                this._super(['webItem']);
                this.renderCallback = settings.renderCallback;
                this.attractionCallback = settings.attractionCallback;
                this.repulsionCallback = settings.repulsionCallback;
                this.rootId = settings.rootId;
            },

            onEntityAdded: function(entity) {
                /**
                 * @type {liq.vis.WebItem|*}
                 */
                var c = entity.getComponent('webItem');
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
                var c = entity.getComponent('webItem');
                this.items.remove(entity);
                var myEntityCopy = this.itemsById.get(c.id);
                if (myEntityCopy !== entity) return;
                this.itemsById.remove(entity);
            },

            processAll: function() {
                this.movedInFrame = false;
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].webMapForce.setXY(0, 0);
                }
                for (i = 0; i < this.items.length; i++) {
                    var myEntity = this.items[i];
                    var myWebItem = this.items[i].// TODO: FINISH THIS
                        for(
                    var j = i + 1;
                    j < this.items.length;
                    j++
                )
                    {
                        var otherEntity = this.items[j];
                    }
                }

                this._super();
                if (!this.movedInFrame) {
                    this.isStatic = true;
                }
            },

            calculateForces: function(myWebItem, mySpatial, myEntity, otherWebItem, otherSpatial, otherEntity) {
                if (this.attractionCallback) {
                    for (var linkIdx in myWebItem.links) {
                        if (!myWebItem.links.hasOwnProperty(linkIdx)) continue;
                        var targetLinkId = myWebItem.links[linkIdx];
                        var targetEntity = this.itemsById.get(targetLinkId);
                        if (!targetEntity) {
                            this.error("Unexpectedly null ")
                        }
                        /**
                         * @type {Object}
                         */
                        this.attractionCallback(myEntity, targetEntity, this.force);
                    }
                }

                if (this.repulsionCallback) {
                    var myIdx = this.items.indexOf(myEntity);
                    for (var targetIdx = myIdx + 1; targetIdx < this.items.length; targetIdx++) {
                        targetEntity = this.items[targetIdx];
                        this.repulsionCallback(myEntity, targetEntity, this.force);
                    }
                }

                if (this.force.x < this.forceCutoff && this.force.y < this.forceCutoff) {
                    // Do nothing - the force is too small to care about
                } else {
                    // Apply the force
                    this.movedInFrame = true;

                }
            }, process: function(entity) {
            /**
             * @type {liq.vis.WebItem|*}
             */
            var c = entity.getComponent('webItem');
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

