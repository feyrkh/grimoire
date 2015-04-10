(function() {
    liq.test.MockFile = pc.MyBase.extend('liq.test.MockFile',
        {
        },
        {
            name: 'mock-file',
            data: null,
            init: function(data) {
                this.data = data;
            }
        }
    );
})();