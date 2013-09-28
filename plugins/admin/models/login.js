//var config = require('../../../config'),
var    crypto = require('crypto'),
    mongo = require('mongodb')
    
// all users show 
exports.users = function(adminId, collection, callback) {
    collection.find().toArray(function(e, r){
        callback(r, e)
    });   
}

// Add user
exports.add = function(data, collection, callback, config) {
    if(data.dblauth == null || data.dblauth=='false') 
        data.dblauth = false
    else 
        data.dblauth = true
    
    if(data.pass != null) data.pass = crypto.createHash(config.HASH_ALG).update(data.pass).digest('hex');

    if(data._id != null) {
        var BSON = mongo.BSONPure,
            o_id = new BSON.ObjectID(data._id);
            data._id = null
        collection.update({_id: o_id}, {$set:{login: data.login, email: data.email}}, {w:1}, function(e, r) {
            
            callback({success:true}, null); 
        })
    
    } else {
                 
        collection.insert({login: data.login, email: data.email}, {w:1}, function(e, r) {
            callback({id:r._id}, e); 
        });    
    }
}

// Check dbl auth
exports.enter2step = function(data, mem, callback, config) {
    mem.get(data.token, function(e, r){
        if(r == data.pass) {      
            mem.set(data.token, data.id,  function(e, r){
                if(r == 'STORED') callback(data, null);
                else callback(null, {mess: 'Internal server error'}); // if memcache error
            }, config.TOKEN.lifetime);
        }
    });
}

// Get user info
exports.userinfo = function(data, collection, callback) {
    collection.findOne(data, function(e, r) {
        callback(r, e);
    })
}