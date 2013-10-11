

Ext.define('MyDesktop.core.GridWindow', {
    extend: 'Ext.window.Window',    
    
    width:740,
    height:480,
    animCollapse:false,
    constrainHeader:true,
    layout: 'border',
    
    requires: [
        'Ext.util.Format',
        'Ext.grid.RowNumberer',
        'Ext.ux.form.SearchField'
        ,'Ext.ux.form.field.ClearButton'
        ,'Ext.ux.form.field.OperatorButton'
        ,'Ext.ux.grid.column.ActionPro'
        ,'Ext.ux.grid.FilterBar'
        ,'Ext.ux.grid.AutoResizer'
    ],
        
    initComponent: function() {
    
        this.store = this.createStore() //Ext.create(this.store)
        this.items = this.buildItems()
                
        
        this.callParent();
    }
    
    ,createStore: function() {
        if(this.store) return Ext.create(this.store)
        
        var modelName = (this.model || Object.getPrototypeOf(this).$className.replace('.view.','.model.').replace(/List$/,'Model'))
        
        return Ext.create('MyDesktop.core.Store', {
            filterParam: 'q',
            remoteFilter: false,
            modelPath: modelName        
        })
        
    }
    
    ,buildItems: function() {
        var me = this;

        var grid = {
            border: true,
            xtype: 'grid',
            
            region: 'center',
            name: 'main-grid',
            loadMask: true,
            multiSelect: true,
            tbar: me.buildTbar(),
            bbar: me.buildBbar(),
            /*viewConfig: {
                trackOver: false
            },*/
            store: me.store
            
        }
        
        if(this.filterbar) {            
            grid.columns = {
                plugins: [{
        			ptype: 'gridautoresizer'
				}],
                items: me.buildColumns()
            }
            
            grid.plugins = [{
            	ptype: 'filterbar',
	        	renderHidden: false,
	        	showShowHideButton: true,
	        	showClearAllButton: true
			}]
        } else {
            grid.columns = me.buildColumns()                
        }
        
        return grid
        
    }
    
    ,buildTbar: function() {
        return [{
            text: D.t('Add'),
            tooltip: D.t('Add a new row'),
            iconCls:'add',
            action: 'add'
        }, '-', {
            text:D.t('Refresh'),
            tooltip:D.t('Refresh data'),
            iconCls:'refresh',
            action: 'refresh'
        },'->',{
            text:D.t('Remove'),
            tooltip:D.t('Remove the selected item'),
            iconCls:'remove',
            action: 'remove'
        }]
    }

    ,buildBbar: function() {
        if(this.filtrable || this.filterable) // ну, да, ошибся немного, но не переделывать же кучу готовых модулей с этим свойством)
            return [{
                width: 400,
                fieldLabel: D.t('Search'),
                labelWidth: 50,
                xtype: 'searchfield',
                store: this.store
            }]
        
        return null
    }
    
    
})