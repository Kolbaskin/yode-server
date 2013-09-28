/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.mainmenu.controller.Main', {
    extend: 'MyDesktop.core.Controller',
    id:'mainmenu-win',

    launcher: {
        text: D.t('Main menu'),
        iconCls:'mainmenu',
        model: 'mainmenu-DataModel'
    },
    mainView: 'MyDesktop.modules.mainmenu.view.Menu'
    ,store: 'MyDesktop.modules.mainmenu.store.Store'
    //,detailFormView: 'MyDesktop.modules.templates.view.DetailForm'
    
    ,addControls: function(win) {
        var me = this
    
        me.control(win,{
            '[action=refreshpages]': {click: function(bt) {me.refreshTree(bt)}},
            '[action=formsave]': {click: function() {me.save(win, false)}},  
            '[action=formremove]': {click: function() {me.removePage()}},
            '[action=addblock]': {click: function() {me.addBlock(win)}},
            'actioncolumn': {click: function(g, ri, ci, aitm, event, record, raw) {me.addPage(record);return false;}},
            '[name=blocks-grid]': {celldblclick: function(th, td, cInd, rec) {me.modifyBlock(rec)}},
            'treepanel': {
                'cellclick': function(c, t, ci, r) {me.cellClick(c, t, ci, r);},
                'celldblclick': function(c, t, ci, r) {me.view(r.raw.dir);}
            }
        })
        
        win.down('treepanel').getView().on('beforedrop', function (m, d, o, p, e) {me.dropPage(m, d, o, p, e)}) 
        
        me.callParent(arguments)
    }
    
    ,view: function(dir) {
        if(dir) window.open(dir, 'view-win');    
    }
    
    ,cellClick: function ( cell, td, cellIndex, record) {
        var me = this        
        me.currentRow = record;
        me.currentAct = 'edit';
        me.formSetValues(cell.up('window').down('form'), record.raw)
    }
    
    ,refreshTree: function(bt) {
        bt.up('treepanel').getStore().load()
    }
    
    ,openRecord: function(rec) {
        var me = this
        
        var w = this.app.createWindow(this)
        
        var form = w.down('form')
        
        me.currentAct = 'edit';

        me.formSetValues(form, rec.data)
        
    }
    
    
    ,afterSave: function(rec) {
        var me = this,
            form = me.mainWin.down('form')

        
        if(me.currentRow) {
        
            if(me.currentAct == 'new') {
                rec.id = rec._id
                var p = me.currentRow.parentNode
                me.currentRow.remove()
                me.currentRow = p.appendChild(rec)                
            } else {
                Ext.apply(me.currentRow.data, rec)
                me.currentRow.commit();
            }
            
            

        }
        me.setButtonsDisabled('open') 
        return false
        
    }
    
    ,addPage: function(record, newrec) {
        var me = this
            ,form = me.mainWin.down("form")
            ,nameField = form.down('[name=name]')

        if(!newrec) {
            newrec = {
                pid: record.raw._id,
                indx: '',
                dir: '',
                name: 'New item'
            }
            me.currentRow = record.appendChild(newrec)
        }
        form = form.getForm()
        form.reset()
        form.setValues(newrec)        
        me.setButtonsDisabled('new')
        me.currentAct = 'new'
        nameField.focus()
        nameField.selectText()

    }
    
    ,removePage: function() {
        var me = this
            ,form = me.mainWin.down("form")
            ,id = form.down("[name=_id]").getValue()
            ,store = me.mainWin.down("treepanel").getStore();
                
        me.removeRows([{_id:id}], store, function() {
            form.getForm().reset()
            if(me.currentRow) me.currentRow.remove()
        })    
    }

    
    ,addFormControls: function(win) {
        var me = this
        
        this.control(win, {
            '[action=close]':{click: function() {win.close()}},
            '[action=remove]':{click: function() {win.editingBlock.store.remove(win.editingBlock);win.close();}},
            '[action=save]':{click: function() {me.blockSave(win, true)}},
            '[action=apply]':{click: function() {me.blockSave(win, false)}}
        })            
    }
    
    ,dropPage: function (node, data, overModel, pos, e) {         
        
        var me = this
            ,rec = {
                name: data.records[0].data.name,
                dir: data.records[0].data.dir,
                indx: 0
            }
        
        if(!data.records[0].data.access && data.records[0].data.access !== false) {
        // Перемещение веток внутри себя
            setTimeout(function() {
                me.dropPageSelf(node, data, overModel, pos, e)            
            }, 100)
            return;
        }
        
        
        
        if(pos == 'append') {
        // вставляем в дочерний подуровень         
            rec.pid = overModel.internalId
            me.currentRow = overModel.appendChild(rec)
        } else {
            rec.pid = overModel.parentNode.internalId
            if(pos == 'before' ) {
                rec.indx = overModel.data.index
                me.currentRow = overModel.parentNode.insertChild(overModel.data.index, rec)
            } else
            if(pos == 'after') {
                rec.indx = overModel.data.index+1
                me.currentRow = overModel.parentNode.insertChild(overModel.data.index+1, rec)
            }
            
        }
        
        me.addPage({}, rec)
        me.save(me.mainWin, false)
        

        e.cancelDrop()
    }
    
    ,dropPageSelf: function (node, data, overModel, pos, e) {         

        
        var me = this
            ,rec = {
                //name: data.records[0].data.name,
                //dir: data.records[0].data.dir,
                indx: 0
            }
            ,new_dir
            ,recs = []
            ,indexes = {}
        
        if(pos == 'append') {
        // вставляем в дочерний подуровень         
            rec.pid = overModel.internalId
            new_dir = overModel.data.dir
            //me.currentRow = overModel.appendChild(rec)
        } else {
            rec.pid = overModel.parentNode.internalId
            /*if(pos == 'before' ) {
                rec.indx = overModel.data.index
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index, rec)
            } else
            if(pos == 'after') {
                rec.indx = overModel.data.index+1
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index+1, rec)
            }*/
            for(var i=0;i<overModel.parentNode.childNodes.length;i++) {
                //console.log(overModel.parentNode.childNodes[i].data.name, ':', overModel.parentNode.childNodes[i].data.index)
                indexes[overModel.parentNode.childNodes[i].data.id] = overModel.parentNode.childNodes[i].data.index
            }
        }
        /*
        var prep_dir = function(nd, d) {
            d = d.split('/')
            nd = nd.split('/')
            if(d.length>nd.length) {
                for(var i=1;i<nd.length-1;i++) d[i] = nd[i]    
            }
            return d.join('/')
        }
    */
        //me.addPage({}, rec)
        //me.save(me.mainWin, false)
        for(var i=0;i<data.records.length;i++) {
            rec._id = data.records[i].data.id
            if(rec._id != rec.pid) {
                if(new_dir) {
                    rec.dir = data.records[i].data.dir// = prep_dir(new_dir, data.records[i].data.dir)
                    //data.records[i].commit()
                }
                recs.push(rec)
            }
        }

        if(recs.length>0) {
            Core.Ajax.request({
                url: 'models.pages:menureorder',
                jsonData: {
                    recs: recs,
                    indexes: indexes
                },
                succ:function() {}
            })
            
        } //else e.cancelDrop()
        return true;
    }

});

