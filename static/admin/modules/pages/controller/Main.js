/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.pages.controller.Main', {
    extend: 'MyDesktop.core.MenuController',
    
    launcher: {
        text: D.t('Site tools'),
        iconCls:'pages',
        menu: {
            items: [                    
            {
                text: D.t('Pages'),
                iconCls:'pages',
                controller: 'MyDesktop.modules.pages.controller.Pages'
            },{
                text: D.t('Main menu'),
                iconCls:'mainmenu',
                controller: 'MyDesktop.modules.mainmenu.controller.Main'
            },{
                text: D.t('Templates'),
                iconCls:'templates',
                controller: 'MyDesktop.modules.templates.controller.Templates'
            },{
                text: D.t('File manager'),
                iconCls:'filemanager',
                controller: 'MyDesktop.modules.filemanager.controller.fm'
            }]
        }
    }
    


});

