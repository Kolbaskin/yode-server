var crypto = require('crypto')
    ,mongo = require('mongodb')
    ,BSON = mongo.BSONPure
    ,fs = require('fs')
    ,forms = require('forms')
    ,util = require('util')
//value, callback, record, model, fieldName, server, oldData
exports.password = function(s, callback, a1, a2, a3, server) {
    var hash_alg = (server.server.config? server.server.config.HASH_ALG:'sha1')
    callback(!s || s == ''? null:crypto.createHash(hash_alg).update(s).digest('hex'))
}

exports.password_l = function(s) {
    return null
}

exports.number = function(s, callback) {
    s = parseInt(s);
    callback(isNaN(s)? null:s);
}

exports.int = function(s, callback) {
    this.number(s, callback);
}

exports.float = function(s, callback) {
    if(s) {
        s = s.replace(',','.')
        s = parseFloat(s);
    }
    callback(isNaN(s)? null:s);
}

exports.ObjectID = function(s, callback) {
    callback(!s || s == ''? null:new BSON.ObjectID(s));
}

exports.boolean = function(s, callback) {
    callback(!!s)
}

exports.array  = function(s, callback) {
    if(!util.isArray(s)) s = [s]
    callback(s)
}


exports.arraystring  = function(s, callback) {
    s = s.split(',')
    for(var i=0;i<s.length;i++) s[i] = s[i].trim()
    callback(s)
}

exports.arraystring_l  = function(s) {
    if(s && !!s.join) {
        s = s.join(',')
    }
    return s
}

// value, record, model, fieldName, server, oldData
exports.file = function(s, callback, record, model, fieldName, server, cur_data) {
    
    if(!s) {
        callback(cur_data)        
        return;
    }
        
    var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'+s 
    fs.exists(path, function(e) {
        if(e) {
            fs.readFile(path, function(e, s) {
                if(s) fs.unlink(path)
                callback(s)
            })
        } else {
            callback(null)
        }
    })    
}

exports.image = function(s, callback, record, model, fieldName, server) {


    
    if(s === '-') {
        callback(null, true)
        return;
    }
    
    var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'+s 
        ,res = {}
        
    fs.exists(path, function(e) {
        if(e) {
 
            fs.readFile(path, function(e, s) {
                if(s) {
                    fs.unlink(path)
                    res.img = s
                    path += '_small'
                    fs.readFile(path, function(e, s) {
                        if(s) {
                            fs.unlink(path)
                            res.preview = s    
                        }
                        callback([res])
                    })
                } else callback(null)
            })
        } else {
            callback(null)
        }
    })
}

exports.image_l = function(arr, record, model, key, server, oldData) {

    if(arr == null) return '';
    var id = record["_id"]    
        ,collection = model.collection
    return '/admin.models.fileOperations:getimage/' + collection + '/' + id + '/' + key + '/0/main/'

}

// cur_data -- предыдущие значения поля
exports.images = function(arr, callback, record, model, fieldName, server, cur_data) {
    var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'
    
    if(arr) {
        var res = []
            ,s, s1
        
        var addRes = function(im, ari) {
            for(var i in ari) {
                if(i != 'img' && i != 'preview' && i != 'num') im[i] = ari[i]                  
            }
            res.push(im)
        }
            
        var func = function(i) {
            if(i >= arr.length) {
                callback(res)
                return;
            }
            
            if(arr[i].img) {
                fs.exists(path + arr[i].img, function(e) {
                    if(e) {
                        fs.readFile(path + arr[i].img, function(e,s) {
            
                            fs.unlink(path + arr[i].img)
                            arr[i].img += '_small'
                            fs.exists(path + arr[i].img, function(e) {
                                if(e) {
                                    fs.readFile(path + arr[i].img, function(e,s1) {
                                        fs.unlink(path + arr[i].img)
                                        addRes({img: s, preview: s1}, arr[i])
                                        func(i+1)
                                    })
                                } else {
                                    addRes({img: s, preview: null}, arr[i])
                                    func(i+1)
                                }
                            })
                             
                        })
                    } else func(i+1)
                })
                return;
            } else if(cur_data && arr[i].num !== null) { // сохраним предыдущее значение картинки
                var n = parseInt(arr[i].num)
                if(!isNaN(n) && cur_data[n]) {
                    addRes(cur_data[n], arr[i])                    
                }
                func(i+1)
            } else { // Сохраним остальные данные если нет картинки
                addRes({}, arr[i])
                func(i+1)
            }
        }    
        func(0)
        return;
    }
    callback('');
}

// постфикс "_l" обозначает те функции, которые вызываются при отображении денных
// в таблицах и формах в админке
exports.images_l = function(arr, record, model, key, server, oldData) {
    
    if(!arr) return arr
    
    var id = record["_id"]    
        ,collection = model.collection

    for(var i=0;i<arr.length;i++) if(arr[i]) {
       arr[i].preview = '/admin.models.fileOperations:getimage/' + collection + '/' + id + '/' + key + '/' + i + '/preview/';
       arr[i].img = '/public.models.dirs:fileOperations/' + collection + '/' + id + '/' + key + '/' + i + '/img/';
    }
    return arr;
}

exports.date = function(s, callback) {
    callback(new Date(s))
}

// Тип поля используется когда нужно определить все родительские
// узлы в дереве (требуется обязательное наличие поля "pid")
// на выходе массив со ссылками на предков [папа, дедушка, прадедушка и т.д.]
exports.parentpages = function(value, callback, record, model, key, server, oldData) {
    var pid;
    if(record && record.pid && (pid = forms.strToId(record.pid))) {
        var pages = [], dir = '/' + record.alias + '/'
        
        var func = function(pd) {
            pages.push(pd)
            server.db.collection(model.collection).findOne({_id:pd}, {pid:1, alias:1}, function(e,d) {
                if(d && d.pid) {
                    dir = '/' + d.alias + dir
                    func(d.pid)
                } else {
                    callback(pages, dir)
                }
            })
        }
        func(pid)    
        return;        
    }
    callback(null);
}

// Тип поля используется для сортировки
exports.sortfield = function(value, callback, record, model, key, server, oldData) {
    if(value) {
        var x = parseInt(value)
        if(!isNaN(x) && x) {
            callback(x)
            return;
        }
    }
    var sort = {}
        ,fields = {}
    sort[key] = -1
    fields[key] = 1
    server.db.collection(model.collection).find({removed:{$ne: true}}, fields).sort(sort).limit(1).toArray(function(e,d) {
        if(d[0] && d[0][key]) {
            callback((parseInt(d[0][key]) + 1))
        } else {
            callback(1)
        }
    })
}