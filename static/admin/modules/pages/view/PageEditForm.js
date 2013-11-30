Ext.define('MyDesktop.modules.pages.view.PageEditForm', {
    
    extend: 'Ext.form.Panel',
    
    requires: [
        'MyDesktop.core.widgets.ImageField'
    ],
    
    bodyStyle: 'padding: 5px;',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        xtype: 'fieldset',
        collapsible: true,
        collapsed: true,
        layout: 'anchor',
        defaults: {
            xtype: 'fieldcontainer',
            anchor: '100%',
            layout: 'hbox',
            defaults: {
                labelWidth: 120,
                xtype: 'textfield'                            
            }
        }
    },
    
    initComponent: function() {

        this.items = this.buildItems()  
        this.tbar = this.buildFormButtons(),
        this.callParent();
    },
    
    buildItems: function() {
        
        var btnlock = {
            xtype: 'button',
            iconCls: 'lock',
            //width: 25,
            hidden: true,
            action: 'field-lock'
        }
        
        return [
            this.buildPageSetsForm(btnlock)
            ,this.buildMetaForm(btnlock)
            ,this.buildOGForm(btnlock)
        ]
    }
    
    ,buildPageSetsForm: function(btnlock) {
        return {
            title: D.t('Page settings'),
            collapsed: false,
            items: [{
                items:[{   
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: '_id',
                    store: Ext.create('MyDesktop.modules.templates.store.ComboStore'),
                    name: 'tpl',
                    queryMode: 'remote',
                    allowBlank: false,
                    flex: 1,
                    blankText: D.t('Select template'),
                    fieldLabel: D.t('Template')
                },btnlock]
            },
            {
                items:[{
                    name: 'name',
                    allowBlank: false,
                    flex: 1,
                    blankText: D.t('Enter page name'),
                    fieldLabel: D.t('Page name')
                },btnlock]
            },
            {
                items:[{
                    name: 'alias',
                    //allowBlank: false,
                    flex: 1,
                    blankText: D.t('Enter a name of the pege in the url'),
                    fieldLabel: D.t('Url alias')
                },btnlock]
            },
            {
                name: 'indx',
                xtype: 'textfield',
                inputType: 'hidden'    
            },
            {
                name: '_id',
                xtype: 'textfield',
                inputType: 'hidden'
            },
            {
                name: 'pid',
                xtype: 'textfield',
                inputType: 'hidden'
            }]
        }    
    }
    
    ,buildMetaForm: function(btnlock) {
        return  {
            title: D.t('Meta data'),
            closable: true,
            closed: true,
            items: [{
                items:[{
                    name: 'metatitle',
                    flex: 1,
                    fieldLabel: D.t('Title')
                },btnlock]
            },
            {
                items:[{
                    name: 'metadesctiption',
                    flex: 1,
                    fieldLabel: D.t('Description')
                },btnlock]
            },
            {
                items:[{
                    name: 'metakeywords',
                    flex: 1,
                    fieldLabel: D.t('Keywords')
                },btnlock]
            }
            ]
        }   
    }
    
    ,buildOGForm: function(btnlock) {
        return {
            title: D.t('Open Graph properties'),
            closable: true,
            closed: true,
            items: [{
                items:[{
                    name: 'og_title',
                    flex: 1,
                    fieldLabel: D.t('Title')
                },btnlock]
            },
            {
                items:[{
                    name: 'og_desctiption',
                    flex: 1,
                    fieldLabel: D.t('Description')
                },btnlock]
            },
            {   
                width:170,
                items:[{      
                    xtype: 'imagefield',
                    fieldLabel: D.t('Image'),
                    tumbSizes: '500x',
                    width: 150,
                    height: 115,
                    name: 'og_img'
                }]
            }
            ]
        }    
    }
    
    ,buildFormButtons: function() {
        return [{
            text: D.t('Save'),
            tooltip: D.t('Save page'),
            iconCls:'save',
            disabled: true,
            action: 'formsave'
        },{
            text: D.t('View'),
            tooltip: D.t('View the page'),
            iconCls:'view',
            disabled: true,
            action: 'viewpage'
        },'->',/*{
            text: '',
            tooltip: D.t('Lock page for changes'),
            iconCls:'unlock',
            action: 'lock'
        },'-',*/{
            text: D.t('Remove'),
            tooltip:D.t('Remove the page'),
            iconCls:'remove',
            disabled: true,
            action: 'formremove'
        }]
    }
    
})