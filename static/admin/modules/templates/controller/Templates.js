/*!
 * Wpier
 * Copyright(c) 2006-2011 Sencha Inc.
 * 
 * 
 */

Ext.define('MyDesktop.modules.templates.controller.Templates', {
    extend: 'MyDesktop.core.Controller',
    id:'templates-win',

    launcher: {
        text: D.t('Templates'),
        iconCls:'templates',
        model: 'templates-DataModel'
    }
    //mainView: 'MyDesktop.modules.templates.view.ListWindow',
    //detailFormView: 'MyDesktop.modules.templates.view.DetailForm'

});

