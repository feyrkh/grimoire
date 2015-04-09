(function() {
    var registry = {};
    var Precept = pc.MyBase.extend('liq.logic.Precept',
        {
            registry: registry,

            /**
             * @param dataResource A pc.DataResource containing the JSON to load.
             * @returns An array of liq.logic.Precept instances, or an exception if the precepts are inconsistent
             */
            loadFile: function(dataResource) {

            }
        },
        {
            name: null,
            p1: null,
            p2: null,
            desc: null,
            difficulty: null,
            preceptUsage: [],
            theoremUsage: [],

            init: function(settings) {
                this.assertNotEmpty(settings.name, 'Name required');
                this.assertNotEmpty(settings.desc, 'Desc required');
                this.assertEmpty(Precept.registry[settings.name], 'Duplicate precept not allowed: ' + settings.name);
                this.name = settings.name;
                if (settings.p1 > settings.p2) {
                    var tmp = settings.p1;
                    settings.p1 = settings.p2;
                    settings.p2 = tmp;
                }
                this.p1 = settings.p1;
                this.p2 = settings.p2;
                if (this.p1) {
                    Precept.registry[this.p1].preceptUsage.push(this.name);
                }
                if (this.p2) {
                    Precept.registry[this.p2].preceptUsage.push(this.name);
                }
                this.desc = settings.desc;
                this.difficulty = this.calculateDifficulty();
                Precept.registry[this.name] = this;
            },

            calculateDifficulty: function() {
                var total = 1;
                if (this.p1 != null) {
                    total += Precept.registry[this.p1].difficulty;
                }
                if (this.p2 != null) {
                    total += Precept.registry[this.p2].difficulty;
                }
                return total;
            }
        }
    );

    liq.logic.Precept = Precept;
})();