/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.pages.controller.Pages', {
    extend: 'MyDesktop.core.Controller',
    id:'pages-win',

    launcher: {
        text: D.t('Pages'),
        iconCls:'pages',
        model: 'pages-PagesModel'
    },
    mainView: 'MyDesktop.modules.pages.view.Pages'
    ,store: 'MyDesktop.modules.pages.store.Store'
    //,detailFormView: 'MyDesktop.modules.templates.view.DetailForm'
    
    ,addControls: function(win) {
        var me = this
    
        me.control(win,{
            '[action=refreshpages]': {click: function(bt) {me.refreshTree(bt)}},
            '[action=formsave]': {click: function() {me.save(win, false)}},  
            '[action=formremove]': {click: function() {me.removePage()}},
            //'[action=lock]': {click: function() {me.lockPage(this)}},
            //'[action=field-lock]': {click: function() {me.lockField(this)}},
            '[action=addblock]': {click: function() {me.addBlock(win)}},
            '[action=viewpage]': {click: function() {me.viewPage(this)}},
            'actioncolumn': {click: function(g, ri, ci, aitm, event, record, raw) {
                me.addPage(record);return false;
            }},
            '[name=blocks-grid]': {
                cellclick: function(th, td, cInd, rec) {me.modifyBlock(rec)}
            },
            'treepanel': {
                'cellclick': function(c, t, ci, r) {me.cellClick(c, t, ci, r);},
                'celldblclick': function(c, t, ci, r) {me.view(r.raw.dir);}
            }
        })
        win.down('treepanel').getView().on('drop', function (m, d, o, p, e) {return me.dropPage(m, d, o, p, e)})
        win.down('treepanel').getView().on('beforedrop', me.beforeDropPage)
        
        win.down('[name=blocks-grid]').getView().on('drop', function() {me.setButtonsDisabled('edit')})
        
        me.populateModels(win)
        
        me.callParent(arguments)
    }
    
    ,populateModels: function(win) {
        var me = this
                
        Core.Ajax.request({
            url: 'models.access:getAllModels',
            succ: function(data) {
                if(data.list) {
                    me.modelsData = []
                    for(var i=0;i<data.list.length;i++) {
                        if(data.list[i].publ) {
                            me.modelsData.push({
                                name: D.t(data.list[i].name), 
                                model: data.list[i].publ
                            })                            
                        }
                    }                    
                }
            }
        })
        
        win.down("[dataIndex=controller]").renderer = function(x) {
            if(x) {
                for(var i=0;i<me.modelsData.length;i++) {
                    if(me.modelsData[i].model == x) return D.t(me.modelsData[i].name)
                    return x
                }
            } else {
                return D.t('Text');
            }            
        }        
    }
    
    ,openRecord: function(rec) {
        var me = this
        
        var w = this.app.createWindow(this)
        
        var form = w.down('form')
        
        me.currentAct = 'edit';

        me.formSetValues(form, rec.data)
        w.down('[name=blocks-grid]').getStore().loadData(rec.data.blocks || [])        
        
        me.setFormToAccess(form, rec.data)
            
        if(rec.data.alias && rec.data.alias != '') me.dirAutoComplite = false
        else me.dirAutoComplite = true    
        
    }
    
    ,cellClick: function ( cell, td, cellIndex, record) {
        var me = this        
        
        if(cellIndex == 4 && record.data.aAccess.modify) {
            
            record.data.access = (record.data.access? false:true)  
            Core.Ajax.request({
                url: 'models.pages:chmod',
                params: {
                    val: record.data.access,
                    _id: record.data.id
                },
                succ:function() {record.commit()}
            })
        }
        if(cellIndex == 5 && record.data.aAccess.modify) {
            record.data.map = (record.data.map? false:true)            
            Core.Ajax.request({
                url: 'models.pages:toSitemap',
                params: {
                    val: record.data.map,
                    _id: record.data.id
                },
                succ:function() {record.commit()}
            })
        }
        
        var opn = function() {
            var form = cell.up('window').down('form')
            
            me.currentRow = record;
            me.currentAct = 'edit';

            record.data._id = (record.data.id == 'root'? record.raw._id:record.data.id)
            me.formSetValues(form, record.data)
            me.mainWin.down('[name=blocks-grid]').getStore().loadData(record.data.blocks || [])        
        
            me.setFormToAccess(form, record.data)
            
            if(record.data.alias && record.data.alias != '') me.dirAutoComplite = false
            else me.dirAutoComplite = true    
        }
        
        var sb = me.mainWin.down('[action=formsave]')
        
        if(!sb || sb.isDisabled()) {
            opn()
        } else {
            Ext.MessageBox.show({
                title: D.t('Save Changes?'),
                msg: D.t('You are closing a data that has unsaved changes. <br />Would you like to save your changes?'),
                buttons: Ext.MessageBox.YESNOCANCEL,
                fn: function(b) {
                    if(b == 'yes') {
                        me.save(me.mainWin, false, function() {opn()}); 
                    } else
                    if(b == 'no') {
                        opn() 
                    }
                },
                animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
            //D.c('','The data has been changed. Save ',[], function() {
            //    opn()
            //})
            
        }
        
        
    }
    
    ,refreshTree: function(bt) {
        bt.up('treepanel').getStore().load()
    }
    
    ,setButtonsDisabled: function(evn) {
        me = this
        if(evn == 'open') {
            me.mainWin.down('[action=viewpage]').setDisabled(false)
            me.mainWin.down('[action=addblock]').setDisabled(false)
        }
        
        if(evn == 'new') {
            me.mainWin.down('[action=viewpage]').setDisabled(true)
            me.mainWin.down('[action=addblock]').setDisabled(false)
        }
        
         if(evn == 'remove') {
            me.mainWin.down('[action=addblock]').setDisabled(true)
        }
        
        this.callParent(arguments)
    }
    
    ,afterSave: function(rec) {
        
        if(rec.block) return true; // если сохраняем блок, то сразу выходим
        
        var me = this,
            form = me.mainWin.down('form')

        if(me.currentRow) {
            if(me.currentAct == 'new') {
                rec.id = rec._id
                rec.aAccess = me.currentRow.data.aAccess
                var p = me.currentRow.parentNode
                me.currentRow.remove()
                me.currentRow = p.appendChild(rec)                
            } else {
                Ext.apply(me.currentRow.data, rec)
                me.currentRow.commit();
            }           

        }
        
        var idf = form.down('[name=_id]')
        if(rec && rec._id && idf.getValue()=='') idf.setValue(rec._id)   
                
        me.setButtonsDisabled('open') 

        if(me.currentRow && me.currentRow.data) me.setFormToAccess(form, me.currentRow.data)
        return false
        
    }
    
    ,addPage: function(record, newrec) {
        
        if(!record.data.aAccess.add) {
            //D.a('Access denied!', "You can't to add new child to the page")
            return;    
        }

        var me = this
            ,form = me.mainWin.down("form")
            ,nameField = form.down('[name=name]')
    
        if(!newrec) {
            newrec = {
                pid: record.raw._id,
                indx: '',
                tpl: record.data.tpl,
                access: record.data.access,
                map: record.data.map,
                alias: '',
                name: D.t('New page'),
                aAccess: record.data.aAccess, 
            }
            newrec.aAccess.modify = true;
            me.currentRow = record.appendChild(newrec)
            me.currentRow.data.indx = me.currentRow.data.index
            newrec.indx = me.currentRow.data.index
        }
      
        me.setFormToAccess(form, newrec);
        
        form = form.getForm()
        form.reset()
        form.setValues(newrec)
        
        me.setButtonsDisabled('new')
        me.currentAct = 'new'
        nameField.focus()
        nameField.selectText()
        me.dirAutoComplite = true
        me.mainWin.down('[name=blocks-grid]').getStore().loadData([])
       
        
    }
    
    ,removePage: function() {
        
        if(this.currentRow && this.currentRow.data.aAccess.del) {
            return;    
        }
        
        var me = this
            ,form = me.mainWin.down("form")
            ,id = form.down("[name=_id]").getValue()
            ,store = me.mainWin.down("treepanel").getStore();
                
        me.removeRows([id], store, function() {
            form.getForm().reset()
            if(me.currentRow) me.currentRow.remove()
            
            me.mainWin.down("[name=blocks-grid]").getStore().loadData([])
            me.setButtonsDisabled('new')
        })    
    }
    
    /*,formFieldsChange: function(fl, val) {
        var me = this
            ,s
    
        if(fl.name == 'name') {
            if(!me.dirField) me.dirField = fl.up('form').down('[name=alias]');            
            if(me.dirAutoComplite) {
                 s = me.dirField.getValue().split('/')
                 
                 if(!!me.transTmr) window.clearTimeout(me.transTmr)
                 
                 me.transTmr = window.setTimeout(function() {
                     D.translate(val, function(v) {
                         //s[s.length-2] = v;
                         me.dirField.setValue(v)//s.join('/'));
                     })
                 }, 2000);
                 
                  
            }
        }

        me.callParent()
    }
    */
    
    ,modifyBlock: function(row, newblk) {           
        
        if(this.currentRow && this.currentRow.data.aAccess.del && row.data.controller) {
            return;    
        }
        
        var win = this.modify(row, 'MyDesktop.modules.pages.view.BlockEditWindow'),
            form = win.down('form')
        //win.record = row
        win.editingBlock = row
        form.getForm().setValues(row.data)
        
        if(newblk || (row.data.controller && row.data.controller != '')) {
            win.down('#block-sets').expand()    
        }
        
    }
    
    ,addBlock: function() {
        var me = this
            ,grid = me.mainWin.down("[name=blocks-grid]")
            ,store = grid.getStore()
            ,rec = {
                id: Sess.makeGuid(),
                block: 1,
                module: '',
                descript: ''
            }
            ,row = store.add(rec)
        me.modifyBlock(row[0], true);

    }
    
    ,beforeSave: function(form, data, callback) {
        var me = this
            ,grid = me.mainWin.down("[name=blocks-grid]")
            ,store = grid.getStore()
        
        data.blocks = []
        
        store.each(function(r) {
            data.blocks.push(r.data)    
        })
    
        if(!data.alias) {
            // Если не указан алиас, переведем его из названия
            D.translate(data.name, function(v) {
                 form.down('[name=alias]').setValue(v)
                 data.alias = v
                 callback(data)
            })
            return false;
        }
    
        return data;
        
    }
    
    ,addFormControls: function(win) {
        var me = this
        
        this.control(win, {
            '[action=close]':{click: function() {win.close()}},
            '[action=remove]':{click: function() {win.editingBlock.store.remove(win.editingBlock);win.close();me.setButtonsDisabled('edit');}},
            '[action=save]':{click: function() {me.blockSave(win, true)}},
            '[action=apply]':{click: function() {me.blockSave(win, false)}}
        }) 
        
        win.down('[name=controller]').getStore().loadData(me.modelsData)
        
    }
    
    ,blockSave: function(win, close) {
        win.editingBlock.data = win.down('form').getValues();
        win.editingBlock.commit();
        if(close) win.close();
        //this.setButtonsDisabled('edit')
        this.save(this.mainWin)
    }
    
    ,viewPage: function(btn) {
        if(this.currentRow && this.currentRow.data.dir) {
            this.view(this.currentRow.data.dir);
        }
    }
    
    ,view: function(dir) {
        window.open(dir, 'view-win');    
    }
    
    ,setDisabledInput: function(btn, log) {
        var el = btn.previousSibling()
        if(el) {
            if(log === null) log = (btn.iconCls == 'lock')
            el.setDisabled(log)
        }
    }
    
    /*,lockPage: function(btn) {        
        var me = this;
        
        (function(status){
            btn.setIconCls(status? 'lock':'unlock')
            var b = btn.up('form').query('[action=field-lock]')
            for(var i=0;i<b.length;i++) {
                b[i].setVisible(status) 
                me.setDisabledInput(b[i], (status? null:false))
            }           
        })(btn.iconCls == 'unlock')
    }
    
    ,lockField: function(btn) {        
        btn.setIconCls(btn.iconCls == 'unlock'? 'lock':'unlock')
        this.setDisabledInput(btn)
    }
    */
    ,beforeDropPage: function (node, data, overModel, pos, x, e) {    
        for(var i=0;i<data.records.length;i++) {
            if(data.records[i].data.aAccess.del) {
                D.a('Access denied!', "You can't move the protected page")
                return false;
            }
        }
    }
    ,dropPage: function (node, data, overModel, pos, e) {         

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
            //new_dir = overModel.data.dir
            //me.currentRow = overModel.appendChild(rec)
        } else {
            rec.pid = overModel.parentNode.internalId
            if(pos == 'before' ) {                
                rec.indx = overModel.data.index
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index, rec)
            } else
            if(pos == 'after') {
                rec.indx = overModel.data.index+1                
                //me.currentRow = overModel.parentNode.insertChild(overModel.data.index+1, rec)
            }
            for(var i=0;i<overModel.parentNode.childNodes.length;i++) {
                indexes[overModel.parentNode.childNodes[i].data.id] = overModel.parentNode.childNodes[i].data.index
            }
        }

        for(var i=0;i<data.records.length;i++) {
            rec._id = data.records[i].data.id
            rec.alias = data.records[i].data.alias
            if(rec._id != rec.pid) {
                recs.push(rec)
            }
        }

        if(recs.length>0) {
            Core.Ajax.request({
                url: 'models.pages:reorder',
                jsonData: {
                    recs:recs,
                    indexes: indexes
                },
                succ:function(out) {
                    if(out && out.data) for(var i = 0;i<out.data.length;i++) {
                        for(var j = 0;j<data.records.length;j++) {
                            if(data.records[j].data.id == out.data[i]._id) {
                                 data.records[j].data.dir = out.data[i].dir
                                 data.records[j].commit()
                                 break;
                            }
                        }
                    } 
                }
            })
            
        } //else e.cancelDrop()
        return true;
    }
    
    ,setFormToAccess: function(form, data) {        
        
        // Закроем от модификации все поля формы
        var els = form.query('field')
        for(var i=0;i<els.length;i++) {
            els[i].setDisabled(!data.aAccess.modify)
        }
        
        // del для страниц означает защиту от опасных изменений:
        // 1) от удаления
        // 2) от изменения шаблонов, пути и блоков с модулями 
        form.down('[name=tpl]').setDisabled(data.aAccess.del)
        form.down('[name=alias]').setDisabled(data.aAccess.del)
        form.down('[action=formremove]').setDisabled(data.aAccess.del)
                
        //var store = form.up('window').down('grid').getStore()
             
        //w.down('[action=addblock]').setDisabled(!data.aAccess.modify)
        //w.down('grid').setDisabled(!data.aAccess.modify)
    }
});

