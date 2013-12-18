Ext.define('MyDesktop.core.Store', {
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.grid.plugin.BufferedRenderer'
    ],
    extend: 'Ext.data.Store',
    fields : [],
    data : [], 
    //remoteGroup: true,
    remoteFilter: true,
    /*purgePageCount: 1,
    leadingBufferZone: 0,
    trailingBufferZone: 0,
    pageSize: 30,
    autoLoad: false,
     */
    buffered: true,
    leadingBufferZone: 0,
    pageSize: 100,
    autoLoad: true,
    listeners: {
       load: function(me) {
               //console.log(me)
       }
    },
                     
    constructor: function(options) {        
        var me = this
            ,modelPath

        if(options && options.modelPath) modelPath = options.modelPath
        else {
            var proto = Object.getPrototypeOf(this)
            if(proto.modelPath) modelPath = proto.modelPath
        }

        me.proxy = {
            type: 'ajax', 
            url: Sess.url('model:getdata/'+modelPath),
            simpleSortMode: true,
            filterParam: 'query',
            remoteFilter: true,
            reader: {
                 type: 'json',
                 root: 'response.list',
                 totalProperty: 'response.total'
                 ,successProperty: 'response.success'
             }
        }
        
        if(me.fieldSet) {
            me.proxy.extraParams = {
                fieldSet: JSON.stringify(me.fieldSet)    
            }    
        }
        
        me.fields = ['_id', 'name']
        

        Core.Ajax.request({
            url: 'model:getmodel/'+modelPath,
            succ: function(data) {
                me.model.setFields(data.fields ,'_id') 
                me.load()
            }                     
        })

        this.callParent(arguments);

    }
    
    
    
});