Ext.define('MyDesktop.modules.profile.view.ProfileWindow', {
    extend: 'Ext.window.Window'
    
    ,width: 550
    ,height: 290
    ,layout: 'border'
    
    ,requires: [
        'MyDesktop.core.widgets.ImageField'
    ]
    
    
    ,initComponent: function() {
        this.items = [{
            xtype: 'form',
            defaults: {
                margin: '5',
                xtype: 'fieldcontainer'                
            },
            region: 'center',
            layout: 'column',
            items: [
                this.buildPhotoBlock(),
                this.buildFormFolders()
            ]
        }]
        this.buttons = this.buildButtons()
        this.callParent();
        
    }
    ,buildPhotoBlock: function() {
        return {
            //title: '',
            collapsible: false,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%',
                margin: '5'
            },
            layout: 'anchor',
            width: 150,
            items:[{      
                xtype: 'imagefield',
                hideLibel: true,
                tumbSizes: '115x',
                height: 115,
                width: 115,
                name: 'photo'
            }]
        }
    }
    
    ,buildFormFolders: function() {
        return {
            //title: '',
            columnWidth: 1,
            collapsible: false,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%',
                msgTarget: 'under',
                margin: '5'
            },
            layout: 'anchor',
            items:[
            {
                name: 'login',
                busyText: D.t('This login name is busy!'),
                fieldLabel: D.t('Login')
            },{
                name: 'pass',
                inputType: 'password',
                fieldLabel: D.t('Password')
            },
            {
                name: 'fname',
                fieldLabel: D.t('Surname')
            },
            {
                name: 'name',
                fieldLabel: D.t('Name')
            },
            {
                name: 'phone',
                fieldLabel: D.t('Phone')
            },
            {
                name: 'email',
                fieldLabel: D.t('Email')
            }
            
            ]
        }
    }
    
    ,buildButtons: function() {
        return [
            {text: D.t('Save'), action: 'formsave'},
            {text: D.t('Apply'), action: 'formapply'},
            '-',
            {text: D.t('Close'), action: 'formclose'}
        ]    
    }
    
})