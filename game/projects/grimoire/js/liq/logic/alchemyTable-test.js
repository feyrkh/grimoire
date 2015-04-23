(function () {
    var origPrecepts;

    function defaultTable() {
        return new liq.logic.AlchemyTable({
            width: 10,
            height: 10
        });
    }

    var t = defaultTable();
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
        },

        gridIsCreated: function () {
            this.assertTrue("Expected something at [5,3]", t.contents[5][3]);
        },

        canAddLiquid: function () {
            t.addLiquid(3, 0, {name: 'Water', amt: 10});
            this.assertEquals({Water: {name: 'Water', amt: 10}}, t.contents[0][3]);
        },

        canCombineSimilarLiquids: function () {
            t.addLiquid(1, 5, {name: 'Water', amt: 1});
            t.addLiquid(1, 5, {name: 'Water', amt: 3});
            this.assertEquals({Water: {name: 'Water', amt: 4}}, t.contents[1][5]);
        },

        canCombineDifferentLiquids: function () {
            t.addLiquid(1, 5, {name: 'Water', amt: 1});
            t.addLiquid(1, 5, {name: 'Fire', amt: 3});
            this.assertEquals({Water: {name: 'Water', amt: 1}, Fire: {name: 'Fire', amt: 3}}, t.contents[1][5]);
        },

        canAverageTemperaturesForSimilarLiquids: function () {
            t.addLiquid(1, 5, {name: 'Water', amt: 5, temp: 10});
            t.addLiquid(1, 5, {name: 'Water', amt: 5, temp: -2});
            this.assertEquals({Water: {name: 'Water', amt: 4, temp: 4}}, t.contents[1][5]);
        },

        canAverageTemperaturesForDifferentLiquids: function () {
            t.addLiquid(1, 5, {name: 'Fire', amt: 3, temp: 10});
            t.addLiquid(1, 5, {name: 'Water', amt: 1, temp: -2});
            this.assertEquals({
                Water: {name: 'Water', amt: 1, temp: 7},
                Fire: {name: 'Fire', amt: 3, temp: 7}
            }, t.contents[1][5]);
        },

        canAverageTemperaturesOverTimeForAdjacentLiquids: function () {
            t.addLiquid(1, 5, {name: 'Fire', amt: 1, temp: 10});
            t.addLiquid(2, 4, {name: 'Fire', amt: 1, temp: 10});
            t.addLiquid(0, 5, {name: 'Fire', amt: 1, temp: 10});
            t.addLiquid(1, 4, {name: 'Water', amt: 1, temp: -2});
        }


    });
})();