Ext.define('MyDesktop.modules.users.view.GroupsForm', {
    extend: 'MyDesktop.core.DetailForm',
    
    titleIndex: 'name',
    width: 550,
    height: 400,
    region: 'center',
    layout: 'border',
    defaults: {
        margin: '0',
    }
    
    ,buildItems: function() {
        var me = this;
        
        return [{
            xtype: 'tabpanel',
            region: 'center',
            items: [
                me.buildForm(),
                me.modulesAccessTree(),
                me.pagesAccessTree()
            ]
        }]
    }
    
    ,buildForm: function() {
        return {
            xtype: 'panel',
            title: D.t('Description'),
            defaults: {
                xtype: 'textfield',
                margin: '5',
                width: 500,
                labelWidth: 200
            },
            items: [
            {
                name: 'name',
                fieldLabel: D.t('Group name')
            },{
                name: 'description',
                fieldLabel: D.t('Description')
            }]
        }
    }
    
    ,modulesAccessTree: function() {
        return {
            xtype: 'grid',
            action: 'model-access',
            title: D.t('Modules'),
            store: Ext.create("Ext.data.Store", {
                fields: ['name', 'hname', 'read', 'add', 'modify', 'del']                
            }),
            columns: [
                {   
                    text: D.t("Model name"),
                    flex: 1,
                    menuDisabled: true,
                    sortable: true,
                    dataIndex: 'hname'
                    //,renderer: function(v) {return D.t(v)}
                },{   
                    text: D.t("Read access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'read'
                },{   
                    text: D.t("Add access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'add'
                },{   
                    text: D.t("Modify access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'modify'
                },{   
                    text: D.t("Delete access"),
                    xtype : 'checkcolumn',
                    sortable: false,
                    menuDisabled: true,
                    width: 80,
                    dataIndex: 'del'
                }
            ]
        }
    }
    
    ,pagesAccessTree: function() {
        return Ext.create('MyDesktop.modules.users.view.AccessPagesTree', {
            title: D.t('Pages')
        })
    }
})