(function () {
    var origPrecepts;
    liq.test.TestCase.buildTests('liq.logic.AlchemyTable', {
        __before: function () {
            origPrecepts = liq.logic.Precept.registry;
            liq.logic.Precept.registry = {};
        },
        __after: function () {
            liq.logic.Precept.registry = origPrecepts;
        },

        mustHaveWidthAndHeight: function () {
            new liq.logic.AlchemyTable({width: 1, height: 1});
            this.expectException(function () {
                new liq.logic.AlchemyTable({width: 1, height: 0});
            });
            this.expectException(function () {
                new liq.logic.AlchemyTable({width: 0, height: 1});
            });
            this.expectException(function () {
                new liq.logic.AlchemyTable({width: 1, height: -1});
            });
            this.expectException(function () {
                new liq.logic.AlchemyTable({width: -1, height: 1});
            });
            this.expectException(function () {
                new liq.logic.AlchemyTable({width: 1});
            });
            this.expectException(function () {
                new liq.logic.AlchemyTable({height: 1});
            });
        }

    });
})();