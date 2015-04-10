(function() {
    liq.namespace.ComponentName = pc.MyComponent.extend('liq.namespace.ComponentName',
        /** @lends liq.namespace.ComponentName */
        {
        },
        /** @lends liq.namespace.ComponentName.prototype */
        {
            /**
             * @constructs
             * @param settings
             */
            create: function(settings) {

            },
            init: function(settings) {
                this._super('COMPONENT_NAME');
                this.create(settings);
            }
        }
    );
})();