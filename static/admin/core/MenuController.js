/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.core.MenuController', {
    extend: 'MyDesktop.core.Controller',

    showDir: function(el) {
        var me = this
            ,contr = Ext.create(el.controller)
        contr.app = me.app
        me.app.createWindow(contr)

    },
    
    init: function(options) {
        var me = this
        
        this.launcher = Object.getPrototypeOf(me).launcher
        
        var func = function(obj) {
            if(!obj) return null;
            if(obj === '-') return '-';
            if(obj.menu) {
                for(var i=0;i<obj.menu.items.length;i++) {
                    obj.menu.items[i] = func(obj.menu.items[i])           
                }
                obj.handler = function() {return false;}
            } else {
                obj.handler = function(el) {me.showDir(el)}     
            }
            return obj
        }        
        this.launcher = func(this.launcher)        
    }


});

