require('daemon')();

var cluster = require('cluster')
    ,workers = []
    ,stopLog = false

var config = {
    numWorkers: require('os').cpus().length,
    checkerTimeout: 1000
};

cluster.setupMaster({
    exec: "server.js"
});

var startWorker = function() {
    var w = cluster.fork()
    w.on('message', function(data) {
        if(data.action && actions[data.action]) actions[data.action]();
    })
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