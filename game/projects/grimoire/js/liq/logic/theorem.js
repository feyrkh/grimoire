(function() {
    var registry = {};

    liq.logic.Theorem = pc.MyBase.extend('liq.logic.Theorem',
        /** @lends liq.logic.Theorem */
        {
            /**
             * @type {Object.<string,liq.logic.Theorem>}
             */
            registry: registry,

            /**
             * @param dataResource A pc.DataResource containing the JSON to load.
             * @returns An array of liq.logic.Precept instances, or an exception if the precepts are inconsistent
             */
            loadFile: function(dataResource) {
                this.info('Loading ' + dataResource.name + ' into theorem registry');
                var entryArr = JSON.parse(dataResource.data);
                for (var entryIdx in entryArr) {
                    if (!entryArr.hasOwnProperty(entryIdx))continue;
                    var entryData = entryArr[entryIdx];
                    this.info('Loading ' + entryData.name + ' from ' + dataResource.name);
                    var theorem = new liq.logic.Theorem(entryData);
                }
                this.info('Finished loading ' + dataResource.name + ' into precept registry');
            },

            registerTheorem: function registerTheorem(t) {
                t.assertEmpty(liq.logic.Theorem.registry[t.name], 'Duplicate theorem not allowed: ' + t.name);

                t.assertNotEmpty(t.precepts, 'precepts');
                pc.assert(Object.keys(t.precepts).length, 'Must have at least 1 precept when registring theorem');
                liq.logic.Theorem.registry[t.name] = t;
            }
        },
        /** @lends liq.logic.Theorem.prototype */
        {
            name: null,
            /**
             * Map of precept names vs the number of research points needed.
             * @type {Object.<string, number>}
             */
            precepts: {},
            /**
             * Flavor text for this precept.
             */
            desc: null,

            /**
             * Theorems that could be learned after learning this one.
             */
            children: [],

            /**
             * @constructs
             * @param settings
             */
            init: function(settings) {
                pc.assert(pc.valid(settings.desc), 'Expected desc when creating theorem');
                pc.assert(pc.valid(settings.precepts), 'Expected nonempty precepts when creating theorem');
                this.name = settings.name;
                this.desc = settings.desc;
                for (var preceptName in settings.precepts) {
                    if (!settings.precepts.hasOwnProperty(preceptName)) continue;
                    var preceptCount = settings.precepts[preceptName];
                    if (typeof(preceptCount) === 'string' && preceptCount.indexOf(':') >= 0) {
                        var randRange = preceptCount.split(':');
                        var min = Number(randRange[0]);
                        var max = Number(randRange[1]);
                        preceptCount = min + Number(Math.floor(Math.random() * (max - min)));
                    } else {
                        preceptCount = Number(preceptCount);
                    }
                    if (preceptCount > 0) {
                        this.precepts[preceptName] = preceptCount;
                        liq.logic.Precept.registry[preceptName].theoremUsage.push(this.name);
                    }
                }

                liq.logic.Theorem.registerTheorem(this);
            },

            getWebItem: function getWebItem() {
                if (!this.webItem) {
                    this.webItem = liq.vis.WebItem.create({id: this.name, links: this.children});
                }
                return this.webItem;
            },

            /**
             * @param childTheorem
             */
            addLink: function addLink(childTheorem) {
                if (this.children.indexOf(childTheorem.name) < 0)
                    this.children.push(childTheorem.name);
            },

            getComplexity: function getComplexity() {
                var complex = 0;
                for (var preceptName in this.precepts) {
                    if (!this.precepts.hasOwnProperty(preceptName)) continue;
                    var preceptVal = this.precepts[preceptName];
                    var preceptDifficulty = preceptVal * liq.logic.Precept.registry[preceptName].calculateDifficulty();
                    complex += preceptDifficulty;
                }
                return complex;
            },

            getAffinity: function getAffinity(otherTheorem) {
                var aff = 0;
                for (var preceptName in this.precepts) {
                    if (!this.precepts.hasOwnProperty(preceptName)) continue;
                    var preceptVal = this.precepts[preceptName];
                    var otherPreceptVal = otherTheorem.precepts[preceptName] || 0;
                    aff += Math.min(preceptVal, otherPreceptVal);
                }
                return aff;
            }
        }
    );
})();