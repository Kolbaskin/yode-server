

Ext.define('MyDesktop.modules.pages.view.Pages', {
    extend: 'Ext.window.Window',
    
    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],
    
    width:900,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    initComponent: function() {
        this.items = [
            Ext.create('MyDesktop.modules.pages.view.PagesTree', {
               title: D.t('Pages tree'), 
               region: 'center'
               //width: 400,
               
            }),
            this.buildForm()
        ]
        this.callParent();
    }
    
    ,buildForm: function() {
        var me = this;

        return {
            border: false,            
            title: D.t('Page editor'),
            xtype: 'panel',
            region: 'east',
            width:400,
            split: true,
            collapsible: true,
            layout: 'border',
            items: [
                Ext.create('MyDesktop.modules.pages.view.PageEditForm', {                    
                    region: 'center'
                }),
                Ext.create('MyDesktop.modules.pages.view.PageEditBlocks', {                    
                    region: 'south',
                    collapsible: true,
                    height: 200,
                    split: true
                })

            ]
        }
        
    }

    

    
    
})