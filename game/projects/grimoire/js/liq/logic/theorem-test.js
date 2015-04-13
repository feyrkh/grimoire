(function() {
    var preceptRegistry;
    var theoremRegistry;

    function buildPrecept(name, p1, p2) {
        return new liq.logic.Precept({name: name, p1: p1, p2: p2, desc: 'desc'});
    }

    function defaultTheorems() {
        new liq.logic.Theorem({
            name: 'Spark',
            precepts: {Fire: 1},
            desc: 'desc'
        });
    }

    liq.test.TestCase.buildTests('liq.logic.Theorem', {
        __before: function() {
            preceptRegistry = liq.logic.Precept.registry;
            theoremRegistry = liq.logic.Theorem.registry;
            liq.logic.Precept.registry = {};
            buildPrecept('Air');
            buildPrecept('Fire');
            buildPrecept('Light', 'Air', 'Fire');
            buildPrecept('Order');
            buildPrecept('Water');
            buildPrecept('Earth');

            liq.logic.Theorem.registry = {};
            this.assertEquals('Precept registry not set up correctly', 6, Object.keys(liq.logic.Precept.registry).length);
        },
        __after: function() {
            liq.logic.Precept.registry = preceptRegistry;
            liq.logic.Theorem.registry = theoremRegistry;
        },

        canCreateSimpleTheorem: function() {
            this.assertEquals('Fire theorem usage before new theorem', 0, liq.logic.Precept.registry.Fire.theoremUsage.length);
            var t = new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 1},
                desc: 'description'
            });
            this.assertEquals('precepts', {Fire: 1}, t.precepts);
            this.assertEquals('description', t.desc);
            this.assertEquals('Fire theorem usage after new theorem', 1, liq.logic.Precept.registry.Fire.theoremUsage.length);
        },

        mustUseExistingPrecepts: function() {
            this.expectException('invalid precept name', function() {
                var t = new liq.logic.Theorem({
                    name: 'Spark',
                    precepts: {SuperFire: 1},
                    desc: 'description'
                });
            });
        },

        theoremGetsIndexedInRegistryOnCreation: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 1},
                desc: 'description'
            });
            this.assertEquals('theorem registry size', 1, Object.keys(liq.logic.Theorem.registry).length);
            this.assertEquals('theorem indexed', t, liq.logic.Theorem.registry['Spark']);
        },

        emptyPreceptsThrowsException: function() {
            this.expectException('theorem with no precepts', function() {
                var t = new liq.logic.Theorem({
                    name: 'Invalid',
                    precepts: {},
                    desc: 'description'
                });
            });
        },

        canCreateComplexTheorem: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            this.assertEquals('precepts', {Fire: 3, Light: 1}, t.precepts);
            this.assertEquals('Fire theorem usage after new theorem', 1, liq.logic.Precept.registry.Fire.theoremUsage.length);
            this.assertEquals('Light theorem usage after new theorem', 1, liq.logic.Precept.registry.Light.theoremUsage.length);

        },

        canCreateRandomizedTheorem: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: '1:3', Light: '1:500'},
                desc: 'description'
            });
            var firstLightUsage = t.precepts.Light;
            var t2 = new liq.logic.Theorem({
                name: 'Spark2',
                precepts: {Fire: '1:3', Light: '1:500'},
                desc: 'description'
            });
            var secondLightUsage = t2.precepts.Light;
            this.assertTrue('Light precept usage should not be same, but was: ' + firstLightUsage + ' vs ' + secondLightUsage, firstLightUsage != secondLightUsage);
            this.assertTrue('Fire usage #1 between 1 and 3, was ' + t.precepts.Fire, t.precepts.Fire >= 1 && t.precepts.Fire <= 3);
            this.assertTrue('Fire usage #2 between 1 and 3, was ' + t2.precepts.Fire, t2.precepts.Fire >= 1 && t2.precepts.Fire <= 3);
        },

        preceptCountOfZeroNotIncludedInMap: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 3, Light: 0},
                desc: 'description'
            });
            this.assertEquals('precepts', {Fire: 3}, t.precepts);
            this.assertEquals('Light theorem usage after new theorem', 0, liq.logic.Precept.registry.Light.theoremUsage.length);
        },

        canNotCreateTheoremsWithDuplicateName: function() {
            new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 3, Light: 0},
                desc: 'description'
            });
            this.expectException('creating duplicate theorem', function() {
                new liq.logic.Theorem({
                    name: 'Spark',
                    precepts: {Fire: 3, Light: 0},
                    desc: 'description'
                });
            });
        },

        canCreateTheoremsWithSamePrecepts: function() {
            new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            new liq.logic.Theorem({
                name: 'Spark2',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
        },

        canLinkToChildPrecept: function() {
            var parent = new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            var child = new liq.logic.Theorem({
                name: 'Spark2',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            parent.addLink(child);
            this.assertEquals(['Spark2'], parent.children);
        },

        canNotLinkToChildPreceptTwice: function() {
            var parent = new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            var child = new liq.logic.Theorem({
                name: 'Spark2',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            parent.addLink(child);
            parent.addLink(child);
            this.assertEquals(['Spark2'], parent.children);
        },

        canGenerateWebItemEntry: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            /**
             * @type {liq.vis.WebItem}
             */
            var w = t.getWebItem();
            this.assertTrue('webItem', w);
            this.assertEquals('Spark1', w.id);
        },

        canLoadFile: function() {
            var fileContent = [
                {name: 'Scientific Method', desc: 'd1', precepts: {'Order': 5}},
                {name: 'Hypothesis', desc: 'd2', precepts: {'Order': 1, 'Light': 1}},
                {name: 'Measurement', desc: 'd3', precepts: {'Order': 2, 'Earth': 1}}
            ];
            var file = new liq.test.MockFile(JSON.stringify(fileContent));
            liq.logic.Theorem.loadFile(file);
            this.assertEquals('Expected 3 theorems', 3, Object.keys(liq.logic.Theorem.registry).length);
            this.assertEquals('Scientific Method', liq.logic.Theorem.registry['Scientific Method'].name);
        },

        canCalculateAffinityFromPrecepts: function() {
            var t1 = new liq.logic.Theorem({
                name: 'Spark1',
                precepts: {Fire: 3, Light: 1},
                desc: 'description'
            });
            var t2 = new liq.logic.Theorem({
                name: 'Spark2',
                precepts: {Fire: 1, Light: 3},
                desc: 'description'
            });
            var aff = t1.getAffinity(t2);
            this.assertEquals('affinity is reversible', aff, t2.getAffinity(t1));
            this.assertEquals('affinity total', 2, aff);
        },

        canCalculateComplexityFromPrecepts: function() {
            var t = new liq.logic.Theorem({
                name: 'Spark',
                precepts: {Fire: 1, Light: 3},
                desc: 'description'
            });
            var complexity = t.getComplexity();
            this.assertEquals('complexity', 1 + 3 * 3, complexity);
        },
        canCalculateAffinityBonusFromDirectPrerequisite: function() {
            this.fail('not impl');
        },
        canIdentifyCircularPrereqs: function() {
            this.fail('not impl');
        },
        canGenerateLinksToFullyConnectWeb: function() {
            this.fail('not impl');
        }
    });
})();