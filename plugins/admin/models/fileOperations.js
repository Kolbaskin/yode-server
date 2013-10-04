var crypto = require('crypto')
    ,fs = require('fs')    
    ,easyimg = require('easyimage')
    ,forms = require('forms')
    ,util = require('util')

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;
}

var makeImg = function(path, callback) {
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

exports.Plugin.prototype.upload = function(req, callback, auth) {
    if(auth) {
        var me = this;
        crypto.randomBytes(32, function(ex, buf) {
            var token = buf.toString('hex')
                ,path = me.server.dir + '/' + me.server.config.STATIC_DIR+'/tmp/'+token;
                
            fs.writeFile(path, req.fullData, function (e) {
                if (e) callback(null, {code:500})
                else {
                    
                    makeImg(path, function(imgs, e) {
                        if (e) {callback(null, {code: 500});return;}
                        imgs.img_s.name = token
                        callback(imgs.img_s);
                    })                  
                }
            });
        });
    } else callback(null, {code: 401});
}

exports.Plugin.prototype.getimage = function(req, callback, auth) {
    var me = this
        ,o_id
        ,collName = (req.urlparams[0] || '')
        ,o_id = (req.urlparams[1] || 0)
        ,folderName = (req.urlparams[2] || '')
        ,folder = {}
        ,head = {code: 200, status: 'OK', heads: {'Content-Type': 'image/jpeg'}}        
        ,num = (req.urlparams[3]? parseInt(req.urlparams[3]) : 0)
        ,size = (req.urlparams[4] == 'img'? 'img' : 'preview')
    
    folder[folderName]=1
    
    if(isNaN(num)) num = 0 
    if((o_id = forms.strToId(o_id, callback)) === 0) return;
     
    me.db.collection(collName).findOne({_id: o_id}, folder, function(e,data) {
        if(data && data[folderName]) {
            
            if(util.isArray(data[folderName])) {
                if(data[folderName][num] && data[folderName][num][size]) {
                    callback(data[folderName][num][size].buffer ,null, head)
                } else {
                    callback(null, {code: 404})
                }
            } else {
                callback(new Buffer(data[folderName][size]),null, head)
            }
        
        } else callback(null, {code: 404})
    })    
}