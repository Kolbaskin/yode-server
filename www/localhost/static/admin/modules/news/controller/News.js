/**
 * 
 * News module for yode-server
 * 
 * controller
 * ver 0.0.1
 * 
 * Copyright 2013
 * 
 */

Ext.define('MyDesktop.modules.news.controller.News', {
    extend: 'MyDesktop.core.Controller'
    
    ,id:'news-win' // If you specify a window identifier, it only appears in one copy
    
    ,launcher: {
        text: D.t('News'),
        iconCls:'news'
    }
    
    ,addFormControls: function(win) {
        var me = this    
        me.control(win,{
            '[action=upload]':{change: function(th, val) {me.upload(win, th)}},
            '[action=removePhoto]':{click: function(th, val) {me.delPhoto(win)}}
        })
        me.callParent(arguments)
    }
    
    ,delPhoto: function(win) {
        var g = win.down('grid')
            ,sm = g.getSelectionModel()        
        g.getStore().remove(sm.selected.items) 
    }
    
    ,upload: function(win, inp) {        
        var me = this
        if(inp.fileInputEl.dom.files.length>0) {
            Core.Ajax.uploadFiles(inp.fileInputEl.dom.files, '/admin.models.fileOperations:upload/', function(data) {
                if(data && data.length) {
                    var s = win.down('grid').getStore();
                    for(var i=0;i<data.length;i++) {
                        s.add({preview: '/tmp/'+data[i].name+'_small', img: data[i].name});
                    }                    
                }
            })                    
        }
    }
    
    ,beforeSave: function(form, data) {        
        var stor = form.down("grid").getStore()
        data.photos = []
        stor.each(function(r) {
            data.photos.push(r.data)
        })
        return data        
    }
    
    ,beforeModify: function(form, data) {
        var store = form.down('grid').getStore()
        store.removeAll();
        if(data.photos) {
            for(var i=0;i<data.photos.length;i++) {
                store.add({preview:data.photos[i].preview, img: null, num: i})    
            }
        }       
    }
    
    ,detailFormReconfig: function(cnf) {
          cnf.layout = 'border'
          cnf.width = 800
          cnf.height = 350
          cnf.tools = null
          return cnf
    }

});

