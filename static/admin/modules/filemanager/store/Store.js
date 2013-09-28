Ext.define('MyDesktop.modules.filemanager.store.Store', {
    extend: 'Ext.data.TreeStore',
    //folderSort: true,
    /*sorters: [{
        property: 'filename',
        direction: 'ASC'
    }],*/
    autoLoad: true,
    fields: [
        'id',
        'filename',
        'type',
        'size',
        {name: 'mtime', type: 'date'}
    ],
    proxy: {
        type: 'ajax', 
        url: Sess.url('models.fm:getdir'),
        //simpleSortMode: true,                    
        reader: {
             type: 'json',
             root: 'data'
         }
    }
    
    /*
    ,folderSort: true
    ,sorters: [{
        property: 'name',
        direction: 'ASC'
    }]
    */
})
