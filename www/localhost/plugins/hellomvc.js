exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    
    var me = this
    
    me.server.getModel('models.hello').getHello(req, function(data, e) {
        this.server.tpl('hello.tpl', data, function(code) {
            callback(code);
        })
    })
}