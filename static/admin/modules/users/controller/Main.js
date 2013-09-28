/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.users.controller.Main', {
    extend: 'MyDesktop.core.MenuController',
    id:'users-menu-win',    
    launcher: {
        text: D.t('Users'),
        iconCls:'users',        
        menu: {
            items: [{
                text: D.t('Admins'),
                iconCls:'user-admin',
                controller: 'MyDesktop.modules.users.controller.Users'
            },{
                text: D.t('Admins groups'),
                iconCls:'user-group',
                controller: 'MyDesktop.modules.users.controller.Groups'
            },{
                text: D.t('User logs'),
                iconCls:'logs',
                controller: 'MyDesktop.modules.logs.controller.Logs'
            },'-',{
                text: D.t('Users on site'),
                iconCls:'user-publ',
                controller: 'MyDesktop.modules.users.controller.PublUsers'
            }]
        }
    }        
});

