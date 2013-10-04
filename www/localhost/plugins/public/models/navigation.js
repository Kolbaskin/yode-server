exports.Plugin = function(server) {
    this.db = server.inits.db;
}

exports.Plugin.prototype.mainMenus = function(req, callback) {
    var me = this
    
    this.db.collection('mainmenu').find({removed:{$ne:true}}, {_id: 1, name:1, dir:1, pid:1, indx:1, root: 1}).sort({indx:1}).toArray(function(e,r) {

        if(!r.length) {
            callback({})
            return;
        }
        var res = {}
            ,out = {}
            ,root
        for(var i=0;i<r.length;i++) {
            if(r[i].root) {
               root = r[i]._id + ''
               break;
            }
        }
        for(var i=0;i<r.length;i++) {
            r[i].pid += '';
            r[i]._id += '';
            if(r[i].pid == root) {
               res[r[i]._id] = {indx: r[i].indx, items: []}     
            }
        }
        for(var i=1;i<r.length;i++) {
            if(res[r[i].pid]) {
               res[r[i].pid].items.push(r[i])     
            }
        }
        
        for(var i in res) {
            if(!out['MENU'+res[i].indx])  out['MENU'+res[i].indx] = []
            out['MENU'+res[i].indx] = res[i].items
        }
        callback(out)
    })
}

exports.Plugin.prototype.crumbs = function(req, callback, auth) {
    var me = this

    me.db.collection('pages').findOne({_id: req.pageData._id, removed:{$ne:true}}, {parents:1, dir:1, name: 1}, function(e, data) {
        var crumbs = []
            ,func = function() {
                crumbs.push({name: data.name, dir: data.dir, cur: true}) 
                callback(crumbs)
            }
        
        if(data.parents) {
            me.db.collection('pages').find({_id: {$in: data.parents}, removed:{$ne:true}}, {dir:1, name: 1}).toArray(function(e, pdata) {
                if(pdata) {
                    for(var i=data.parents.length-1;i>=0;i--) {
                        for(var j=0;j<pdata.length;j++) {
                            if(pdata[j]._id+'' == data.parents[i]) {
                                crumbs.push(pdata[j])    
                            }
                        }
                    }
                } 
                func()                
            })
        } else {
            func()
        }        
    })
}

exports.Plugin.prototype.childMenu = function(req, callback, auth) {
    var me = this
        ,dir = req.pageData.dir.split('/')
    
    me.db.collection('pages').find({pid: req.pageData._id, removed:{$ne:true}}).sort({indx:1}).toArray(function(e, data) {
        if((!data || !data.length) && dir.length>3) {            
            me.db.collection('pages').find({pid: req.pageData.pid, removed:{$ne:true}}).sort({indx:1}).toArray(function(e, data) {
                callback(data)
            })
            return;
        }
        callback(data)
    })
}

exports.Plugin.prototype.seoText = function(req, callback, auth) {
    var me = this
        ,u1, u = decodeURIComponent(req.href).replace(/\s/g, '%20')
        ,uin = []
        ,uu = ''
        
    u1 = u.split('/')
    for(var i=0;i<u1.length;i++) {
        uu += u1[i] + '/'
        uin.push(uu)
    }

    me.db.collection('seo').find({$or: [{url: u}, {url: {$in:uin}, inherit: true}], removed:{$ne:true}}, {text:1}).sort({url:-1}).limit(1).toArray(function(e, data) {
        callback(data? data[0]:null)
    })
}