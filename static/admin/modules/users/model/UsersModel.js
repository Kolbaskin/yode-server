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
        name: 'dblauth',
        type: 'boolean',
        editable: true,
        visable: true
    },
    {
        name: 'pass',
        type: 'password',
        editable: true,
        visable: false
    },
    {
        name: 'group',
        type: 'ObjectID',
        editable: true,
        visable: true
    }
        
]