/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.StartMenu', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],

    ariaRole: 'menu',

    cls: 'x-menu ux-start-menu',

    defaultAlign: 'bl-tl',

    iconCls: 'user',

    floating: true,

    shadow: true,

    // We have to hardcode a width because the internal Menu cannot drive our width.
    // This is combined with changing the align property of the menu's layout from the
    // typical 'stretchmax' to 'stretch' which allows the the items to fill the menu
    // area.
    width: 300,

    initComponent: function() {
        var me = this, menu = me.menu;
        
        menu = me.checkAccess(menu) 
        
        //console.log(menu)

        me.menu = new Ext.menu.Menu({
            cls: 'ux-start-menu-body',
            border: false,
            floating: false,
            items: menu
        });
        me.menu.layout.align = 'stretch';

        me.items = [me.menu];
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();
        // TODO - relay menu events

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: 'right',
            cls: 'ux-start-menu-toolbar',
            vertical: true,
            width: 100,
            listeners: {
                add: function(tb, c) {
                    c.on({
                        click: function() {
                            me.hide();
                        }
                    });
                }
            }
        }, me.toolConfig));

        me.toolbar.layout.align = 'stretch';
        me.addDocked(me.toolbar);

        delete me.toolItems;
    },

    addMenuItem: function() {
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
    },

    addToolItem: function() {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    },
    
    checkAccess: function(menu) {
        if(!Sess.superuser) {           
            var func = function(items) {
                var i = items.length-1
                    ,model
                while(i>=0) {
                    if(items[i].menu) {
                        items[i].menu.items = func(items[i].menu.items)
                                              
                        if(items[i].menu.items.length == 0) items.splice(i,1)
                        else {
                             // подчистим разделители 
                             var j = items[i].menu.items.length-1, k 
                             while(j>0) {
                                 k = j-1
                                 while(k>=0 && items[i].menu.items[k] == '-') {
                                    items[i].menu.items.splice(k,1)
                                    k--
                                 }
                                 j--
                             }

                             if(items[i].menu.items.length == 0 ||
                                (items[i].menu.items.length == 1 && items[i].menu.items[0] == '-')) {
                                 items.splice(i,1)
                             }
                             
                        }
                    } else if(Sess.modelAccess) {
                        if(items[i].model) {
                            model = items[i].model.split('.')
                            if(model.length == 5) items[i].model = model[2] + '-' + model[4]
                            if(!Sess.modelAccess[items[i].model]) items.splice(i,1)
                        } else if(items[i].controller) {
                            // если в запускателе явно не указана модель,
                            // попробуем ее определить по названию контроллера
                            // 1 вариант: название модели = названию контроллера
                            // 2 вариант: название модели = названию контроллера + 'Model'
                            model = items[i].controller.split('.')
                            if(model.length == 5) {
                                model = model[2] + '-' + model[4]
                                if(!Sess.modelAccess[model] && !Sess.modelAccess[model + 'Model']) 
                                    items.splice(i,1)
                            }
                        }
                    }
                    i--    
                }
                return items
            }            
            return func(menu)
        } 
        return menu
    }
}); // StartMenu
