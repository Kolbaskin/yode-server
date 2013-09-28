Ext.define('MyDesktop.core.StoreTree', {
    extend: 'Ext.data.TreeStore',
    //folderSort: true,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
    autoLoad: false,
     
    constructor: function(options) {        
        var me = this,
            modelPath
        
        
        if(options && options.modelPath) modelPath = options.modelPath
        else {
            var proto = Object.getPrototypeOf(this)
            if(proto.modelPath) modelPath = proto.modelPath
        }
        
        if(!modelPath) return null;
        
        Core.Ajax.request({
            url: 'model:getmodel/' + modelPath,
            succ: function(data) {
                me.model.setFields(data.fields ,'id')        
                me.setProxy({
                    type: 'ajax', 
                    url: Sess.url('model:getdatatree/' + modelPath),
                    //simpleSortMode: true,                    
                    reader: {
                         type: 'json',
                         root: 'data'
                     }
                })
                me.setRootNode(data.root)
                me.load() 
            }        
        })        
        this.callParent(arguments);
    }
});
