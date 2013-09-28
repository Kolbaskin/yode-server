

Ext.define('MyDesktop.modules.users.view.UsersList', {
    extend: 'MyDesktop.core.GridWindow',
    
    requires: ['MyDesktop.core.ComboColumn'],
    
    filterable: true,
    
    buildColumns: function() {
        return [
                new Ext.grid.RowNumberer(),
                {
                    text: D.t("Login"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'login'
                },
                {
                    xtype: 'combocolumn',
                    text: D.t("Group"),
                    flex: 1,
                    guideUrl: 'model:getdata/MyDesktop.modules.users.model.GroupsModel/',                  
                    dataIndex: 'group'
                },
                {
                    text: D.t("name"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                }
                
                ,{
                    text: D.t("Email"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'email'
                }
                
            ]        
    }
    
})