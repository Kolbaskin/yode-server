/*!
 * Wpier
 * Copyright(c) 2013
 * 
 * 
 */

Ext.define('MyDesktop.modules.profile.controller.Profile', {
    extend: 'MyDesktop.core.Controller',
    id:'profile-win',

    launcher: {
        text: D.t('User profile'),
        iconCls:'profile'        
    },
    
    modelsAll: null,
    
    mainView: 'MyDesktop.modules.profile.view.ProfileWindow',
    store: 'MyDesktop.modules.profile.store.ProfileStore'
    
    ,createWindow: function() {
        var me = this
        Core.Ajax.request({
            url: 'model:myinfo/',
            succ: function(data) {
                data.pass = ''
                data.photo = '/admin.models.fileOperations:getimage/admin_users/' + data._id + '/photo/0/img/'
                me.mainWin.down('form').getForm().setValues(data)
            }
        })
        return this.callParent();
    }
    
    ,addFormControls: function(win) {        
        var me = this        
        this.control(win, {
            "[name=login]": {
                change: function(el, val) {
                    me.checkLogin(el, val)                    
                }
            }
        })        
        this.callParent(arguments);
    }
    
    ,checkLogin: function(el, val) {
        var me = this
        Core.Ajax.request({
            url: '/admin.models.access:checklogin',
            params: {
                login: val
            },
            succ: function(data) {
                
                var o
                
                if(data && data.result) {
                    el.validator = function() {return true;}
                    el.clearInvalid()
                    o = me.mainWin.down('[action=formsave]')
                    if(o) o.setDisabled(false)
                    o = me.mainWin.down('[action=formapply]')
                    if(o) o.setDisabled(false)                    
                } else {                    
                    el.validator = function() {return el.busyText;}
                    el.markInvalid(el.busyText)
                    o = me.mainWin.down('[action=formsave]')
                    if(o) o.setDisabled(true)
                    o = me.mainWin.down('[action=formapply]')
                    if(o) o.setDisabled(true)
                }
            }
        })
    }
    
    ,addControls: function(win) {        
        this.addFormControls(win)
    }
    
    
});

