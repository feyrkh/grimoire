(function() {
    liq.namespace.ComponentName = pc.MyComponent.extend('liq.namespace.ComponentName',
        /** @lends liq.namespace.ComponentName */
        {
            /**
             * @param settings
             * @return {liq.namespace.ComponentName}
             */
            create: function(settings) {
                var n = this._super();
                n.config(settings);
                return n;
            }
        },
        /** @lends liq.namespace.ComponentName.prototype */
        {
            config: function(settings) {

            },
            init: function(settings) {
                this._super('COMPONENT_NAME');
                if (pc.valid(settings))
                    this.config(settings);
            }
        }
    );
})();