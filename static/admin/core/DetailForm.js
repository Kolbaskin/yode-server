Ext.define('MyDesktop.core.DetailForm', {
    extend: 'Ext.form.Panel',
    
    defaults: {
        labelWidth: 90,
        xtype: 'textfield',
        margin: '5'
    },
        
    initComponent: function() {        
        this.items = this.buildItems() 
        
        this.items.push({xtype: 'textfield', name: '_id', region: 'west', inputType:'hidden'})
        
        this.tbar = this.buildTbar()        
        this.buttons = this.buildButtons()        
        this.callParent();
    }
    
    ,buildItems: function() {
        return []
    }
    
    ,buildTbar: function() {
        return null
    }
    
    ,buildButtons: function() {
        return [
            {text: D.t('Save'), action: 'formsave'},
            {text: D.t('Apply'), action: 'formapply'},
            '-',
            {text: D.t('Close'), action: 'formclose'}
        ]    
    }
    
    ,setValues: function(row) {
        this.getForm().setValues(row)    
    }
})