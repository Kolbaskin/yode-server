
var mongo = require('mongodb'),
    memcache = require('memcache'),
    config = require('./config');

// if needed, include a mailer
var nodemailer = require("nodemailer");
var mailTransp = nodemailer.createTransport(config.params.MAIL.type, config.params.MAIL.server);
var mem = new memcache.Client(config.params.MEMCACHE.port, config.params.MEMCACHE.host);      
    mem.connect();

// check current authorisation
exports.checkauth = function(params, callback) {
    if(params.id !=null && params.token !=null) { 
        mem.get(params.token, function(e, r){            

            if(r == params.id) {      
                mem.set(params.token, params.id,  function(e, rr){               
                    
                    var BSON = mongo.BSONPure;
                    var o_id = new BSON.ObjectID(r);
                    
                    callback(o_id);   // returns user id if autorised
                }, config.params.TOKEN.lifetime);
            } else 
                callback(null);    
            
        });
    } else 
        callback(null);
}

exports.start = function(callback) {        
    
    var th = this
    
    mongo.MongoClient.connect('mongodb://'+config.params.MONGO.host+':'+config.params.MONGO.port+'/'+config.params.MONGO.db_name, function(e, db) {        
        callback({db: db, mem: mem, mail: mailTransp, checkauth: th.checkauth});  
    });    
}