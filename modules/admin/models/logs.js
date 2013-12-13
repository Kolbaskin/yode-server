
var getUserName = function(auth, db, callback) {
    db.collection('admin_users').findOne({_id:auth},{login:1},function(e,r) {
        callback(r? r.login:'anonimus')    
    })    
}

exports.insert = function(user_id, server, model_name, new_data) {
    if(!server.server.config.LOGS) {
        
        return;
    }
    getUserName(user_id, server.db, function(login) {
        var rec = {
            date: new Date(),
            user: login,
            model: model_name,
            actionType: 'insert'
        }
        server.db.collection('logs').insert(rec,function(e,r) {})    
    })
}

exports.update = function(user_id, server, model_name, old_data, callback) {

    if(!server.server.config.LOGS) {
        callback()
        return;
    }
    
    getUserName(user_id, server.db, function(login) {
        var rec = {
            date: new Date(),
            user: login,
            model: model_name,
            actionType: 'update',
            saved: old_data
        }
        server.db.collection('logs').insert(rec,function(e,r) {
            callback()
        })    
    })
}

exports.delByMarking = function(user_id, server, model_name, rec_id){
    if(!server.server.config.LOGS) {
        
        return;
    }
    getUserName(user_id, server.db, function(login) {
        var rec = {
            date: new Date(),
            user: login,
            model: model_name,
            actionType: 'mark_as_del',
            saved: rec_id 
        }
        server.db.collection('logs').insert(rec,function(e,r) {})    
    })
}

exports.delByRemoving = function(user_id, server, model_name, collection_name, rec_id, callback){
    if(!server.server.config.LOGS) {
        callback()
        return;
    }
    getUserName(user_id, server.db, function(login) {
        var rec = {
            date: new Date(),
            user: login,
            model: model_name,
            actionType: 'remove'
        }
        server.db.collection(collection_name).findOne({_id:rec_id}, function(e,r) {
            delete r._id
            rec.saved = r
            server.db.collection('logs').insert(rec,function(e,r) {
                callback()
            }) 
        })
    })
}