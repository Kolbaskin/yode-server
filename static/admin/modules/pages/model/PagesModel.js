var forms = require('forms')

exports.collection = 'pages'

exports.root = {
    name: 'Index page',
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
    },{
        name: 'aAccess',
        editable: false,
        visable: true,
        emptySave: true
    },{
        name: 'parents',
        //type: '',//parentpages',
        editable: true,
        visable: true,
        emptySave: true
    },
    {
        name: 'tpl',
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
        name: 'metatitle',
        type: 'string',
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'metadesctiption',
        type: 'string',
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'metakeywords',
        type: 'string',
        unique: true,
        editable: true,
        visable: true
    },
    {
        name: 'dir',
        type: 'string',
        editable: true,
        visable: true
    },{
        name: 'alias',
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
    },
    {
        name: 'access',
        type: 'boolean',
        editable: true,
        visable: true
    },
    {
        name: 'map',
        type: 'boolean',
        editable: true,
        visable: true
    },
    {
        name: 'indx',
        type: 'int',
        sort: 'ASC',
        editable: true,
        visable: true
    } 
]

exports.init = function(parent, callback, auth) {
    var me = this,
        fields = {}
    for(var i=0;i<me.fields.length;i++) {
        if(me.fields[i].visable) fields[(me.fields[i].mapping || me.fields[i].name)] = 1;  
        fields.leaf = 1
    }
    
    var func = function(access) {
        parent.db.collection(me.collection).findOne({root: true}, fields, function(e, data) {
            if(!data) {

                parent.db.collection(me.collection).insert({root: true, name: me.root.name, leaf: false}, {w:1}, function(e, r) {
                    me.root = r;
                    callback(); 
                });      
            } else {
                if(access) data.aAccess = access                
                me.root = data;
                callback()                
            }
        })
    }
    
    var empFunc = function() {
        me.root = null
        callback()
    }
    
    parent.server.getModel('admin.models.access').getuserinfo(null, function(user) {    
        if(!user) {
            empFunc()
            return;
        }       
        if(user && user.superuser) {
           func({read: true, add: true, modify: true, del: false}) 
        } else if(!!user.group && !!user.group.pagesAccess) {
            var rates = parent.server.getModel('admin.models.access').getPageRates(null, null, auth, {root: true}, user.group) 
            if(rates && rates.read) func(rates)
            else empFunc()
           
        } else empFunc()
    }, auth)    
}

exports.beforeSave = function(data, auth, callback, server) {
    var pid;
    if(data && data.pid && (pid = forms.strToId(data.pid))) {
        var pages = [] 
        
        data.dir = '/' + data.alias + '/'
        
        var func = function(pd) {
            pages.push(pd)
            server.db.collection('pages').findOne({_id:pd}, {pid:1, alias:1}, function(e,d) {
                if(d && d.pid) {
                    data.dir = '/' + d.alias + data.dir
                    func(d.pid)
                } else {
                    data.parents = pages
                    callback(data)
                }
            })
        }
        func(pid)    
        return;        
    } else {
        data.dir = '/'
        data.alias = ''
        callback(data)
    }
}

// Методы для внешнего использования
exports.publics = {
    
    checkAlias: function(inp) {
        
    }
    
}