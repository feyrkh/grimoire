(function() {
    liq.namespace.SystemName = pc.systems.EntitySystem.extend('liq.namespace.SystemName',
        /** @lends liq.namespace.SystemName */
        {},
        /** @lends liq.namespace.SystemName.prototype */
        {
            /**
             * @constructs
             */
            init: function() {
                this._super(['COMPONENT_NAMES']);
            },

            process: function(entity) {
//            var c = entity.getComponent('expiry');
//            if (!c.active) return;
//
//            c.decrease(pc.device.elapsed);
//            if (c.hasExpired())
//                entity.remove();
            }

        });
})();