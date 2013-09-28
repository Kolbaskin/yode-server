Ext.define('MyDesktop.modules.templates.view.TemplatesForm', {
    extend: 'MyDesktop.core.DetailForm',
    
    titleIndex: 'name',
        
    buildItems: function() {
        return [
        {
            name: 'name',
            width: 500,
            fieldLabel: D.t('Template name')
        },
        {
            name: 'blocks',
            width: 500,
            xtype: 'numberfield',
            fieldLabel: D.t('Blocks count')
        },
        {
            name: 'tpl',
            width: 500,
            fieldLabel: D.t('Template')
        },
        {
            name: 'controller',
            width: 500,
            fieldLabel: D.t('Controller')
        }
        ]
    }
    
})