/**
 * @namespace
 */
var liq = {};

(function() {
    function assertNotEmpty(val, field) {
        var msg;
        if (!val) {
            if (!field) field = 'Field';
            msg = field + ' must not be empty';
            this.error(msg);
            throw msg;
        }
    }

    function assertEmpty(val, field) {
        var msg;
        if (val) {
            if (!field) field = 'Field';
            msg = field + ' must be empty';
            this.error(msg);
            throw msg;
        }
    }

    pc.MyBase = pc.Base.extend('pc.MyBase', {},
        {
            assertNotEmpty: assertNotEmpty,
            assertEmpty: assertEmpty
        });

    pc.MyComponent = pc.components.Component.extend('pc.MyComponent', {},
        {
            assertNotEmpty: assertNotEmpty,
            assertEmpty: assertEmpty
        });

    pc.jsLoader.add('lodash.js');
    pc.jsLoader.add('liq/test/test.js');
    pc.jsLoader.add('liq/ui/ui.js');
    pc.jsLoader.add('liq/logic/logic.js');
    pc.jsLoader.add('liq/vis/vis.js');
}());