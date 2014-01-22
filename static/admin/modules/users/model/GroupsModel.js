exports.collection = 'groups'

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
        editable: true,
        visable: true
    },
    {
        name: 'description',
        type: 'string',
        filterable: false,
        editable: true,
        visable: true
    },{
        name: 'modelAccess',
        type: 'object',
        filterable: false,
        editable: true,
        visable: true
    },{
        name: 'pagesAccess',
        type: 'object',
        filterable: false,
        editable: true,
        visable: true
    },{
        name: 'desktopClassName',
        type: 'string',
        filterable: false,
        editable: true,
        visable: true
    }
]