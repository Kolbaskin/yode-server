Ext.define('MyDesktop.modules.pages.store.Store', {
    extend: 'MyDesktop.core.StoreTree',
    
    modelPath: 'MyDesktop.modules.pages.model.PagesModel'

    
    ,folderSort: true
    ,sorters: [{
        property: 'indx',
        direction: 'ASC'
    }]
    
})
