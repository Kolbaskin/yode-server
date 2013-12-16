Ext.define('MyDesktop.modules.templates.store.ComboStore', {
    extend: 'Ext.data.Store',
    
    fields: ['_id', 'name'],
    proxy: {
        type: 'ajax', 
        url: Sess.url('model:getdata/MyDesktop.modules.templates.model.TemplatesModel'),
        simpleSortMode: true,
        reader: {
             type: 'json',
             root: 'response.list',
             totalProperty: 'response.total'
             ,successProperty: 'response.success'
         }
    },
    autoLoad: true
})