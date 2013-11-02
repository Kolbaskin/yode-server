var fs       = require('fs')
    ,forms = require('forms')    
    ,dataFunc = require('./datafunctions')
    ,globalLog = require('./logs')
    ,valueTypes = require('./valueTypes')


/*
*
* private function. Requires model file, saves it to cache and returns the model 
*
*/

var readmodel = function(urlparam, parent, callback, auth) {
    
    if(!parent.server.modelsAll) parent.server.modelsAll = {}
    
    var config = parent.server.config
       
    var fn = urlparam.split('.')
    
    fn[0] = config.ADMIN_MODULES_DIR
    fn = fn.join("/")
    
    // doesn't get a model from cache in debug mode
    if(!config.DEBUG && parent.server.modelsAll[fn]) {
         callback(parent.server.modelsAll[fn]);
         return;
    }
    
    var fName = parent.server.dir + '/' + fn + '.js'
    
    if(fs.existsSync(fName)) {
        var model = null        
        try { 
            model = require(fName)
        } catch(e) {
            
            callback(null)
            return;
        }
    } else {
        fName = parent.server.serverDir + '/'+fn+'.js'
    
        if(fs.existsSync(fName)) {
            try { 
                model = require(parent.server.serverDir + '/'+fn)
            } catch(e) {
                callback(null)
                return;
            }
        }
    }
    // проверим текущие индексы,
    // добавим недостающие на все фильтруемые поля
    var checkIndexes = function(mdl) {
        
        callback(mdl)
        
        if(!config.DEBUG) return; // индексы настраиваем только в дебаг-режиме
        for(var i in model.fields) {
            if(model.fields[i].filterable) {
                 parent.db.collection(mdl.collection).ensureIndex(model.fields[i].name, function(e, r) {})   
            }
        }            
    }
    
    if(model) {
        parent.server.modelsAll[urlparam] = model
        if(!!parent.server.modelsAll[urlparam].init) {
       
            parent.server.modelsAll[urlparam].init(parent, function() {
                checkIndexes(parent.server.modelsAll[urlparam])
            }, auth)
        
        } else        
            checkIndexes(parent.server.modelsAll[urlparam])
    } else 
        callback(null)
}



/*
*
* getting model details
*
*/
exports.getmodel = function(params, parent, callback, auth, getfull) {
    readmodel(params.urlparams[0], parent, function(model) {
        if(model) { 
            var obj = (getfull?  model:{fields: model.fields})        
            if(model.root) obj.root = model.root        
            callback(obj,null)    
        } else {
            callback(null, {code: 500})
        }  
    }, auth)
}

// Private get readable fields fom model
var getReadableFields = function(model, req) {
    
    if(!model) return {}
    
    
    
    var fields = {}
        ,queryFieldSet   
    if(req) {
        if(req.fieldSet) {
            queryFieldSet = {}
            try {
                queryFieldSet = JSON.parse(req.fieldSet)
            } catch(e) {queryFieldSet = null}       
        } else if(req.urlparams && req.urlparams[1]) {
            queryFieldSet = {}
            var x = req.urlparams[1].split(',')
            for(var i=0;i<x.length;i++) queryFieldSet[x[i]] = 1    
        }
    }


    for(var i in model.fields) if(model.fields[i] && model.fields[i].visable) {
        if(!queryFieldSet || queryFieldSet[model.fields[i].name]) fields[model.fields[i].name] = 1
    }
    return fields;
}

var buildWhere = function(params, model) {
    var re
        ,query
        ,$or = [] 
        ,find = (model && model.find?  model.find:{})
        ,cond
        ,filters = {}
        ,oo;
        
    if(params.query) {       
        
        // Проверим, не объект-ли в запросе
        
        try {
            re = JSON.parse(params.query)
        } catch(e) {
            re = null    
        }
        
        // если там объект, он должен быть массивом
        if(re && re.length) {            
            for(var i=0;i<re.length;i++) if(re[i].property && re[i].value) {
                if(re[i].property == 'query') {
                    try {
                        query = new RegExp('^' + re[0].value,'i')
                    } catch(e) {return {_id:0}}
                } else {
                // Добавляем фильтры
                    filters[re[i].property] = re[i]
                }
            } 
        } else {        
            try {
                query = new RegExp('^' + params.query,'i')
            } catch(e) {return {_id:0}}
        }
        find.$and = []
        
        var fname;
            
        for(var i in model.fields) {
            if(model.fields[i].mapping) fname = model.fields[i].mapping
            else fname = model.fields[i].name
            if(fname == '_id' || model.fields[i].filterable) {
                // Делаем запрос по поисковой строке
                if(query && model.fields[i].type == 'string') {
                    cond = {}                
                    cond[fname] = query
                    $or.push(cond)
                }
                // делаем запрос, если он от фильтров
                if(filters[fname]) {
                    //find[model.fields[i].name] = 
                    if(model.fields[i].type == 'ObjectID') {
                        filters[fname].value = forms.strToId(filters[fname].value)
                        if(filters[fname].value) {
                            var o1 = {}
                            o1[fname] = filters[fname].value
                            find.$and.push(o1)
                        }
                    } else {
                        oo = valueTypes.getValue(filters[fname], fname)
                        if(oo) find.$and.push(oo)
                    }
                }
            }
        }
    }

    if($or.length>0) {find.$and.push({$or:$or})}
    if(!params.showRemoved) find.removed = {$ne:true}

    
    return find;
}

var builData = function(data, model, server) {    
    if(!data) return data
    for(var i=0;i<data.length;i++) {
        for(var j in model.fields) if(data[i][model.fields[j].name] !== undefined) {            
            if(model.fields[j].type && dataFunc[model.fields[j].type + '_l']) {    
                // value, record, model, fieldName, server
                data[i][model.fields[j].name] = dataFunc[model.fields[j].type + '_l'](data[i][model.fields[j].name], data[i], model, model.fields[j].name, server)                
            }
        }
    }   

    return data
}

var buildSort = function(params, model) {
    var sort = {}
    
    if(params.sort) {
        if(typeof params.sort === "object") {
            for(var i=0;i<model.fields.length;i++) {
                if(params.sort[model.fields[i].name]) {
                    sort[model.fields[i].name] = params.sort[model.fields[i].name]
                }
            }
        } else {        
            sort[params.sort] = (!!params.dir && params.dir == 'ASC'? 1:-1)
        }
    } else {
        for(var i=0;i<model.fields.length;i++) {
            if(model.fields[i].sort) {
                sort[model.fields[i].name] = model.fields[i].sort
            }
        }
    }
    return sort;
}

/*
*
* geting all data with paging
*
*/
exports.getdata = function(params, parent, callback, model) {        
    var func = function(model) {
            if(!model) {
                callback(null, {code:404});
                return;
            }
            
            var fields = getReadableFields(model, params),
                start = params.start || 0,
                limit = params.limit || 25,
                find = buildWhere(params, model),
                sort = buildSort(params, model)
                                      
            start = parseInt(params.start)
            limit = parseInt(params.limit)
            if(isNaN(start)) start = 0;
            if(isNaN(limit)) limit = 25;
            var cursor = parent.db.collection(model.collection).find(find,fields)
                
            cursor.count(function(e, cnt) {
                if(cnt && cnt>0) {
                    cursor.sort(sort).limit(limit).skip(start).toArray(function(e,data) {

                        callback({total: cnt, list: builData(data, model, parent), success: true},null)
                    })
                } else callback({total:0, list:[]})
            })    
        }
    if(model) func(model)
    else
        readmodel(params.urlparams[0], parent, function(model) {
            func(model)        
        })
}

exports.reorder = function(params, parent, callback) { 
    var obj
    try {
        obj = JSON.parse(params.reorder)    
    } catch(e) {
        callback({})
        return;
    }
    
    readmodel(params.urlparams[0], parent, function(model) {
        
        if(!model) {
             callback(null)
             return;
        }
        
        var indx = obj.dropRec.indx
        
        if(obj.position == 'before') {
            //obj.dropRec.indx += obj.records.length
        } else {
            indx ++
        }
        parent.db.collection(model.collection).update({indx:{$gte: indx}},{$inc:{indx:obj.records.length}}, { multi: true }, function(e) {

            var func = function(i) {                
                if(i>=obj.records.length) {
                    callback({ok:'ok'})  
                    return;
                }                
                var o_id
                if((o_id = forms.strToId(obj.records[i]._id)) === 0) {func(i+1)}
                else {
                    parent.db.collection(model.collection).update({_id:o_id}, {$set:{indx: (indx+i)}}, function() {
                        func(i+1)
                    })
                }
            }
            func(0)
        })
                
    })
}

var createDataRecord = function(data, cur_data, model, server, callback) {
    var insdata = {}, 
        f = function(i) {
            if(i>=model.fields.length) {
                callback(insdata)
                return;
            }
            
            if(data[model.fields[i].name] !== undefined || model.fields[i].type == 'boolean' || model.fields[i].emptySave) {
                if(model.fields[i].editable) {
                    if(!!model.fields[i].type && !!dataFunc[model.fields[i].type]) {
                        // calling data type specific functions
                        // value, record, model, fieldName, server, oldData
                        dataFunc[model.fields[i].type](data[model.fields[i].name], function(x) {
                            if(x !== null) insdata[model.fields[i].name] = x
                            f(i+1)
                        }, data, model, model.fields[i].name, server, (cur_data && cur_data[model.fields[i].name]? cur_data[model.fields[i].name]:null)) 
                        return;
                    } else { 
                        insdata[model.fields[i].name] = data[model.fields[i].name]                        
                    }
                }
            } 
            f(i+1)                       
        }
    insdata.mtime = new Date()
    f(0)
}

/*
*
* saving data
*
*/
exports.save = function(params, parent, callback, access, auth) {    
 
    readmodel(params.urlparams[0], parent, function(model) {   
  
        if(!model) {
            callback(null)
            return;
        }
        
        var data = params.jsonData || null,
            insdata = {}
            
        if(data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                data = null    
            }
            if(data) {
                var allFunc = function(data) {  
                    
                    var fin = function(insdata) {
                        
                        if(parent.server.config.SEARCH_ENGINE) {
                            parent.server.getModel('search.engine').update_index(null, null, null, params.urlparams[0], model, o_id)
                        }
                        
                        if(!!model.afterSave) {
                            model.afterSave(insdata, auth, callback, parent, data)    
                        } else {
                            callback({success:true, record: insdata});
                        }
                    }
 
                    var func = function(cur_data, callback) {  
                        createDataRecord(data, cur_data, model, parent, callback)
                    }
            
                    if(!data._id || data._id == '') {
                    // Insert 
                        if(access && access.add) {
                            func(null, function(insdata) {
                                parent.db.collection(model.collection).insert(insdata, {w:1}, function(e, r) {
                                    globalLog.insert(auth, parent, params.urlparams[0], insdata)
                                    //insdata._id = r[0]
                                    fin(r[0])
                                     
                                });
                            });
                        } else {
                            callback(null, {code:403})    
                        }
                    } else {
                    // Update
                        if(access && access.modify) {                        
                            var o_id; 
                            if((o_id = forms.strToId(data._id, callback)) === 0) {                                
                                return;
                            }
                            if(o_id) {
               
                                parent.db.collection(model.collection).findOne({_id: o_id}, function(e, r) {                        
                                    func(r, function(insdata) {
                                        globalLog.update(auth, parent, params.urlparams[0], r, function() {
                                            parent.db.collection(model.collection).update({_id: o_id}, {$set:insdata, $unset:{removed:""}}, {w:1}, function(e, r) {          

                                                if(r) {
                                                    insdata._id = o_id; 
                                                    fin(insdata)
                                                } else {
                                                    callback({success:false}, e);
                                                }
                                            })
                                        })
                                    })
                                })                           
                            }
                        } else {

                            callback(null, {code:403}) 
                        }
                    }
                }
                if(!!model.beforeSave) {
                    model.beforeSave(data, auth, function(data, e) {
                        if(data) allFunc(data)
                        else callback(null, e)
                    },parent)
                } else {
                    allFunc(data)    
                }
                
                                   
            } else {
                callback(null, {code:500})
            }
        } else {
            callback(null, {code:500})
        } 
    })
}

/*
*
* saving data
*
*/
exports.del = function(params, parent, callback, auth) {    



    readmodel(params.urlparams[0], parent, function(model) {    
        var data = params.jsonData || null
            ,o_id


        if(data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                data = null    
            }

            if(data && Object.prototype.toString.call(data)=='[object Array]') {
            
                var removeRow = function(i, callback) {
               
                    if(!data[i]) {
                   
                        callback()
                        return;    
                    }
                    var o_id;
                    
                    if(data[i]._id) data[i] = data[i]._id 
                    
                    if((o_id = forms.strToId(data[i], callback)) === 0) return;
                    
                    if(parent.server.config.SEARCH_ENGINE) {  
                        
                        
                          parent.server.getModel('search.engine').remove_index(null, null, null, params.urlparams[0], model, o_id)
                    }
                   
                    if(model.remove_action && model.remove_action == 'mark') {
                      
                        parent.db.collection(model.collection).update(
                            {_id: o_id}, 
                            {$set:{removed: true}}, 
                            function(e, r) {
                                removeRow(i+1,callback)
                            })
                        globalLog.delByMarking(auth, parent, params.urlparams[0], o_id)
                    } else {
                        globalLog.delByRemoving(auth, parent, params.urlparams[0], model.collection, o_id, function() {
                            parent.db.collection(model.collection).remove({_id: o_id}, function(e, r) {
                                removeRow(i+1,callback)
                            })
                        })
                    }                
                }
                
                var func = function(data) {
                    
                    removeRow(0, function() {
                        callback({success:true}, null);
                    })                    
                    return true;
                }
                if(!!model.beforeDelete) {
                    model.beforeDelete(data, auth, function(data, e) {
                        if(data) func(data)
                        else callback(null, e)
                    },parent)
                } else {
                    func(data)    
                }
                return;
            }
        }
        callback(null, {code:500})
    })
}

/*
*
* getting model details
*
*/
exports.getdatatree = function(params, parent, callback) {
    readmodel(params.urlparams[0], parent, function(model) {
        if(model) {  
            
            var find = buildWhere(params),
                fields = getReadableFields(model)
            
            fields.leaf = 1
            
            var findLayer = function() {
                
                parent.db.collection(model.collection).find(find,fields).toArray(function(e,data) {
                    callback(data,null)
                })
            }
            
            if(!params.node || params.node == 'root') {
                parent.db.collection(model.collection).findOne({root:true},{w:1}, function(e,data) {
                    if(data) {
                        find.pid = data._id
                        findLayer();
                    } else callback(null, {code: 500, mess: 'Root node not found'})
                })
            } else {
                if((find.pid = forms.strToId(params.node, callback)) === 0) return;
                findLayer();
            }

              
        } else {
            callback(null, {code: 500})
        }
    })
}

/**
 * Экспорт данных в справочнике
 * на входе в адресной строке название модели
 * в параметрах файл
 **/
exports.exportdir = function(params, parent, callback) {
    readmodel(params.urlparams[0], parent, function(model) {
        if(model) { 
            
            var file = params.fullData + '' // to str
                ,insdata = {}
                
            //for(var i=0;i<model.fields.length;i++) if(model.fields[i].editable) insdata[model.fields[i].name] = model.fields[i].type
        
            file = file.split('\n');
            
            
            
            parent.db.collection(model.collection).remove({}, function(e,r) {
                var prev = {}
                
                var func = function(i) {
                    if(i>=file.length) return;
                    file[i] = file[i].replace(/^\s+|\s+$/g, '')
                    if(file[i] != '') {
                        var data = {};
                        file[i] = file[i].split(';');
                        
                        for(var j=0;j<model.fields.length;j++) if(model.fields[j].editable) {
                            data[model.fields[j].name] = file[i][j] || null
                        }
                                                
                        createDataRecord(data, null, model, parent, function(data) {
                            // добавляем остальные данные, если в модели есть соответствующая настройка
                            if(model.importAll && j<file[i].length) {
                                data.ext_data = []
                                while(j<file[i].length) {
                                    if(file[i][j]) data.ext_data.push(file[i][j]);
                                    j++;
                                }
                            }
                            parent.db.collection(model.collection).insert(data, {w:1}, function(e, r) {})
                            func(i+1)
                        })                       
                    } else func(i+1)
                }
                func(0)               
                
                callback({success:true})
            })
        }
    })
    
}