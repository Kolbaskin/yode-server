/**
 * Модуль управления правми доступа в админке
 * 
 */
 
var fs = require('fs')
    ,forms = require('forms')

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;  
}

// Получить распределение всех прав для пользователя по ИД
// метод только для локального использования
exports.Plugin.prototype.getUserAccessRates = function(req, callback, auth, user) { // getUserAccess2Models
    

    
    if(!auth) {
        callback(null, {code: 500})
        return;
    }
    var me = this;
    
    if(!user) {
        user = auth
    }   
    
    me.getuserinfo({}, function(data) {
        if(data.superuser) {
            callback({superuser: true})
        } else {
            if(data) {                    
                callback(data.group)
            } else {
                callback(null, e)
            }
        }    
    }, user)

}

/**
*
* reading user info
*
*/

exports.Plugin.prototype.getuserinfo = function(req, callback, auth) { 
    
    if(!auth) {
        callback(null, {code: 401})
        return;
    }
    
    var me = this
    me.db.collection('admin_users').findOne({_id: auth}, {}, function(e, data) {       
        if(data) {            
            if(data.superuser) {
                callback(data)
            } else {            
                me.db.collection('groups').findOne({_id: data.group}, {modelAccess:1, pagesAccess: 1}, function(e, gdata) {
                    if(gdata) {                    
                        data.group = gdata
                    } 
                    callback(data)                    
                })
            }
        }
        else callback(null, e)
    })    
}

var getModuleName = function(s) {
    return s.substr(18).replace('.model.', '-')
}


// Проверить права пользователя на конкретный модуль
exports.Plugin.prototype.checkAccess2Model = function(req, callback, auth, user) {

    this.getUserAccessRates(req, function(rights) {
      
        if(!rights) {
            callback({read: false, add: false, modify: false, del: false})
            return;
        }
      
        if(rights.superuser) {
            // для суперюзера все пути открыты
            callback({read: true, add: true, modify: true, del: true})
            return;
        }
        
        var models = rights.modelAccess
        if(models && req.urlparams) {            
            
            
            var model = getModuleName(req.urlparams[1]);
            if(models[model]) callback(models[model])
            else if(models[model + 'Model']) callback(models[model + 'Model'])
            else callback({read: false, add: false, modify: false, del: false})
        } else {
            callback({read: false, add: false, modify: false, del: false})
        }
    }, auth, user)
}

exports.Plugin.prototype.getAllModels = function(req, callback, auth) {
    
    if(!auth) {
        callback(null, {code: 401})
        return;
    }
    
    var me = this, md = me.server.dir + '/' + me.server.config.ADMIN_MODULES_DIR + '/modules'
        ,manifests = [];
    
    var readF = function(md, e, files) {  
        if(e) {return;}
            
        var s, dr;
        for(var i=0;i<files.length;i++) {
            dr = md + '/' + files[i] + '/model/'
            if(fs.existsSync(dr)) {
                s = fs.readdirSync(dr)
                var ll, mn;
                for(var j=0;j<s.length;j++) {
    
                    ll = true
                    mn = files[i] + '-' + s[j].substr(0,s[j].length-3)
                    for(var jj=0;jj<manifests.length;jj++) {
                        if(manifests[jj].name == mn) {
                            ll = false
                            break;
                        }
                    }
                    if(ll) {
                        var model = require(dr + s[j].substr(0,s[j].length-3))
                        if(model) manifests.push({name: mn, publ: (model.publicContriller? model.publicContriller:(!!model.public? 'default:html:' + mn: false))})
                    }
                }
            }
        }
    }
    
    
    fs.readdir(md, function(e, files) {
        readF(md, e, files) 
        fs.readdir(me.server.serverDir + '/static/admin/modules', function(e, files) {
            readF(me.server.serverDir + '/static/admin/modules', e, files)
            callback({list:manifests},null)
        })
    })
    
}

exports.Plugin.prototype.modules = function(req, callback, auth) {
    
    if(!auth) {
        callback(null, {code: 401}); 
        return;
    }
    
    //var md = this.server.dir + '/' + this.server.config.ADMIN_MODULES_DIR + '/modules'
    var   me = this, manifests = [];
    
    var readDir = function(md, callback) {  
        fs.readdir(md, function(e, files) {  
            if(e) {callback(manifests);return 0;}
            var s;
            for(var i=0;i<files.length;i++) {
                files[i] = md + '/' + files[i] + '/manifest.json'
                if(fs.existsSync(files[i])) {
                    s = fs.readFileSync(files[i], 'utf8')
                    s = JSON.parse(s)
    
                    if(s) {
                        if(Object.prototype.toString.call(s)=='[object Array]') {
                            for(var j=0;j<s.length;j++) manifests.push(s[j]);
                        } else {
                            manifests.push(s);
                        }
                    }
                }
            }
            callback(manifests,null)        
        }) 
    }   
   
    readDir(me.server.serverDir + '/'+me.server.config.ADMIN_MODULES_DIR + '/modules', function() {
        readDir(me.server.dir + '/' + me.server.config.ADMIN_MODULES_DIR + '/modules', function(manifests) {
            callback(manifests,null)
        })
    })
}

exports.Plugin.prototype.getPageRates = function(req, callback, auth, page, rates) {
    if(page && rates) {
        var ret = false, id = page._id + ''
        if(rates.pagesAccess['root'] && rates.pagesAccess['root'].inherit) return rates.pagesAccess['root'] 
        if(page.root) {
            if(!rates.pagesAccess['root']) return false
            return rates.pagesAccess['root']
        }
        if(rates.pagesAccess[id]) ret = rates.pagesAccess[id]
        if(page.parents) {
            for(var i=0;i<page.parents.length-1;i++) {
                id = page.parents[i]+''
                if(rates.pagesAccess[id] && rates.pagesAccess[id].inherit) {
                    ret = rates.pagesAccess[id]    
                }
            }
        }
        return ret    
    }
    callback({module_status: 'undefined'})
}

exports.Plugin.prototype.getuserphoto = function(req, callback, auth) {
    var me = this
        ,o_id
        ,folder = {}
        ,head = {code: 200, status: 'OK', heads: {'Content-Type': 'image/jpeg'}}        
     
    if((o_id = forms.strToId(req.urlparams[0], callback)) === 0) return;
     
    me.db.collection('admin_users').findOne({_id: o_id}, {photo:1}, function(e,data) {
        if(data.photo) {
            
            callback(data.photo.buffer ,null, head)
                
        
        } else callback(null, {code: 404})
    })    
}

exports.Plugin.prototype.checklogin = function(req, callback, auth) {
    if(auth) {
        if(req.login) {
            this.db.collection('admin_users').findOne({login: req.login}, {_id:1}, function(e,data) {
                callback({result: !!(!data || (data._id+'') == (auth+''))})    
            }) 
        } else callback(null, {code: 500})
    } else {
        callback(null, {code: 401})
    }
}

