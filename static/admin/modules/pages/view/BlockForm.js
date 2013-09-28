Ext.define('MyDesktop.modules.users.view.UserForm', {
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
        }
        ]
    }
    
})