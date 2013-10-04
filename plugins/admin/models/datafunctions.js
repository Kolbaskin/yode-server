var crypto = require('crypto')
    ,mongo = require('mongodb')
    ,BSON = mongo.BSONPure
    ,fs = require('fs')
    ,forms = require('forms')
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
    s = s.replace(',','.')
    s = parseFloat(s);
    callback(isNaN(s)? null:s);
}

exports.ObjectID = function(s, callback) {
    callback(!s || s == ''? null:new BSON.ObjectID(s));
}

exports.boolean = function(s, callback) {
    callback(!!s)
}

// value, record, model, fieldName, server, oldData
exports.file = function(s, callback, record, model, fieldName, server) {
    var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'+s 
    if(s != '' && fs.existsSync(path)) {
        s = fs.readFileSync(path)
        fs.unlink(path)
        callback(s)
        return;
    }
    callback(null)
}

// cur_data -- предыдущие значения поля
exports.images = function(arr, callback, record, model, fieldName, server, cur_data) {
    var path = server.server.dir + '/' + server.server.config.STATIC_DIR + '/tmp/'
    
    if(arr) {
        var res = []
            ,s, s1
            
        
        for(var i=0;i<arr.length;i++) {
            if(arr[i].img) {
                if(fs.existsSync(path + arr[i].img)) {
                    s = fs.readFileSync(path + arr[i].img)
                    fs.unlink(path + arr[i].img)
                    arr[i].img += '_small'
                    if(fs.existsSync(path + arr[i].img)) {
                        s1 = fs.readFileSync(path + arr[i].img)
                        fs.unlink(path + arr[i].img)
                    }
                    res.push({img: s, preview: s1})
                }
            } else if(cur_data && arr[i].num !== null) { // сохраним предыдущее значение картинки
                var n = parseInt(arr[i].num)
                if(!isNaN(n) && cur_data[n]) {
//console.log('save num:', )                    
                    res.push(cur_data[n])
                }
            }
        }
        callback(res)
        return;
    }
    callback('');
}

// постфикс "_l" обозначает те функции, которые вызываются при отображении денных
// в таблицах и формах в админке
exports.images_l = function(arr, record, model, key, server, oldData) {

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