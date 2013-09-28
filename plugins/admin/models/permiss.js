var fs = require('fs')
    //,mongo = require('mongodb')
    //,BSON = mongo.BSONPure







/*
*
* set user sets
*
*/

exports.setusersets = function(auth, req, parent, callback) { 
    
    var sets;
    
    try {
        sets = JSON.parse(req.jsonData)
    } catch(e){}

    parent.db.collection('admin_users').update(auth, {$set:{sets:sets}}, function(e, data) {})
    callback({ok:true})
    
    //parent.db.collection('admin_users').findOne(auth, {login:1, email:1}, function(e, data) {
    //    callback(data, e);  
    //})    
}
