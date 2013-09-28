/**
 * Модель
 * 
 * управления пользовательскими объявлениями 
 */
var crypto = require('crypto')
    ,fs = require('fs')
    ,DIRS = null
    ,easyimg = require('easyimage')
    ,forms = require('forms')
    ,util = require('util')
    
var makeImages = function(path, callback) {
    easyimg.rescrop({
        src: path, 
        dst: path,
        width:456, height:342,                        
        gravity:'Center'
    },
    function(err, image) {
        if (err) {callback(null, {code: 500});return;}                                                
        easyimg.rescrop({
            src: path, 
            dst: path+'_small',
            width:150, height:150,
            gravity:'Center'
        }, function(err, image_small) {
            if (err) {callback(null, {code: 500});return;}
            callback({img: image, img_s:image_small});
        });
    });
}

exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.img = function(req, callback, auth) {
    
    if(auth) {
        var me = this;
        crypto.randomBytes(32, function(ex, buf) {
            var token = buf.toString('hex')
                ,path = me.server.dir + '/' + me.server.config.STATIC_DIR+'/tmp/'+token
                ,w,h
                
            fs.writeFile(path, req.fullData, function (e) {
                if (e) callback(null, {code:500})
                else {
                    if(req.urlparams[0]) w = parseInt(req.urlparams[0])
                    if(req.urlparams[1]) h = parseInt(req.urlparams[1])
                    
                    if(isNaN(w)) w = null;
                    if(isNaN(h)) h = null;                
                    
                    easyimg.rescrop({
                        src: path, 
                        dst: path,
                        width:w, height:h,
                        gravity:'Center'
                    }, function(err, img) {
                        if (err) {callback(null, {code: 500});return;}
                        callback({img: token});
                    });
                }
            });
        });
    } else {
        callback(null, {code: 401})    
    }
}

exports.Plugin.prototype.file = function(req, callback, auth) {
    
    if(auth) {
        var me = this;
        crypto.randomBytes(32, function(ex, buf) {
            var token = buf.toString('hex')
                ,path = me.server.dir + '/' + me.server.config.STATIC_DIR+'/tmp/'+token
                ,w,h
                
            fs.writeFile(path, req.fullData, function (e) {
                if (e) callback(null, {code:500})
                else {
                    callback({file: token});
                }
            });
        });
    } else {
        callback(null, {code: 401})    
    }
}