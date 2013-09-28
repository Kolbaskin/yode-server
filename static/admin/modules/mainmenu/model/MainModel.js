exports.collection = 'mainmenu'

exports.root = {
    name: 'All menus',
    expanded: false
}

exports.remove_action = 'mark'

exports.fields = [
    {
        name: 'id',
        mapping: '_id',
        type: 'ObjectID',
        editable: false,
        visable: true
    },
    {
        name: 'pid',
        type: 'ObjectID',
        editable: true,
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
        name: 'indx',
        type: 'int',
        sort: 'ASC',
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'dir',
        type: 'string',
        editable: true,
        visable: true
    },
    {
        name: 'mtime',
        type: 'date',
        editable: true,
        visable: true
    } 
    ,
    {
        name: 'blocks',
        editable: true,
        visable: true
    } 
]

exports.init = function(parent, callback) {
    var me = this,
        fields = {}
    for(var i=0;i<me.fields.length;i++) {
        if(me.fields[i].visable) fields[(me.fields[i].mapping || me.fields[i].name)] = 1;  
        fields.leaf = 1
    }
    
    parent.db.collection(me.collection).findOne({root: true}, fields, function(e, data) {
        if(!data) {
            parent.db.collection(me.collection).insert({root: true, name: me.root.name, leaf: false}, {w:1}, function(e, r) {
                me.root = r
                callback(); 
            });      
        } else {
            me.root = data;
            callback()
        }
    })
    
    
}