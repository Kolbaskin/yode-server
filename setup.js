var ncp = require("ncp")
    ,readline = require('readline')
    ,rmdir = require('rimraf')
    ,fs = require('fs')
    ,mongo = require('mongodb')
    ,memcache = require('memcache');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var port = 80
    ,projectsDir = 'www'

var config = {
    STATIC_DIR: 'static',
    ADMIN_MODULES_DIR: 'static/admin',
    ROWS_PER_PAGE: 20,
    UPLOAD_DIR: 'upload', // dir for user files in STATIC_DIR
    LOGS: true,
    MONGO: {
        db_name: 'testdb',
        port: 27017,
        host: 'localhost',
        user: '',
        pass: ''
    },
    DEBUG: true,
    TIME_TO_CONSOLE_LOG: false, // замеры времени
    PLUGIN_DIR: 'plugins',
    MEMCACHE: {
        host: 'localhost',
        port: 11211
    },
    TOKEN: {
        lifetime: 300, // session max lifetime in sec
        len: 32, // token length bytes
        sessPassLen: 3 // session password length
    },
    MAIL: {
      
    },
    HASH_ALG: 'sha1',
    GLOBAL_AUTH: true, // check authorisation globaly
    REDIRECT_401: '/',
    ERRORPAGES: {
        404: 'http://metri.local:8000/errors/404/'    
    }
}

var steps = [
    
    // Step 1
    function(callback) {
        
        fs.exists(__dirname + '/../../server.js', function(log) {
            if(log) {
                console.log('Yode-server already exists!');
                process.exit(0);
            } else {
                callback(true)
            }
        })
    },
    

    // Step 1
    function(callback) {
        ncp(__dirname + "/node_modules", __dirname + "/../../node_modules", function (err) {
            rmdir(__dirname + "/node_modules", function(error){
                callback(true)
            });            
        });
    },
    
    function(callback) {    
        rl.question("Server port [" + port + "]?", function(answer) {
            if(answer != '') {
                var p = parseInt(answer)
                if(!isNaN(p)) port = p
            }
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb host [" + config.MONGO.host + "]?", function(answer) {
            if(answer != '') config.MONGO.host = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb port [" + config.MONGO.port + "]?", function(answer) {
            if(answer != '') config.MONGO.port = parseInt(answer)     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb user [" + config.MONGO.user + "]?", function(answer) {
            if(answer != '') config.MONGO.user = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Mongodb password [" + config.MONGO.pass + "]?", function(answer) {
            if(answer != '') config.MONGO.pass = answer     
            callback(true)          
        })       
    },
    
    // Test mongo connect
    function(callback) {
        var usr = ""
        if(config.MONGO.user) {
            usr = config.MONGO.user + ':' + config.MONGO.pass + '@'    
        }
        mongo.MongoClient.connect('mongodb://' + usr + config.MONGO.host + ':' + config.MONGO.port + '/test1db', function(e, db) {        
             if(e) {
                 console.log('Trying mongo connect: ERROR!')
                 callback(false)   
             } else {
                 console.log('Trying mongo connect: OK')
                 db.collection('admin_users').insert({
                     login: "yeti",
                     pass: "3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d",
                     superuser: true
                     }, function() {
                        
                        db.collection('admin_templates').insert({
                           "mtime": new Date(),
                           "name": "Main",
                           "blocks": 1,
                           "tpl": "index.tpl",
                           "controller": ""   
                        }, function(e,r) {
                            db.collection('pages').insert({
                               "root": true,
                               "name": "Home page",
                               "dir": "/",
                               "alias": "",
                               "tpl": r._id,
                               "leaf": false 
                            }
                            , function(e,r) {
                               callback(true) 
                            })
                        })
                     
                     
                 })
                 
             }
        });    
    },
    
    function(callback) {    
        rl.question("Memcache host [" + config.MEMCACHE.host + "]?", function(answer) {
            if(answer != '') config.MEMCACHE.host = answer     
            callback(true)          
        })       
    },
    
    function(callback) {    
        rl.question("Memcache port [" + config.MEMCACHE.port + "]?", function(answer) {
            if(answer != '') config.MEMCACHE.port = parseInt(answer)     
            callback(true)          
        })       
    },
    
    function(callback) {    
        var mem = new memcache.Client(config.MEMCACHE.port, config.MEMCACHE.host);      
        
        mem.connect();  
        try {
        mem.set('test', 'test',  function(e, rr){
            if(e) {
                console.log('Trying memcached connect: ERROR!')
                callback(false)   
             } else {
                console.log('Trying memcached connect: OK')
                callback(true)
             }
        }, 1)
        } catch(e) {
            console.log('Trying memcached connect: ERROR!')
            callback(false) 
        }
    },

    function(callback) {
        rl.question("Project directory [" + projectsDir + "]?", function(answer) {
            if(answer != '') projectsDir = answer     
            callback(true)          
        })    
    },
    
    function(callback) {
        
        var data = 'var server = require("yode-server")\n'
            + 'server.start({\n'
            + '    port: ' + port + ',\n'
            + '    projects_dir: __dirname + "/' + projectsDir + '",\n'
            + '    tmp_dir: __dirname + "/tmp",\n' 
            + '    gs_timeout: 300000\n'
            + '})\n\n'
        
        fs.writeFile("../../server.js", data, function() {
            callback(true)
        })
        
    },
    
    function(callback) {
        
        ncp(__dirname + "/www", __dirname + "/../../" + projectsDir, function (err) {
            var fn = __dirname + "/../../" + projectsDir + '/localhost/config.js'
            
            fs.readFile(fn, 'utf8', function(e,d) {
                
            
                d = d.replace("${MONGO.port}", config.MONGO.port)
                d = d.replace("${MONGO.host}", config.MONGO.host)
                d = d.replace("${MONGO.user}", config.MONGO.user)
                d = d.replace("${MONGO.pass}", config.MONGO.pass)
                
                d = d.replace("${MEMCACHE.port}", config.MEMCACHE.port)
                d = d.replace("${MEMCACHE.host}", config.MEMCACHE.host)
                
                fs.writeFile(fn, d, 'utf8', function() {
                    callback(true)    
                })                
            })
            
        });    
        
    }
    
    
]

var runs = function(i) {
    if(i == steps.length) {
        
        console.log('Setup is success!')
        console.log('Now you can run yode-server: node server.js')
        
        rl.close();
        process.exit(0);
        return;
    }
    steps[i](function(log) {
        if(log) runs(i+1)
        else {
            "not ok";
            process.exit(1);
        }
    })
}

runs(0)