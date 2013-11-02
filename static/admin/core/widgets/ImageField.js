Ext.define('MyDesktop.core.widgets.ImageField',{
    extend: 'Ext.form.FieldContainer'
    ,alias: 'widget.imagefield'

    ,layout: 'hbox'
    ,width: 500
    ,height:100
    
    ,tumbSizes: '220x130x460x330'
    
    ,buttonAlign: 'left'
    
    //style: 'padding:5px',

    
    ,initComponent: function() {     
        if(this.buttonAlign == 'top' || this.buttonAlign == 'bottom') {
            this.layout = 'vbox'    
        }
        this.items = this.buildItems()
        
        this.callParent();
    }
    
    ,buildItems: function() {
        var me = this
        
        var sz = me.tumbSizes.split('x')
        if(sz[0]) sz[0] = parseInt(sz[0])
        if(sz[1]) sz[1] = parseInt(sz[1])
        if(!sz[0] || isNaN(sz[0])) sz[0] = 150
        if(!sz[1] || isNaN(sz[1])) sz[1] = 150
        
        var rec = []
        
        var func = function() {
            rec.push({
    
                xtype: 'filefield',
                msgTarget: 'side',
                allowBlank: true,
                buttonOnly: true,
                buttonText: D.t('Select file'),
                listeners: {
                    change: function(el) {
                        me.upload(el)
                    }    
                }
            },{
                xtype: 'textfield',
                inputType: 'hidden',
                name: me.name,
                listeners: {
                    change: function(e,v) {
                        if(!me.noChange) me.down('[xtype=image]').setSrc(v)
                        me.noChange = false;
                    }
                }
            })   
        }
        
        var func1 = function() {
            rec.push({
                xtype: 'panel',
                width: sz[0],
                height: sz[1],
                items: [
                    {
                        xtype: 'image'
                    }                  
                ]
            })
        }
        
        if(this.buttonAlign == 'left' || this.buttonAlign == 'bottom') {
            func1()
            func()
        } else {
            func()
            func1()
        }
        
        return rec
    }
    
    ,upload: function(inp) {        
        var me = this       
        if(inp.fileInputEl.dom.files.length>0) {
            Core.Ajax.upload(inp.fileInputEl.dom.files[0], '/admin.models.fileOperations:upload/' + me.tumbSizes + '/', function(data) {
                if(data.data && data.data.name) {
                    var img = me.down('[xtype=image]')
                        ,img_inp = me.down('[xtype=textfield]')
                    if(img) {
                        
                        me.noChange = true
                        
                        img.setSrc('/tmp/'+data.data.name) 
                        img.setWidth(data.data.width)
                        img.setHeight(data.data.height)
                        img_inp.setValue(data.data.name);
                    }
                }
            })                    
        }
    }

})