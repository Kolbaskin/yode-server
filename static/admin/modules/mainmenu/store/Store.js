Ext.define('MyDesktop.modules.mainmenu.store.Store', {
    extend: 'MyDesktop.core.StoreTree',
    
    modelPath: 'MyDesktop.modules.mainmenu.model.MainModel'

    
    ,folderSort: true
    ,sorters: [{
        property: 'indx',
        direction: 'ASC'
    }]
})
