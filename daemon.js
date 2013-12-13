require('daemon')();

var winston = require('winston')
    ,cluster = require('cluster')
    ,workers = []
    ,stopLog = false
    ,config = require("./config_global.js").params
    ,clusterConfig = {
        exec: "server.js"        
    }

if(config.logs_file) {
    winston.add(winston.transports.File, { filename: config.logs_file});
    clusterConfig.silent = true
}

cluster.setupMaster(clusterConfig)

var startWorker = function() {
    var w = cluster.fork()
    w.on('message', function(data) {
        if(data.action && actions[data.action]) actions[data.action]();
    })
    if(config.logs_file) {        
        w.process.stdout.on('data', function(chunk) {
            winston.info(chunk.toString());            
        });
        w.process.stderr.on('data', function(chunk) {
            winston.warn(chunk.toString());
        });       
    }
    return w
}

var actions = {
    restart: function() {
        stopLog = true
        var stopWorker = function(i) {
            if(!workers[i]) {
                stopLog = false
                return;
            }
            workers[i].kill()
            workers[i] = startWorker()        
            setTimeout(function() {stopWorker(i+1)}, 500);
        }
        stopWorker(0)
    }
}

for (var i = 0; i < config.numWorkers; i++) {    
    workers[i] = startWorker()
}

var startChecker = function() {
    setTimeout(function() {
        if(!stopLog) {
            for(var i=0;i<workers.length;i++) {
                if(workers[i].process._channel === null) {
                    workers[i] = cluster.fork();
                }
            }
        }
        startChecker()
    }, config.checkerTimeout)
}
 
startChecker()