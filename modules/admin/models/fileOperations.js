var crypto = require('crypto')
    ,fs = require('fs')    
    ,easyimg = require('easyimage')
    ,forms = require('forms')
    ,util = require('util')
    //,gd = require('easy-gd')
    
var WaterFile = '/var/www/www/www.metry.ru/static/images/metry-wmk-floorplan-center.png'				
	 ,WaterPos = {x:0, y:1}	

exports.Plugin = function(server) {
    this.db = server.inits.db;
    this.server = server;
}

var makeImg = function(path, callback, sizes) {
    
    var w1
        ,h1
        ,w2
        ,h2
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


        var resize = function() {    
        
        [
            function(next) {
                if(conf1.width>=w1 && conf1.height>=h1) {
                    fs.rename(conf1.src, conf1.dst, function(e,d) {
                        next({
                            width: w1,
                            height: h1,
                            name: conf1.dst
                        })
                    })
                } else {
                    easyimg.thumbnail(conf1, function(err, image) {
                        if (err) {
                            callback(null, {code: 500});
                            return;
                        }
                        next(image);
                    })
                }
            }
            ,function(image, next) {
                if(conf2.width && conf2.height) {
                    if(conf2.width>=w2 && conf2.height>=h2) {
                        fs.rename(conf2.src, conf2.dst, function(e,d) {
                            next({
                                width: w2,
                                height: h2,
                                name: conf2.dst
                            })
                        })
                    }
                    easyimg.thumbnail(conf2, function(err, image_small) {
                        if (err) {
                            callback(null, {code: 500});
                            return;
                        }
                        next(image, image_small);
                    });
                } else {
                    next(null , image);
                }
            }
            
            ,function(image, image_small) {
                callback({img: image, img_s:image_small});
            }
            
        ].runEach();
    }
        
    if(sizes) {
        sizes = sizes.split('x')
        if(sizes.length == 4) {        
            if(sizes[0]) {w2 = parseInt(sizes[0]);if(isNaN(w2)) w2=null;}
            if(sizes[1]) {h2 = parseInt(sizes[1]);if(isNaN(h2)) h2=null;}
            if(sizes[2]) {w1 = parseInt(sizes[2]);if(isNaN(w1)) w1=null;}
            if(sizes[3]) {h1 = parseInt(sizes[3]);if(isNaN(h1)) h1=null;}
        } else {
            if(sizes[0]) {w1 = parseInt(sizes[0]);if(isNaN(w1)) w1=null;}
            if(sizes[1]) {h1 = parseInt(sizes[1]);if(isNaN(h1)) h1=null;}
        }
    } else {
        w1 = 456
        h1 = 342
        w2 = 150
        h2 = 150    
    }
    
 
    
    var getSizes = function(w,h, callback) {
        easyimg.info(path, function(e, info) {

            if(info && info.width) {
                if(!h) {
                    h = parseInt(info.height * w / info.width)    
                } else if(!w) {
                    w = parseInt(info.width * h / info.height)
                }
                if(w > info.width) w = info.width
                if(h > info.height) h = info.height
            }
            
        
            
            callback(w,h)
        })        
    }
    

    getSizes(w1, h1, function(w,h) {
        conf1.width = w
        conf1.height = h

        if(w2 || h2) {
            getSizes(w2, h2, function(w,h) {

                conf2.width = w
                conf2.height = h
                resize()
            })
        } else {
            resize()
        }
    })
}

exports.Plugin.prototype.upload = function(req, callback, auth) {
    if(auth) {
        var me = this;
        crypto.randomBytes(32, function(ex, buf) {
            var token = buf.toString('hex')
                ,path = me.server.dir + '/' + me.server.config.STATIC_DIR+'/tmp/'+token;
            
                        
            fs.writeFile(path, req.fullData, function (e) {
                if (e) {
                    callback(null, {code:500})
                } else {
                    
                    makeImg(path, function(imgs, e) {
                        if (e) {
                            callback(null, {code: 500});
                            return;
                        }
                        imgs.img_s.name = token
                        callback(imgs.img_s);
                    }, req.urlparams[0])                  
                }
            });
        });
    } else callback(null, {code: 401});
}

exports.Plugin.prototype.getimage = function(req, cb, auth) {
    var me = this
        ,o_id
        ,collName = (req.urlparams[0] || '')
        ,o_id = (req.urlparams[1] || 0)
        ,folderName = (req.urlparams[2] || '')
        ,folder = {}
        ,head = {code: 200, status: 'OK', heads: {'Content-Type': 'image/jpeg'}}        
        ,num = (req.urlparams[3]? parseInt(req.urlparams[3]) : 0)
        ,size = req.urlparams[4]

	 var callback = function(buff, e, h) {
	 	
         if(buff) {		
			/*
            gd.createFrom(WaterFile, function (err, water) {
			    gd.createFromPtr(buff ,function(e, img) {
					img.watermark(water, WaterPos)				
					var buffer = img.ptr({format: 'jpeg', jpegquality: 80})			 	   	
					h.heads['Content-Length'] = buffer.length			 	   	
			 	   cb(buffer,e,h)
			 	})
			})
            */
            h.heads['Content-Length'] = buff.length    		 	   	
			cb(buff,e,h)
	 	} else {
	 		cb(buff, e, h)
	 	}
	 }

    folder[folderName]=1
    
    var func404 = function() {
        if(me.server.config.DEFAULT_IMAGE) {
//console.log(me.server.dir + '/' + me.server.config.STATIC_DIR + '/' + me.server.config.DEFAULT_IMAGE)            
            fs.readFile(me.server.dir + '/' + me.server.config.STATIC_DIR + '/' + me.server.config.DEFAULT_IMAGE, function(e, file) {
                if(e) {
                    callback(null, {code: 404})
                    return;
                }
                head.heads = {
                    'Content-Type': 'image/png'
                }
                callback(file,null, head)
            }) 
        } else
            callback(null, {code: 404})
    }
    
    if(isNaN(num)) num = 0 
    if((o_id = forms.strToId(o_id, callback)) === 0) return;
    if(!collName) {
        func404()
        return;
    }
    folder.mtime = 1 
    me.db.collection(collName).findOne({_id: o_id}, folder, function(e,data) {
        if(data && data[folderName]) {
            
            head.heads['Last-Modified'] = data.mtime
            head.heads['Cache-Control'] = (req.urlparams[5] && req.urlparams[5] == 'nocached'? 'no-cache':'private')
            
            if(util.isArray(data[folderName])) {
                if(data[folderName][num]) {
                    if(size == 'main') {
                        if(data[folderName][num]['preview']) size = 'preview'
                        else if(data[folderName][num]['img']) size = 'img'
                    }                  
                    if(data[folderName][num][size]) {
                        head.heads['Content-Length'] = data[folderName][num][size].buffer.length
                        callback(data[folderName][num][size].buffer ,null, head)
                        return;
                    }
                }               
            } else {
                if(size == 'main') {
                    if(data[folderName]['preview']) size = 'preview'
                    else if(data[folderName]['img']) size = 'img'
                }
                if(data[folderName][size]) {
                    head.heads['Content-Length'] = data[folderName][size].length
                    callback(new Buffer(data[folderName][size]),null, head)
                    return;
                } else {
                    if(data[folderName].buffer && data[folderName].buffer.length) {
                        head.heads['Content-Length'] = data[folderName].buffer.length
                        callback(data[folderName].buffer,null, head)
                    }
                    return;
                }
            }                
        } 
        func404()
    })    
}