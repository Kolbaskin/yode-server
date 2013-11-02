Ext.define('MyDesktop.core.ComboColumn',{
    extend: 'Ext.grid.column.Column',
    alias: 'widget.combocolumn',
    
    guide: null,
    guideKeyField: '_id',
    quideValueField: 'name',


    defaultRenderer: function(v,x,y,z) {
        //console.log('def:',this)
        var me = this
        
        if(me.guide == 'loading') {
        // пока справочник загружается, ждемс
        // через таймаут повторяем попытку рендера со справочником
            setTimeout(function() {y.commit()}, 100)
            return '';
        }
        
        if(me.guide === null) {
        // Если нет справочника               
            if(me.guideUrl) {
                // если задан url, прочитаем справочник по нему
                me.guide = 'loading'            
                Core.Ajax.request({
                    url: me.guideUrl,
                    succ: function(data) {
                        me.guide = data.list
                    }                     
                })
                setTimeout(function() {y.commit()}, 100)
            }
            
            return '';
        }
        
        if(me.guide) {
            for(var i=0;i<me.guide.length;i++) {
                if(me.guide[i][me.guideKeyField] && me.guide[i][me.guideKeyField] == v) {
                    if(me.guide[i][me.quideValueField]) return me.guide[i][me.quideValueField];
                    return v;
                }
            }
        }
        return v
    }
});