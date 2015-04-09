var liq = {};

pc.MyBase = pc.Base.extend('pc.MyBase', {},
    {
        assertNotEmpty: function assertNotEmpty(val, msg) {
            if (!val) {
                if (!msg) msg = 'Non-empty value required';
                this.error(msg);
                throw msg;
            }
        },
        assertEmpty: function assertNotEmpty(val, msg) {
            if (val) {
                if (!msg) msg = 'Empty value required';
                this.error(msg);
                throw msg;
            }
        }
    });

pc.jsLoader.add('lodash.js');
pc.jsLoader.add('liq/test/test.js');
pc.jsLoader.add('liq/logic/logic.js');