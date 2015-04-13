(function () {
    var registry = {};

    function randomAmt(amt) {
        if (typeof(amt) === 'string' && amt.indexOf(':') >= 0) {
            var randRange = amt.split(':');
            var min = Number(randRange[0]);
            var max = Number(randRange[1]);
            amt = min + Number(Math.random() * (max - min));
        } else {
            amt = Number(amt);
        }

        return amt;
    }

    function settingsOrDefault(settings, defaults, field) {
        if (typeof(settings[field] !== 'undefined')) {
            defaults[field] = settings[field];
        }
    }

    function variableField(settings, defaults, field) {
        var fieldVal = settingsOrDefault(settings, defaults, field);
        var varVal = settingsOrDefault(settings, defaults, field + 'Variance');
        fieldVal = randomAmt(fieldVal) + randomAmt(varVal);
        defaults[field] = fieldVal;
        defaults[field + 'Variance'] = 0;
    }

    var Precept = pc.MyBase.extend('liq.logic.Precept',
        /** @lends liq.logic.Precept **/
        {
            /**
             * @type {Object.<string,liq.logic.Precept>}
             */
            registry: registry,

            /**
             * @param dataResource A pc.DataResource containing the JSON to load.
             * @returns An array of liq.logic.Precept instances, or an exception if the precepts are inconsistent
             */
            loadFile: function (dataResource) {
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
            freezingPoint: 0,
            freezingPointVariance: '-40:40',
            boilingPoint: 100,
            boilingPointVariance: '-40:40',
            highPressureSensitivity: 0.037,
            highPressureSensitivityVariance: '-0.01:0.01',
            lowPressureSensitivity: -0.3,
            highPressureSensitivityVariance: '-0.1:0.1',
            energy: 1,
            energyVariance: '-0.9:0.9',
            mass: 1,
            massVariance: '-0.9:3',

            /**
             * Array of precept names this precept is a component of.
             */
            preceptUsage: [],
            /**
             * Array of theorem names this precept is a component of.
             */
            theoremUsage: [],
            linkNames: [],

            /**
             * @constructs
             * @param settings
             * @param {string} settings.name Name of the precept
             * @param {string} settings.p1 Name of the first parent precept
             * @param {string} settings.p2 Name of the second parent precept
             * @param {string} settings.desc Flavor text for this precept
             */
            init: function (settings) {
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

                variableField(settings, this, 'freezingPoint');
                variableField(settings, this, 'boilingPoint');
                variableField(settings, this, 'highPressureSensitivity');
                variableField(settings, this, 'lowPressureSensitivity');
                variableField(settings, this, 'energy');
                variableField(settings, this, 'mass');

                return this;
            },

            calculateDifficulty: function () {
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