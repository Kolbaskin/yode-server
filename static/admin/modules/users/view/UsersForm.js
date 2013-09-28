Ext.define('MyDesktop.modules.users.view.UsersForm', {
    extend: 'MyDesktop.core.DetailForm',
    
    titleIndex: 'login',
    
    buildItems: function() {
        return [
        {
            name: 'login',
            fieldLabel: D.t('Login')
        },
        {
            name: 'email',
            fieldLabel: D.t('Email')
        },
        {
            name: 'pass',
            inputType: 'password',
            fieldLabel: D.t('Password')
        },
        this.buildGroupCombo()
        ]
    }
    
    ,buildGroupCombo: function() {
        return {
            xtype: 'combo',
            name: 'group',
            fieldLabel: D.t('Access group'),
            valueField: '_id',
            displayField: 'name',
            queryMode: 'local',
            store: Ext.create('MyDesktop.core.ComboStore', {url: 'model:getdata/MyDesktop.modules.users.model.GroupsModel'})
        }
    }
})