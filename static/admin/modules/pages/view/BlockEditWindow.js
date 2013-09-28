Ext.define('MyDesktop.modules.pages.view.BlockEditWindow', {
    extend: 'Ext.form.Panel',
    
    titleIndex: 'descript',
    
    region: 'center',
    
    width:740,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'accordion',
    noPin: true,
    
    initComponent: function() {
        this.items = this.buildItems()
        this.tbar = this.buildTbar()

        
        this.callParent();
    }
    
    
    ,buildItems: function() {
        return [{
            title: D.t('Content'),
            xtype: 'panel',
            itemId: 'module-panel',
            collapsible: true,
            layout: 'border',
            items: [{
                xtype: 'tinymce_textarea',
                fieldStyle: 'font-family: Courier New; font-size: 12px;',
                
                region: 'center',
                
                noWysiwyg: false,
                tinyMCEConfig: Config.tinyCfg,
                
                name: 'text'
            }]
            
            
        },{
            title: D.t('Block settings'),
            xtype: 'panel',
            collapsible: true,
            layout: 'anchor',
            bodyStyle: 'padding:10px;',
            itemId: 'block-sets',
            defaults: {
                anchor: '100%',
                xtype: 'textfield',
                labelWidth: 120
            },
            items: this.buildFormItems()
            //,tbar: this.buildFormButtons()
        }]
    }
    
    ,buildTbar: function() {
        return [
            {
                text: D.t('Save'),
                iconCls: 'save',
                action: 'save'
            },
            {
                text: D.t('Apply'),
                //iconCls: 'apply',
                action: 'apply'
            },'-',
            {
                text: D.t('Close'),
                //iconCls: 'close',
                action: 'close'
            },
            '->',
            {
                text: D.t('Remove block'),
                iconCls: 'remove',
                action: 'remove'
            }
            
        ]
    }
    
    ,buildFormItems: function() {
        return [
            {
                fieldLabel: D.t('Block number'),  
                xtype: 'numberfield',
                minValue: 1,
                value: 1,
                name: 'block'
            },
            {
                fieldLabel: D.t('Conten type'),  
                //value: 'MyDesktop.modules.texteditor.controller.Editor',
                name: 'controller'
            },
            {
                fieldLabel: D.t('Description'),   
                name: 'descript'
            },
            {
                inputType: 'hidden',   
                name: 'id'
            }
        ]
    }

        
    
})