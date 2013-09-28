/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.pages.controller.Main', {
    extend: 'MyDesktop.core.MenuController',
    
    launcher: {
        text: D.t('Управление сайтом'),
        iconCls:'pages',
        menu: {
            items: [                    
            {
                text: D.t('Управление страницами'),
                iconCls:'pages',
                controller: 'MyDesktop.modules.pages.controller.Pages'
            },{
                text: D.t('Структура меню'),
                iconCls:'mainmenu',
                controller: 'MyDesktop.modules.mainmenu.controller.Main'
            },{
                text: D.t('Шаблоны страниц'),
                iconCls:'templates',
                controller: 'MyDesktop.modules.templates.controller.Templates'
            },{
                text: D.t('Менеджер файлов'),
                iconCls:'filemanager',
                controller: 'MyDesktop.modules.filemanager.controller.fm'
            }]
        }
    }
    


});

