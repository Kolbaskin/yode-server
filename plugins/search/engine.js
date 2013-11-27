var dataFuncs = require('../admin/models/data')
    ,authIndexer = require('./auth')
    ,exec = require('child_process').exec
    ,fs = require('fs')

exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
}

var runIndexer = function(config) {    
    
    exec('cd ' + __dirname
        + ' && indexer --config ./indexer.conf ' + config.SEARCH_ENGINE.index + '_upd'
        + ' && indexer --config ./indexer.conf --merge ' + config.SEARCH_ENGINE.index + ' ' + config.SEARCH_ENGINE.index + '_upd --rotate'
    , function(e, stdout, stderr) {

/*
console.log(e)
console.log(stdout)
console.log(stderr)
//*/
    })        
}

exports.Plugin.prototype.update_index = function(req, callback, auth, modelname, model, _id, noRunIndexer) {    
 
    if(!modelname) {
        callback(null, {code: 500})
        return; 
    }
  
    if(!model.searchBuildDocUrl ) {
        if(callback) callback({success: false})
        return; 
    }
  
    var me = this
        ,fin = function() {
            if(!!callback) callback({success: true})
            
            if(!noRunIndexer) runIndexer(me.server.config)
            
        }       
    me.db.collection('search_index').update({m: modelname, id:_id}, {$set: {a: 'u'}}, function(e,r) {
        if(r === 0) {
        // Нужно вставить
            var indx = 1;
            me.db.collection('search_key').findOne({key: 'cur_index'}, {value: 1}, function(er, rec) {
                if(!rec) {
                    me.db.collection('search_key').insert({key: 'cur_index', value: 1}, function(){})
                    
                    me.db.collection('search_index').ensureIndex('m', function(e, r) {
                        me.db.collection('search_index').ensureIndex('id', function(e, r) {
                            me.db.collection('search_index').ensureIndex('i', function(e, r) {
                                me.db.collection('search_index').ensureIndex('a', function(e, r) {
                    })})})})
                    
                } else {
                    indx = rec.value + 1
                    me.db.collection('search_key').update({key: 'cur_index'}, {$set:{value: indx, key: 'cur_index'}}, function(){})
                }
                me.db.collection('search_index').insert({m: modelname, id:_id, a: 'u', i:indx}, function(e,r) {
                    fin()
                })
            })
        } else {
            fin()    
        }
    })    
}

exports.Plugin.prototype.remove_index = function(req, callback, auth, modelname, model, _id) {
    if(!modelname) {
        callback(null, {code: 500})
        return;
    }
    
    if(model.searchBuildDocUrl === null) {
        callback({success: false})
        return; 
    }
    
    var me = this
    this.db.collection('search_index').remove({m: modelname, id:_id}, function(e,r) {
        if(!!callback) callback({success: true})
        runIndexer(me.server.config)
    })
}


exports.Plugin.prototype.getXml = function(req, callback, auth) {
    
    if(!req.login || !req.pass || authIndexer.login != req.login || authIndexer.pass != req.pass) {
        callback(null, {code: 404})
        return;
    }
    
    var me = this   
        ,rq = {urlparams: []}
        ,xml = []
        ,deleted = []
        ,updated = []
        ,date = new Date().getTime()
    
    var finXml = function() {
        
        
        
        callback('<?xml version="1.0" encoding="utf-8"?>'
            + '<sphinx:docset>'            
            + '<sphinx:schema>'
            + '<sphinx:field name="content"/>'
            + '<sphinx:attr name="published" type="timestamp"/>'
            + '<sphinx:attr name="module" type="string" />'
            + '<sphinx:attr name="title" type="string" />'
            + '<sphinx:attr name="rid" type="string" />'
            + '</sphinx:schema>'        
            + (xml.length? xml.join('\n'):'')
            + (deleted.length? '<sphinx:killlist><id>' + deleted.join('</id><id>') + '</id></sphinx:killlist>':'')
            + '</sphinx:docset>') 
            
        updateIndexes()    
        
    }
    
    var updateIndexes = function() {
        if(deleted.length) {
            me.db.collection('search_index').remove({i:{$in:deleted}}, function() {})
        }
        if(updated.length) {
            me.db.collection('search_index').update({i:{$in:updated}}, {$set: {a: ''}}, function() {})
        }
    }
       
    var getItem = function(model, modelName, id, index, callback) {
        
        updated.push(index)
        
        me.db.collection(model.collection).findOne({_id:id}, {}, function(e,r) {
            if(!r) {
                callback() 
                return;
            }
            var item = {title: '', content: []}
                ,log = ''
            for(var i=0;i<model.fields.length;i++) if(model.fields[i].visable && r[model.fields[i].name]) {
                if(model.fields[i].name == 'name' || model.fields[i].name == 'title') {
                    item.title = r[model.fields[i].name]
                }
                if(model.fields[i].search_title) item.title = r[model.fields[i].name]
                else if(model.fields[i].type == 'string') item.content.push(r[model.fields[i].name])
                else if(model.fields[i].search_index_fields) {
                    for(var j=0;j<r[model.fields[i].name].length;j++) {
                        for(var k in r[model.fields[i].name][j]) {
                            if(model.fields[i].search_index_fields.indexOf(k) != -1) {
                                if(r[model.fields[i].name][j][k])
                                    item.content.push(r[model.fields[i].name][j][k])
                            }
                        }
                    }
                }
            }   
            
            var s = '<sphinx:document id="' + index + '">'
            + '<content><![CDATA[' + item.content.join('\n') + ']]></content>'
            + '<published>' + date + '</published>'
            + '<title><![CDATA[' + item.title + ']]></title>'
            + '<module>' + modelName + '</module>'
            + '<rid>' + id + '</rid>'
            + '</sphinx:document>'

            //fs.appendFile(__dirname + '/xml.log', s, function(){})
            
            xml.push(s);
            
            callback()            
        })        
    }
        //
    me.db.collection('search_index').find({a:{$in:['u', 'd']}}, {m: 1, id: 1, i: 1, a: 1}).toArray(function(e, items) {        

        var func = function(i) {
            if(i == items.length) {
                finXml()
                return;
            }            
            rq.urlparams[0] = items[i].m
            dataFuncs.getmodel(rq, me, function(model) {                

                if(model) {
                    if(items[i].a == 'u') {
                        getItem(model, items[i].m, items[i].id, items[i].i, function() {
                            func(i+1)    
                        })
                    } else {
                        deleted.push(items[i].i) 
                        func(i+1)
                    }
                } else {
                    func(i+1)
                }                
            }, auth, true)            
        }        
        func(0)        
    })    
}

exports.Plugin.prototype.rebuildAll = function(req, callback, auth) {
    
    var me = this
    
    var rebuildModuleIndex = function(model, callback) {        
        var modelname = 'MyDesktop.modules.' + model.name.replace('-','.model.') 
        me.db.collection(model.collection).find({removed:{$ne:true}},{_id:1}).toArray(function(e,d) {
            if(e || d.length==0) {
                callback()
                return;
            }            
            var func = function(i) {
                if(i>=d.length) {
                    callback()
                    return;
                }
                me.update_index(req, function() {
                    func(i+1)
                }, 
                auth, 
                modelname, 
                {
                    searchBuildDocUrl:model.search
                }, 
                d[i]._id, 
                true)
            }
            func(0)
        })
    }
    
    
    me.server.getModel('admin.models.access').getAllModels(req, function(data, e) {
        
        var func = function(i) {            
            if(i>=data.list.length) {
                runIndexer(me.server.config)
                callback({ok:1})
                return;
            }         
     
            if(data.list[i].search) {
                rebuildModuleIndex(data.list[i], function() {func(i+1)})
                return;
            } 
            func(i+1)
        }
        func(0)
    }, auth)
    
    
}