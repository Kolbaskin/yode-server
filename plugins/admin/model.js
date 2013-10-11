var login = require('./models/login'),
    permiss = require('./models/permiss'),
    data = require('./models/data')

exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
}

exports.Plugin.prototype.userslist = function(params, callback, auth) {
    if(auth != null) {
        login.users(auth, this.db.collection('admin_users'), function(r, e) {
            callback(r, e);
        })
    } else callback(null, {code: 401});
}

// Login method
exports.Plugin.prototype.login = function(params, callback) {
    
    this.server.getModel('admin.models.user').getAutorization('admin_users', {login: params.login}, params.pass, callback)
    
    /*
    login.enter(params, this.db.collection('admin_users'), function(r, e) {
        callback(r, e);
    }, this.server.inits.mem, this.server.inits.mail)
    */
}

// exit
exports.Plugin.prototype.exit = function(params, callback) {    
    this.server.inits.mem.delete(params.token)
}

// New user registration
exports.Plugin.prototype.add = function(params, callback) {
    
    login.add(params, this.db.collection('admin_users'), function(r, e) {
        callback(r, e);
    }, this)

}

// two step login
exports.Plugin.prototype.enter2step = function(params, callback) {    
    login.enter2step(params, this.server.inits.mem, function(r, e) {
        callback(r, e);
    }, this.server.config)
}

// is user registrated
exports.Plugin.prototype.test = function(params, callback, auth) {    
    callback({result: auth}, null);
}

// is user registrated
exports.Plugin.prototype.myinfo = function(params, callback, auth) {    
    if(!!auth) {       
                
        login.userinfo({_id:auth}, this.db.collection('admin_users'), function(r, e) {
            callback(r, e);
        })
    } else {
        callback(null, {code: 401});    
    }
}

// module data
exports.Plugin.prototype.module = function(params, callback, auth) {    
    callback({total: 0, rows:[]}, null);
}

// Get modules names by permissions
exports.Plugin.prototype.usermoduleslist = function(params, callback, auth) {    
    
    this.server.getModel('admin.models.access').modules(params, callback, auth) // перенес в отдельный мо
    
    /*if(!!auth) {
        permiss.modules({_id:auth}, this, callback);
    } else {
        callback(null, {code: 401});    
    } */   
}

// Get user info
exports.Plugin.prototype.getuserinfo = function(params, callback, auth) {    
    this.server.getModel('admin.models.access').getuserinfo(params, callback, auth) // перенес в отдельный мо
    /*if(!!auth) {
        permiss.getuserinfo({_id:auth}, this, callback);
    } else {
        callback(null, {code: 401});    
    } 
    */
}

// Set user settings
exports.Plugin.prototype.setusersets = function(params, callback, auth) {    
    if(!!auth) {
        permiss.setusersets({_id:auth}, params, this, callback);
    } else {
        callback(null, {code: 401});    
    }    
}

// Working with grid data
exports.Plugin.prototype.getmodel = function(params, callback, auth) {    
    if(!!auth) {
        data.getmodel(params, this, callback, auth);
    } else {
        callback(null, {code: 401});    
    }    
}

exports.Plugin.prototype.getdata = function(params, callback, auth) {    
    if(!!auth) {
        
        var me = this
        
        me.server.getModel('admin.models.access').checkAccess2Model({urlparams:[null,params.urlparams[0]]}, function(access) {
            if(access && access.read) {
                if(params.reorder && access.modify) {
                    data.reorder(params, me, function(res) {
                        data.getdata(params, me, callback);
                    })
                } else {
                    data.getdata(params, me, callback);
                }
            } else {
                callback(null, {code: 403});
            }
        }, auth, auth)
        
        
    } else {
        callback(null, {code: 401});    
    }    
}

exports.Plugin.prototype.save = function(params, callback, auth) {    
    if(auth) {
        var me = this
        me.server.getModel('admin.models.access').checkAccess2Model({urlparams:[null,params.urlparams[0]]}, function(access) {
            data.save(params, me, callback, access, auth);
        }, auth, auth)
        
    } else {
        callback(null, {code: 401});    
    }    
}

exports.Plugin.prototype.del = function(params, callback, auth) {    
    if(!!auth) {
        var me = this
        me.server.getModel('admin.models.access').checkAccess2Model({urlparams:[null,params.urlparams[0]]}, function(access) {
            if(access && access.del) {
                data.del(params, me, callback, auth);
            } else {
                callback(null, {code: 403});
            }
        }, auth, auth)
        
        
    } else {
        callback(null, {code: 401});    
    }    
}



exports.Plugin.prototype.getdatatree = function(params, callback, auth) {    
    var me = this
    if(!!auth) {
        data.getdatatree(params, this, function(data) {
            if(data) {
                me.server.getModel('admin.models.access').getUserAccessRates({}, 
                function(rates) {
                    if(rates.superuser) {
                        // для суперюзера показываем все страницы
                        for(var i=0;i<data.length;i++) {
                            data[i].aAccess = {read: true, add: true, modify: true, del: false}
                        }
                        callback(data)    
                    } else {
                        // для остальных проверим права доступа
                        
                        var check = function(p) {
                            return me.server.getModel('admin.models.access').getPageRates(null, null, null, p, rates)
                        }
                        var r, out = []
                        for(var i=0;i<data.length;i++) {
                            r = check(data[i]) 
                            if(r && r.read) {
                                data[i].aAccess = r
                                out.push(data[i])
                            }
                        }
                        delete data
                        callback(out)
                    }
                }, auth, auth)
            }
        });
    } else {
        callback(null, {code: 401});    
    }    
}

exports.Plugin.prototype.upload = function(params, callback, auth) {    
    if(!!auth) {
        data.exportdir(params, this, callback);
    } else {
        callback(null, {code: 401});    
    }    
}
