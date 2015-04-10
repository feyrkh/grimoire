(function() {
    liq.vis.WebItem = pc.MyComponent.extend('liq.vis.WebItem',
        /** @lends liq.vis.WebItem **/
        {
        },
        /** @lends liq.vis.WebItem.prototype **/
        {
            id: null,
            links: null,
            visible: true,

            /**
             * @constructs
             * @param settings.id ID - should be unique within a WebMapLayer, most likely.
             * @param settings.links Array of IDs representing the links to other WebItems. Bidirectional links will be twice as strong.
             * @param settings.visible Whether to render this item on a WebMapLayer.
             */
            create: function(settings) {
                this.assertNotEmpty(settings.id, 'id');
                this.assertNotEmpty(settings.links, 'links');
                this.id = settings.id;
                this.links = settings.links;
                this.visible = typeof(settings.visible) === 'undefined' ? true : settings.visible;
            },
            init: function(settings) {
                this._super(['webItem']);
                this.create(settings);
            }
        }
    );
})();