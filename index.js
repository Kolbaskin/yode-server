/**
 * 
 * HTTP Server for yode project
 * version 0.1
 * 
 * Author Maxim Tushev
 * 
**/

var  fs = require('fs')
    ,querystring = require('querystring')
    ,urlutils = require('url')
    ,static = require('node-static')
    ,subserv = require('./subserver')
    ,streamBuffer = require("stream-buffers")
    ,formidable = require('formidable')
    ,util = require('util')
    ,gc = require('gc')
    ,config = require('../../config_global.js').params
    ,extensions = {}
    ,domain = require('domain')
    ,http = require('http')
    ,manifest = require('./package.json')
    
require('proto_correct')

console.log(manifest.name + ' ' + manifest.version)    
console.log('Copyright (c) 2013 ' + manifest.contributors[0].name + ' <' + manifest.contributors[0].email + '>' + '\n') 

var projects = {}
    ,aliases = {}
        
/**
 * Global congig options
**/
var port = config.port
    ,maxUploadSize = config.maxUploadSize
    ,maxPostSize = config.maxPostSize
    ,staticParams = config.staticParams
    ,formConfig = config.formConfig

/**
 * Create a node-static server instance to serve the './static' folder
**/
var staticMain = new(static.Server)(__dirname + '/static', staticParams)

var vHostStart = function(host) {
    
    projects[host] = new(subserv.Server)(config.projects_dir + '/' + host, staticParams, host, port);
    projects[host].init(function() {        
        
        runPlugins("onSubserverStart", projects[host], function() {        
            console.log('Virtual host ' + host + ' [Ready]')  
        })
    });
    if(projects[host].config.ALIASES) {
        for(var i=0;i<projects[host].config.ALIASES.length;i++) {
            aliases[projects[host].config.ALIASES[i]] = host
        }
    }

}

// GC starts
var startGC = function() {    
    setInterval(function() {
        gc.run(config.tmp_dir, 3600)
    }, 600000);    
}



var startVH = function(test) {   
    fs.readdir(config.projects_dir, function(e, files) {      
        for(var i=0;i<files.length;i++) {
            if(test || process.argv.indexOf('-p') ==-1 || process.argv.indexOf(files[i]) != -1) 
                vHostStart(files[i])
        }
    })
}

var _PLUGINS = []

var getPlugins = function() {
    if(config.plugins) {
        for(var i=0;i<config.plugins.length;i++) {
            _PLUGINS[i] = require(config.plugins[i])
        }
    }
}

var runPlugins = function() {
    var callback = arguments[arguments.length-1]
        ,eventName = arguments[0]
        ,args = []
        ,num = 0 
    
    for(var i = 1;i < arguments.length-1; i++) args.push(arguments[i])
        
    var func = function() {
        if(!_PLUGINS[num]) {
            callback()
            return;
        }
        if(_PLUGINS[num][eventName]) {
            _PLUGINS[num][eventName].apply(null, args)   
        } else {
            num++
            func()
        }
    }
    
    args.push(function() {
        num++  
        func()
    })
    
    func()
}

var runMethod = function(req, res, post) {    

    
    if(!req.headers.host || req.headers.host == '') {
        res.end('Host not found!');
        return;
    }
    
    var hostPort = req.headers.host.split(":")
        ,host = hostPort[0];
    
    if(host == '127.0.0.1') host = 'localhost'
        
    if(!projects[host]) {
        if(aliases[host]) {
            res.writeHead(301, "Moved Permanently", {'Location': 'http://' + aliases[host] + (hostPort[1]? ':' + hostPort[1]:'') + req.url});
            res.end();
            return;            
        } else {
            res.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
            res.end('Host not found!');
            return;
        }
    }    
    
    runPlugins('onGetRequest', req, res, projects[host], function() { 
    
        if(!post) {
            // in get requests try to serve static files (first in prj dir, 
            // next in global dir), if false, serve dynamic       
            projects[host].statserve(req, res, function(e, r) {
                if (e && (e.status === 404)) staticMain.serve(req, res, function(e, r) {
                    if (e && (e.status === 404)) projects[host].serve(req, res, post);    
                });    
            });
        } else {
            projects[host].serve(req, res, post)
        }
    })
     
}

/**
 * Create multipart parser to parse given request
 */
var serveMultipartForm = function(req, res, runMethod) {
    var form = new formidable.IncomingForm()
        ,files = {}
        ,fields = {}
        ,fileSize = 0 
        ,postSize = 0

    for(var i in formConfig) {
        form[i] = formConfig[i]
    }
    form.on('file', function(field, file) {
        fileSize += file.size
        if(fileSize > maxUploadSize) {
            return false;
        }
        if(files[field]) {
            if(!util.isArray(files[field])) files[field] = [files[field]]                    
            files[field].push(file)        
        } else {
            files[field] = file;
        }
    })            
    form.on('field', function(field, value) {
        postSize += value.length;
        if(postSize > maxPostSize) {
            return false;
        }
        if(fields[field]) {
            if(!util.isArray(fields[field])) fields[field] = [fields[field]]                    
            fields[field].push(value)        
        } else {
            fields[field] = value;
        }
    })            
    form.on('end', function() {
        fields.files = files
        runMethod(req, res, fields); 
    });
    form.parse(req); 
}




var createServer = function(req, res) {      
    
    
    
    if (req.method == 'POST') {        
        if(req.headers['content-type'] && req.headers['content-type'].substr(0,19) == 'multipart/form-data') {
        // Multipart form-data post    
            serveMultipartForm(req, res, runMethod)    
        } else {
        // URL-encoded POST    
            var fullBody = '', fullData = new streamBuffer.WritableStreamBuffer();               
            req.on('data', function(chunk) {            
                if(fullData.length > maxUploadSize) {
                    res.writeHead(500, "Internal Server Error", {'Content-Type': 'text/plain'});
                    res.end('Too lage data!');                   
                } else {
                    fullBody += chunk.toString();
                    fullData.write(chunk)
                }
            });            
            req.on('end', function() {
                var params = querystring.parse(fullBody)
                params.fullData = fullData.getContents()
                runMethod(req, res, params);            
            }); 
        }
    } else {
       runMethod(req, res, null);        
    }    
}

var memLimit = function(limit) {
    if(limit) limit *= 1024*1024
    setInterval(function() {
        if(process.memoryUsage().rss > limit) {
            process.exit(0)    
        }
    }, 1000)    
}

// Чистим принудительно мусор каждые 5сек
// если нода запущена с парамтром --expose-gc
if(!!global.gc)
    setInterval(function() {
       global.gc()
    }, 5000)

/*
setInterval(function() {
   console.log(parseInt(process.memoryUsage().rss / 1024 / 1024))
}, 3000)
*/

var createHttpServer = function(serv, conf) {
    
    if(conf.auth) {
        var basicAuth = require('http-auth');
    
        var basic = basicAuth.basic({
                realm: "Closed Area."
            }, function (username, password, callback) { // Custom authentication method.
                callback(username === conf.auth.user && password === conf.auth.pass);
            }
        );
        
        return http.createServer(basic, createServer)
        
    } else {
    
        return http.createServer(createServer)
    
    }
}

exports.start = function(conf, callback) {
    //for(var i in conf) {
    //    config[i] = conf[i]    
    //}    
    //if(!config.projects_dir) config.projects_dir = '/var/www'
    //if(!config.tmp_dir) config.tmp_dir = './tmp'
    //if(!config.gc_timeout) config.gc_timeout = 600000
    
    if(config.memLimit) memLimit(config.memLimit)
        
    startGC()   
    
    getPlugins()    
    
    if(callback) {
    // for test call
        startVH(true)
        callback(createHttpServer(createServer, config))
    } else {
    // work call
        startVH()
        if(config.host) createHttpServer(createServer,config).listen(config.port, config.host)
        else createHttpServer(createServer, config).listen(config.port)
        console.log('Server HTTP started on port ' + config.port)
    }
    
    if(config.https) {
        var https = require('https')
        var options = {
          key: fs.readFileSync(config.https.key),
          cert: fs.readFileSync(config.https.cert)
        };
        
        if(config.https.host) https.createServer(options, createServer).listen(config.https.port, config.https.host);
        else https.createServer(options, createServer).listen(config.https.port);
        console.log('Server HTTPS started on port ' + config.https.port)        
    } 
    
    process.title = 'yode'
    if(process.argv.indexOf('-d') != -1) {
        //require('daemon')();
        
    } 
    
}
