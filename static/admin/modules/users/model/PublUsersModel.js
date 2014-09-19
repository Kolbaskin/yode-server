exports.collection = 'users'

exports.fields = [
    {
        name: '_id',
        type: 'ObjectID',
        visable: true
    },
    {
        name: 'name',
        type: 'string',
        filterable: true,
        //unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'fname',
        type: 'string',
        filterable: true,
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'phone',
        type: 'string',
        filterable: true,
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
        name: 'status',
        type: 'string',
        editable: true,
        visable: true
    },
    {
        name: 'region',
        type: 'string',
        editable: true,
        visable: false
    }
    ,
    {
        name: 'activated',
        type: 'boolean',
        editable: true,
        visable: true
    },{
        name: 'ads1',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads2',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads3',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads4',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads5',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads6',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'ads7',
        type: 'int',
        editable: true,
        visable: false
    },{
        name: 'rate',
        type: 'float',
        filterable: true,
        editable: true,
        visable: true
    },{
        name: 'premium',
        type: 'boolean',
        filterable: true,
        editable: true,
        visable: false
    }
        
]



exports.beforeSave = function(data, auth, cb, serv) {
    data.activated = !!data.activated
    var id = (data._id+'')._id()
    serv.db.collection('ads').update({owner: id}, {$set: {lock: !data.activated}}, {multi:1}, function(e, d) {
        cb(data)    
    })
}