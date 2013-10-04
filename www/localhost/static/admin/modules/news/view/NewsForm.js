/**
 * 
 * News module for yode-server
 * 
 * form view
 * ver 0.0.1
 * 
 * Copyright 2013
 * 
 */

Ext.define('MyDesktop.modules.news.view.NewsForm', {
    extend: 'MyDesktop.core.DetailForm'
    
    ,titleIndex: 'title' // field name to show in the form title
    
    ,region: 'center'
    ,layout: 'border'
    
    ,defaults: {
        margin: '0',
    }
        
    ,buildItems: function() {
        var me = this;
        
        return [{
            xtype: 'tabpanel',
            region: 'center',
            items: [
                me.buildForm(),
                me.buildFotos(),
                me.buildDescript()
            ]
        }]    
    }
    
    ,buildForm: function() {
        return {
            xtype: 'panel',
            title: D.t('Mail info'),
            layout: 'anchor',
            defaults: {
                xtype: 'textfield',
                margin: '5',
                anchor: '100%',
                //width: 500,
                labelWidth: 150
            },
            items: this.buildFormItems()
        }   
    }
    
    ,buildFormItems: function() {
        return [{
            name: 'title',
            fieldLabel: D.t('Headline news')
        },{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            hideLabel: true,
            defaults: {
                width: 300,
                labelWidth: 150,
                xtype: 'datefield'
            },
            items:[{
                name: 'datepubl',
                margin:'0 20 0 0',
                fieldLabel: D.t('Dete of publication'),
                value: new Date()
            },{
                name: 'dateunpubl',
                fieldLabel: D.t('Dete of unpublication')
            }]
        },{
            name: 'shorttext',
            xtype: 'textarea',
            height: 100,
            fieldLabel: D.t('Short text')
        },{
            name: 'ontop',
            xtype: 'checkbox',
            fieldLabel: D.t('Top news')
        }]
        
    }
    
    ,buildFotos: function() {
        return {
            title: D.t('Photo'),
            xtype: 'grid',
            tbar: [
                {
                    xtype: 'filefield',
                    msgTarget: 'side',
                    allowBlank: true,
                    buttonOnly: true,
                    buttonText: D.t('Select file(s)'),
                    buttonConfig: {
                        iconCls:'upload'
                    },
                    action: 'upload',
                    listeners: {
                        render: function (me, eOpts) {
                            Ext.get(me.id+'-button-fileInputEl').dom.multiple = true
                        }
                    }
                },'->',{
                    text:D.t('Remove'),
                    tooltip:D.t('Remove the selected item'),
                    iconCls:'remove',
                    action: 'removePhoto'
                }
            ],
            store: Ext.create("Ext.data.Store", {
                fields: ['img', 'preview', 'num']                
            }),
            columns: [
                {   
                    text: D.t("Photo"),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'preview',
                    renderer: function(v) {
                        return '<img src="' + v + '" />'    
                    }
                }    
            ]
        }
    }
    
    ,buildDescript: function() {
        return {
            title: D.t('Full text'),
            xtype: 'tinymce_textarea',
            fieldStyle: 'font-family: Courier New; font-size: 12px;',             
            
            noWysiwyg: false,
            tinyMCEConfig: Config.tinyCfg,                
            name: 'descript'
        }
    }        
    
})