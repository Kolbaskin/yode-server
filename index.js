/**
 * 
 * HTTP Server for Wpier project
 * version 0.1
 * 
 * Author MrKolbaskin
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
    ,config = require('./config_glob')
    ,extensions = {}
    ,domain = require('domain')
    ,http = require('http')
    ,manifest = require('./package.json');
    
console.log(manifest.name + ' ' + manifest.version)    
console.log('Copyright (c) 2013 ' + manifest.author + '\n')   
  

 
var projects = {}
    ,aliases = {}
        
/**
 * Global congig options
**/
var port = config.port
    ,maxUploadSize = config.maxUploadSize
    ,staticParams = config.staticParams
    ,formConfig = config.formConfig

/**
 * Create a node-static server instance to serve the './static' folder
**/
var staticMain = new(static.Server)(__dirname + '/static', staticParams)

var vHostStart = function(host) {
    
    projects[host] = new(subserv.Server)(config.projects_dir + '/' + host, staticParams, host, port);
    projects[host].init(function() {        
        console.log('Virtual host ' + host + ' [Ready]')  
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
        gc.run(config.tmp_dir, 600)
    }, config.gs_timeout);    
}



var startVH = function(test) {   
    fs.readdir(config.projects_dir, function(e, files) {      
        for(var i=0;i<files.length;i++) {
            if(test || process.argv.indexOf('-p') ==-1 || process.argv.indexOf(files[i]) != -1) 
                vHostStart(files[i])
        }
    })
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
     
}

/**
 * Create multipart parser to parse given request
 */
var serveMultipartForm = function(req, res, runMethod) {
    var form = new formidable.IncomingForm()
        ,files = {}
        ,fields = {}
        ,size = 0                
    
    for(var i in formConfig) {
        form[i] = formConfig[i]
    }
    form.on('file', function(field, file) {
        size += file.size
        if(size > maxUploadSize) {
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



exports.start = function(conf, callback) {
    for(var i in conf) {
        config[i] = conf[i]    
    }    
    if(!config.projects_dir) config.projects_dir = '/var/www'
    if(!config.tmp_dir) config.tmp_dir = './tmp'
    if(!config.gs_timeout) config.gs_timeout = 600000
    
    if(config.memLimit) memLimit(config.memLimit)
        
    startGC()   
    
    if(callback) {
    // for test call
        startVH(true)
        callback(http.createServer(createServer))
    } else {
    // work call
        startVH()
        if(config.host) http.createServer(createServer).listen(config.port, config.host)
        else http.createServer(createServer).listen(config.port)
        console.log('Server HTTP started on port ' + config.port)
    }
    
    if(config.https) {
        var https = require('https')
        var options = {
          key: fs.readFileSync(config.https.key),
          cert: fs.readFileSync(config.https.sert)
        };
        
        if(config.https.host) https.createServer(options, createServer).listen(config.https.port, config.https.host);
        else https.createServer(options, createServer).listen(config.https.port);
        console.log('Server HTTPS started on port ' + config.https.port)        
    } 
    
    process.title = 'yode'
    if(process.argv.indexOf('-d') != -1) {
        require('daemon')();
        
    } 
    
}
