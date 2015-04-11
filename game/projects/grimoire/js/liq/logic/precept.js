(function() {
    var registry = {};
    var Precept = pc.MyBase.extend('liq.logic.Precept',
        /** @lends liq.logic.Precept **/
        {
            registry: registry,

            /**
             * @param dataResource A pc.DataResource containing the JSON to load.
             * @returns An array of liq.logic.Precept instances, or an exception if the precepts are inconsistent
             */
            loadFile: function(dataResource) {
                this.info('Loading ' + dataResource.name + ' into precept registry');
                var preceptArr = JSON.parse(dataResource.data);
                for (var preceptIdx in preceptArr) {
                    if (!preceptArr.hasOwnProperty(preceptIdx))continue;
                    var preceptData = preceptArr[preceptIdx];
                    this.info('Loading ' + preceptData.name + ' from ' + dataResource.name);
                    var precept = new Precept(preceptData);
                }
                this.info('Finished loading ' + dataResource.name + ' into precept registry');
            }
        },
        /** @lends liq.logic.Precept.prototype **/
        {
            name: null,
            p1: null,
            p2: null,
            desc: null,
            difficulty: null,
            preceptUsage: [],
            theoremUsage: [],
            linkNames: [],

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
                this.linkNames = [];
                if (this.p1) {
                    this.assertNotEmpty(Precept.registry[this.p1], this.p1 + ' does not exist, must load precepts in order (while loading ' + this.name + ')');
                    Precept.registry[this.p1].preceptUsage.push(this.name);
                    this.linkNames.push(this.p1);
                }
                if (this.p2) {
                    this.assertNotEmpty(Precept.registry[this.p2], this.p2 + ' does not exist, must load precepts in order (while loading ' + this.name + ')');
                    Precept.registry[this.p2].preceptUsage.push(this.name);
                    this.linkNames.push(this.p2);
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