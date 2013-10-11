var crypto = require('crypto')
    ,fs = require('fs')    
    ,easyimg = require('easyimage')
    ,forms = require('forms')
    ,util = require('util')

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;
}

var makeImg = function(path, callback, sizes) {
    
    var w1 = 456
        ,h1 = 342
        ,w2 = 150
        ,h2 = 150
        ,conf1 = {
            src:path, 
            dst:path,
            x:0, 
            y:0
        }
        ,conf2 = {
            src:path, 
            dst:path+'_small',
            x:0, 
            y:0
        }
    
    if(sizes) {
        sizes = sizes.split('x')
        if(sizes[0]) {w2 = parseInt(sizes[0]);if(isNaN(w2)) w2=null;}
        if(sizes[1]) {h2 = parseInt(sizes[1]);if(isNaN(h2)) h2=null;}
        if(sizes[2]) {w1 = parseInt(sizes[2]);if(isNaN(w1)) w1=null;}
        if(sizes[3]) {h1 = parseInt(sizes[3]);if(isNaN(h1)) h1=null;}
    }
    
    if(w1) conf1.width = w1
    if(h1) conf1.height = h1
    
    if(w2) conf2.width = w2
    if(h2) conf2.height = h2    
  
    easyimg.thumbnail(conf1, function(err, image) {
    		if (err) {
                callback(null, {code: 500});
                return;
            }                                                
            easyimg.thumbnail(conf2, function(err, image_small) {
                if (err) {
                    callback(null, {code: 500});
                    return;
                }
                callback({img: image, img_s:image_small});
            });
    	}
    );
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
                    }, req.urlparams[0])                  
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