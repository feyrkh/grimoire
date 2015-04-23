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
            contents: [],

            /**
             * @constructs
             * @param settings
             */
            init: function init(settings) {
                this.width = assertPositive(settings, 'width');
                this.height = assertPositive(settings, 'height');
                for (var y = -1; y <= this.height; y++) {
                    this.contents[y] = [];
                    for (var x = -1; x <= this.width; x++) {
                        this.contents[y][x] = {liquid: {}};
                    }
                }
            },

            /**
             * @param x {number} X coordinate
             * @param y {number} Y coordinate
             * @param liquid
             * @param liquid.name {string} Name of the liquid
             * @param liquid.amt {number} Amount of liquid present
             * @param liquid.temp {number} Temperature of the liquid
             */
            addLiquid: function addLiquid(x, y, liquid) {

            },

            averageLocalTemperatures: function averageLocalTemperatures(cell, transferAmt) {

            }
        }
    );
})();