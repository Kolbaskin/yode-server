Ext.define('MyDesktop.modules.pages.view.PagesTree', {
    extend: 'Ext.tree.Panel',
    
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
    ],    
    
    viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop',
                containerScroll: true,
                enableDrag: true,
                enableDrop: true
                ,appendOnly: false
                ,displayField: 'name'
                
            }
    },
    
    //useArrows: true,
    multiSelect: false,
    //singleExpand: true,
    rootVisible: true,
    
    initComponent: function() {
        var me = this
        
        
        Ext.apply(this, {
            
            store: Ext.create('MyDesktop.modules.pages.store.Store'),
            tbar: me.buildButtons(),
            columns: me.buildColumns()
        });
        this.callParent();
    }
    
    ,buildColumns: function() {
        return [{
                xtype: 'treecolumn',
                text: D.t('Page'),
                flex: 1,
                //sortable: true,
                dataIndex: 'name'
            },{
                text: D.t('Web path'),
                flex: 1,
                dataIndex: 'dir'
                //,sortable: true
            },{
                text: D.t('Last modified'),
                width: 110,
                renderer : Ext.util.Format.dateRenderer('d.m.y H:i'),
                dataIndex: 'mtime'
                //,sortable: true
            }, {
                text: D.t('Add'),
                width: 65,
                menuDisabled: true,
                xtype: 'actioncolumn',
                tooltip: D.t('Add page'),
                align: 'center',
                renderer: function(v, m, r) {
                    if(!r.data.aAccess.add) return ''
                    m.tdCls = 'add'
                }
            },{
                text: D.t('Access'),
                width: 65,
                dataIndex: 'access',
                menuDisabled: true,
                renderer: function(v, m) {
                    m.tdCls = 'page-'+(v === true? 'private':'shared')
                    //alert(m.tdCls);
                }
            },{
                text: D.t('Sitemap'),
                width: 65,
                dataIndex: 'map',
                menuDisabled: true,
                renderer: function(v, m) {
                    m.tdCls = (v === true? 'page-in-map':'')
                    //alert(m.tdCls);
                }
            }]
    }
    
    ,buildButtons: function() {
        return [/*{
            text: D.t('Add'),
            tooltip: D.t('Add a new page to root layer'),
            iconCls:'add',
            action: 'addpage'
        }, */{
            text: D.t('Refresh'),
            tooltip:D.t('Refresh pages tree'),
            iconCls:'refresh',
            action: 'refreshpages'
        }]
    }
});