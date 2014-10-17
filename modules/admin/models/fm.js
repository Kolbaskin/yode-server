/**
 * Модель
 * 
 * для файлменеджера
 */
var fs = require('fs')
    ,exec = require('child_process').exec    
    ,arch_types = ['tar', 'zip', '7z', 'rar', 'arj']
    ,convert = require('./convertor')
    ,crypto = require('crypto')

exports.Plugin = function(server) {
    this.server = server;
}

var getExtension = function(fn) {
    var v = fn.length;
    while(v>0 && fn.charAt(v) != '.') v--;
    if(v>0) return fn.substr(v+1).toLowerCase()    
    return null;
}

exports.Plugin.prototype.getUploadDir = function(req, callback, auth) {
    var me = this
    callback(me.server.config.UPLOAD_DIR)
}

exports.Plugin.prototype.getdir = function(req, callback, auth) {
    var me = this
    me.getUploadDir(req, function(dir) {
        me.getdir1(req, callback, auth, dir)
    }, auth)
}

exports.Plugin.prototype.getdir1 = function(req, callback, auth, UPLOAD_DIR) {    
  
    if(UPLOAD_DIR) {
        
        var me = this,  
            uplDir = me.server.config.STATIC_DIR+'/'+UPLOAD_DIR;
            md = me.server.dir + '/' + uplDir
        
        if(req.node && req.node != 'root') {
            if(req.node.substr(1, UPLOAD_DIR.length) == UPLOAD_DIR) {
                req.node = req.node.replace(/\.\./g, '')
                md = me.server.dir + '/'+me.server.config.STATIC_DIR+req.node;
            } else {
  
                callback(null, {code: 404});
                return;
            }
        }
      
        var readDir = function(md) {
            fs.readdir(md, function(e, files) {  
                if(e) {callback(null, e);return 0;}
                
                var s, t, v, flst = [], dirlist = [], pt;
                
                pt = md.substr((me.server.dir+'/'+me.server.config.STATIC_DIR).length);
                
                for(var i=0;i<files.length;i++) { 
                    s = fs.statSync(md + '/'+files[i])
                    if(s.isFile()) {
                        t = getExtension(files[i]);
                        flst.push({filename: files[i], id: pt + '/'+files[i], leaf: (arch_types.indexOf(t) == -1), type: t, size: s.size, mtime: s.mtime})
                    } else {
                        dirlist.push({filename: files[i], id: pt + '/'+files[i], leaf: false, mtime: s.mtime})
                    }
                }
                callback(dirlist.concat(flst))        
            })    
        }

        // разложим путь на составляющие
        var pth = md.split('/')
        
        var testPath = function(i) {
            if(i == pth.length) {
                readDir(md);
                return;
            }
            var p = '';
            for(var j=1;j<=i;j++) p += '/' + pth[j]
   
            fs.stat(p, function(e,s) {
                if(s.isFile()) {
                    var e = getExtension(p)
                    if(arch_types.indexOf(e) >= 0) {
                        // Если архив, разложим его отдельно
                        var aPath = ''
                        i++
                        while(i<pth.length) aPath += '/' + pth[i++] 
                        // p - путь к файлу архива
                        // aPath - путь внутри архива
                        me.readArchive(null, callback, auth, p, aPath)                        
                    } else {
                        callback(null, {code: 404})
                    }
                    return;
                } else {
                    testPath(i+1)
                }
            })    
        }

        testPath(1)
        
        
    } else callback(null, {code: 401});    
}

// Чтение оглавления архивов
exports.Plugin.prototype.readArchive = function(req, callback, auth, archName, pathName) {    
    
    var me = this

    if(auth) {
        
        // Собираем файлы и их размеры из stdout
        var getFilesFromStd = function(stdout) {
            var files = {}
                ,i = 0
                ,j = 0
                ,n = 0
                ,c, fName, sz
                ,formats = [[0,0]]


                
            stdout = stdout.split('\n')
            while(stdout[i] !== null && stdout[i].substr(0,7) != '-------') {
                i++;
            }
            while(stdout[i] && j<stdout[i].length) {
                c = stdout[i].charAt(j)
                if(c != '-') {
                    n++  
                    formats[n] = [j+1, 0]
                } else {
                    formats[n][1]++    
                }
                j++;
            }
            i++
            
            n = pathName.split('/').length - 1
 
            while(stdout[i] && stdout[i].substr(0,7) != '-------') {                
                
                fName = stdout[i].substr(formats[4][0]).trim().split('/')

                if(fName[n] && !files[fName[n]]) {
                    c = stdout[i].substr(formats[1][0],formats[1][1]).trim()
                    sz = parseInt(stdout[i].substr(formats[2][0],formats[2][1]).trim())
                    
                    if(c.charAt(0) != 'D' && n == (fName.length-1)) {
                    // это файл
                        c = 'F'
                    } else {
                    // каталог
                        c = 'D'
                        sz = 0
                    }
                    files[fName[n]] =[
                        sz, // size
                        c // attr
                    ]
                }
                i++;
            }
            return files;
        }
                
        var testFileName = function(fileName) {
            var fn = fileName.split('/')
            if(fn.length == pathName.length) return true;
            return false
        }

        var dirlist = []
            ,filelist = []


        exec("7z l " + '"'+archName+'"', function(e, stdout, stderr) {
            if(stdout) {

                var files = getFilesFromStd(stdout)
                
                archName = archName.substr((me.server.dir+'/'+me.server.config.STATIC_DIR).length)
                if(files) for(var i in files) {
                    if(files[i][1] == 'D') {
                        dirlist.push({
                            filename: i, 
                            id: archName + pathName + '/' + i, 
                            leaf: false, 
                            mtime: new Date()
                        })
                    } else {
                        filelist.push({
                            filename: i, 
                            id: archName + pathName + '/' + i, 
                            leaf: true, 
                            type: getExtension(i), 
                            size: files[i][0],
                            mtime: new Date()
                        })                                                                        
                    }
                }

                callback(dirlist.concat(filelist))
            }
        })
    }
}

exports.Plugin.prototype.newdir = function(req, callback, auth) {
    var me = this
    me.getUploadDir(req, function(dir) {
        me.newdir1(req, callback, auth, dir)
    }, auth)
}

exports.Plugin.prototype.newdir1 = function(req, callback, auth, UPLOAD_DIR) {    
    if(UPLOAD_DIR) {

        if(req.name !== null && req.path !== null) {
            var me = this
                ,rpath = (req.path==''? '/'+UPLOAD_DIR:req.path)
                ,path = me.server.dir+'/'+me.server.config.STATIC_DIR+rpath+'/'+req.name

            fs.mkdir(path, function(e,r) {
                if(e) {
                    callback(null, {code: 500});
                } else {
                    callback({
                        filename: req.name, 
                        id: rpath+'/'+req.name,
                        leaf: false,
                        mtime: new Date()
                    });    
                }
            })
            
        } else {
            callback(null, {code: 404});
        }
        
    } else callback(null, {code: 401});    
}

exports.Plugin.prototype.upload = function(req, callback, auth) {
    var me = this
    me.getUploadDir(req, function(dir) {
        me.upload1(req, callback, auth, dir)
    }, auth)
}
exports.Plugin.prototype.upload1 = function(req, callback, auth, UPLOAD_DIR) {    
    
    if(UPLOAD_DIR) {
        var me = this, path, file, rpath;
        
        if(req.urlparams[0]) path = decodeURIComponent(req.urlparams[0])
        if(req.urlparams[1]) file = decodeURIComponent(req.urlparams[1])
        
        if(file) {            
            rpath = (!path || path==''? '/'+UPLOAD_DIR:path)
            path = me.server.dir+'/'+me.server.config.STATIC_DIR+rpath+'/'+file
            fs.writeFile(path, req.fullData, function (e) {
                if (e) {
                    callback({success: false})
                } else {
                    callback({
                        filename: file, 
                        id: rpath+'/'+file,
                        type: getExtension(file),
                        leaf: true,
                        mtime: new Date(),
                        size: req.fullData.length
                    })
                
                    convert.makePreview(path, me.server, auth)
                }                
            });                   
            return;      
        } 
        callback(null, {code: 404});        
    } else callback(null, {code: 401});    
}

exports.Plugin.prototype.remove = function(req, callback, auth) {    
    
    if(auth) {
        
        var me = this
            ,data =  JSON.parse(req.jsonData)
            ,path = me.server.dir+'/'+me.server.config.STATIC_DIR
            ,s

        var remDir = function(fn) {
            var files = fs.readdirSync(fn)
            ,s            
            for(var i=0;i<files.length;i++) { 
                s = fs.statSync(fn + '/'+files[i])
                if(s.isFile()) {
                    fs.unlinkSync(fn + '/'+files[i])
                } else {
                    remDir(fn + '/'+files[i])
                }
            }
            fs.rmdirSync(fn)            
        }        
        for(var i=0;i<data.length;i++) {
            s = fs.statSync(path + data[i])  
            if(s) {
                if(s.isFile()) {
                    var pathHash = crypto.createHash('sha1').update(path + data[i]).digest('hex')                    
                    fs.unlink(path + data[i], function(){})
                    me.server.inits.db.collection('previews').remove({hash: pathHash}, function(e,r) {})
                    
                } else {
                    remDir(path + data[i])
                }
            }
        }        
        callback({success: true})
    } else callback(null, {code: 401});    
}

exports.Plugin.prototype.getPreview = function(req, callback, auth) {    
    var me = this
        ,head = {code: 200, status: 'OK', heads: {'Content-Type': 'image/png'}}

    if(auth && req.file) {
        var file = me.server.dir + '/' + me.server.config.STATIC_DIR + req.file
            ,e = getExtension(file)
        
        if(['jpg', 'jpeg', 'gif', 'png'].indexOf(e) != -1) {
        // Если файл -- картинка, отдаем как есть    
            head.heads = {'Content-Type': 'image/' + e}
            callback(file,null, head)
        } else {
        // Для остальных поищем превью
            var pathHash = crypto.createHash('sha1').update(file).digest('hex')
            me.server.inits.db.collection('previews').findOne({hash: pathHash}, function(e,r) {            
                if(r && r.pics && r.pics[0]) {
                    callback(r.pics[0].buffer, null, head)
                } else {
                    file = fs.readFileSync(me.server.dir + '/' + me.server.config.STATIC_DIR+'/images/no_image.png')
                    callback(file,null, head)
                }
            })
        }
    }
}