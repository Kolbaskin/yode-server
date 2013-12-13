var model = require("./model")
    ,fs = require('fs')
    modules = {}

exports.Plugin = function(server) {
    this.server = server;
    this.db = this.server.inits.db
    
   //console.log('model.Plugin'); console.log(model)
    
    if(!!model.Plugin) model = new(model.Plugin)(server)
}

exports.Plugin.prototype.login = function(request, callback) {
    
    if(request.urlparams[0] != null && request.urlparams[0] == 'out') {
        model.exit(request)
    }
    
    this.server.tpl('login.tpl', {}, function(code) {
        callback(code);
    })
}

exports.Plugin.prototype.registration = function(request, callback) {
    this.server.tpl('registration.tpl', {}, function(code) {
        callback(code);
    })
}

exports.Plugin.prototype.main = function(request, callback, auth) {
    var th = this
    if(auth != null) { 
        model.myinfo(null, function(r, e) {
            if(r != null) {
                r.token = request.token
                th.server.tpl('admin', r, function(code) {
                    callback(code);
                })
                
            } else
                callback('Error find user');
        }, auth)
    } else 
        callback('Error auth');
}

exports.Plugin.prototype.module = function(request, callback, auth) {
    var th = this
    if(auth != null) {
        
        var mn = request.urlparams[0];
        
        var run = function(module) {
            th.server.tpl(module.config.tpl_grid, module.config, function(code) {
                callback(code);
            })
        }
        
        if(modules[mn] != null) {
            run(modules[mn]);    
        } else {                
            var fn = __dirname+'/modules/'+mn+'.js';
            fs.exists(fn, function(log) {
                if(log) {                    
                    modules[mn] = require('./modules/'+mn);
                    run(modules[mn]);    
                }
            }); 
        }
    }
}