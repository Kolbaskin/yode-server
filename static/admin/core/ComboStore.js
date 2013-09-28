Ext.define('MyDesktop.core.ComboStore', {
    extend: 'Ext.data.Store',
    
    alias: 'store.combostore',
    
    autoLoad: true,
    fields:[{name: '_id'},{name: 'name'}],
    constructor: function(options) {
       var me = this        
        me.proxy = {
            type: 'ajax', 
            url: (options.url? Sess.url(options.url):''),
            reader: {
                 type: 'json'
                 ,root: 'data.list'
                 ,totalProperty: 'data.total'
                 ,successProperty: 'data.success'
             }
        }
        
        if(options.fields) me.fields = options.fields
        
        this.callParent(arguments);
    }    
});