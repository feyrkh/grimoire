(function() {
    var origPrecepts;
    liq.test.TestCase.buildTests('liq.logic.Precept', {
        __before: function() {
            origPrecepts = liq.logic.Precept.registry;
            liq.logic.Precept.registry = {};
        },
        __after: function() {
            liq.logic.Precept.registry = origPrecepts;
        },

        canCreateAxiom: function() {
            this.assertEquals("# of precepts", 0, Object.keys(liq.logic.Precept.registry).length);
            var p = new liq.logic.Precept({
                name: "Air",
                p1: null,
                p2: null,
                desc: "A basic axiom."
            });
            this.assertEquals("name", "Air", p.name);
            this.assertEquals("p1", null, p.p1);
            this.assertEquals("p2", null, p.p2);
            this.assertEquals("desc", "A basic axiom.", p.desc);
            this.assertEquals("difficulty", 1, p.difficulty);
            this.assertSetEquals("component usage", [], p.preceptUsage);
            this.assertSetEquals("theorem usage", [], p.theoremUsage);
            this.assertEquals("# of precepts", 1, Object.keys(liq.logic.Precept.registry).length);
        },

        nameAndDescRequired: function() {
            this.expectException("missing desc",
                function() {
                    new liq.logic.Precept({
                        name: "Air"
                    });
                });

            this.expectException("missing name",
                function() {
                    new liq.logic.Precept({
                        desc: "Mysterious element"
                    });
                });
        },

        canCreateComposedPrecept: function() {
            var p1 = new liq.logic.Precept({
                name: "Air", desc: "desc"
            });
            var p2 = new liq.logic.Precept({
                name: "Fire", desc: "desc"
            });
            var p3 = new liq.logic.Precept({
                name: "Light", desc: "desc",
                p1: "Fire", p2: "Air"
            });
            var p4 = new liq.logic.Precept({
                name: "Shimmer", desc: "desc",
                p1: "Light", p2: "Air"
            })
            this.assertEquals("light diff", 3, p3.difficulty);
            this.assertEquals("Parents should be sorted #1", "Air", p3.p1);
            this.assertEquals("Parents should be sorted #2", "Fire", p3.p2);
            this.assertEquals("shimmer diff", 3 + 1 + 1, p4.difficulty);

            this.assertSetEquals("air used in light & shimmer", ['Light', 'Shimmer'], p1.preceptUsage);
            this.assertSetEquals('fire used in light', ['Light'], p2.preceptUsage);
            this.assertSetEquals('light used in shimmer', ['Shimmer'], p3.preceptUsage);
            this.assertSetEquals('shimmer used nowhere', [], p4.preceptUsage);
        },

        mustHaveExistingParents: function() {
            this.expectException(function() {
                var p3 = new liq.logic.Precept({
                    name: "Light", desc: "desc",
                    p1: "Fire", p2: "Air"
                });
            });
        },

        canNotCreateDuplicateEntries: function() {
            var p1 = new liq.logic.Precept({
                name: "Air", desc: "desc"
            });
            this.expectException("creating duplicates.",
                function() {
                    var p2 = new liq.logic.Precept({
                        name: "Air", desc: "desc"
                    });
                });
        },

        canLoadSimpleFile: function() {
            var fileContent = [
                {name: 'Air', desc: 'air desc'},
                {name: 'Fire', desc: 'fire desc'},
                {name: 'Light', desc: 'light desc', p1: 'Air', p2: 'Fire'}
            ];
            var file = new liq.test.MockFile(JSON.stringify(fileContent));
            liq.logic.Precept.loadFile(file);
            this.assertEquals('Expected 3 precepts', 3, Object.keys(liq.logic.Precept.registry).length);
            this.assertEquals('Air', liq.logic.Precept.registry.Air.name);
            this.assertEquals('Fire', liq.logic.Precept.registry.Fire.name);
            this.assertEquals('Light', liq.logic.Precept.registry.Light.name);
        },

        loadingInconsistentFileFails: function() {
            this.expectException(function() {
                var fileContent = [
                    {name: 'Air', desc: 'air desc'},
                    {name: 'Light', desc: 'light desc', p1: 'Air', p2: 'Fire'}
                ];
                var file = new liq.test.MockFile(JSON.stringify(fileContent));
                liq.logic.Precept.loadFile(file);
            });
        },

        loadingNonListFileFails: function() {
            this.expectException(function() {
                var fileContent =
                {name: 'Air', desc: 'air desc'};
                var file = new liq.test.MockFile(JSON.stringify(fileContent));
                liq.logic.Precept.loadFile(file);
            });
        }
    });
})();