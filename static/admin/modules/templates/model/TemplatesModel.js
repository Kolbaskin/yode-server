exports.collection = 'admin_templates'

exports.fields = [
    {
        name: '_id',
        type: 'ObjectID',
        visable: true
    },
    {
        name: 'name',
        type: 'string',
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'blocks',
        type: 'number',
        editable: true,
        visable: true
    },
    {
        name: 'tpl',
        type: 'string',
        editable: true,
        visable: true
    },
    {
        name: 'controller',
        type: 'string',
        editable: true,
        visable: true
    }
        
]