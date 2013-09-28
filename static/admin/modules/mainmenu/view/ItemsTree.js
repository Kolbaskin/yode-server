Ext.define('MyDesktop.modules.mainmenu.view.ItemsTree', {
    extend: 'Ext.tree.Panel',
    
    viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop'
                ,containerScroll: true
                //,enableDrag: true
                ,enableDrop: true
                ,appendOnly: false
            }
    },
    
    //useArrows: true,
    multiSelect: false,
    //singleExpand: true,
    rootVisible: true,
    
    initComponent: function() {
        var me = this
        
        
        Ext.apply(this, {
            
            store: Ext.create('MyDesktop.modules.mainmenu.store.Store'),
            tbar: me.buildButtons(),
            columns: [{
                xtype: 'treecolumn',
                text: D.t('Menu'),
                flex: 1,
                //sortable: true,
                dataIndex: 'name'
            },{
                text: D.t('Web path'),
                flex: 1,
                dataIndex: 'dir'
                //,sortable: true
            },{
                text: D.t('Add'),
                width: 55,
                menuDisabled: true,
                xtype: 'actioncolumn',
                tooltip: D.t('Add page'),
                align: 'center',
                iconCls: 'add'/*
                ,handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                    Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : '') , record.get('task'));
                }*/
                // Only leaf level tasks may be edited
                /*,isDisabled: function(view, rowIdx, colIdx, item, record) {
                    return !record.data.leaf;
                }*/
            }]
        });
        this.callParent();
    }
    
    ,buildButtons: function() {
        return [/*{
            text: D.t('Add'),
            tooltip: D.t('Add a new page to root layer'),
            iconCls:'add',
            action: 'addpage'
        }, */{
            text: D.t('Refresh'),
            tooltip: D.t('Refresh pages tree'),
            iconCls:'refresh',
            action: 'refreshpages'
        }]
    }
});