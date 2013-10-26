exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
    this.search = this.server.inits.search
}

exports.Plugin.prototype.query = function(req, callback, auth) {
    
    var me = this
console.log(req);    
    if(!req.q && req.params.q) req.q = req.params.q
    
console.log('req.q:',req.q)    
    
    if(me.search && req.q) {
        me.search.Query(req.q, me.server.config.SEARCH_ENGINE.index, function(err, result) { 
console.log(result);
            callback({res: 'ok'})
        });
        
    } else {
        callback(null, {code: 500})
    }
    
}