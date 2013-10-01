exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.getHello = function(req, callback, auth) {
    callback({text: 'Hello World!'})
}