

Ext.define('MyDesktop.modules.templates.view.TemplatesList', {
    extend: 'MyDesktop.core.GridWindow',
    
    buildColumns: function() {
        return [
                new Ext.grid.RowNumberer(),
                {
                    text: D.t("Template name"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name'
                }
                ,{
                    text: D.t("Count of blocks"),
                    flex: 1,
                    sortable: true,
                    dataIndex: 'blocks'
                }               
                
                ,{
                    text: D.t("Template"),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'tpl'
                }
                ,{
                    text: D.t("Controller"),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'controller'
                }
            ]        
    }
    
})