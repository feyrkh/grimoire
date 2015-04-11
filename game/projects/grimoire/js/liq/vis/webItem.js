(function() {

    /**
     * @class liq.vis.WebItem
     */
    liq.vis.WebItem = pc.MyComponent.extend('liq.vis.WebItem',
        /** @lends liq.vis.WebItem **/
        {
            /**
             * @param settings.id ID - should be unique within a WebMapLayer, most likely.
             * @param settings.links Array of IDs representing the links to other WebItems. Bidirectional links will be twice as strong.
             * @param settings.visible Whether to render this item on a WebMapLayer.
             * @return {liq.vis.WebItem}
             */
            create: function(settings) {
                var n = this._super();
                n.config(settings);
                return n;
            }
        },
        /** @lends liq.vis.WebItem.prototype **/
        {
            id: null,
            links: null,
            visible: true,

            config: function(settings) {
                this.assertNotEmpty(settings.id, 'id');
                this.assertNotEmpty(settings.links, 'links');
                this.id = settings.id;
                this.links = settings.links;
                this.visible = typeof(settings.visible) === 'undefined' ? true : settings.visible;
            },
            init: function(settings) {
                this._super('webitem');
                if (pc.valid(settings))
                    this.config(settings);
            }
        }
    );
})();