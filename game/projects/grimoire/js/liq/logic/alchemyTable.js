(function () {
    function assertPositive(settings, fieldName) {
        var fieldVal = settings[fieldName];
        if (!fieldVal || fieldVal < 0) throw 'Expected ' + fieldName + ' to be positive, but was ' + fieldVal;
        return fieldVal;
    }

    liq.logic.AlchemyTable = pc.MyBase.extend('liq.logic.AlchemyTable',
        /** @lends liq.logic.AlchemyTable */
        {},
        /** @lends liq.logic.AlchemyTable.prototype */
        {
            items: [],

            /**
             * @constructs
             * @param settings
             */
            init: function (settings) {
                this.width = assertPositive(settings, 'width');
                this.height = assertPositive(settings, 'height');
            }
        }
    );
})();