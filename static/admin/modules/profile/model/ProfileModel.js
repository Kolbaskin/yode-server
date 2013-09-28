exports.collection = 'admin_users'

exports.fields = [
    {
        name: '_id',
        type: 'ObjectID',
        visable: true
    },
    {
        name: 'login',
        type: 'string',
        filterable: true,
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'fname',
        type: 'string',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'phone',
        type: 'string',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'photo',
        type: 'file',
        filterable: false,
        editable: true,
        visable: true
    },
    {
        name: 'email',
        type: 'string',
        filterable: true,
        vtype: 'email',
        editable: true,
        visable: true
    },
    {
        name: 'pass',
        type: 'password',
        editable: true,
        visable: false
    }
        
]

// Запретим удалять пользователей
exports.beforeDelete = function(data, auth, callback) {
    callback(null, {code: 401})
}

// Профиль можно менять только у себя
// и логин не должен дублировать логин другого юзера
exports.beforeSave = function(data, auth, callback, server) {    
    server.db.collection('admin_users').findOne({login: data.login}, {_id:1}, function(e,dt) {
        if(!dt || (dt._id+'') == (auth+'')) {
            data._id = auth+''
            callback(data)
        } else {
            callback(null, {code: 401})
        }
    })    
}