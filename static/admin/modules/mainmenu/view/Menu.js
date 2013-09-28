

Ext.define('MyDesktop.modules.mainmenu.view.Menu', {
    extend: 'Ext.window.Window',

    
    width:700,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    
    
    layout: 'border',
    
    initComponent: function() {
        this.items = [
            Ext.create('MyDesktop.modules.mainmenu.view.ItemsTree', {
               title: D.t('Menu tree'), 
               region: 'center'
               //width: 400,
               
            })
            ,this.buildForm()
        ]
        this.callParent();
    }
    
    ,buildForm: function() {
        var me = this;

        return {
            border: false,            
            title: D.t('Item editor'),
            xtype: 'panel',
            region: 'east',
            width:400,
            split: true,
            layout: 'border',
            collapsible: true,
            items: [
                Ext.create('MyDesktop.modules.mainmenu.view.ItemEditForm', {                    
                    region: 'center'
                })
            ]
        }
        
    }

    

    
    
})
    