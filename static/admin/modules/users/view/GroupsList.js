

Ext.define('MyDesktop.modules.users.view.GroupsList', {
    extend: 'MyDesktop.core.GridWindow',
    
    //store: "MyDesktop.modules.users.store.GroupStore",
    filterable: true,
    
    buildColumns: function() {
        return [                
                {
                    text: D.t("Group name"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    text: D.t("Description"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'description'
                }
            ]        
    }
    
})