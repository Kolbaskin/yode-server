var dataFuncs = require('../admin/models/data')
    ,authIndexer = require('./auth')
    ,exec = require('child_process').exec

exports.Plugin = function(server) {
    this.server = server
    this.db = this.server.inits.db
}

var runIndexer = function(config) {    
    exec('cd ' + __dirname + ' && indexer --config ./sphinx.conf --rotate ' + config.SEARCH_ENGINE.index, function(e, stdout, stderr) {})        
}

exports.Plugin.prototype.update_index = function(req, callback, auth, modelname, model, _id) {    
    if(!modelname) {
        callback(null, {code: 500})
        return;
    }    
    var me = this
        ,fin = function() {
            if(!!callback) callback({success: true})
            
            runIndexer(me.server.config)
            
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
                    me.db.collection('search_key').update({key: 'cur_index'}, {value: indx}, function(){})
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
            + '<sphinx:attr name="rid" />'
            + '</sphinx:schema>'        
            + (xml.length? xml.join('\n'):'')
            + (deleted.length? '<sphinx:killlist><id>' + deleted.join('</id><id>') + '</id></sphinx:killlist>':'')
            + '</sphinx:docset>') 
            
        //updateIndexes()    
        
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
            for(var i=0;i<model.fields.length;i++) if(model.fields[i].visable && r[model.fields[i].name]) {
                if(model.fields[i].name == 'name' || model.fields[i].name == 'title') {
                    item.title = r[model.fields[i].name]
                }
                if(model.fields[i].search_title) item.title = r[model.fields[i].name]
                else if(model.fields[i].type == 'string') item.content.push(r[model.fields[i].name])
            }            
            xml.push('<sphinx:document id="' + index + '">'
            + '<content><![CDATA[' + item.content.join('\n') + ']]></content>'
            + '<published>' + date + '</published>'
            + '<title><![CDATA[' + item.title + ']]></title>'
            + '<module>' + modelName + '</module>'
            + '<rid>' + id + '</rid>'
            + '</sphinx:document>');
            
            callback()            
        })        
    }
        
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