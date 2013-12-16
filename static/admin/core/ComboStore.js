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
                 ,root: 'response.list'
                 ,totalProperty: 'response.total'
                 ,successProperty: 'response.success'
             }
        }
        
        if(options.fields) me.fields = options.fields
        
        this.callParent(arguments);
    }    
});