(function() {
    liq.test.MockFile = pc.MyBase.extend('liq.test.MockFile',
        {
        },
        {
            data: null,
            init: function(data) {
                this.data = data;
            }
        }
    );
})();