Ext.onReady(function () {
    Ext.override(Ext.selection.Model, {
        storeHasSelected: function (record) {
            var store = this.store,
                records,
                len, id, i;
            if (record.hasId() && store.getById(record)) {
                return true;
            }

            if (store.data instanceof Ext.util.LruCache) {
                var result = false;
                store.data.forEach(function (rec) {
                    return !(result = (record.internalId === rec.internalId));
                });
                return result;
            }

            records = store.data.items;
            len = records.length;
            id = record.internalId;
            for (i = 0; i < len; ++i) {
                if (id === records[i].internalId) {
                    return true;
                }
            }
            return false;
        }
    });
    
    Ext.define('Ext.override.grid.ViewDropZone', {
    override: 'Ext.grid.ViewDropZone',
	handleNodeDrop: function()
	{
		var sm = this.view.getSelectionModel(),
			onLastFocusChanged = sm.onLastFocusChanged;

		sm.onLastFocusChanged = Ext.emptyFn;
		this.callParent(arguments);
		sm.onLastFocusChanged = onLastFocusChanged;
	}
});
})