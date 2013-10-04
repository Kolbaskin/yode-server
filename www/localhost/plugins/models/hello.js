exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    callback({text: 'Hello World!'})
}