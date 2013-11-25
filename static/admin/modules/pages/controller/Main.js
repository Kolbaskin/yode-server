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
            },'-',{
                text: D.t('Rebuilding of search index'),
                iconCls:'refresh',   
                model: 'pages-SearchReindex',
                handler: function() {
                    D.c('Rebuilding of search index', 'Old indexes will be removed. Are You sure?', [], function() {
                        Core.Ajax.request({
                            url:'/search.engine:rebuildAll',
                            callback: function(a1, a2, a3) {
                                D.a('Search index was rebuilt.')
                            }
                        })
                    })
                }
            },{
                text: D.t('Restart server'),
                iconCls:'refresh',   
                model: 'pages-RestartServer',
                handler: function() {
                    D.c('Server restarting', 'Are You sure?', [], function() {
                        Core.Ajax.request({
                            url:'/admin.models.access:restartServer',
                            callback: function(a1, a2, a3) {
                                
                            }
                        })
                    })
                }
            }]
        }
    }
    


});

