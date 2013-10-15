/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.core.Controller', {
    extend: 'Ext.ux.desktop.Module',
    requires: ['MyDesktop.core.ExtraIcons'],
    
    mainWin: null,
    
    init: function() {
        if(!this.mainView) {
            var name = this.getControllerName().replace('.controller.', '.view.')
            this.detailFormView = name + 'Form'
            this.mainView = name + 'List'
        }
        
        if(this.model && this.launcher) {
            this.launcher.model = this.model
        }
        
        this.getAccessRights()
        
        
    },
    
    // Запросим данные о правах доступа пользователя на этот модуль
    getAccessRights: function() {        
        var me = this 
            ,model = (this.model || this.getControllerName().replace('.controller.', '.model.'))      
        
        Core.Ajax.request({
            url: 'models.access:checkAccess2Model//' + model + '/',
            succ: function(r) {
                me.accessRights = r 
                me.setAccessControls(r)    
            }
        })
    },
    
    // Настройка интерфейса в соответствии с правами
    setAccessControls: function(rights) {
        var me = this
            ,o

        if(rights && me.mainWin) {
            if(!rights.add) {
                o = me.mainWin.down("[action=add]")
                if(o) o.ownerCt.remove(o)
                o = me.mainWin.down("[action=formapply]")
                if(o) o.ownerCt.remove(o)
                o = me.mainWin.down("[action=formsave]")
                if(o) o.ownerCt.remove(o)
            }
            
            if(!rights.del) {
                o = me.mainWin.down("[action=remove]")
                if(o) o.ownerCt.remove(o)
            }

        }
    },
    
    getControllerName: function() {
        return Object.getPrototypeOf(this).$className
    },

    createWindow : function(){
        var me = this,
            desktop = this.app.getDesktop(),
            win = desktop.getWindow(me.id),
            state = Sess.getState(me.id);
                
        if(!win){
            
            var sets = Sess.getState(me.id)
            win = desktop.createWindow({
                id: me.id,
                title: me.launcher.text, 
                maximized: (sets && sets.maximize),
                iconCls: me.launcher.iconCls
            }, me.mainView);

            me.addControls(win)
            me.mainWin = win
            
            setTimeout(function() {                
                win.on('maximize', function() {Sess.setState(me.id,{maximize: true})})
                win.on('resize', function(th, w, h) {Sess.setState(me.id,{maximize: false})})
                    //win.on('move', function(th, x, y) {Sess.setState(me.id,{maximize: false, x:x, y:y})})
                
            }, 100)
            
            if(sets && sets.formPin && me.detailFormView) {
                me.pinDetailForm(null, me.detailFormView)  
            }
        }
        
        
        
        return win;
    }
   
    ,addControls: function(win) {
        
        var me = this
        
        me.control(win,{
            
            "[action=add]": {click: function() {me.add()}},
            "[action=refresh]": {click: function() {me.refresh()}},
            "[action=remove]": {click: function() {me.remove()}}, 
            'form field': {change: function(fl, v) {me.formFieldsChange(fl,v);}},
            "grid": {
                celldblclick: function(cell, td, i, rec) {
                    if(!me.innerDetailForm) me.modify(rec, null)
                    else me.innerDetailForm.expand()                    
                },
                cellclick: function(cell, td, i, rec) {
                    if(me.innerDetailForm) me.modifyInside(rec)
                }
            } 
        })
    }
    
    ,addFormControls: function(win) {
        var me = this
        
        me.setAccessControls(me.accessRights)
        
        me.control(win,{
            "[action=formsave]": {click: function() {me.save(win, true)}},
            "[action=formapply]": {click: function() {me.save(win, false)}},
            "[action=formclose]": {click: function() {win.close()}} 
        })
    }
    
    ,logEdit: true
    
    ,setButtonDisabled: function(selector, disable) {
        var el = this.mainWin.down(selector)
        if(el) el.setDisabled(disable)
    }
    
    ,setButtonsDisabled: function(evn) {
        var me = this          
        
        if(evn == 'open') {
            me.setButtonDisabled('[action=formsave]',true)
            me.setButtonDisabled('[action=formremove]',false)
        }
        
        if(evn == 'new') {
            me.setButtonDisabled('[action=formsave]',true)
            me.setButtonDisabled('[action=formremove]',true)
        }
        
        if(evn == 'edit') {
            me.setButtonDisabled('[action=formsave]',false)
        }
        

    }
    
    ,formFieldsChange: function(fl) {
        if(this.logEdit) this.setButtonsDisabled('edit')
    }
    
    ,formSetValues: function(form, data) {
        if(form) {
            this.logEdit = false;
            this.setButtonsDisabled('open')
            form.getForm().setValues(data)  
            this.logEdit = true;
        }
    }
    
    ,add: function() {
        
        if(this.innerDetailForm) {
            var g = this.mainWin.down('grid')
                ,s = (g? g.getStore():null)
            if(s) {
                this.innerDetailForm.expand()
                this.modifyInside(null, true)
            }
        } else
            this.modify({}, null, true)
        
    }
    
    ,modifyInside: function(rec, innerCall) {        
        
        if(!innerCall && this.accessRights && !this.accessRights.modify) return;
        
        this.innerDetailForm.record = rec
       
        if(!!this.beforeModify && this.beforeModify(this.innerDetailForm, (rec && rec.data? rec.data:{})) === false) return false;
        
        if(rec) this.innerDetailForm.setValues(rec.data);
        else this.innerDetailForm.getForm().reset()
        
        var t = this.innerDetailForm.down('textfield')
        if(t) t.focus()
        
    }
    
    ,modify: function(rec, formClassName, innerCall) {
        
        if(!innerCall && this.accessRights && !this.accessRights.modify) return;
        
        if(!rec.data) rec.data = {}
        
        var me = this
            ,desktop = this.app.getDesktop()
            ,wid = me.id+(rec.data._id || 'new')
            ,win = desktop.getWindow(wid);
                        
        if(!win) {
            
            var form = Ext.create(formClassName || me.detailFormView)
                ,titleIndx = form.titleIndex || 'name'
                ,tools = (form.noPin? null:[{
                    type: 'pin',//toparentwin',
                    //scope: this,
                    handler: function() {me.pinDetailForm(win)}
                }]);
                         
            form.record = rec 
            
            var wcnf = {
                id: wid,
                title: (rec.data[titleIndx] || D.t('blank'))+' - '+me.launcher.text, 
                iconCls: me.launcher.iconCls,
                //resizable: false,
                //maximizable: false,
                items: form,
                tools:tools
                ,
                layout: 'fit'
            }
            
            if(!!me.detailFormReconfig) wcnf = me.detailFormReconfig(wcnf)
                                    
            win = desktop.createWindow(wcnf).show();
            
            me.addFormControls(win)
         
            if(!!me.beforeModify && me.beforeModify(form, rec.data) === false) return false;
            
            if(!!form.setValues) form.setValues(rec.data);
            else {
                var inForm = form.down('form')
                if(inForm && !!inForm.setValues) inForm.setValues(rec.data);
            }
            
        } else {
            win.show()  
        }
        return win
    }
    
    ,remove: function(win) {
        var grid = this.mainWin.down('[name=main-grid]')
            ,me = this
            ,store = grid.getStore()
            ,sm = grid.getSelectionModel()
            ,data = [];
                
        if(sm.selected.length>0) {
            
            for(var i=0;i<sm.selected.length;i++) {
                data.push(sm.selected.items[i].data._id) 
            }
            
            me.removeRows(data, store, function() {
                sm.deselect(sm.selected.items);
                store.load()
            })


        }
        
    }
    
    ,removeRows: function(data, store, callback) {
        var me = this
        if(data.length>0) {            
            D.c('Deleding','Delete %s row(s)?',[data.length], function() {
                
                var modelName = me.getModelName(store)
                
                if(modelName) {
                    Core.Ajax.request({
                        url: 'model:del/' + modelName,
                        jsonData: data,
                        succ: function(data) {
                            if(callback) callback()
                        }
                    })
                }
            })
            return true
        }
        return false
    }
    
    ,refresh: function() {
        var grid = this.mainWin.down('grid')
            
        if(grid) grid.getStore().load();
    }
    
    ,getModelName: function(store) {
        if(store) {
            var proto = Object.getPrototypeOf(store)
            if(proto.modelPath) return proto.modelPath
        } 
        if(this.model) return this.model
        return Object.getPrototypeOf(this).$className.replace('.controller.','.model.') + 'Model'
    }
    
    ,save: function(win, closewin, callback) {
        var me = this,
            form = win.down('form');
            data = {},
            store = null;
       
        if(form) {
            data = form.getForm().getValues()    
        }

        var saveF = function(data) {
            if(me.store) store = Ext.create(me.store) 
            else {
                if(win.store) {
                    store = win.store
                } else if(me.mainWin) {
                    var grid = me.mainWin.down('grid')
                    if(grid) store = grid.getStore()
                }
            }
            
            var modelName = me.getModelName(store)
     
            Core.Ajax.request({
                url: 'model:save/' + modelName,
                jsonData: data,
                succ: function(data) {               
                
                    if(!! me.afterSave && me.afterSave(data.record) === false) {
                        if(callback) callback(data)
                        return;
                    }
    
                    if(store) store.load(); 
    
                    if(form && form.record) {
                        form.record.data =  data.record;
                        if(!!form.record.commit) form.record.commit();
                    }
                    if(closewin) win.close()
                    else {
                        var idf = form.down('[name=_id]')
                        if(data.record && data.record._id && idf.getValue()=='') idf.setValue(data.record._id)   
                        me.setButtonsDisabled('open')                    
                    }
                        
                    if(callback) callback(data)
                }
            })
        }
        
        if(!!me.beforeSave) {
            // beforeSave может вернуть результат или ретурном или
            // в калбэк. В случае калбэка, в ретурн нужно отправить false
            var d = me.beforeSave(form, data, function(data) {
                if(data === false) return false;
                saveF(data);
            })
            if(d === false) return false;
            saveF(d);
        } else {
            saveF(data);    
        }      
    }
        
    ,pinDetailForm: function(win, formCls) {
        var me = this
            ,form
            ,fconf = {
                region: 'south', 
                height: 200, 
                split: true,
                collapsible: true,
                title: D.t('Row Editor'),
                tools:[
                    {
                        type: 'unpin',//toparentwin',
                        scope: this,
                        handler: function() {me.unpinDetailForm()}
                    }
                ],
                buildButtons: function() {return null},
                buildTbar: function(){
                    if(this.buildButtonsPined) return this.buildButtonsPined()
                }                
            }
        
        if(formCls) {
            form = fconf = Ext.create(formCls, fconf)
        } else {
            form = win.down('form')           
            fconf = form.cloneConfig(fconf)
        }
        
        me.mainWin.insert(0, fconf)
        me.addFormControls(me.mainWin)
        me.innerDetailForm = me.mainWin.down('form')
        me.innerDetailForm.setValues(form.getValues())
        me.innerDetailForm.record = form.record
        if(win) win.close();
        Sess.setState(me.id,{formPin: true})
    }
    
    ,unpinDetailForm: function() {
        var form = this.mainWin.down('form');
        
        if(form.record) {
            this.modify(form.record)
        }  
        this.mainWin.remove(form)
        this.innerDetailForm = null
        Sess.setState(this.id,{formPin: false})
    }
   
});

