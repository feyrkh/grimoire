(function() {
    liq.test.TestCase.buildTests('liq.vis.WebItem', {
        __before: function() {
        },
        __after: function() {
        },

        defaultVisIsTrue: function() {
            var cmp = new liq.vis.WebItem({id:1,links:[]});
            this.assertTrue(cmp.visible);
        },
        canSetVisFalse: function() {
            var cmp = new liq.vis.WebItem({id:1,links:[],visible:false});
            this.assertFalse(cmp.visible);
        },
        canSetVisTrue: function() {
            var cmp = new liq.vis.WebItem({id:1,links:[],visible:true});
            this.assertTrue(cmp.visible);
        }
    });
})();