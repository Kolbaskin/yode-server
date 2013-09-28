

Ext.define('MyDesktop.modules.filemanager.view.Win', {
    extend: 'Ext.window.Window',
    
    width:900,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    initComponent: function() {
        this.items = [
            Ext.create('MyDesktop.modules.filemanager.view.FilesList', {
               title: '',//D.t('Files list'), 
               region: 'center'
               //width: 400,
               
            }),
            {
                xtype: 'panel',
                region: 'east',
                width: 200,
                split: true,
                itemId: 'preview',
                title: ''//D.t('Preview')
            }
        ]
        this.callParent();
    }
    
    
})