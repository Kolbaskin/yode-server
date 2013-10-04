/**
 * 
 * News module for yode-server
 * 
 * grid view
 * ver 0.0.1
 * 
 * Copyright 2013
 * 
 */

Ext.define('MyDesktop.modules.news.view.NewsList', {
    extend: 'MyDesktop.core.GridWindow'
    
    ,filterbar: true  // adding filters bar
    
    ,buildColumns: function() {
        return [{
                xtype: 'datecolumn',
                text: D.t("Date to publish"),
                width: 120,
                sortable: true,
                dataIndex: 'datepubl',
                filter: 'date'
            },{
                xtype: 'datecolumn',
                text: D.t("Date to unpublish"),
                width: 120,
                sortable: true,
                dataIndex: 'dateunpubl',
                filter: 'date'
            },{                    
                text: D.t("Title"),
                flex: 1,
                sortable: true,
                dataIndex: 'title',
                filter: true
            },this.topNewColumn()
            
        ]        
    }
    
    ,topNewColumn: function() {
        
        return {
            text: D.t("Top new"),
            width: 80,
            sortable: true,
            xtype: 'booleancolumn',
            dataIndex: 'ontop',
            filter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.ArrayStore',{
                    data: [[true, D.t('Top news')], ['', D.t('All news')]],
                    fields:['key','name']
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'key',
            }
            ,renderer: function(v) {
                if(v) return 'TOP'
                return ''
            }
        }
    }
    
})