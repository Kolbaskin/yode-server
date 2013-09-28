var forms = require('forms')
    ,dataFunc = require('./datafunctions')

exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
}

var changeBool = function(auth, req, pname, db, callback) {
    if(auth != null) {
        if(req._id && req.val) {
            var find,x;
            if(req._id == 'root') {
                find = {root: true}
            } else {
                if((x = forms.strToId(req._id, callback)) === 0) return;
                find = {_id: x}
            }
            var set = {}
            set[pname] = (req.val=='true'? true:false)
            db.collection('pages').update(find, {$set:set}, function(e,r) {
                callback({success: true})
            })
            return;
        }         
    } 
    callback(null, {code: 500});
}

exports.Plugin.prototype.chmod = function(req, callback, auth) {
    changeBool(auth, req, 'access', this.db, callback)
}

exports.Plugin.prototype.toSitemap = function(req, callback, auth) {
    changeBool(auth, req, 'map', this.db, callback)
}

exports.Plugin.prototype.reorder = function(req, callback, auth, colname) {
    
    if(!colname) colname = 'pages'
    
    if(!auth) {
        callback(null, {code:401}); return;
    }
    
    if(req.jsonData) {
        var me = this
            ,dataAll = JSON.parse(req.jsonData) 
            ,data 
        
        if(!dataAll) { callback(null, {code:500}); return;}
        
        data = dataAll.recs
            
        var func = function(i) {
            if(!data[i]) {
                
                if(dataAll.indexes) {
                    var idd;
                    for(var n in dataAll.indexes) {
                        if((idd = forms.strToId(n)) === 0) {}
                        else {                        
                            me.db.collection(colname).update({_id: idd}, {$set:{indx: dataAll.indexes[n]}}, function(){})
                        }
                    }
                }
                callback({success: true, data: data})
                return;    
            }
            var id, pid;
            if((id = forms.strToId(data[i]._id)) === 0) {func(i+1);return;}
            if((pid = forms.strToId(data[i].pid)) === 0) {func(i+1);return;}

            
            var findIndex = {$gt:data[i].indx}
            if(data[i].pos == 'after') data[i].indx++
            else if(data[i].pos == 'before') {
                data[i].indx--
                findIndex = {$gte:data[i].indx}
            }
             //:{$gte:data[i].indx})
            
            //me.db.collection(colname).find({pid:pid, indx:findIndex}, {_id:1}).sort({indx:1}).toArray(function(e,pages) {
                
                
                                
            var set = {pid: pid}
            if(data[i].dir) set.dir = data[i].dir
            
            if(colname == 'pages') {
                dataFunc.parentpages(null, function(pages, dir) {
                    set.parents = pages
                    set.dir = dir
                    data[i].dir = dir
                    me.db.collection(colname).update({_id:id}, {$set:set}, function(e,r) {
                        func(i+1)                   
                    }) 
                }, {pid:set.pid+'', alias: data[i].alias}, {collection: colname}, null, me)
            } else {
                me.db.collection(colname).update({_id:id}, {$set:set}, function(e,r) {
                    func(i+1)                   
                })
            }
                
            //})
        }
        
        func(0)
        
    } else {     
        callback(null, {code:404})
    }
}

exports.Plugin.prototype.menureorder = function(req, callback, auth) {
    this.reorder(req, callback, auth, 'mainmenu')
}