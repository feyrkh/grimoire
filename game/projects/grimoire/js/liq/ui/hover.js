(function() {
    liq.ui.Hover = pc.MyComponent.extend('liq.ui.Hover',
        /** @lends liq.ui.Hover */
        {
            /**
             * @param settings
             * @param settings.onEnter {function} Called when the mouse enters the hover area. Param is the target entity.
             * @param settings.onLeave {function} Called when the mouse exits the hover area. Param is the target entity.
             * @param settings.onHover {function} Called when the mouse stays in the hover area. Param is the target entity.
             * @return {liq.ui.Hover}
             */
            create: function(settings) {
                var n = this._super();
                n.config(settings);
                return n;
            }
        },
        /** @lends liq.ui.Hover.prototype */
        {
            onEnter: null,
            onLeave: null,
            onHover: null,
            hovering: false,

            config: function(settings) {
                this.onEnter = settings.onEnter;
                this.onLeave = settings.onLeave;
                this.onHover = settings.onHover;
                this.hovering = false;
            },
            init: function(settings) {
                this._super('hover');
                if (pc.valid(settings))
                    this.config(settings);
            }
        }
    );
})();

